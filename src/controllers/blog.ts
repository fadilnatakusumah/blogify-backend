import { config } from "dotenv";
import { Request, Response } from "express";
import formidable, { Fields, Files, File } from "formidable";
import slugify from "slugify";
import { Blog, BlogDataTypes } from "../models/blog";
import { stripHtml } from "string-strip-html";
import sanitizeHtml from "sanitize-html";
import { trimExcerpt } from "../helpers/trimExcerpt";
import { readFileSync } from "fs";
import { customMongoErrorHandler } from "../helpers/errorHandler";

config();

export const createBlog = (req: Request, res: Response) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields: Fields | BlogDataTypes, files: Files) => {
    const { title, content, tags, contributors, } = fields;
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "title is required"
      })
    }

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "content is required"
      })
    }

    const newBlog = new Blog({
      title,
      content,
      slug: slugify(title as string).toString(),
      metaTitle: process.env.APP_NAME || "Blogify",
      metaDescription: stripHtml((content as string).substring(0, 160)).result,
      tags: [],
      excerpt: trimExcerpt(content as string, 320, ' ', '...'),
      author: (req as any).profile._id
    });

    if (files.featuredImage) {
      if ((files.featuredImage as File).size > 31457280) { // 30MB
        return res.status(400).json({
          success: false,
          message: "featured image size shouldn't more than 30MB"
        })
      }

      (newBlog as any).featuredImage.data = readFileSync((files.featuredImage as File).path);
      (newBlog as any).featuredImage.contentType = readFileSync((files.featuredImage as File).type)
    }

    try {
      await newBlog.save();
      return res.json({
        success: true,
        message: 'success create blog',
        data: newBlog
      })
    } catch (error) {
      return res.status(400).json({
        error,
        success: false,
        message: customMongoErrorHandler(error)
      })
    }
  })
}