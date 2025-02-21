const express = require("express");
const Router = express.Router();

const controllerBlog = require("../controllers/blog.controller");
const controllerPodcast = require("../controllers/podcast.controller");

/* +++++++ BLOG +++++++ +++++++ +++++++ +++++++ +++++++ +++++++ +++++++ */
Router.get("/blogs", controllerBlog.findMany);
Router.get("/blogs/:id", controllerBlog.findOne);
/* ####### END ####### ####### ####### ####### ####### ####### ####### *
 */

/* +++++++ PODCAST +++++++ +++++++ +++++++ +++++++ +++++++ +++++++ +++++++ */
Router.get("/podcasts", controllerPodcast.findMany);
Router.get("/podcasts/:id", controllerPodcast.findOne);
/* ####### END ####### ####### ####### ####### ####### ####### ####### *
 */

module.exports = Router;
