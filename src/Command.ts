import * as Discord from 'discord.js';

export class Command {
    public process = (msg: Discord.Message): string => {
        const message = msg.content;
        console.log(`processing command: '${message}' by user '${msg.author.username}' in channel '${msg.channel}' in guild '${msg.guild}'`);        
        const params = message.split(' ');
        params.splice(0, 1);
        return params.join(' ');
    }
}