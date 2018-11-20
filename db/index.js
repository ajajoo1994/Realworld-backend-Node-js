const Sequelize = require("sequelize");
const { vendor, product, user, article, comment, tags } = require("./models");
var jwt = require("jsonwebtoken");
const secret = "Hello this is my jwtToken";
var bcrypt = require("bcryptjs");
var slug = require("slug");

const db = new Sequelize({
  dialect: "sqlite",
  storage: __dirname + "/store.db"
});

const Vendor = db.define("vendor", vendor);
const Product = db.define("product", product);
const User = db.define("user", user);
const Article = db.define("article", article);
const Comment = db.define("comment", comment);
const Tags = db.define("tags", tags);

User.prototype.generateToken = function() {
  return jwt.sign(
    {
      id: this.id
    },
    secret,
    {
      expiresIn: 86400
    }
  );
};
User.prototype.validpassword = function(pass) {
  if (bcrypt.compareSync(pass, this.password)) {
    return true;
  }
  return false;
};
Article.prototype.slugify = function() {
  this.slug =
    slug(this.title) +
    "-" +
    ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  return this.slug;
};

Article.prototype.toJson = function() {
  return {
    title: this.title,
    description: this.description,
    body: this.body,
    userId: this.user.id,
    tagList: this.tagList != null ? this.tagList.split(",") : null,
    updatedAt: this.updatedAt,
    createdAt: this.createdAt,
    slug: this.slug,
    author: {
      username: this.user.username,
      bio: this.user.bio,
      image: this.user.image
    }
  };
};
Comment.prototype.toJson = function() {
  return {
    id: this.id,
    body: this.body,
    userId: this.userId,
    articleId: this.articleId,
    updatedAt: this.updatedAt,
    createdAt: this.createdAt,
    author: {
      username: this.user.username,
      bio: this.user.bio,
      image: this.user.image
    }
  };
};
Product.belongsTo(Vendor);
Vendor.hasMany(Product);

Article.belongsTo(User);
User.hasMany(Article);

Tags.belongsToMany(Article, { through: "ArticleTags" });
Article.belongsToMany(Tags, {
  through: "TagsArticle"
});
Article.hasMany(Tags);

Comment.belongsTo(User);
User.hasMany(Comment);

Comment.belongsTo(Article);
Article.hasMany(Comment);

module.exports = {
  db,
  Vendor,
  Product,
  User,
  Article,
  Comment,
  Tags
};
