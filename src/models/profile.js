import { Schema, model } from 'mongoose';


const profileSchema = new Schema({
  // here add all the rest of the features
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  entryno: { type: String },
  age: { type: String },
  dob: { type: String },
  phone: { type: String },
  education: [
    {
      institution: { type: String, required: true },
      discipline: { type: String, required: true },
      type: { type: String, required: true },
      startdate: { type: String },
      enddate: { type: String },
      cgpa: { type: String, required: true },
      maxcgpa: { type: String, required: true },
      courses: [
        {
          name: { type: String },
        },
      ],

    },
  ],
});

export default model('profile', profileSchema);
