import { model, Schema } from "mongoose";

export interface TagDataTypes {
  name: string,
  slug: string,
  createdAt: string,
  updatedAt: string,
}

const TagSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    max: 32,
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
}, {
  timestamps: true
});


export const Tag = model("Tag", TagSchema);

