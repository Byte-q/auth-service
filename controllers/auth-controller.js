import { User } from '../models/Users.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

export class AuthController {

    async refresh(req, res) {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(401); // Unauthorized
        console.log(cookies.jwt)
        const refreshToken = cookies.jwt;

        const user = await User.findOne({ refreshToken }).exec();
        if (!user) return res.sendStatus(403); // Forbidden

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err || user.name !== decoded.username) return res.sendStatus(403); // Forbidden
            const roles = Object.values(user.roles)
            const accessToken = jwt.sign(
                { "userInfo": { "username": user.name, "role": roles } },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );
            res.status(200).json(accessToken);
        });
    }

    async listAll(req, res) {
        try {
            const users = await User.find().exec();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.id }).exec();
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getByName(req, res) {
        try {
            const name = req.params.name;
            const user = await User.findOne({ name }).exec();
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getByEmail(req, res) {
        try {
            const email = req.params.email;
            const user = await User.findOne({ email }).exec();
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { name, password } = req.body;
            if (!name || !password) {
                return res.status(400).json({ message: "Name and password are required" });
            }
            const user = await User.findOne({ name }).exec();
            if (!user) {
                return res.sendStatus(401).json({ message: "Invalid credentials" });
            }
            
            const passwordMatch = await bcrypt.compare(password, user.password);
            
            if (!passwordMatch) {
            return null;
            }
                

            // Generate access and refresh tokens
            const ACCESS_TOKEN = process.env.ACCESS_TOKEN_SECRET;
            const REFRESH_TOKEN = process.env.REFRESH_TOKEN_SECRET;
            const roles = Object.values(user.roles)
            const accessToken = jwt.sign(
                { 
                    "userInfo": {
                        "username": user.name,
                        "roles": roles
                    }
                 },
                ACCESS_TOKEN,
                { expiresIn: '15m' }
            );
            const refreshToken = jwt.sign(
                { "username": user.name },
                REFRESH_TOKEN,
                { expiresIn: '1d' }
            );
            Object.assign(user, { refreshToken });
            await user.save();
            res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 }); // 1 day
            res.status(200).json(accessToken);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async logout(req, res) {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(204); // No content
        const refreshToken = cookies.jwt;

        // Check if the refresh token is in the database
        const user = await User.findOne({ refreshToken }).exec();
        if (!user) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' });
            return res.sendStatus(204); // No content
        }

        // Delete the refresh token from the database
        user.refreshToken = '';
        await user.save();

        // Clear the cookie
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        res.sendStatus(204); // No content
    }

    async create(req, res) {
        try {
            let { name, password, description, activity, email  } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            password = hashedPassword;
            const userData = { 
                name, 
                password,
                roles: {"User": 2001},
                description, 
                activity, 
                email 
            };

            const existingUser = await User.findOne({ email }).exec();
            if (existingUser) {
            throw new Error('User with this email already exists');
            return null;
            }
            const user = new User(userData);
            await user.save();
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const _id = req.params.id;
            const data = req.body;
            const user = await User.findOne({ _id }).exec();
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            
            Object.assign(user, data);
            await user.save();
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id;
            const result = await User.findOneAndDelete({ _id: id}).exec();
            if (!result) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}