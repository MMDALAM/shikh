require("dotenv").config();
const mongoose = require("mongoose");

const modelItem = require("../models/Blog");

const { httpResponseOk } = require("../utils/httpResponse");

exports.create = async (req, res, next) => {
  try {
    const item = new modelItem({
      title: req.body.title,
      titleEn: req.body.titleEn,
      text: req.body.text,
      textEn: req.body.textEn,
      description: req.body.description,
      descriptionEn: req.body.descriptionEn,
      descThumb: req.body.descThumb,
      descThumbEn: req.body.descThumbEn,
      imgThumb: req.body.imgThumb,
      imgBg: req.body.imgBg,
      isActive: true,
    });

    await item.save();
    return res.status(200).json(httpResponseOk("created Blog"));
  } catch (e) {
    next(e);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.id || null;
    const data = await modelItem.findById(id);
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

exports.updateOne = async (req, res, next) => {
  try {
    const filter = { _id: mongoose.Types.ObjectId(req.params.id) };
    const update = {
      title: req.body.title,
      titleEn: req.body.titleEn,
      text: req.body.text,
      textEn: req.body.textEn,
      description: req.body.description,
      descriptionEn: req.body.descriptionEn,
      descThumb: req.body.descThumb,
      descThumbEn: req.body.descThumbEn,
      imgThumb: req.body.imgThumb,
      imgBg: req.body.imgBg,
      isActive: true,
    };
    await modelItem.updateOne(filter, update);
    return res.status(200).json(httpResponseOk("updated blog"));
  } catch (err) {
    next(err);
  }
};

exports.enableOne = async (req, res, next) => {
  try {
    await modelItem.updateOne(
      { hashIdPublic: req.params.id },
      { isActive: true }
    );
    return res.status(200).json(httpResponseOk("isActive enable blog"));
  } catch (err) {
    next(err);
  }
};

exports.disableOne = async (req, res, next) => {
  try {
    await modelItem.updateOne(
      { hashIdPublic: req.params.id },
      { isActive: false }
    );
    return res.status(200).json(httpResponseOk("isActive disable Blog"));
  } catch (err) {
    next(err);
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    await modelItem.deleteOne({ hashIdPublic: req.params.id });
    return res.status(200).json(httpResponseOk("Delete Blog"));
  } catch (err) {
    next(err);
  }
};
