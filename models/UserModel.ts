import { model, Schema, Document } from 'mongoose'

export interface UserModelInterface {
  _id?: string
  email: string
  fullname: string
  username: string
  location?: string
  password: string
  confirmed?: boolean
  confirmedHash?: string
  about?: string
  website?: string
}

export type UserModelDocumentInterface = UserModelInterface & Document

const UserSchema = new Schema<UserModelInterface>({
  email: {
    unique: true,
    required: true,
    type: String,
  },
  fullname: {
    required: true,
    type: String,
  },
  username: {
    unique: true,
    required: true,
    type: String,
  },
  location: {
    type: String,
  },
  password: {
    required: true,
    type: String,
    // select: false,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  confirmedHash: {
    required: true,
    type: String,
    // select: false,
  },
  about: {
    type: String,
  },
  website: {
    type: String,
  },
})

UserSchema.set('toJSON', {
  transform: function (_, obj) {
    delete obj.password
    delete obj.confirmedHash
    return obj
  },
})

export const UserModel = model<UserModelDocumentInterface>('User', UserSchema)
