import mongoose from "mongoose";
import dns from "dns";
import dotenv from 'dotenv'
dotenv.config()

if(!process.env.MONGODB_URL) {
    throw new Error(
        "Please provide MONGODB_URL in the .env file"
    )
}

async function connectDB() {
    try {
        // Avoid SRV DNS resolution issues on some networks.
        dns.setDefaultResultOrder('ipv4first')
        dns.setServers(['8.8.8.8', '1.1.1.1'])
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("DB connected")
    } catch (error) {
        console.log("Mongodb connect error", error)
        process.exit(1)
    }
}

export default connectDB