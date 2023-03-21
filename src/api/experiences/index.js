import express from "express";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import createHttpError from "http-errors";
import multer from "multer";
import q2m from "query-to-mongo";
import experiencesModel from "./module.js";
import { pipeline } from "stream";
import { Transform } from "@json2csv/node";
import UsersModel from "../users/model.js";

const experiencesRouter = express.Router();

experiencesRouter.get("/:userId/experiences/csv", async (req, res, next) => {
  try {
    const user = await user.findById(req.params.userId);
    console.log(req.params.userId);
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=experiences.csv"
    );
    const source = JSON.stringify(user);
    const transform = new Transform({ fields: ["role", "company", "image"] });
    const destination = res;
    pipeline(source, transform, destination, (err) => {
      if (err) console.log(err);
    });
  } catch (error) {
    next(error);
  }
});

experiencesRouter.post("/:userId/experiences", async (req, res, next) => {
  try {
    const newExperience = req.body;

    const updatedUser = await UsersModel.findByIdAndUpdate(
      req.params.userId,
      { $push: { experiences: newExperience } },
      { new: true, runValidators: true }
    );
    if (updatedUser) {
      res.send(updatedUser);
    } else {
      res.send("error");
    }
    // const { _id } = await newExperience.save();
    // res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

experiencesRouter.get("/:userId/experiences", async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.params.userId);
    if (user) {
      res.send(user.experiences);
    } else {
      next(
        createHttpError(
          404,
          `user with _id ${req.params.userId} was not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

experiencesRouter.get("/:userId/experiences/:expId", async (req, res, next) => {
  try {
    const foundExperience = await experiencesModel.findById(req.params.expId);
    if (foundExperience) {
      res.send(foundExperience);
    } else {
      next(
        createHttpError(
          404,
          `Experience with _id ${req.params.expId} was not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

experiencesRouter.put("/:userId/experiences/:expId", async (req, res, next) => {
  try {
    const updatedExperience = await experiencesModel.findByIdAndUpdate(
      req.params.expId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedExperience) {
      res.send(updatedExperience);
    } else {
      next(
        createHttpError(
          404,
          `Experience with id ${req.params.expId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

experiencesRouter.delete(
  "/:userId/experiences/:expId",
  async (req, res, next) => {
    try {
      const deletedExperience = await experiencesModel.findByIdAndDelete(
        req.params.expId
      );
      if (deletedExperience) {
        res.status(204).send();
      } else {
        next(
          createHttpError(
            404,
            `Experience with id ${req.params.expId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "bw-4-linkedin-be/experiences",
    },
  }),
}).single("experience");

experiencesRouter.post(
  "/:userId/experiences/:expId/image",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      const experience = await experiencesModel.findById(req.params.expId);
      experience.image = req.file.path;
      await experience.save();
      if (experience) {
        res.send({ message: "Image uploaded successfully" });
      } else {
        next(
          createHttpError(
            404,
            `Experience with id ${req.params.expId} not found`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default experiencesRouter;
