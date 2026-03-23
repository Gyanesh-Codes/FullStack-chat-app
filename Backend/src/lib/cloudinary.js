// THIS WAS THE WHOLE SETUP FOR PHOTOS UPLOADING SPACE WHICH WILL BE USE LATER 

// KEEP IN MIND ITS NOT DATABASE ITS THE BUCKET WHERE WE ARE STORING OUR IMAGES 

import {v2 as cloudinary } from "cloudinary"

import {config} from 'dotenv'

config()

// config is used to access the enviournment varriables : 

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

