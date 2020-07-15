import { Schema, model } from 'mongoose';

const profileSchema = new Schema({
    // here add all the rest of the features
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    about: {
        label: { type: String, required: true},
        summary: { type: String, required: true},
        number: { type: String, required: true},
        imgUrl: { type: String },
    },
    education: [
        {
            institution: { type: String , required: true},
            qualification: { type: String , required: true},
            area: { type: String , required: true},
            startdate: { type: String , required: true},
            enddate: { type: String , required: true},
            gpa: { type: String , required: true},
            details: { type: String, required: true },
            hidden: { type: Boolean },
        },
    ],
    work: [
        {
            company: { type: String , required: true},
            position: { type: String , required: true},
            website: { type: String },
            startdate: { type: String , required: true},
            enddate: { type: String , required: true},
            summary: { type: String , required: true},
            hidden: { type: Boolean },
        },
    ],
    location: {
        addressline1: { type: String , required: true},
        addressline2: { type: String , required: true},
        city: { type: String , required: true},
        pincode: { type: String , required: true},
        country: { type: String , required: true},
    },
    volunteer: [
        {
            organisation: { type: String },
            position: { type: String },
            website: { type: String },
            startdate: { type: String },
            enddate: { type: String },
            summary: { type: String },
            hidden: { type: Boolean },
        },
    ],
    awards: [
        {
            title: { type: String },
            date: { type: String },
            awarder: { type: String },
            details: { type: String },
            hidden: { type: Boolean },
        },
    ],
    publications: [
        {
            name: { type: String },
            publisher: { type: String },
            releaseDate: { type: String },
            website: { type: String },
            summary: { type: String },
            hidden: { type: Boolean },
        },
    ],
    skills: [
        {
            name: { type: String },
            level: { type: String },
            keywords: { type: String },
            hidden: { type: Boolean },
        },
    ],
    languages: [
        {
            language: { type: String, required: true },
            fluency: { type: String, required: true },
            hidden: { type: Boolean },
        },
    ],
    interests: [
        {
            name: { type: String },
            keywords: { type: String },
            hidden: { type: Boolean },
        },
    ],
    references: [
        {
            name: { type: String },
            reference: { type: String },
            hidden: { type: Boolean },
        },
    ],
});

export default model('profile', profileSchema);
