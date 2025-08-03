import express from 'express';
import dbConnect from './lib/dbConnect.js';
import mongoose, { set } from'mongoose';
import { setupRoutes } from './routes/index.js';
import cors from 'cors';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config/corsOptions.js';
import { credentials } from './middleware/credentials.js';

// Connect to DB
dbConnect();

const app = express();
config()
const PORT = process.env.PORT || 3500

async function startServer() {
    // middleware to handle url encoded data in other word form data
    app.use(express.urlencoded({ extended: false }));

    // middleware to handle json data from url
    app.use(express.json());

    // handle headers
    app.use(credentials)

    // Cross Origin Resorces Sharing
    app.use(cors(corsOptions));

    // middleware to handle cookies
    app.use(cookieParser());

    setupRoutes(app);

    mongoose.connection.once('open', () => {
        console.log(`Connected to DB`)
        app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
    })
}

startServer();
export default app;
