const express = require("express");

const cloudinaryImp = require("../utility/imageUpload");
const asyncHandler = require("express-async-handler");

const Listings = require("../models/listingsModel");

const createListing = asyncHandler(async (req, res) => {
  console.log("Working!!!");
  try {
    let pictureFiles = req.files;
    let user = req.user;
    let details = req.body;

    if (!pictureFiles) {
      res.status(400);
      throw new Error("No picture attached!");
    }
    let multiplePicturePromise = pictureFiles.map((picture, index) =>
      cloudinaryImp.uploader.upload(picture.path, {
        public_id: `${Date.now()}_${user.username}_${index}`,
        height: 300,
        width: 300,
        crop: "fill",
      })
    );
    let imageResponses = await Promise.all(multiplePicturePromise);
    let imagesUrl = imageResponses.map((image) => image.secure_url);

    const newListing = await Listings.create({
      title: details.title,
      images: imagesUrl,
      category: details.category,
      description: details.description,
      price: details.price,
      userId: user._id,
      poster: {
        name: user.name,
        username: user.username,
        email: user.email,
      },
      location: details.location,
    });

    if (newListing) {
      console.log(newListing);
      res.send({
        message: "New post has been sent!",
        newListing,
      });
    }
  } catch (error) {
    res.status(500);
    throw new Error("Server error, try after some time");
  }
});

const getListings = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const allListings = await Listings.find({ isSold: false, ...keyword }).sort({
    createdAt: -1,
  });

  if (allListings) {
    res.send(allListings);
  } else {
    res.status(404).send({ error: "Listings not found." });
  }
});

const updateSingleListing = asyncHandler(async (req, res) => {
  const e = req.params.id;

  const listing = await Listings.findById(e);

  if (listing) {
    listing.isSold = true;

    const listingUpdated = await listing.save();

    if (listingUpdated) {
      res.send(listingUpdated);
    } else {
      res.status(400);
      throw new Error("Unable to update listing.");
    }
  } else {
    res.status(400);
    throw new Error("Listing not found.");
  }
});

module.exports = {
  createListing,
  getListings,
  updateSingleListing,
};
