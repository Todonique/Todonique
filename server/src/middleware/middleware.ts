import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import sanitize from 'sanitize-html';
import { config } from '../config';
import { extractBearerToken, isBlockedLocation } from '../utils';
import IPinfoWrapper from 'node-ipinfo';

export const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'This IP has hit a rate limit, please try again later'
});

export const securityHeaders = helmet();

export const corsMiddleware = cors({
    origin: config.allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
});

export const requestSizeLimiter = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers['content-length'] && 
        parseInt(req.headers['content-length']) > config.maxBytesRequestSize) {
        res.status(413).json({ error: 'Request entity too large' });
    } else {
        next();
    }
};

export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
    if (req.body) {
        req.body = Object.keys(req.body).map(key => {
            if (typeof req.body[key] === 'string') {
                return sanitize(req.body[key] as string, {
                    allowedTags: config.allowedHTMLTags,
                    allowedAttributes: config.allowedHTMLAttributes
                });
            } else {
                res.status(400).json({ error: 'Invalid input' });
                return;
            }
        });
        next();
    } else {
        res.status(400).json({ error: 'Invalid input' });
    }
};

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = extractBearerToken(req.headers.authorization);
        
        if (!token) {
            res.status(401).json({ error: 'No token provided' });
        } else{
            // Implement your token verification logic here
            // const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // req.user = decoded;
            next();
        }
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Authorization middleware
export const authorize = (requiredRole: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Implement your role-based authorization logic here
        // if (req.user.role !== requiredRole) {
        //     return res.status(403).json({ error: 'Insufficient permissions' });
        // }
        next();
    };
};

// Location-based security middleware (example)
export const locationCheck = (ipinfoWrapper: IPinfoWrapper) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const clientIP = req.ip;
            if (!clientIP) {
                res.status(403).json({ error: 'Access denied from your location' });
            } else {
                const ipinfo = await ipinfoWrapper.lookupIp(clientIP);
                if (isBlockedLocation(ipinfo)) {
                    res.status(403).json({ error: 'Access denied from your location' });
                } else {
                    // TODO: use ipinfo for other stuff as well
                    next();
                }
            }
        } catch (error) {
            res.status(403).json({ error: 'Access denied from your location' });
        }
    };
};

