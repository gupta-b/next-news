import mongoose from 'mongoose';

const connection = {};

async function dbConnect() {
  // Check if we have a connection to the database or if it's currently connecting
  if (connection.isConnected) {
    console.log('Already connected to the database');
    return;
  }

  try {
    // Attempt to connect to the database
    const db = await mongoose.connect(process.env.MONGODB_URI || '', {});

    connection.isConnected = db.connections[0].readyState;

    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);

    // Graceful exit in case of a connection error
    process.exit(1);
  }
}

export default dbConnect;

// import mongoose from "mongoose"

// const MONGODB_URI = process.env.MONGODB_URI || ""

// if (!MONGODB_URI) {
//   throw new Error("Please define the MONGODB_URI environment variable")
// }

// /**
//  * Global is used here to maintain a cached connection across hot reloads
//  * in development. This prevents connections growing exponentially
//  * during API Route usage.
//  */
// let cached = global.mongoose

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null }
// }

// async function dbConnect() {
//   if (cached.conn) {
//     console.log("Already Connected to MongoDB")
//     return cached.conn
//   }

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//     }

//     cached.promise = mongoose
//       .connect(MONGODB_URI, opts)
//       .then((mongoose) => {
//         console.log("Connected to MongoDB", mongoose)
//         return mongoose
//       })
//       .catch((error) => {
//         console.error("Error connecting to MongoDB:", error)
//         throw error
//       })
//   }

//   cached.conn = await cached.promise
//   return cached.conn
// }

// export default dbConnect
