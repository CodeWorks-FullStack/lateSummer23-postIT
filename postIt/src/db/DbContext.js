import mongoose from 'mongoose'
import { AccountSchema } from '../models/Account'
import { AlbumsSchema } from '../models/Album.js';
import { PictureSchema } from '../models/Picture.js';

class DbContext {
  Account = mongoose.model('Account', AccountSchema);

  Albums = mongoose.model('Album', AlbumsSchema)

  Pictures = mongoose.model('Picture', PictureSchema)

}

export const dbContext = new DbContext()
