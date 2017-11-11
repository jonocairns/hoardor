const rp = require('request-promise');

export class Shortener {
    private baseUrl: string = 'https://www.googleapis.com/urlshortener/v1/url';
    
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
        } catch(err) {
            console.log(err);
        }
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