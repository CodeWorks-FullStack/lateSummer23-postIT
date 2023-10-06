import { SocketHandler } from "../utils/SocketHandler.js";




export class RoomHandler extends SocketHandler{
  constructor(io, socket){
    super(io, socket, false)
    this
    .on('JOIN_ROOM', this.onJoinRoom)
    .on('LEAVE_ROOM', this.onLeaveRoom)

  }

  onJoinRoom(roomName){
    this.socket.join(roomName)
    this.messageSelf('JOINED_ROOM', roomName)
  }

  onLeaveRoom(roomName){
    this.socket.leave(roomName)
    this.messageSelf('LEFT_ROOM', roomName)
  }
}
