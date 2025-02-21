// Dependencies
const express = require("express");
const Router = express.Router();
const { checkToken } = require("../middlewares/checkToken");

const controllerUser = require("../controllers/user.controller");

/* +++++++ AUTH +++++++ +++++++ +++++++ +++++++ +++++++ +++++++ +++++++ */
Router.post("/users/auth/login", controllerUser.login);
Router.post("/users/auth/register", controllerUser.create);
Router.post("/users/auth/forget-password", controllerUser.forgetPassword);
Router.post("/users/auth/validate", checkToken, controllerUser.validate);
/* ####### END AUTH ####### ####### ####### ####### ####### ####### ####### *
 */

/* +++++++ USER +++++++ +++++++ +++++++ +++++++ +++++++ +++++++ +++++++ */
Router.get("/users", checkToken, controllerUser.findUserSelf);
Router.put("/users", checkToken, controllerUser.updateOneSelf);
Router.put("/users/scimage", checkToken, controllerUser.updateOneScimage);
/* ####### USER AUTH ####### ####### ####### ####### ####### ####### ####### *
 */

module.exports = Router;
