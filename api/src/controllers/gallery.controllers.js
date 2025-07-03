const dummyKeywords = require("../db/dummyKeyword");
const knex = require("../db/config");

exports.addKeywords = async (req, res) => {
  try {
    if (dummyKeywords) {
      for (const tag of dummyKeywords) {
        await knex("tbl_tags").insert({ tags_name: tag });
      }
    }

    return res.status(201).json({
      success: true,
      message: "Keywords added",
    });
  } catch (err) {
    console.log(`add Keywords error: ${JSON.stringify(err)}`);
    return res.status(500).json({ message: err.message });
  }
};
