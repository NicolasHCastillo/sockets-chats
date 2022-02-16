const { Socket } = require("socket.io")
const { comprobarJWT } = require("../helpers")
const { ChatMensajes } = require('../models')

const chatMensajes = new ChatMensajes()

const socketController = async(socket = new Socket, io) => {
    const token = socket.handshake.headers['x-token']
    const usuario = await comprobarJWT(token)
    if(!usuario) return socket.disconnect()
    
    //Agregar usuario conectado
    chatMensajes.conectarUsuario(usuario)
    io.emit('usuarios-activos', chatMensajes.usuariosArr)
    socket.emit('recibir-mensaje', chatMensajes.ultimos10)

    //Conectarlo a una sala especial
    socket.join(usuario.id) // global, socket.id, usuario,id

    //Limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id)
        io.emit('usuarios-activos', chatMensajes.usuariosArr)
    })

    socket.on('enviar-mensaje',({uid, mensaje}) => {
        if(uid){
            //Mensaje privado
            console.log(uid);
            socket.to(uid).emit('mensaje-privado', {de: usuario.nombre, mensaje})
        }else{
            chatMensajes.enviarMensaje(usuario.uid, usuario.nombre, mensaje)
            io.emit('recibir-mensaje', chatMensajes.ultimos10)
        }
    })

}

module.exports = {
    socketController
}