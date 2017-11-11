require('dotenv').config();
import { Search } from './Search';
import { Shortener } from './Shortener';
import * as Discord from 'discord.js';
import { Command } from './Command';
import { Assistant } from './Assistant';
import { Prices } from './Prices';
import { MoneyConverter } from './MoneyConverter';

const command = new Command();
const client = new Discord.Client();
const shortenerClient = new Shortener(client, command);
const searchClient = new Search(client, shortenerClient, command);
const assistant = new Assistant(client);
const priceClient = new Prices(client, command, shortenerClient);
const moneyConverter = new MoneyConverter(client, command);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.TOKEN).catch(a => console.log(a));