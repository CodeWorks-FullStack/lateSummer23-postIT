import { SocketHandler } from "../utils/SocketHandler.js";



 class AuthorizedHandler extends SocketHandler{
  constructor(){
    super(true)
  }
}

export const authSockethandler = new AuthorizedHandler()
