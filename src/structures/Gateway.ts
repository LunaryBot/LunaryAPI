import { WebSocketServer, ServerOptions, RawData } from 'ws';
import Server from './Server';
 
class Gateway extends WebSocketServer {
    public server: Server;
    constructor(Server: Server, options: ServerOptions = {}) {
        super({ ...options });

        this.server = Server;

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