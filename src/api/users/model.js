import mongoose from "mongoose";

const { Schema, model } = mongoose

const validateEmail = function (email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
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
            required: 'Email address is required',
            validate: [validateEmail, 'Please fill a valid email address'],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        bio: { type: String },
        title: { type: String },
        area: { type: String },
        image: { type: String },
    },
    {
        timestamps: true,
    }
)


export default model("User", usersSchema) 