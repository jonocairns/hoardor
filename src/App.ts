require('dotenv').config();
import { Search } from './Search';
import * as Discord from 'discord.js';

const searchClient = new Search();

const inviteLink = `invite link: https://discordapp.com/oauth2/authorize?&client_id=${process.env.BOT_CLIENT_ID}&scope=bot&permissions=${process.env.BOT_PERMISSIONS}"`
console.log(inviteLink);


const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }

  if(msg.content.startsWith('!s')) {
    const message = msg.content;
    const params = message.split(' ');
    params.splice(0, 1);
    const query = params.join(' ');
    
    console.log(`searching for ${query}`);
    const results = await searchClient.search(query);
    if(results.length > 0) {
        msg.reply(`${results[0].title} - ${results[0].link}`);  
    } else {
        msg.reply('no search results');
    }
  }
});
client.login(process.env.TOKEN).catch(a => console.log(a));