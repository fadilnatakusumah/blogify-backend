import { Request, Response } from "express";
import slugify from "slugify";
import { customMongoErrorHandler } from "../helpers/errorHandler";
import { Tag, TagDataTypes } from "../models/tag";



export const createTags = async (req: Request, res: Response) => {
  const { names } = req.body;
  const newTags = (names as string[]).map((name) => ({
    name,
    slug: slugify(name).toLowerCase(),
  }));

  try {
    const { ops } = await Tag.collection.insertMany(newTags);
    res.json({
      success: true,
      message: "success create categories",
      data: ops
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: customMongoErrorHandler(error),
    })
  }
}

export const listTags = async (req: Request, res: Response) => {
  const { limit = 10, search = "" } = req.query;
  const tags = await Tag.find({
    $or: [{
      name: {
        $regex: search,
        $options: 'i'
      }
    }]
  })
    .limit(+limit)

  res.json({
    success: true,
    message: 'success get categories',
    data: tags,
  })
}