import { WebSocketServer, ServerOptions, RawData, WebSocket } from 'ws';
import Apollo from './Apollo';
 
class Gateway extends WebSocketServer {
    public server: Apollo;
    constructor(Server: Apollo, options: ServerOptions = { server: Server.httpServer }) {
        super({ ...options });

        this.server = Server;

        this.on('connection', (ws) => {
            ws.on('message', (data) => {
                console.log(this.formatMessage(data));
            });
        });
    }
    
    public broadcast(data: Object, filter?: (client: WebSocket) => any) {
        return (filter ? [...this.clients.values()].filter(filter) : this.clients).forEach(client => {
            client.send(JSON.stringify(data));
        });
    }

    public formatMessage(data: RawData) {
        if (Array.isArray(data)) data = Buffer.concat(data);
        else if (data instanceof ArrayBuffer) data = Buffer.from(data);
        
        const msg = JSON.parse(data.toString());

        return msg;
    }
}

export default Gateway;