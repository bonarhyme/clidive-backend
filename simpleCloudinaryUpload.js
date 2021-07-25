const express = require("express");

const multer = require("multer");
const cloudinaryImp = require("../utility/imageUpload");
const asyncHandler = require("express-async-handler");

const Listings = require("../models/listingsModel");

const createListing = asyncHandler(async (req, res) => {
  try {
    const result = await cloudinaryImp.uploader.upload(req.files[0].path, {
      public_id: `user_id_property`,
      height: 500,
      width: 500,
      crop: "fill",
    });

    if (result) {
      console.log(result);
    }
  } catch (error) {
    res.status(500);
    throw new Error("server error, try after some time");
  }
});

module.exports = {
  createListing,
};
