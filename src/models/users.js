import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  date: { type: Date, default: Date.now },
  dob : {type : String, required :true},
  entryno: {type:String, required : true},
  isverified: { type: Boolean, default: false },
});

export default model('user', userSchema);
