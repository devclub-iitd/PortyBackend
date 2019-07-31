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
  aboutme : { type : String},
  education: [
    {
      institution: { type: String },
      discipline: { type: String },
      type: { type: String },
      startDate: { type: String },
      endDate: { type: String },
      cgpa: { type: String },
      maxcgpa: { type: String }
    },
  ],
  work : [
    {
      company: { type: String},
      position: { type: String },
      website: { type: String },
      startDate: { type: String },
      startDate: { type: String },
      summary: { type: String },
    }
  ],
  location : {
    address: { type: String },
    postalCode: { type: String },
    city: { type: String },
    countryCode: { type: String },
    region: { type: String },
  },
  volunteer : [
    {
      organization: { type: String },
      postion: { type: String },
      website: { type: String },
      startDate: { type: String },
      endDate: { type: String },
      summary: { type: String },
    }
  ],
  awards : [
    {
      title: { type: String },
      date: { type: String },
      awarder: { type: String },
      summary: { type: String },
    }
  ],
  publications : [
    {
      name: { type: String },
      publisher: { type: String },
      releaseDate: { type: String },
      website: { type: String },
      summary: { type: String },
    }
  ],
  skills : [
    {
      name: { type: String },
      level: { type: String },
      keywords: { type: String },
    }
  ],
  languages : [
    {
      language: { type: String },
      fluency: { type: String },
    }
  ],
  interests : [
    {
      name: { type: String },
      keywords: { type: String },
    }
  ],
  references : [
    {
      name: { type: String },
      reference: { type: String },
    }
  ],
});

export default model('profile', profileSchema);
