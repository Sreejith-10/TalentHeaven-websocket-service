import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {log} from "./lib/log.js";
import {createConnectionMQ} from "./config/rabbitmq.js";
import {WebSocketServer} from "ws";
import chalk from "chalk";
import {createServer} from "http";
import {Server} from "socket.io";
import {PrivateRoom} from "./lib/room.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {cors: {origin: "*"}});
export let socket = null;

io.on("connection", (ws) => {
	socket = ws;
	console.log("client connected");

	socket.emit("connection_success", {message: "success"});

	socket.on("join_chat", (data) => {
		console.log("joined room", data.id);
		socket.join(data.id);
	});

	socket.on("leave_chat", (data) => {
		socket.leave(data.id);
	});

	socket.on("close", () => {
		console.log("client diconnected");
		socket.disconnect();
	});
});

createConnectionMQ();

server.listen(3006, () => {
	log(
		chalk.bold.yellowBright(`Server started on PORT : ${chalk.bold.blue(3006)}`)
	);
});
