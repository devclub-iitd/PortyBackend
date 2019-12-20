import { Schema, model } from 'mongoose';


const profileSchema = new Schema({
  // here add all the rest of the features
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  about : { 
    label : {type : String},
    summary : {type : String},
    number : {type : String},
    imgUrl : {type : String}
  },
  education: [
    {
      institution: { type: String },
      qualification: { type: String },
      area: { type: String },
      startdate: { type: String },
      enddate: { type: String },
      gpa: { type: String },
      details: { type: String },
      hidden: { type: Boolean}
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
      hidden: { type: Boolean}
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
      hidden: { type: Boolean}
    }
  ],
  awards : [
    {
      title: { type: String },
      date: { type: String },
      awarder: { type: String },
      details: { type: String },
      hidden: { type: Boolean}
    }
  ],
  publications : [
    {
      name: { type: String },
      publisher: { type: String },
      releaseDate: { type: String },
      website: { type: String },
      summary: { type: String },
      hidden: { type: Boolean}
    }
  ],
  skills : [
    {
      name: { type: String },
      level: { type: String },
      keywords: { type: String },
      hidden: { type: Boolean}
    }
  ],
  languages : [
    {
      language: { type: String },
      fluency: { type: String },
      hidden: { type: Boolean}
    }
  ],
  interests : [
    {
      name: { type: String },
      keywords: { type: String },
      hidden: { type: Boolean}
    }
  ],
  references : [
    {
      name: { type: String },
      reference: { type: String },
      hidden: { type: Boolean}
    }
  ],
});

export default model('profile', profileSchema);
