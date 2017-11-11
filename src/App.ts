require('dotenv').config();
import { Search } from './Search';
import { Shortener } from './Shortener';
import * as Discord from 'discord.js';

const searchClient = new Search();
const shortenerClient = new Shortener();

const processCommand = (msg: any) => {
    const message = msg.content;
    const params = message.split(' ');
    params.splice(0, 1);
    return params.join(' ');
}

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }

  if(msg.content.startsWith('!i')) {
    const inviteLink = `invite link: https://discordapp.com/oauth2/authorize?&client_id=${process.env.BOT_CLIENT_ID}&scope=bot&permissions=${process.env.BOT_PERMISSIONS}"`
    msg.delete();
    msg.reply(inviteLink);
  }

  if(msg.content.startsWith('!q')) {
    const query = processCommand(msg);

    console.log(`searching for ${query}`);
    const results = await searchClient.search(query);
    msg.delete();
    if(results.length > 0) {
        const shortUrl = await shortenerClient.shorten(results[0].link);
        msg.reply(`${results[0].title} - ${shortUrl.id}`);  
    } else {
        msg.reply('no search results');
    }
  }

  if(msg.content.startsWith('!s')) {
    const command = processCommand(msg);
    const query = command.split(' ');
    if(query.length !== 1) {
        msg.reply('please correct the link (and just one at a time)');
    } else {
        const shortUrl = await shortenerClient.shorten(command);
        msg.delete();
        msg.reply(shortUrl.id);
    }
  }
});
client.login(process.env.TOKEN).catch(a => console.log(a));