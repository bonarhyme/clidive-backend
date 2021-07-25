const sharp = require("sharp")
const path = require("path")
const fs = require("fs")

const outputFolder = "public/assets"

/*
Here we receive the arrays of images from the forms in our frontend.

---> Sharp [A module] takes the images by mapping through them and:
          1. Duplicates each images into two; one as full and the other as a thumbnail
          2. Resizes the images 
          3. converts the images to jpg
          4. Renames the image using file.filename + "_full.jpg" or "_thumbnai.jpg"
          5. Then stores it in "public/assets" 

*/

module.exports = async (req, res, next) => {
  const images = []

  const resizePromises = req.files.map(async (file) => {
    await sharp(file.path)
      .resize(2000)
      .jpeg({ quality: 50 })
      .toFile(path.resolve(outputFolder, file.filename + "_full.jpg"))

    await sharp(file.path)
      .resize(100)
      .jpeg({ quality: 30 })
      .toFile(path.resolve(outputFolder, file.filename + "_thumb.jpg"))

    // This makes sure that the initial path of the file is deleted
    fs.unlinkSync(file.path)

    images.push(file.filename)
  })

  await Promise.all([...resizePromises])

  // This renames the req.images
  req.images = images

  next()
}
