import express from "express";
import dotenv from "dotenv";
import {log} from "./lib/log.js";
import {createConnectionMQ} from "./config/rabbitmq.js";
import chalk from "chalk";
import {createServer} from "http";
import {Server} from "socket.io";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {cors: {origin: process.env.CLIENT}});
export var socket = null;

io.on("connection", (s) => {
	socket = s;

	socket.on("join_chat", (data) => {
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
