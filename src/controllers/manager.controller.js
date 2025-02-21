const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const md5 = require("md5");
const randomstring = require("randomstring");

const modelItem = require("../models/Manager");

const { historyLogger, loginLogger } = require("../utils/utils");
const { httpResponseOk, httpResponseError } = require("../utils/httpResponse");

exports.login = async (req, res) => {
  if (req.body.username && req.body.password) {
    const item = await modelItem
      .findOne(
        { username: req.body.username },
        "name family username password hashIdPublic hashIdAuth"
      )
      .exec();
    if (item) {
      const checkPassword = await bcrypt.compare(
        req.body.password,
        item.password
      );
      if (checkPassword) {
        loginLogger(
          req,
          { username: req.body.username, password: req.body.password },
          item.hashIdAuth,
          "manager",
          "login",
          "success"
        );
        const accessToken = jwt.sign(
          { hashIdAuth: item.hashIdAuth },
          process.env.JWT_ACCESS_TOKEN_SECRET_MANAGER
        );
        res.status(200).json(
          httpResponseOk({
            username: item.username,
            accessToken: accessToken,
          })
        );
      } else {
        loginLogger(
          req,
          {
            username: req.body.username,
            password: req.body.password,
            description: "incorrect password",
          },
          item.hashIdAuth,
          "manager",
          "login",
          "failed"
        );
        res.status(400).json(httpResponseError("PASSWORD doesn't match!"));
      }
    } else {
      loginLogger(
        req,
        {
          username: req.body.username,
          password: req.body.password,
          description: "user not found",
        },
        null,
        "manager",
        "login",
        "failed"
      );
      res.status(400).json(httpResponseError("USER doesn't exist!"));
    }
  } else {
    loginLogger(
      req,
      { description: "input error" },
      null,
      "manager",
      "login",
      "failed"
    );
    res
      .status(400)
      .json(
        httpResponseError((message = "INVALID username or password input!"))
      );
  }
};

exports.validate = async (req, res) => {
  res.status(200).json(httpResponseOk({}));
};

exports.insertOne = async (req, res, next) => {
  try {
    // ------- HASH ID ------- //
    const hashIdPublicSalt = randomstring.generate(128);
    const hashIdPublicString = `manager-id-${
      req.body.username
    }-${hashIdPublicSalt}-${Date.now()}`;
    const hashIdPublic = md5(hashIdPublicString);

    // ------- HASH AUHT ------- //
    const hashIdAuthSalt = randomstring.generate(512);
    const hashIdAuthString = `manager-auth-${
      req.body.username
    }-${hashIdAuthSalt}-${Date.now()}`;
    const hashIdAuth = md5(hashIdAuthString);

    // ------- PASSWORD ------- //
    let password = null;
    if (req.body.password) {
      password = await bcrypt.hash(req.body.password, 10);
    }

    const item = new modelItem({
      username: req.body.username,
      name: req.body.name,
      family: req.body.family,
      email: req.body.email,
      password: password,
      phone: req.body.phone,
      mobile: req.body.mobile,
      hashIdPublic: hashIdPublic,
      hashIdAuth: hashIdAuth,
    });

    const resualt = await item.save();
    res
      .status(200)
      .json(httpResponseOk({ name: resualt.name, family: resualt.family }));
  } catch (err) {
    next(err);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    let data = await modelItem.findOne({ hashIdPublic: req.params.id });
    return res.status(200).json(httpResponseOk(data));
  } catch (err) {
    next(err);
  }
};

exports.findMany = async (req, res, next) => {
  try {
    const data = await modelItem.find({});
    return res.status(200).json(httpResponseOk(data));
  } catch (err) {
    next(err);
  }
};

exports.updateOne = async (req, res) => {
  const filter = { hashIdPublic: req.params.id };
  const update = {
    password: req.body.name,
    family: req.body.family,
    email: req.body.email,
    phone: req.body.phone,
    mobile: req.body.mobile,
  };

  try {
    const resualtUpdate = await modelItem.updateOne(filter, update);
    res.status(200).json(httpResponseOk({}));
  } catch (e) {
    res.status(400).json(httpResponseError(e.message));
  }
};

exports.updatePassword = async (req, res) => {
  if (req.body.a === req.body.b) {
    let password = await bcrypt.hash(req.body.a, 10);
    //const filter = { _id: mongoose.Types.ObjectId(req.params.id) };
    const filter = { hashIdPublic: req.params.id };
    const update = {
      password: password,
    };

    try {
      const resualtUpdate = await modelItem.updateOne(filter, update);
      res.status(200).json(httpResponseOk({}));
    } catch (e) {
      res.status(400).json(httpResponseError(e.message));
    }
  } else {
    res.status(400).json(httpResponseError("خطا در ورود رمز عبور"));
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    return res.status(200).json(httpResponseOk("err"));
  } catch (err) {
    next(err);
  }
};
