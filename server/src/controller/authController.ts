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

type Setup2FARequest = {
    username: string;
};

type Verify2FARequest = {
    username: string;
    token: string;
    secret: string;
};

export const registerHandler = async (req: Request, res: Response) => {
    try {
    
        const { username, password }: CreateUser =  req.body;
        if (!username || !password) {
             res.status(400).json({ error: 'username and password are required' });
        }
        
        const existingUser = await UserModel.findByUsername(username);
        if (existingUser) {
             res.status(400).json({ error: 'User already exists' });
        }
        
        const newUser = await UserModel.createUser({ username, password });
        const jwtToken = jwt.sign(
            { 
                userId: newUser.id,
                username: newUser.username,
                role: newUser.role 
            },
            config.jwtSecret,
            { expiresIn: '1h' }
        );
        const refreshToken = jwt.sign(
            {
                userId: newUser.id
            },
            config.jwtSecret,
            { expiresIn: '2h' }
        );

        res.json({ message: 'User registered successfully', data: newUser , jwtToken, refreshToken });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const setupTwoFactorAuthenticationHandler = async (req: Request, res: Response) => {
    try {
        const { username }: Setup2FARequest = req.body;
        
        
        if (!username) {
             res.status(400).json({ error: 'Username is required' });
        }

        const user = await UserModel.findByUsername(username);
        
        if (!user) {
             res.status(404).json({ error: 'User not found' });
        } else {

            const has2FA = await UserModel.has2FA(user.id);
            if (has2FA) {
                res.status(400).json({ error: '2FA is already enabled for this user' });
            }

            const secret = speakeasy.generateSecret({ 
                name: `${username}@Todonique`,
                issuer: 'Todonique', 
                length: 20
            });


            await UserModel.setTempSecret(user.id, secret.base32);

            qrcode.toDataURL(secret.otpauth_url || '', (err, dataUrl) => {
                if (err) {
                    console.error('QR generation error:', err);
                    return res.status(500).json({ error: 'QR generation error' });
                }
                
                res.json({ 
                    qrCode: dataUrl,
                    secret: secret.base32,
                    manualEntryKey: secret.base32
                });
            });
        }

    } catch (error) {
        console.error('2FA setup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const verifyTwoFactorHandler = async (req: Request, res: Response) => {
    try {
        const { username, token, secret }: Verify2FARequest = req.body;
                          
        if (!username || !token || !secret) {
            res.status(400).json({ error: 'Username, token, and secret are required' });
        } else {
            const user = await UserModel.findByUsername(username);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
            } else {
                const tempSecret = await UserModel.getTempSecret(user.id);
                console.log('Temp Secret:', tempSecret);
                console.log('Provided Secret:', secret);
                if (!tempSecret || tempSecret !== secret) {
                    res.status(400).json({ error: 'Invalid or expired setup session' });
                } else {
                    const verified = speakeasy.totp.verify({
                        secret: tempSecret,
                        encoding: 'base32',
                        token,
                        window: 1
                    });
                      
                    if (!verified) {
                        res.status(401).json({ error: 'Invalid token' });
                    } else {
                        await UserModel.activate2FA(user.id, tempSecret);
                        await UserModel.clearTempSecret(user.id);
                         
                        res.status(200).json({ message: '2FA verified and activated successfully' });
                    }
                }
            }
        }
    } catch (error) {
        console.error('2FA verification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const loginHandler = async (req: Request, res: Response) => {
    try {
        const { username, password, token }: LoginRequest = req.body;
        
        if (!username || !password) {
            res.status(400).json({ error: 'Username and password are required' });
        } else {
            const user = await UserModel.verifyUser(username, password);
            if (!user) {
                res.status(401).json({ error: 'Invalid credentials' });
            } else {
                const has2FA = await UserModel.has2FA(user?.id);
                
                if (has2FA) {
                    if (!token) {
                        res.status(200).json({ 
                            requires2FA: true,
                            message: '2FA token required',
                            user: {
                                id: user?.id,
                                username: user?.username
                            }
                        });
                    } else {
                        // Verify 2FA token
                        const twoFactorSecret = await UserModel.get2FASecret(user?.id);
                        if (!twoFactorSecret) {
                            res.status(500).json({ error: 'Unable to verify 2FA - secret not found' });
                        } else {
                            const tokenValid = speakeasy.totp.verify({
                                secret: twoFactorSecret,
                                encoding: 'base32',
                                token,
                                window: 1
                            });

                            if (!tokenValid) {
                                res.status(401).json({ error: 'Invalid 2FA token' });
                            } else {
                                const jwtToken = jwt.sign(
                                    { 
                                        userId: user?.id,
                                        username: user?.username,
                                        role: user?.role 
                                    },
                                    config.jwtSecret,
                                    { expiresIn: '24h' }
                                );

                                res.status(200).json({ 
                                    message: 'Login successful',
                                    token: jwtToken,
                                    user: {
                                        id: user?.id,
                                        username: user?.username,
                                        role: user?.role,
                                        has2FA: has2FA
                                    }
                                });
                            }
                        }
                    }
                } else {
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
                        { expiresIn: '2h' }
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
                }
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const disable2FAHandler = async (req: Request, res: Response) => {
    try {
        const { username, password, token } = req.body;

        if (!username || !password || !token) {
             res.status(400).json({ error: 'Username, password, and 2FA token are required' });
        }

        const user = await UserModel.verifyUser(username, password);
        if (!user) {
             res.status(401).json({ error: 'Invalid credentials' });
        } else {
            const has2FA = await UserModel.has2FA(user.id);
            if (!has2FA) {
                res.status(400).json({ error: '2FA is not enabled for this user' });
            }

            const twoFactorSecret = await UserModel.get2FASecret(user.id);
            if (!twoFactorSecret) {
                res.status(500).json({ error: 'Unable to verify 2FA' });
            } else {
                const tokenValid = speakeasy.totp.verify({
                    secret: twoFactorSecret,
                    encoding: 'base32',
                    token,
                    window: 1
                });

                if (!tokenValid) {
                    return res.status(401).json({ error: 'Invalid 2FA token' });
                }

                await UserModel.disable2FA(user.id);

                res.json({ message: '2FA disabled successfully' });
            }
        }
    } catch (error) {
        console.error('2FA disable error:', error);
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