// – GET https://yourapi.cyclic.com/api/users/ Retrieves list of users

// – GET https://yourapi.cyclic.com/api/users/{userId}  Retrieves the user with userId = {userId}

// – POST https://yourapi.cyclic.com/api/users/  Registers a new user with all his details

// – PUT https://yourapi.cyclic.com/api/users/{userId}  Update current user profile details

// – POST https://yourapi.cyclic.com/api/users/{userId}/image  Replace user profile image

// – GET https://yourapi.cyclic.com/api/profile/users/{userId}/CV  Generates and download a PDF with the CV of the user (details, image, experiences)

import express from "express"
import createHttpError from "http-errors"
import UsersModel from "./model.js"

const usersRouter = express.Router()

usersRouter.post("/", async (req, res, next) => {
    try {
        const newUser = new UsersModel(req.body)
        const { _id } = await newUser.save()
        res.status(201).send({ _id })
    } catch (error) {
        next(error)
    }
})

usersRouter.get("/", async (req, res, next) => {
    try {
        const users = await UsersModel.find()
        res.send(users)
    } catch (error) {
        next(error)
    }
})

usersRouter.get("/:userId", async (req, res, next) => {
    try {
        const user = await UsersModel.findById(req.params.userId)
        if (user) {
            res.send(user)
        } else {
            next(createHttpError(404, `User with id ${req.params.userId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

usersRouter.delete("/:userId", async (req, res, next) => {
    try {
        const deletedUser = await UsersModel.findByIdAndDelete(req.params.userId)
        if (deletedUser) {
            res.status(204).send()
        } else {
            next(createHttpError(404, `User with id ${req.params.userId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})


export default usersRouter