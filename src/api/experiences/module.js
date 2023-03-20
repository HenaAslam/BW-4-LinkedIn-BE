import mongoose from "mongoose"

const { Schema, model } = mongoose
/*
const usersSchema = new Schema(
  {
    name: { type: String },
    surname: { type: String },
    email: { type: String },
    bio: { type: String },
    title: { type: String },
    area: { type: String }
}
)*/

const experiencesSchema = new Schema(
  {
    role: { type: String },
    company: { type: String },
    startDate: { type: String },
    endDate: { type: String }, //could be null
    description: { type: String },
    area: { type: String },
    image: {
      default:
        "http://placekitten.com/200/300",
      type: String,
    },
    //users: [usersSchema]
   
  },
  { timestamps: true }
)

export default model("Experiences", experiencesSchema)




