import amqp from "amqplib";
import dotenv from "dotenv";
import { socket } from "../service.js";

dotenv.config();

const queue = "ws_service_queue";
let channel = null;

export const createConnectionMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.AMQP_URL)
    channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    console.log("Waiting for data");
    channel.consume(
      queue,
      async (msg) => {
        const { action, body } = msg.content.toString()

        switch (action) {
          case "MESSAGE":
            const { chat_id, chat } = JSON.parse(body);
            socket.to(chat_id).emit("recieve_chat_message", { content: chat });
            break;
          default:
            break;
        }

        await channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(responseState)), {
          correlationId: msg.properties.correlationId
        })

        channel.ack(msg)
      },
      { noAck: false }
    );
  }
  catch (err) {
    throw new Error(err)
  }
};
