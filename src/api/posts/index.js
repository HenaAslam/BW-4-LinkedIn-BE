import express from "express";
import createHttpError from "http-errors";
import postModel from "./model.js";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import q2m from "query-to-mongo";

const postRouter = express.Router();

postRouter.post("/", async (req, res, next) => {
  try {
    const newPost = new postModel(req.body);

    const { _id } = await newPost.save();

    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

postRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    // console.log(mongoQuery);
    const posts = await postModel
      .find(mongoQuery.criteria, mongoQuery.options.fields)
      .limit(mongoQuery.options.limit)
      .skip(mongoQuery.options.skip)
      .sort(mongoQuery.options.sort)
      .populate({
        path: "user",
        select: "_id name surname image ",
      });

    const total = await postModel.countDocuments(mongoQuery.criteria);

    res.send({
      links: mongoQuery.links(process.env.PAGINATION_POSTS, total),
      total,
      numberOfPages: Math.ceil(total / mongoQuery.options.limit),
      posts,
    });
  } catch (error) {
    next(error);
  }
});

postRouter.get("/:postId", async (req, res, next) => {
  try {
    const post = await postModel.findById(req.params.postId).populate({
      path: "user",
      select: "_id name surname image",
    });

    if (post) {
      res.send(post);
    } else {
      next(createHttpError(404, `post with id ${req.params.postId} not found`));
    }
  } catch (error) {
    next(error);
  }
});
postRouter.delete("/:postId", async (req, res, next) => {
  try {
    const deletedPost = await postModel.findByIdAndDelete(req.params.postId);
    if (deletedPost) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `post with id ${req.params.postId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

postRouter.put("/:postId", async (req, res, next) => {
  try {
    const updatedPost = await postModel.findByIdAndUpdate(
      req.params.postId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedPost) {
      res.send(updatedPost);
    } else {
      next(createHttpError(404, `post with id ${req.params.postId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "linkedin/postImage",
    },
  }),
}).single("post");

postRouter.post(
  "/:postId/image",
  cloudinaryUploader,

  async (req, res, next) => {
    try {
      if (req.file) {
        // console.log("FILE:", req.file);
        const post = await postModel.findById(req.params.postId);
        if (post) {
          post.image = req.file.path;
          await post.save();
          res.send("uploaded");
        } else {
          next(
            createHttpError(404, `post with id ${req.params.postId} not found`)
          );
        }
      } else {
        next(createHttpError(400, "upload an image"));
      }
    } catch (error) {
      next(error);
    }
  }
);

export default postRouter;
