import * as Discord from 'discord.js';
import { Command } from './Command';

export class Assistant {
    constructor(
        private discordClient: Discord.Client
    ) {
        this.bind();
    }

    private bind(): void {
        this.discordClient.on('message', async msg => {
            if (msg.content === 'ping') {
                msg.reply('Pong!');
            }

            if (msg.content.startsWith('.i') || msg.content.startsWith('.invite')) {
                const inviteLink = `invite link: https://discordapp.com/oauth2/authorize?&client_id=${process.env.BOT_CLIENT_ID}&scope=bot&permissions=${process.env.BOT_PERMISSIONS}"`
                msg.delete();
                msg.reply(inviteLink);
            }

            if (msg.content.startsWith('.help') || msg.content.startsWith('.h')) {
                msg.channel.send(`'.g thing to search for' to search google.`);
                msg.channel.send(`'.s https://urlToShorten.com/this/is/long\' to shorten a URL. `);
                msg.channel.send(`'.i' to generate an invite link for this bot.`);
                msg.channel.send(`'.c FROM TO' to convert based on exchange rates.`);
                msg.channel.send(`'.r' to refresh exchange rates`);
            }
        });
    }
}