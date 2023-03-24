import mongoose from "mongoose";

const { Schema, model } = mongoose;

const experiencesSchema = new Schema(
  {
    role: { type: String },
    company: { type: String },
    startDate: { type: String },
    endDate: { type: String }, //could be null
    description: { type: String },
    area: { type: String },
    image: {
      default: "http://placekitten.com/200/300",
      type: String,
    },
    //users: [usersSchema]
  },
  { timestamps: true }
);

const validateEmail = function (email) {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const usersSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      // unique: true,
      required: "Email address is required",
      validate: [validateEmail, "Please fill a valid email address"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    bio: { type: String },
    title: { type: String },
    area: { type: String },
    image: { type: String },
    experiences: { type: [experiencesSchema] },

    send: [{ type: Schema.Types.ObjectId, ref: "User" }],
    pending: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

export default model("User", usersSchema);
