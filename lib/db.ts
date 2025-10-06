import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL

if (!MONGO_URL) {
    throw new Error("please define mongo_url in env varibale  ");

}
let Cached = global.mongoose

if (!Cached) {
    Cached = global.mongoose = {
        conn: null,
        promise: null
    }
}
export async function Connecttodatabase() {
    if (Cached.conn) {
        return Cached.conn
    }

    if (!Cached.promise) {
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10,
        }
        mongoose
            .connect(MONGO_URL as string, opts)
            .then(() => mongoose.connection)
    }
    try {
        Cached.conn = await Cached.promise
    } catch (error) {
        Cached.promise = null
        throw new Error(`error: ${String(error)}`);

    }
    return Cached.conn
}