// import mongoose from "mongoose";

// function initDB() {
//     if (mongoose.connections[0].readyState){
//         console.log("** Already Connected **")
//         return
//     }
//     mongoose.connect(process.env.CONNECTION_STRING, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     });
//     mongoose.connection.on('connected', () => {
//         console.log("** Connected To Mongo **")
//     });
//     mongoose.connection.on('error', (err) => {
//         console.log("** Connecting To Mongo returns error **", err)
//     })
// }

// export default initDB;

// // const mongoose = require("mongoose");

// // const connectDb = async () => {
// //     try {
// //         const connect = await mongoose.connect(process.env.CONNECTION_STRING);
// //         console.log("++ connected ++",
// //             connect.connection.host,
// //             connect.connection.name);
        
// //     } catch (err) {
// //         console.log(err);
// //         process.exit(1)
// //     }
// // }

// // module.exports = connectDb;