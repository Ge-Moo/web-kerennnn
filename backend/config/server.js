import express from 'express'
import {Server} from 'socket.io'
import http from 'http'
import {updateStatus} from '../controller/taskHandle.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

io.on('connected',(socket)=>{
    console.log('new socket connected :',socket.id)
    socket.on('update',(data)=>{
        socket.emit('updated',updateStatus(data))
    })
})

export {
    server,app,express
}
