import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    date: { type: Date, default: Date.now },
    dob: { type: String },
    entryno: { type: String },
    isverified: { type: Boolean, default: false },
});

export default model('user', userSchema);
