const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const md5 = require("md5");
const randomstring = require("randomstring");
const createError = require("http-errors");
const modelItem = require("../models/User");

const modelPodcast = require("../models/Podcast");

const { httpResponseOk, httpResponseError } = require("../utils/httpResponse");
const { smsPasswdSend } = require("../utils/sms");
const { loginSchema, registerSchema } = require("../validators/auth.validator");
const { englishNumber } = require("../utils/utils");

exports.login = async (req, res, next) => {
  try {
    await loginSchema.validateAsync(req.body);
    let { mobile, password } = req.body;

    const item = await modelItem
      .findOne(
        { mobile, isActive: true },
        "name family mobile password hashIdPublic hashIdAuth"
      )
      .exec();
    if (item) {
      const checkPassword = await bcrypt.compare(password, item.password);
      if (checkPassword) {
        const accessToken = jwt.sign(
          { hashIdAuth: item.hashIdAuth },
          process.env.JWT_ACCESS_TOKEN_SECRET_USER
        );
        return res
          .status(200)
          .json(
            httpResponseOk({ mobile: item.mobile, accessToken: accessToken })
          );
      } else {
        throw createError.Unauthorized("رمز عبور وارد شده اشتباه است");
      }
    } else {
      throw createError.Unauthorized("کاربر مورد نظر وجود ندارد");
    }
  } catch (err) {
    next(err);
  }
};

exports.validate = async (req, res) => {
  let data = await modelItem.findOne({ hashIdAuth: req.systemUser.hashIdAuth });

  res.status(200).json(httpResponseOk(data));
};

exports.create = async (req, res, next) => {
  try {
    await registerSchema.validateAsync(req.body);

    let mobile = englishNumber(req.body.mobile);
    const user = await modelItem.findOne({
      $or: [{ mobile }, { email: req.body.email }],
    });

    if (user)
      throw createError.Unauthorized("ایمیل یا موبایل وارد شده وجود دارد");

    // ------- HASH ID ------- //
    const hashIdPublicSalt = randomstring.generate(128);
    const hashIdPublicString = `user-id-${mobile}-${hashIdPublicSalt}-${Date.now()}`;
    // const hashIdPublic = SHA256(hashIdPublicString);
    const hashIdPublic = md5(hashIdPublicString);

    // ------- HASH AUHT ------- //
    const hashIdAuthSalt = randomstring.generate(512);
    const hashIdAuthString = `user-auth-${mobile}-${hashIdAuthSalt}-${Date.now()}`;
    const hashIdAuth = md5(hashIdAuthString);

    // ------- PASSWORD ------- //
    let password = null;
    if (req.body.password) {
      password = await bcrypt.hash(req.body.password, 10);
    }

    const item = new modelItem({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: password,
      phone: req.body.phone,
      degree: "",
      nc: "",
      mobile: mobile,
      spotPlayerLicense: req.body.spotPlayerLicense || null,
      gender: req.body.gender || "",
      hashIdPublic: hashIdPublic,
      hashIdAuth: hashIdAuth,
      isActive: true,
    });

    const resualt = await item.save();
    const accessToken = jwt.sign(
      { hashIdAuth: hashIdAuth },
      process.env.JWT_ACCESS_TOKEN_SECRET_USER
    );
    return res.status(200).json(
      httpResponseOk({
        name: resualt.name,
        family: resualt.family,
        mobile: resualt.mobile,
        accessToken: accessToken,
      })
    );
  } catch (err) {
    next(err);
  }
};

exports.findOne = async (req, res) => {
  let data = await modelItem.findOne({ hashIdPublic: req.params.id });
  res.status(200).json(httpResponseOk(data));
};

exports.findUserSelf = async (req, res) => {
  let data = await modelItem.findOne({ hashIdAuth: req.systemUser.hashIdAuth });

  res.status(200).json(httpResponseOk(data));
};

exports.findMany = async (req, res) => {
  // let data = await modelItem.find({}, 'name family isActive mobile hashIdPublic');
  let data = await modelItem.find({});
  res.status(200).json(httpResponseOk(data));
};

exports.updateOne = async (req, res) => {
  const filter = { hashIdPublic: req.params.id };
  const update = {
    firstName: req.body.firstName || null,
    lastName: req.body.lastName || null,
    spotPlayerLicense: req.body.spotPlayerLicense || null,
    phone: req.body.phone || null,
    gender: req.body.gender || null,
  };
  const data = await modelItem.updateOne(filter, update);

  res.status(200).json(httpResponseOk());
};

