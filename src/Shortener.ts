const rp = require('request-promise');
import * as Discord from 'discord.js';
import { Command } from './Command';

export class Shortener {
    private baseUrl: string = 'https://www.googleapis.com/urlshortener/v1/url';

    constructor(
        private discordClient: Discord.Client,
        private command: Command
    ) {
        this.bind();
    }

    public async shorten(longUrl: string): Promise<Shortened> {
        const uri = this.buildUrl();
        const payload = {
            method: 'POST',
            uri,
            body: {
                longUrl
            },
            json: true
        }
        try {
            return await rp(payload);
        } catch (err) {
            console.log(err);
        }
    }

    private bind() {
        this.discordClient.on('message', async msg => {
            try {
                if (msg.content.startsWith('.s') || msg.content.startsWith('.shorten')) {
                    const command = this.command.process(msg);
                    const query = command.split(' ');
                    if (query.length !== 1) {
                        msg.reply('hoardor! (please correct the link - and just one at a time)');
                    } else {
                        console.log(`shortening the url ${command}`);
                        const shortUrl = await this.shorten(command);
                        msg.delete();
                        msg.reply(shortUrl.id);
                    }
                }
            } catch(err) {
                msg.reply(':confused: hoardor? (something went wrong) :confused:');
            }
            
        });
    }

    private buildUrl() {
        return `${this.baseUrl}?key=${process.env.GOOGLE_API_KEY}`;
    }
}

export class Shortened {
    kind: string;
    id: string;
    longUrl: string;
}