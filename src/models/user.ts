import { model, Schema } from "mongoose";
import crypto from "crypto";

export interface UserDataTypes {
  name: string,
  username: string,
  email: string,
  hashedPassword?: string,
  role?: number,
  salt?: string,
  about?: string,
  photo?: any,
  createdAt?: string,
  updatedAt?: string,
}

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    max: 32
  },
  username: {
    type: String,
    required: true,
    max: 24,
    unique: true,
    index: true,
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  hashedPassword: {
    type: String,
    trim: true,
  },
  role: {
    type: Number,
    default: 0,
  },
  salt: String,
  about: {
    type: String,
    default: ''
  },
  photo: {
    data: Buffer,
    contentType: String,
    default: ''
  }
}, {
  timestamps: true
});

UserSchema.virtual("password")
  .set(function (password: string) {
    // store the password
    this._password = password;

    // set salt
    this.salt = this.makeSalt();

    // encrypt password
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

(UserSchema as any).methods = {
  authenticate: function (password: string) {
    return this.encryptPassword(password) === this.hashedPassword;
  },
  encryptPassword: function (password: string) {
    if (!password) return '';

    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (error) {
      return '';
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  },
}

export const User = model("User", UserSchema);