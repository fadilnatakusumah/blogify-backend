import { model, Schema } from "mongoose";
import crypto from "crypto";

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
    console.log("🚀 ~ file: user.ts ~ line 46 ~ password", password)
    // store the password
    this._password = password;

    // set salt
    this.salt = this.makeSalt();
    console.log("🚀 ~ file: user.ts ~ line 51 ~ this.salt ", this.salt)

    // encrypt password
    this.hashedPassword = this.encryptPassword(password);
    console.log("FIRST", this.hashedPassword)
  })
  .get(function () {
    return this._password;
  });

(UserSchema as any).methods = {
  authenticate: function (password: string) {
    console.log("🚀 ~ file: user.ts ~ line 66 ~ this.encryptPassword(password)", this.encryptPassword(password))
    console.log("🚀 ~ file: user.ts ~ line 67 ~ this.hashedPassword", this.hashedPassword)
    return this.encryptPassword(password) === this.hashedPassword;
  },
  encryptPassword: function (password: string) {
    console.log("🚀 ~ file: user.ts ~ line 73 ~ password", password)
    if (!password) return '';

    try {
      console.log("🚀 ~ file: user.ts ~ line 77 ~ this.salt", this.salt)
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