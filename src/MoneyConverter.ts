const fx = require('money');
var oxr = require('open-exchange-rates')
import * as Discord from 'discord.js';
import { Command } from './Command';

oxr.set({ app_id: process.env.EXCHANGE_APP_ID });

fx.base = "USD";
fx.rates = {
	"EUR" : 0.745101, // eg. 1 USD === 0.745101 EUR
	"GBP" : 0.647710, // etc...
	"HKD" : 7.781919,
    "USD" : 1,      
};

export class MoneyConverter {
    constructor(
        private discordClient: Discord.Client,
        private command: Command
    ) {
        this.bind();
        this.latest();
    }

    public latest = () => {
        console.log('fetching latest exchange rates...');
        oxr.latest(() => {
            fx.rates = oxr.rates;
            fx.base = oxr.base;
        });
    }

    public convert = (query: string) => {
        const params = query.split(' ');
        if (params.length === 3) {
            console.log(`converting ${params[0]} from ${params[1]} to ${params[2]}`);
            return fx.convert(params[0], { from: params[1], to: params[2] });
        } else {
            return -1;
        }
    }

    private bind(): void {
        this.discordClient.on('message', msg => {
            if (msg.content.startsWith('.c') || msg.content.startsWith('.convert')) {
                const query = this.command.process(msg);
                try {
                    const converted = this.convert(query);
                    if (converted === -1) {
                        msg.reply('hoardorrrr!!! (type .h for help)');
                    } else {
                        msg.reply(`$${converted.toFixed(2)}`);
                    }
                } catch (err) {
                    console.log(err);
                    msg.reply('...hoardor? :confused:');
                }
            }

            if (msg.content.startsWith('.r') || msg.content.startsWith('.refresh')) {
                this.latest();
            }
        });
    }
}