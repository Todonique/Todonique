import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { config } from '../config';
import { Request, Response } from 'express';
import { CreateUser, UserModel } from '../models/user';
import { extractBearerToken } from '../utils';

type LoginRequest = {
    username: string;
    password: string;
    token?: string; 
};

export const registerHandler = async (req: Request, res: Response) => {
    try {
    
        const { username, password, roleId }: CreateUser =  req.body;
        if (!username || !password) {
             res.status(400).json({ error: 'username and password are required' });
        }
        
        const existingUser = await UserModel.findByUsername(username);
        if (existingUser) {
             res.status(400).json({ error: 'User already exists' });
        }
        
        const newUser = await UserModel.createUser({ username, password , roleId });
        if (!newUser) {
            res.status(500).json({ error: 'Failed to create user' });
        } else {
            const user = await UserModel.findByUsername(newUser.username);
            const jwtToken = jwt.sign(
                { 
                    userId: user?.id,
                    username: user?.username,
                    role: user?.role
                },
                config.jwtSecret,
                { expiresIn: '1h' }
            );
            const refreshToken = jwt.sign(
                {
                    userId: user?.id
                },
                config.jwtSecret,
                { expiresIn: '4h' }
            );
            res.json({ message: 'User registered successfully', data: user , jwtToken, refreshToken });
        }

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export const setupTwoFactorHandler = async (req: Request, res: Response) => {
    try {
        const { username, token }: { username: string, token?: string } = req.body;
        
        if (!username) {
            res.status(400).json({ error: 'Username is required' });
        } else {
            const user = await UserModel.findByUsername(username);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
            } else {
                const has2FA = await UserModel.has2FA(user.id);
                if (has2FA) {
                    res.status(400).json({ error: '2FA is already enabled' });
                } else {
                    // If no token provided, return QR code for setup
                    if (!token) {
                        const secret = speakeasy.generateSecret({
                            name: `${username}@Todonique`,
                            issuer: 'Todonique',
                            length: 20
                        });

                        const qrCode = await qrcode.toDataURL(secret.otpauth_url || '');
                        
                        res.json({
                            qrCode,
                            secret: secret.base32
                        });
                    } else {
                        // If token provided, verify and activate
                        const { secret } = req.body;
                        if (!secret) {
                            res.status(400).json({ error: 'Secret required for verification' });
                        } else {
                            const verified = speakeasy.totp.verify({
                                secret,
                                encoding: 'base32',
                                token,
                                window: 10
                            });

                            if (!verified) {
                                res.status(401).json({ error: 'Invalid token' });
                            } else {
                                await UserModel.activate2FA(user.id, secret);
                                res.json({ message: '2FA activated successfully' });
                            }
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error('2FA setup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const loginHandler = async (req: Request, res: Response) => {
    try {
        const { username, password }: LoginRequest = req.body;
        
        if (!username || !password) {
            res.status(400).json({ error: 'Username and password are required' });
            return;
        }
        
        const user = await UserModel.verifyUser(username, password);
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        
        const has2FA = await UserModel.has2FA(user?.id);
        

        const jwtToken = jwt.sign(
            { 
                userId: user?.id,
                username: user?.username,
                role: user?.role 
            },
            config.jwtSecret,
            { expiresIn: '24h' }
        );

        const refreshToken = jwt.sign(
            {
                userId: user?.id
            },
            config.jwtSecret,
            { expiresIn: '7d' }
        );

        res.status(200).json({ 
            message: 'Login successful',
            token: jwtToken,
            refreshToken,
            user: {
                id: user?.id,
                username: user?.username,
                role: user?.role,
                has2FA: has2FA
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const verify2FAHandler = async (req: Request, res: Response) => {
    try {
        const { token }: { token: string } = req.body;
        const authHeader = req.headers.authorization;
        console.log('Authorization header:', authHeader)
        
        if (!token || !authHeader) {
            res.status(400).json({ error: '2FA token and authorization header are required' });
        } else {
            const jwtToken = authHeader.split(' ')[1];
            
            let decoded;
            try {
                decoded = jwt.verify(jwtToken, config.jwtSecret) as any;
               
                const twoFactorSecret = await UserModel.get2FASecret(decoded.userId);
                if (!twoFactorSecret) {
                    res.status(500).json({ error: 'Unable to verify 2FA - secret not found' });
                } else {
                    const tokenValid = speakeasy.totp.verify({
                        secret: twoFactorSecret,
                        encoding: 'base32',
                        token,
                        window: 10
                    });

                    if (!tokenValid) {
                        res.status(401).json({ error: 'Invalid 2FA token' });
                    } else {
                        res.status(200).json({
                            message: '2FA verification successful',
                            user: {
                                id: decoded.userId,
                                username: decoded.username,
                                role: decoded.role,
                                has2FA: true
                            }
                        });
                    }
                }
                
            } catch (error) {
                res.status(401).json({ error: 'JWT token expired or invalid' });
            }
        }
    } catch (error) {
        console.error('2FA verification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const get2FAStatusHandler = async (req: Request, res: Response) => {
    try {
        const { username } = req.params;

        if (!username) {
             res.status(400).json({ error: 'Username is required' });
        }

        const user = await UserModel.findByUsername(username);
        if (!user) {
             res.status(404).json({ error: 'User not found' });
        } else {

            const has2FA = await UserModel.has2FA(user.id);

            res.json({ 
                username: user.username,
                has2FA: has2FA 
            });
        }

    } catch (error) {
        console.error('2FA status check error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const refreshTokenHandler = async (req: Request, res: Response) => {
    try {
        const refreshToken = extractBearerToken(req.headers.authorization);

        if (!refreshToken) {
            res.status(400).json({ error: 'Refresh token is required' });
        } else{
            const decodedToken: jwt.JwtPayload | string = jwt.verify(refreshToken, config.jwtSecret);
            if (typeof decodedToken === 'string' || !decodedToken) {
                res.status(401).json({ error: 'Invalid refresh token' });
            } else {
                const userId = decodedToken.userId;
                const user = await UserModel.findById(userId);
                
                if (!user) {
                    res.status(404).json({ error: 'User not found' });
                } else {
                    const newJwtToken = jwt.sign(
                        { 
                            userId: user.id,
                            username: user.username,
                            role: user.role 
                        },
                        config.jwtSecret,
                        { expiresIn: '1h' }
                    );

                    const newRefreshToken = jwt.sign(
                        {
                            userId: user.id
                        },
                        config.jwtSecret,
                        { expiresIn: '2h' }
                    );

                    res.json({ 
                        message: 'Token refreshed successfully',
                        token: newJwtToken,
                        refreshToken: newRefreshToken,
                        user: {
                            id: user.id,
                            username: user.username,
                            role: user.role
                        }
                    });
                }
            }
        }
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}