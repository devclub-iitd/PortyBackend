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
  about : { 
    label : {type : String},
    summary : {type : String}
  },
  education: [
    {
      institution: { type: String },
      qualification: { type: String },
      area: { type: String },
      startdate: { type: String },
      enddate: { type: String },
      gpa: { type: String },
      details: { type: String }
    },
  ],
  work : [
    {
      company: { type: String},
      position: { type: String },
      website: { type: String },
      startdate: { type: String },
      enddate: { type: String },
      summary: { type: String },
    }
  ],
  location : {
    addressline1: { type: String },
    addressline2: { type: String },
    city: { type: String },
    pincode: { type: String },
    country: { type: String },
  },
  volunteer : [
    {
      organisation: { type: String },
      position: { type: String },
      website: { type: String },
      startdate: { type: String },
      enddate: { type: String },
      summary: { type: String },
    }
  ],
  awards : [
    {
      title: { type: String },
      date: { type: String },
      awarder: { type: String },
      details: { type: String },
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
