require("dotenv").config();
const mongoose = require("mongoose");
const redis = require("redis");

const modelItem = require("../models/Podcast");

const modelUser = require("../models/User");

const { httpResponseOk, httpResponseError } = require("../utils/httpResponse");
const createError = require("http-errors");

exports.create = async (req, res) => {
  try {
    const item = new modelItem({
      title: req.body.title,
      titleEn: req.body.titleEn,
      text: req.body.text,
      textEn: req.body.textEn,
      code1: req.body.code1,
      code2: req.body.code2,
      code3: req.body.code3,
      description: req.body.description,
      descriptionEn: req.body.descriptionEn,
      descThumb: req.body.descThumb,
      descThumbEn: req.body.descThumbEn,
      imgThumb: req.body.imgThumb,
      imgBg: req.body.imgBg,
      episode: req.body.episode,
      season: req.body.season,
      isActive: true,
    });

    await item.save();
    res.status(200).json(httpResponseOk("created podcast"));
  } catch (err) {
    res.status(400).json(httpResponseError(err.message));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    let { id } = req.params;
    const data = await modelItem.findById(id, {
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    });

    res.status(200).json(httpResponseOk(data));
  } catch (err) {
    next(err);
  }
};

exports.findMany = async (req, res) => {
  const podcast = await modelItem.aggregate([
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: modelManager.collection.collectionName,
        localField: "createdBy",
        foreignField: "_id",
        as: "createdBy",
      },
    },

    {
      $lookup: {
        from: modelWriter.collection.collectionName,
        localField: "writedBy",
        foreignField: "_id",
        as: "writedBy",
      },
    },
  ]);

  res.status(200).json(httpResponseOk(podcast));
};

exports.updateOne = async (req, res) => {
  const filter = { _id: mongoose.Types.ObjectId(req.params.id) };
  const update = {
    title: req.body.title,
    titleEn: req.body.titleEn,
    text: req.body.text,
    textEn: req.body.textEn,
    code1: req.body.code1,
    code2: req.body.code2,
    code3: req.body.code3,
    description: req.body.description,
    descriptionEn: req.body.descriptionEn,
    descThumb: req.body.descThumb,
    descThumbEn: req.body.descThumbEn,
    imgThumb: req.body.imgThumb,
    imgBg: req.body.imgBg,
    episode: req.body.episode,
    season: req.body.season,
    isActive: true,
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
  const data = await modelItem.deleteOne({ hashIdPublic: req.params.id });
  res.status(200).json(httpResponseOk());
};

exports.like = async (req, res, next) => {
  try {
    const { id } = req.params;
    const podcast = await modelItem.findOne({ _id: id });
    if (!podcast) throw createError.BadRequest("پادکت پیدا نشد");
    const user = await modelUser.findOne({
      hashIdAuth: req.systemUser.hashIdAuth,
    });
    if (!user) throw createError.BadRequest("کاربر پیدا نشد");

    if (podcast.likes.includes(user.id)) {
      const index = podcast.likes.indexOf(user.id);
      podcast.likes.splice(index, 1);
      podcast.numLikes = podcast.likes.length;
      await podcast.save();
      return res.status(200).json(httpResponseOk("unlike Podcast"));
    } else {
      podcast.likes.push(user._id);
      podcast.numLikes = podcast.likes.length;
      await podcast.save();
      return res.status(200).json(httpResponseOk("like podcast"));
    }
  } catch (err) {
    next(err);
  }
};
