const { Router } = require("express");
const { Tags } = require("../db/index");
const auth = require("./auth");
const route = Router();
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;

//GET /api/tags
route.get("/", async (req, res) => {
  let totaltags = [];
  const tags = await Tags.findAll({
    attributes: [
      [Sequelize.fn("DISTINCT", Sequelize.col("tagname")), "tagname"]
    ]
  });
  if (!tags) {
    res.status(404).send({ error: " Tags Not Found" });
  }
  tags.forEach(element => {
    totaltags.push(element.tagname);
  });
  console.log(totaltags);
  res.status(201).send({
    tags: totaltags
  });
});

module.exports = route;
