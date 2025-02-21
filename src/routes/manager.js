// Dependencies
const express = require("express");
const Router = express.Router();
const { checkToken } = require("../middlewares/checkToken");

const { upload } = require("../utils/upload");

const controllerManager = require("../controllers/manager.controller.js");
const controllerUser = require("../controllers/user.controller.js");
const controllerBlog = require("../controllers/blog.controller");
const controllerPodcast = require("../controllers/podcast.controller");
const controllerUploadCenter = require("../controllers/uploadCenter.controller");
const controllerLogin = require("../controllers/login.controller");

/* +++++++ AUTH +++++++ +++++++ +++++++ +++++++ +++++++ +++++++ +++++++ */
Router.post("/managers/auth/login", controllerManager.login);
Router.post("/managers/auth/validate", checkToken, controllerManager.validate);
/* ####### END ####### ####### ####### ####### ####### ####### ####### *
 */

/* +++++++ MANAGERS +++++++ +++++++ +++++++ +++++++ +++++++ +++++++ +++++++ */
Router.post(
  "/managers",
  // checkToken,
  controllerManager.insertOne
);
Router.get("/managers", checkToken, controllerManager.findMany);
Router.get("/managers/:id", checkToken, controllerManager.findOne);
Router.put("/managers/:id", checkToken, controllerManager.updateOne);
Router.put(
  "/managers/:id/change-password",
  checkToken,
  controllerManager.updatePassword
);
/* ####### END ####### ####### ####### ####### ####### ####### ####### *
 */

/* +++++++ USERS +++++++ +++++++ +++++++ +++++++ +++++++ +++++++ +++++++ */
Router.get("/users", checkToken, controllerUser.findMany);
Router.post("/users", checkToken, controllerUser.create);

Router.get("/users/:id", checkToken, controllerUser.findOne);
Router.put("/users/:id", checkToken, controllerUser.updateOne);
// Router.put('/users/:id/enable', checkToken, controllerEvent.enableOne);
// Router.put('/users/:id/disable', checkToken, controllerEvent.disableOne);
// Router.post('/events/:id/delete', checkToken, controllerEvent.deleteOne);
/* ####### END ####### ####### ####### ####### ####### ####### ####### *
 */

/* +++++++ BLOG +++++++ +++++++ +++++++ +++++++ +++++++ +++++++ +++++++ */
Router.get("/blogs", checkToken, controllerBlog.findMany);
Router.post("/blogs", checkToken, controllerBlog.create);
Router.get("/blogs/:id", checkToken, controllerBlog.findOne);
Router.put("/blogs/:id", checkToken, controllerBlog.updateOne);
Router.put("/blogs/:id/enable", checkToken, controllerBlog.enableOne);
Router.put("/blogs/:id/disable", checkToken, controllerBlog.disableOne);
Router.put("/blogs/:id/delete", checkToken, controllerBlog.deleteOne);
/* ####### END ####### ####### ####### ####### ####### ####### ####### *
 */

/* +++++++ PODCASTS +++++++ +++++++ +++++++ +++++++ +++++++ +++++++ +++++++ */
Router.get("/podcasts", checkToken, controllerPodcast.findMany);
Router.post("/podcasts", checkToken, controllerPodcast.create);
Router.get("/podcasts/:id", checkToken, controllerPodcast.findOne);
Router.put("/podcasts/:id", checkToken, controllerPodcast.updateOne);
Router.put("/podcasts/:id/enable", checkToken, controllerPodcast.enableOne);
Router.put("/podcasts/:id/disable", checkToken, controllerPodcast.disableOne);
Router.put("/podcasts/:id/delete", checkToken, controllerPodcast.deleteOne);
/* ####### END ####### ####### ####### ####### ####### ####### ####### *
 */

/* +++++++ UPLOADCENTER +++++++ +++++++ +++++++ +++++++ +++++++ +++++++ +++++++ */
Router.post(
  "/uploadCenter",
  checkToken,
  upload.single("file"),
  controllerUploadCenter.create
);
Router.get("/uploadCenter/:id", checkToken, controllerUploadCenter.findOne);
Router.get("/uploadCenter", checkToken, controllerUploadCenter.findMany);
/* ####### END ####### ####### ####### ####### ####### ####### ####### *
 */

/* +++++++ LOGIN +++++++ +++++++ +++++++ +++++++ +++++++ +++++++ +++++++ */
Router.post("/logins/list/:page", checkToken, controllerLogin.findMany);
Router.get("/logins/downloadExcel", checkToken, controllerLogin.downloadExcel);
// Router.post('/zones/:id/delete', checkToken, controllerZone.deleteOne);
/* ####### END ####### ####### ####### ####### ####### ####### ####### *
 */

module.exports = Router;
