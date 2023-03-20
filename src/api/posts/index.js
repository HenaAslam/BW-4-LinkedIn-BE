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

// postRouter.get("/", async (req, res, next) => {
//   try {
//     const mongoQuery = q2m(req.query);
//     // console.log(mongoQuery);
//     const posts = await postModel
//       .find(mongoQuery.criteria, mongoQuery.options.fields)
//       .limit(mongoQuery.options.limit)
//       .skip(mongoQuery.options.skip)
//       .sort(mongoQuery.options.sort)
//       .populate({
//         path: "user",
//         select: "_id name surname image ",
//       });

//     const total = await postModel.countDocuments(mongoQuery.criteria);

//     res.send({
//       links: mongoQuery.links(process.env.PAGINATION_POSTS, total),
//       total,
//       numberOfPages: Math.ceil(total / mongoQuery.options.limit),
//       posts,
//     });
//   } catch (error) {
//     next(error);
//   }
// });
export default postRouter;
