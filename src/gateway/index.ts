import { WebSocketServer, ServerOptions, RawData } from 'ws';

class Gateway extends WebSocketServer {
    constructor(options: ServerOptions) {
        super(options);

        this.on('connection', (ws) => {
            ws.on('message', (data) => {
                console.log(this.formatMessage(data));
            });
        });
    }

    formatMessage(data: RawData) {
        if (Array.isArray(data)) data = Buffer.concat(data);
        else if (data instanceof ArrayBuffer) data = Buffer.from(data);
        
        const msg = JSON.parse(data.toString());

        return msg;
    }
}

export default Gateway;