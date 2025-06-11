import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import sanitize from 'sanitize-html';
import { config } from '../config';
import { extractBearerToken, isAllowedLocation } from '../utils';
import IPinfoWrapper from 'node-ipinfo';
import jwt from 'jsonwebtoken';

export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts from this IP, please try again later'
});

export const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: 'Too many requests from this IP, please try again later'
});

export const securityHeaders = helmet();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(origin => origin.trim());

export const corsMiddleware = cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
});

export const csPMiddleware = (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Content-Security-Policy',
        "default-src 'self';" + // Only allow resources from same origin
        "script-src 'self' 'unsafe-inline' 'unsafe-eval';" + // Scripts from same origin and inline scripts
        "style-src 'self' 'unsafe-inline';" + // Styles from same origin and inline styles
        "img-src 'self' data: https:;" + // Images from same origin, data URLs and HTTPS
        "font-src 'self';" + // Fonts from same origin
        "frame-src 'none';" + // Prevent iframe usage
        "object-src 'none';" + // Prevent object/embed usage
        "base-uri 'self';" + // Restrict base tag
        "form-action 'self';" // Restrict form submissions to same origin
    );
    next();
};
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
        req.body = Object.entries(req.body).reduce((acc: Record<string, any>, [key, value]) => {
            if (typeof value === 'string') {
              acc[key] = sanitize(value, {
                allowedTags: config.allowedHTMLTags,
                allowedAttributes: config.allowedHTMLAttributes
              });
            } else if (Array.isArray(value)) {
              acc[key] = value.map(item =>
                typeof item === 'string' ? sanitize(item, {
                    allowedTags: config.allowedHTMLTags,
                    allowedAttributes: config.allowedHTMLAttributes
                }) : item
              );
            }
            else {
                acc[key] = value;
            }
            return acc;
          }, {});
        next();
    } else {
        next();
    }
};

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = extractBearerToken(req.headers.authorization);
        
        if (!token) {
            res.status(401).json({ error: 'No token provided' });
        } else{
            const decodedToken: jwt.JwtPayload | string = jwt.verify(token, config.jwtSecret);
            if (typeof decodedToken === 'string' || !decodedToken) {
                res.status(401).json({ error: 'Invalid token' });
            } else{
                res.locals.user = {
                    userId: decodedToken.userId,
                    role: decodedToken.role,
                    username: decodedToken.username
                };
                next();
            }
        }
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

export const authorize = (requiredRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = res.locals.user;
        if (!user) {
            res.status(401).json({ error: 'Unauthorized' });
        } else if (!requiredRoles.includes(user.role)) {
            res.status(403).json({ error: 'Insufficient permissions' });
        } else {
            res.locals.user = user;
            next();
        }
    };
};

export const locationCheck = (ipinfoWrapper: IPinfoWrapper) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (config.nodeEnv === 'development') {
            next();
        } else{
            let clientIP = req.ip;
            // If localhost, try to get real IP from X-Forwarded-For
            if (clientIP === '::1' || clientIP === '127.0.0.1') {
                const forwarded = req.headers['x-forwarded-for'];
                if (typeof forwarded === 'string') {
                    clientIP = forwarded.split(',')[0].trim();
                } else if (Array.isArray(forwarded)) {
                    clientIP = forwarded[0];
                }
            } else {
                // we assume the ip address is valid here
            }
    
            if (!clientIP) {
                res.status(403).json({ error: 'Access denied from your location' });
            } else {
                const ipinfo = await ipinfoWrapper.lookupIp(clientIP);
                if (isAllowedLocation(ipinfo)) {
                    console.log(`Access granted for IP: ${clientIP}, Location: ${ipinfo.city}, ${ipinfo.country}`);
                    res.locals.ipinfo = ipinfo;
                    next();
                } else {
                    res.status(403).json({ error: 'Access denied from your location' });
                }
            }
        }
        try {
        } catch (error) {
            res.status(403).json({ error: 'Access denied from your location' });
        }
    };
};

