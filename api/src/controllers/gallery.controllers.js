const dummyTags = require("../db/dummyTags");
const knex = require("../db/config");

const url = "https://placehold.co/";
const size = [400, 500, 600, 800];
const imageCount = 30;

exports.generateMatchImageAndKeywords = async (req, res) => {
  try {
    const allImages = await knex.select("id").from("tbl_images");
    const allTags = await knex.select("id").from("tbl_tags");

    if (allImages.length === 0 || allTags.length === 0) {
      console.log("No images or tags found in the database.");
      return;
    }

    for (const image of allImages) {
      const imageId = image.id;
      const tagCount = Math.floor(Math.random() * (5 - 2 + 1)) + 2;

      const shuffledTage = [...allTags].sort(() => 0.5 - Math.random());
      const selectedTageIds = shuffledTage
        .slice(0, tagCount)
        .map((tag) => tag.id);

      const imageTageRelations = selectedTageIds.map((tagId) => ({
        image_id: imageId,
        tag_id: tagId,
      }));

      await knex("tbl_image_tags").insert(imageTageRelations)
    }

    return res.status(201).json({
      success: true,
      message: "generate image tags successfully!"
    })
  } catch (err) {
    console.log(`genarate Images error: ${JSON.stringify(err)}`);
    return res.status(500).json({ message: err.message });
  }
};

exports.generateImages = async (req, res) => {
  for (let i = 0; i < imageCount; i++) {
    const width = size[Math.floor(Math.random() * size.length)];
    const height = size[Math.floor(Math.random() * size.length)];

    const imageUrl = `${url}${width}x${height}`;

    const newImage = {
      image_url: imageUrl,
      width: width,
      height: height,
    };

    try {
      await knex("tbl_images").insert(newImage);
    } catch (err) {
      console.log(`genarate Images error: ${JSON.stringify(err)}`);
      return res.status(500).json({ message: err.message });
    }
  }

  return res.status(201).json({
    success: true,
    message: "genarate Images Url successfully!",
  });
};

exports.generateTags = async (req, res) => {
  try {
    if (dummyTags) {
      for (const tag of dummyTags) {
        await knex("tbl_tags").insert({ name: tag });
      }
    }

    return res.status(201).json({
      success: true,
      message: "genarate Tags successfully",
    });
  } catch (err) {
    console.log(`genarate Tags error: ${JSON.stringify(err)}`);
    return res.status(500).json({ message: err.message });
  }
};
