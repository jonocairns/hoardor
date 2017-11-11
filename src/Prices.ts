const rp = require('request-promise');
const cheerio = require('cheerio');
import * as Discord from 'discord.js';
import { Command } from './Command';
import { Shortener } from './Shortener';

export class Prices {
    private baseUrl = 'https://pcpartpicker.com/products/internal-hard-drive/fetch/';

    constructor(
        private discordClient: Discord.Client,
        private command: Command,
        private shortenerClient: Shortener
    ) {
        this.bind();
    }

    public hdd = async (query: string) => {
        const result = await rp(`${this.baseUrl}?xcx=0&mode=list&xslug=&sort=price&search=${query}`);
        var actualHTML = JSON.parse(result).result.html;
        var $ = cheerio.load(`<div>${actualHTML}</div>`);
        const results: Array<any> = [];

        $('a').each(function () {
            if ($(this).attr('href').indexOf('product') != -1) {
                let price = '$0';
                if (actualHTML.substring(actualHTML.indexOf($(this).text()) + $(this).text().length, actualHTML.indexOf($(this).text()) + $(this).text().length + 1040).split("$")[2]) {
                    price = '$' + (parseFloat(actualHTML.substring(actualHTML.indexOf($(this).text()) + $(this).text().length + 30, actualHTML.indexOf($(this).text()) + $(this).text().length + 1040).split("$")[2].split("<")[0]));
                }
                else {
                    price = ("N/A");
                }

                const name = ($(this).text());

                const link = 'https://pcpartpicker.com' + ($(this).attr('href'))

                const series = (actualHTML.substring(actualHTML.indexOf($(this).text()) + $(this).text().length, actualHTML.indexOf($(this).text()) + $(this).text().length + 300).split("<td>")[1].split("<")[0]);

                const form = (actualHTML.substring(actualHTML.indexOf($(this).text()) + $(this).text().length, actualHTML.indexOf($(this).text()) + $(this).text().length + 300).split("right;\">")[1].split("<")[0]);

                const type = (actualHTML.substring(actualHTML.indexOf($(this).text()) + $(this).text().length, actualHTML.indexOf($(this).text()) + $(this).text().length + 300).split("right;\">")[2].split("<")[0]);

                const capacity = (actualHTML.substring(actualHTML.indexOf($(this).text()) + $(this).text().length, actualHTML.indexOf($(this).text()) + $(this).text().length + 300).split("right;\">")[3].split("<")[0]);

                const cache = (actualHTML.substring(actualHTML.indexOf($(this).text()) + $(this).text().length, actualHTML.indexOf($(this).text()) + $(this).text().length + 300).split("right;\">")[4].split("<")[0]);

                const ppg = (parseFloat(actualHTML.substring(actualHTML.indexOf($(this).text()) + $(this).text().length, actualHTML.indexOf($(this).text()) + $(this).text().length + 300).split("right;\">")[5].split("<")[0].replace("$", "")));

                results.push({
                    price,
                    name,
                    series,
                    form,
                    type,
                    capacity,
                    cache,
                    ppg,
                    link
                });

            }
        });

        return results;
    }

    private bind(): void {
        this.discordClient.on('message', async msg => {
            if (msg.content.startsWith('.p') || msg.content.startsWith('.price')) {
                try {
                    const query = this.command.process(msg);

                    const results = await this.hdd(query);
                    const top = results.slice(0, 5);

                    top.forEach(async element => {
                        const shortenedLink = await this.shortenerClient.shorten(element.link);
                        msg.channel.sendMessage(`${element.name} - ${element.capacity} - ${element.price} - ${shortenedLink.id} :money_with_wings: - (PPG: ${element.ppg})`);
                    });
                } catch (err) {
                    msg.reply('...hoardor? :confused:');
                }


            }
        });
    }
}