const Router = require("express");
const route = Router();

route.use("/vendors", require("./vendors"));
route.use("/products", require("./products"));
route.use("/", require("./user"));
route.use("/articles", require("./article"));
route.use("/tags", require("./tags"));
module.exports = route;
