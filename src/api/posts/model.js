import mongoose from "mongoose";

const { Schema, model } = mongoose;

const commentSchema = new Schema(
  {
    comment: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    post: { type: Schema.Types.ObjectId, ref: "Post" },
  },
  { timestamps: true }
);
const postSchema = new Schema(
  {
    text: { type: String, required: true },
    image: { type: String, default: "" },
    user: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  {
    timestamps: true,
  }
);

export default model("Post", postSchema);
