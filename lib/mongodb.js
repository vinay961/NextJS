import mongoose from "mongoose";

const Mongo_URI = process.env.MONGO_URI;

if(!Mongo_URI){
    throw new Error("Please define the MONGO_URI environment variable inside .env.local");
}

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = {conn: null, promise: null};
}

async function dbConnect(){
    if(cached.conn){
        return cached.conn;
    }

    if(!cached.promise){
        const opts = {
            bufferCommands: false, // Disable mongoose buffering: buffering means mongoose will queue up operations if it gets disconnected from MongoDB and send them when it reconnects. Setting this to false means that if mongoose is not connected, operations will fail immediately.
        };
        cached.promise = mongoose.connect(Mongo_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }
}

export default dbConnect;