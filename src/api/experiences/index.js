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
import exp from "constants";

const experiencesRouter = express.Router();

experiencesRouter.get("/:userId/experiences/csv", async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.params.userId);

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=experiences.csv"
    );
    const source = JSON.stringify(user.experiences);
    const transform = new Transform({ fields: ["role", "company", "image", "startDate", "endDate", "description", "area" ] });
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
    const user = await UsersModel.findById(req.params.userId);
    if (user) {
      const experience = user.experiences.find(
        (e) => e._id.toString() === req.params.expId
      );
      if (experience) {
        console.log("Experience", experience);
        res.send(experience);
      } else {
        next(
          createHttpError(
            404,
            `Experience with id ${req.params.expId} was not found!`
          )
        );
      }
    } else {
      next(
        createHttpError(
          404,
          `User with _id ${req.params.userId} was not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

experiencesRouter.put("/:userId/experiences/:expId", async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.params.userId);
    if (user) {
      const index = user.experiences.findIndex(
        (e) => e._id.toString() === req.params.expId
      );
      if (index !== -1) {
        user.experiences[index] = {
          ...user.experiences[index].toObject(),
          ...req.body,
        };
        await user.save();
        res.send(user.experiences[index]);
      } else {
        next(
          createHttpError(404, `User with id ${req.params.userId} not found!`)
        );
      }
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
      const user = await UsersModel.findByIdAndUpdate(
        req.params.userId,
        { $pull: { experiences: { _id: req.params.expId } } },
        { new: true, runValidators: true }
      );
      if (user) {
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
      folder: "bw-4-linkedin-be/users",
    },
  }),
}).single("image");

experiencesRouter.post(
  "/:userId/experiences/:expId/image",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      const user = await UsersModel.findById(req.params.userId);
      if (user) {
        const index = user.experiences.findIndex(
          (e) => e._id.toString() === req.params.expId
        );
        if (index !== -1) {
          user.experiences[index] = {
            ...user.experiences[index].toObject(),
            image: req.file.path,
          };
          await user.save();
          res.send(user.experiences[index]);
        }
        await user.save();
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
