import { AppState } from "../AppState.js";
import { Album } from "../models/Album.js";
import { Collaborator } from "../models/Collborator.js";
import { Picture } from "../models/Picture.js";
import Pop from "../utils/Pop.js";
import { SocketHandler } from "../utils/SocketHandler.js";

class TestHandler extends SocketHandler {

  constructor() {
    super()
    this
      .on('IS_TESTED', this.onTest)
      .on('USER_LOGGED_IN', this.onUserLogin)
      .on('NEW_ALBUM', this.onNewAlbum)
      .on('NEW_COLLABORATOR', this.onNewCollab)
      .on('NEW_PICTURE', this.onNewPicture)
      .on('JOINED_ROOM', this.onJoinedRoom)
      .on('LEFT_ROOM', this.onLeftRoom)
  }

  onTest(payload){
    console.log('Recieved IS_TESTED', payload)
  }


  onUserLogin(payload){
    console.log('🧛', payload)
    Pop.toast(payload.name + "logged in")
  }

  onNewAlbum(album){
    let newAlbum = new Album(album)
    AppState.albums.unshift(newAlbum)
  }

  onNewCollab(collab){
    let newCollab = new Collaborator(collab)
    let activeAlbum = AppState.activeAlbum
    if(activeAlbum && activeAlbum.id == collab.albumId){ //makes sure it only shows up IF your one the correct album page
      AppState.activeAlbumCollaborators.push(newCollab)
    }
    let profile = collab.profile
    let album = collab.album
    Pop.toast(`${profile.name} just collabed on ${album.title}, \n<a href="#/albums/${album.id}">Go check it out 👉</a>`)
  }

  onNewPicture(picture){
    let newPicture=  new Picture(picture)
    AppState.activeAlbumPictures.push(newPicture)
  }

  onJoinedRoom(payload){
    console.log('joined room',payload)
  }

  onLeftRoom(payload){
    console.log('left room', payload)
  }

}

export const testHandler = new TestHandler()
