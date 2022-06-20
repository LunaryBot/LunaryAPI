import type { IUser } from './index';
import type { WebSocket } from 'ws';
import type { NextFunction, Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            user: IUser;
            userId: string;
        }
    }
}

module 'http' {
    interface 
    interface ServerResponse {
        sendWs: (cb: (req: Request, ws: WebSocket, next?: NextFunction) => void) => void;
    }
}