exports.updateOneSelf = async (req, res) => {
  //const filter = { hashIdAuth: mongoose.Types.ObjectId(hashIdAuth) };
  const filter = { hashIdAuth: req.systemUser.hashIdAuth };
  const update = {
    firstName: req.body.firstName || null,
    lastName: req.body.lastName || null,
    phone: req.body.phone || null,
    gender: req.body.gender || null,
    degree: req.body.degree || null,
    nc: req.body.nc || null,
  };
  const data = await modelItem.updateOne(filter, update);

  res.status(200).json(httpResponseOk());
};

exports.updateOneScimage = async (req, res) => {
  //const filter = { hashIdAuth: mongoose.Types.ObjectId(hashIdAuth) };
  const filter = { hashIdAuth: req.systemUser.hashIdAuth };
  const update = {
    scimage: req.body.scimage || null,
  };
  const data = await modelItem.updateOne(filter, update);

  res.status(200).json(httpResponseOk());
};

exports.enableOne = async (req, res) => {
  const data = await modelItem.updateOne(
    { hashIdPublic: req.params.id },
    { isActive: true }
  );
  res.status(200).json(httpResponseOk());
};

exports.disableOne = async (req, res) => {
  const data = await modelItem.updateOne(
    { hashIdPublic: req.params.id },
    { isActive: false }
  );
  res.status(200).json(httpResponseOk());
};

exports.deleteOne = async (req, res) => {
  res.status(200).json(httpResponseOk());
};

exports.revokeToken = async (req, res) => {
  let itemUser = await modelItem.findOne({ hashIdPublic: req.params.id });
  itemUser = itemUser.toObject();

  const hashIdAuthSalt = randomstring.generate(512);
  const hashIdAuthString = `user-auth-${
    itemUser.mobile
  }-${hashIdAuthSalt}-${Date.now()}`;
  const hashIdAuth = md5(hashIdAuthString);

  const filter = { hashIdPublic: req.params.id };
  const update = {
    hashIdAuth: hashIdAuth.toString(),
  };

  const data = await modelItem.updateOne(filter, update);
  res.status(200).json(httpResponseOk());
};

exports.forgetPassword = async (req, res) => {
  const mobile = req.body.mobile || null;

  if (!mobile) {
    res.status(400).json(httpResponseError((message = "موبایل اجباری")));
  } else {
    const itemUser = await modelItem.findOne({ mobile: mobile });
    if (itemUser) {
      const hashIdAuthSalt = randomstring.generate(512);
      const hashIdAuthString = `user-auth-${mobile}-${hashIdAuthSalt}-${Date.now()}`;
      const hashIdAuth = md5(hashIdAuthString);

      const randomPassword = Math.floor(Math.random() * 1000000000) + 9999999;
      const password = await bcrypt.hash(randomPassword.toString(), 10);

      const filter = { mobile: mobile };
      const update = {
        hashIdAuth: hashIdAuth,
        password: password,
      };
      try {
        await modelItem.updateOne(filter, update);
        await smsPasswdSend(mobile, randomPassword);
        res
          .status(200)
          .json(
            httpResponseOk(
              (message = "رمز عبور جدید به این شماره تماس ارسال شد.")
            )
          );
      } catch (e) {
        res.status(400).json(httpResponseError((message = e.message)));
      }
    } else {
      res
        .status(400)
        .json(httpResponseError((message = "کاربری با این موبایل وجود ندارد")));
    }
  }
};

exports.findLike = async (req, res, next) => {
  try {
    const user = await modelItem.findOne({
      hashIdAuth: req.systemUser.hashIdAuth,
    });
    const podcast = await modelPodcast.find({ likes: user.id });
    const videocast = await modelVideocast.find({ likes: user.id });
    const webinar = await modelWebinar.find({ likes: user.id });
    const audioBook = await modelAudioBook.find({ likes: user.id });
    const qgame = await modelQgame.find({ likes: user.id });

    if (!user) throw createError.BadRequest(" کاربر پیدا نشد ");

    let data = {};

    data.podcast = podcast;
    data.videocast = videocast;
    data.webinar = webinar;
    data.audioBook = audioBook;
    data.qgame = qgame;

    return res.status(200).json(httpResponseOk(data));
  } catch (err) {
    next(err);
  }
};
