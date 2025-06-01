import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { config } from '../config';
import { Request, Response } from 'express';
import { CreateUser } from '../models/user';

export const registerHandler = async (req: Request, res: Response) => {
    try {
        const { username, password }: CreateUser = req.body;
        if (!username || !password) {
            res.status(400).json({ error: 'username and password are required' });
        } else{
            // find if user already exists
            const existingUser = null // await find user
            if (existingUser) {
                res.status(400).json({ error: 'User already exists' });
            } else{
                // create user
                const newUser = null // await create user
                res.json({ message: 'User registered successfully' });
            }
        }

    } catch (error) {
       res.status(500).json({ error: 'Internal server error' });
    }
};

export const setupTwoFactorAuthenticationHandler = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = {
                email: 'chris@gmail.com',
            password: 'password123',
            twoFactorSecret: 'KZ3Q2X5F4G6H7J8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F0G1H2', // Example secret
        };

        if (!user){ 
            res.status(404).json({ error: 'User not found' });
        } else{
            const secret = speakeasy.generateSecret({ 
                name: user.email,
                issuer: 'Todonique', 
                length: 20
            });

            console.log('Generated 2FA Secret:', secret.base32);

            // Save the secret to the user's profile in the database
            // await saveUserTwoFactorSecret(user.id, secret.base32);
            console.log('Generated 2FA Secret:', secret.base32);

            qrcode.toDataURL(secret.otpauth_url || '', (err, dataUrl) => {
                if (err) return res.status(500).json({ error: 'QR generation error' });
                res.json({ qrCode: dataUrl });
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const verifyTwoFactorHandler = async (req: Request, res: Response) => {
    try {
        const { email, token, secret } = req.body;
        // hard coding secret for demo purposes
        const user = {
            email: 'chris@gmail.com',
            password: 'password123',
            twoFactorSecret: secret
        };
        if (!user || !user.twoFactorSecret){ 
            res.status(400).json({ error: '2FA not set up' });
        } else{

            const verified = speakeasy.totp.verify({
                secret: user.twoFactorSecret,
                encoding: 'base32',
                token,
                window: 1
            });

            console.log('2FA Token Verification:', verified);

            if (!verified) {
                res.status(401).json({ error: 'Invalid token' });
            } else{

                // Optionally mark 2FA as "enabled" in the DB
                // await markTwoFactorEnabled(user.id);

                res.json({ message: '2FA verified successfully' });
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const loginHandler = async (req: Request, res: Response) => {
    try {
        const { email, password, token } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
        } else{
            const user = {
                email: 'chris@gmail.com',
                password: 'password123',
                twoFactorSecret: 'KZ3Q2X5F4G6H7J8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F0G1H2', // Example secret
            };
            if (!user) {
                res.status(400).json({ error: 'Invalid credentials' });
            } else{
                // const passwordMatch = await bcrypt.compare(password, user.password);
                const passwordMatch = user.password === password; // Simulating password check for demo purposes
                console.log('Password match:', passwordMatch);
                if (!passwordMatch) {
                    res.status(400).json({ error: 'Invalid credentials' });
                } else{

                    console.log('Generated Token:', token);
                    const tokenValid = speakeasy.totp.verify({
                        secret: user.twoFactorSecret,
                        encoding: 'base32',
                        token,
                        window: 1
                    });

                    if (!tokenValid) {
                        res.status(401).json({ error: 'Invalid 2FA token' });
                    } else{
                        const jwtToken = jwt.sign(
                            { email: user.email },
                            config.jwtSecret,
                            { expiresIn: '1h' }
                        );

                        res.json({ token: jwtToken });
                    }
                }
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};