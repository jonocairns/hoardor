const rp = require('request-promise');
import * as Discord from 'discord.js';
import { Shortener } from './Shortener';
import { Command } from './Command';

export class Search {
    private baseUrl: string = 'https://www.googleapis.com/customsearch/v1';

    constructor(
        private discordClient: Discord.Client, 
        private shortenerClient: Shortener,
        private command: Command) {
            this.bind();
    }

    public async search(query: string): Promise<Array<SearchItem>> {
        const url = this.buildQueryString(query);
        const result = await rp(url);
        const json = JSON.parse(result);
        return json.items;
    }

    private bind(): void {
        this.discordClient.on('message', async msg => {
            try {
                if (msg.content.startsWith('.g') || msg.content.startsWith('.google')) {
                    const query = this.command.process(msg);
    
                    console.log(`searching for ${query}`);
                    const results = await this.search(query);
                    msg.delete();
                    if (results.length > 0) {
                        const shortUrl = await this.shortenerClient.shorten(results[0].link);
                        msg.reply(`${results[0].title} - ${shortUrl.id}`);
                    } else {
                        msg.reply('no search results');
                    }
                }
            } catch(e) {
                msg.reply('...hoardor? :confused:');
            }
            
        });
    }

    private buildQueryString(query: string): string {
        const cleanQueryString = query.replace(/\s/g, '+');
        return `${this.baseUrl}?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_CX}&q=${cleanQueryString}&alt=json&num=10`;
    }
}

export class SearchItem {
    public link: string;
    public title: string;
}