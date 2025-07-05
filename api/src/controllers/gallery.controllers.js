const dummyTags = require("../db/dummyTags");
const knex = require("../db/config");

exports.fetchTags = async (req,res) => {
  try {
    const itemTags = await knex('tbl_tags').select("*")
    return res.status(200).json(itemTags)
  } catch (err) {
    console.log(`fetch Tags error: ${JSON.stringify(err)}`);
    return res.status(500).json({ message: err.message });
  }
}

exports.fetchGallery = async (req, res) => {
  try {
    const { page = 1, limit = 10, tag } = req.query;
    const offset = (page - 1) * limit;
    let query = knex("tbl_images").select("id");

    if (tag) {
      query = query.whereExists(function () {
        this.select("*")
          .from("tbl_image_tags")
          .join("tbl_tags", "tbl_image_tags.tag_id", "tbl_tags.id")
          .where("tbl_tags.name", tag)
          .whereRaw("tbl_image_tags.image_id = tbl_images.id");
      });
    }

    const imagesIdObjects = await query
      .orderBy("created_at", "desc")
      .limit(limit)
      .offset(offset);

    if (imagesIdObjects.length === 0) {
      return res.json({ gallery: [] });
    }

    const imageIds = imagesIdObjects.map((img) => img.id);

    const imagePromise = await knex("tbl_images").whereIn("id", imageIds);

    const tagsPromise = await knex("tbl_image_tags")
      .join("tbl_tags", "tbl_image_tags.tag_id", "tbl_tags.id")
      .whereIn("tbl_image_tags.image_id", imageIds)
      .select("tbl_image_tags.image_id", "tbl_tags.name as tagName");

    const [images, tags] = await Promise.all([imagePromise, tagsPromise]);

    const sortedImages = imageIds.map((id) =>
      images.find((img) => img.id === id)
    );

    const tagMap = new Map();
    
    tags.forEach((t) => {
      if (!tagMap.has(t.image_id)) {
        tagMap.set(t.image_id, []);
      }
      tagMap.get(t.image_id).push(t.tagName);
    });

    const finalResult = sortedImages.map((image) => ({
      ...image,
      tags: tagMap.get(image.id) || [],
    }));

    return res.status(200).json({ gallery: finalResult });
  } catch (err) {
    console.log(`fetch Gallery error: ${JSON.stringify(err)}`);
    return res.status(500).json({ message: err.message });
  }
};

exports.generateMatchImageAndKeywords = async (req, res) => {
  const url = "https://placehold.co/";
  const size = [400, 500, 600, 800];
  const imageCount = 30;

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

      await knex("tbl_image_tags").insert(imageTageRelations);
    }

    return res.status(201).json({
      success: true,
      message: "generate image tags successfully!",
    });
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
