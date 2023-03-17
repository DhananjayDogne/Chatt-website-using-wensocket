const express=require("express");
const path=require('path');
const app=express();

const PORT=process.env.PORT || 4000
const server=app.listen(PORT,()=>console.log(`chat server on Port ${PORT}`))

const io=require('socket.io')(server)

//run the html file with index name
app.use(express.static(path.join(__dirname,'public')))

let socketsConnected=new Set()

//call for onConnection 
io.on('connection',onConnected)

// when server start print id and add to set
function onConnected(socket){
    console.log(socket.id);
    socketsConnected.add(socket.id);
    
    io.emit('clients-total',socketsConnected.size)

    socket.on('disconnect',()=>{
        console.log('Socket Disconnected',socket.id)
        socketsConnected.delete(socket.id);
        io.emit('clients-total',socketsConnected.size)
    })

    socket.on('message',(data)=>{
        console.log(data);
        socket.broadcast.emit('chat-message',data);
    })

    socket.on('feedback',(data)=>{
        socket.broadcast.emit('feedback',data);
    })
}