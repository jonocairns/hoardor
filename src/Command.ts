export class Command {
    public process = (msg: any): string => {
        const message = msg.content;
        const params = message.split(' ');
        params.splice(0, 1);
        return params.join(' ');
    }
}