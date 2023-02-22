const express = require('express');
const app = express();
const http = require('http');
//
const server = http.createServer(app);
//socket
const { Server } = require("socket.io");
const socketio = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/static/index.html");
});

server.listen(3000, () => {
    console.log('listening on 3000');
});

//---------------- eventy

let clients = []
//
socketio.on('connection', (client) => {
    console.log('klient dołaczył', client.id);
    clients.push(client)
    console.log("jest klientów:" + clients.length)
    let ids = []
    clients.forEach(el => {
        ids.push(el.id)
    })
    socketio.emit("clients_array", { ids: ids });
    //
    client.emit("onclientmessage", {
        clientId: client.id
    })
    //
    client.on("mouseposition", (data) => {
        //console.log(data.posX + " - " + data.posY)
        client.broadcast.emit("mouseposition", { posX: data.posX, posY: data.posY });
    })
    //
    client.on("disconnect", (reason) => {
        console.log(`client id = ${client.id} się odłączył`, reason);
        clients = clients.filter(x => x.id !== client.id)
        console.log(`pozostało klientów ${clients.length}`)
        //
        let ids = []
        clients.forEach(el => {
            ids.push(el.id)
        })
        socketio.emit("clients_array", { ids: ids });
    })

});