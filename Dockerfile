FROM node:18

WORKDIR /usr/src/app

COPY websocket-service/package*.json ./

RUN npm install

COPY websocket-service/src ./src

EXPOSE 3006

CMD [ "node","src/service.js" ]
