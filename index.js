import connectDB from "./src/config/db.js";
import dotenv from "dotenv";
import express from "express";
import {app} from './app.js';
dotenv.config({
    path: './env'
})


// app.use((req, res, next) => {
//     console.log(`[INCOMING REQUEST] ${req.method} ${req.url}`);
//     next();
// });


connectDB()
.then( () => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`server is running at port ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("MONGODB connection failed" , err);
});


console.log("MONGO URL FROM ENV:", process.env.MONGODB_URL);












