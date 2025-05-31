// rate limiting middleware

// location middleware

// authorization middleware

// authentication middleware

import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { body, validationResult } from 'express-validator';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import sanitize from 'sanitize-html';

// Rate limiting middleware
export const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
});

// Helmet middleware for HTTP headers security
export const securityHeaders = helmet();

// CORS middleware
export const corsMiddleware = cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
});

// Request size limiter
export const requestSizeLimiter = (req: Request, res: Response, next: NextFunction) => {
    const MAX_SIZE = '10mb';
    if (req.headers['content-length'] && 
        parseInt(req.headers['content-length']) > parseInt(MAX_SIZE)) {
        return res.status(413).json({ error: 'Request entity too large' });
    }
    next();
};

// Input sanitization middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = sanitize(req.body[key], {
                    allowedTags: [],
                    allowedAttributes: {}
                });
            }
        });
    }
    next();
};

// Request validation middleware
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// CSRF Protection
export const csrfProtection = csrf({ cookie: true });

// Cookie security middleware
export const secureCookies = cookieParser(process.env.COOKIE_SECRET);

// Authentication middleware (example - implement your actual auth logic)
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        // Implement your token verification logic here
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Authorization middleware (example - implement your actual authorization logic)
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
export const locationCheck = async (req: Request, res: Response, next: NextFunction) => {
    const clientIP = req.ip;
    
    try {
        // Implement your IP geolocation logic here
        // const location = await getLocationFromIP(clientIP);
        // if (isBlockedLocation(location)) {
        //     return res.status(403).json({ error: 'Access denied from your location' });
        // }
        next();
    } catch (error) {
        next(error);
    }
};

// SQL Injection protection middleware (if using raw queries)
export const sqlInjectionProtection = (req: Request, res: Response, next: NextFunction) => {
    const sqlInjectionPattern = /('|"|;|--|\/\*|\*\/|xp_|sp_|exec|execute|insert|select|delete|update|drop|union|into|load_file|outfile)/i;
    
    const checkForSQLInjection = (obj: any): boolean => {
        for (let key in obj) {
            if (typeof obj[key] === 'string' && sqlInjectionPattern.test(obj[key])) {
                return true;
            } else if (typeof obj[key] === 'object') {
                if (checkForSQLInjection(obj[key])) return true;
            }
        }
        return false;
    };

    if (checkForSQLInjection(req.body) || checkForSQLInjection(req.query)) {
        return res.status(403).json({ error: 'Potential SQL injection detected' });
    }
    
    next();
};

