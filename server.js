const { Server } = require('socket.io')
const server = new Server()

server.on('connection', (socket) => {
  console.log('Socket connected:', socket.id)
})

module.exports = {
  server,
}