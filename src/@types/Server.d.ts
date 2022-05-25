import type { User } from './index';
import type { WebSocket } from 'ws';
import type { NextFunction, Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            user: User;
        }
    }
}

module 'http' {
    interface 
    interface ServerResponse {
        sendWs: (cb: (res: Request, ws: WebSocket, next?: NextFunction) => void) => void;
    }
}