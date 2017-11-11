const rp = require('request-promise');

export class Search {
    private baseUrl: string = 'https://www.googleapis.com/customsearch/v1';

    public async search(query: string): Promise<Array<SearchItem>> {
        const url = this.buildQueryString(query);
        const result = await rp(url);
        const json = JSON.parse(result);
        return json.items;
    }

    private buildQueryString(query: string) {
        const cleanQueryString = query.replace(/\s/g, '+');
        return `${this.baseUrl}?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_CX}&q=${cleanQueryString}&alt=json&num=10`;
    }
}

export class SearchItem {
    public link: string;
    public title: string;
}