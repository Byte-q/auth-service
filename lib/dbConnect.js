import mongoose from 'mongoose';

const dbConnect = async () => {
    try {
        const DATABASE_URI = process.env.DATABASE_URL || 'mongodb+srv://mohaazizz01:0122Gare@cluster0.9x5bc7x.mongodb.net/core-platform?retryWrites=true&w=majority&appName=Cluster0';
        await mongoose.connect(DATABASE_URI);
    } catch (err) {
        console.log(`Error connecting to the database: ${err.message}`);
    }
}

export default dbConnect;