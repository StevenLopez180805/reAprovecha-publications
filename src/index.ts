import express from "express";
import http from "http";


const app = express();
const server = http.createServer(app);
const PORT = Number(process.env.PORT ?? 4000)
server.listen(3000, () => {
    console.log("Server is running on port 3000");
});