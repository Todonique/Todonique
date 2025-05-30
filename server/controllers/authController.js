import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

export const registerHandler = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // find if user already exists
        const existingUser = null // await find user
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        };

        res.json({ message: 'User registered successfully' });
    } catch (error) {
       
    }
};

export const setupTwoFactorAuthenticationHandler = async (req, res) => {
    const { email } = req.body;
    const user = {
            email: 'chris@gmail.com',
            password: 'password123',
            twoFactorSecret: 'KZ3Q2X5F4G6H7J8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F0G1H2', // Example secret
        };

    if (!user) return res.status(404).json({ error: 'User not found' });

    const secret = speakeasy.generateSecret({ 
        name: user.email,
        issuer: 'Todonique', 
        length: 20
    });

    console.log('Generated 2FA Secret:', secret.base32);

    // Save the secret to the user's profile in the database
    // await saveUserTwoFactorSecret(user.id, secret.base32);
    console.log('Generated 2FA Secret:', secret.base32);

    qrcode.toDataURL(secret.otpauth_url, (err, dataUrl) => {
        if (err) return res.status(500).json({ error: 'QR generation error' });
        res.json({ qrCode: dataUrl });
    });
};

export const verifyTwoFactorHandler = async (req, res) => {
    const { email, token, secret } = req.body;
 // hard coding secret for demo purposes
    const user = {
            email: 'chris@gmail.com',
            password: 'password123',
            twoFactorSecret: secret
        };
    if (!user || !user.twoFactorSecret) return res.status(400).json({ error: '2FA not set up' });

    const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token,
        window: 1
    });

    console.log('2FA Token Verification:', verified);

    if (!verified) return res.status(401).json({ error: 'Invalid token' });

    // Optionally mark 2FA as "enabled" in the DB
    // await markTwoFactorEnabled(user.id);

    res.json({ message: '2FA verified successfully' });
};

export const loginHandler = async (req, res) => {
    const { email, password, token } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = {
            email: 'chris@gmail.com',
            password: 'password123',
            twoFactorSecret: 'KZ3Q2X5F4G6H7J8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F0G1H2', // Example secret
        };

        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        };

        // const passwordMatch = await bcrypt.compare(password, user.password);
        const passwordMatch = user.password === password; // Simulating password check for demo purposes
        console.log('Password match:', passwordMatch);
        if (!passwordMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        };

        console.log('Generated Token:', token);
        const tokenValid = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token,
            window: 1
        });

        if (!tokenValid) {
            return res.status(401).json({ error: 'Invalid 2FA token' });
        };

        const jwtToken = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token: jwtToken });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};