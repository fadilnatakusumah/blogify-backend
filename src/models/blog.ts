import mongoose, { model, Schema, Types } from "mongoose";
import { TagDataTypes } from "./tag";
import { UserDataTypes } from "./user";

export interface BlogDataTypes {
  title: string,
  content: string,
  slug?: string,
  excerpt?: string,
  metaTitle?: string,
  metaDescription?: string,
  tags: TagDataTypes[],
  featuredImage?: File,
  author: UserDataTypes
  contributors?: UserDataTypes[],
  createdAt?: string,
  updatedAt?: string,
}

const BlogSchema = new Schema({
  title: {
    type: String,
    required: true,
    min: 3,
    index: true,
    max: 60,
  },
  content: {
    type: {},
    required: true,
    min: 200,
    max: 2000000,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  excerpt: {
    type: String,
    max: 1000,
  },
  metaTitle: {
    type: String,
  },
  metaDescription: {
    type: String,
  },
  featuredImage: {
    data: Buffer,
    contentType: String,
  },
  tags: [
    {
      type: Types.ObjectId,
      ref: 'Tag',
    }
  ],
  author: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  contributors: [
    {
      type: Types.ObjectId,
      ref: 'User',
    }
  ]
}, {
  timestamps: true
});

export const Blog = model("Blog", BlogSchema);