/*
This function does the following:

    1. Fetches the development asset url from "config/development.json"
    2. Creates a url object for the full image
    3. creates a thumbnailUrl for the thumnail image
*/

const listingsMapper = (listing) => {
  const baseUrl = process.env.ASSETS_BASE_URL;

  const mapImage = (image) => ({
    url: `${baseUrl}${image.fileName}_full.jpg`,
    thumbnailUrl: `${baseUrl}${image.fileName}_thumb.jpg`,
  });

  // const mapUser = async (userId) => {
  //   const user = await userDatabase.findById(userId)
  //   return {
  //     id: user.id,
  //     name: user.name,
  //     phone: user.phoneNumber,
  //     email: user.email,
  //     rating: user.rating,
  //     numReview: user.numReview,
  //     reviews: user.reviews,
  //   }
  // }

  return {
    ...listing,
    images: listing.images.map(mapImage),
    // seller: mapUser(listing.userId),
  };
};

module.exports = listingsMapper;
