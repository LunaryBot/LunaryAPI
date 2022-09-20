import type { NextFunction, Request } from 'express';
import type { WebSocket } from 'ws';

declare global {
    namespace Express {
        interface Request {
            userId: string;
        }
    }
}

module 'http' {
    interface; 
    interface ServerResponse {
        sendWs: (cb: (req: Request, ws: WebSocket, next?: NextFunction) => void) => void;
    }
}