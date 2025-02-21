require("dotenv").config();
const mongoose = require("mongoose");

const modelItem = require("../models/Blog");

const { httpResponseOk, httpResponseError } = require("../utils/httpResponse");

exports.create = async (req, res) => {
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

  try {
    const resualtInsert = await item.save();
    res.status(200).json(httpResponseOk({}));
  } catch (e) {
    res.status(400).json(httpResponseError(e.message));
  }
};

exports.findOne = async (req, res) => {
  // const data = await modelItem.findOne({ _id: req.params.id });

  const _id = req.params.id || null;

  const query = { _id: mongoose.Types.ObjectId(_id) };

  const data = await modelItem.aggregate([
    { $match: query },
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
      $unwind: "$createdBy",
    },

    {
      $lookup: {
        from: modelWriter.collection.collectionName,
        localField: "writedBy",
        foreignField: "_id",
        as: "writedBy",
      },
    },
    {
      $unwind: "$writedBy",
    },

    {
      $project: {
        _id: 1,
        title: 1,
        titleEn: 1,
        descThumb: 1,
        description: 1,
        descriptionEn: 1,
        text: 1,
        textEn: 1,
        imgThumb: 1,
        imgBg: 1,
        isActive: 1,
        createdAt: 1,
        updatedAt: 1,
        "createdBy._id": 1,
        "createdBy.name": 1,
        "createdBy.family": 1,
        "createdBy.createdAt": 1,
        "createdBy.updatedAt": 1,
        "writedBy._id": 1,
        "writedBy.email": 1,
        "writedBy.img": 1,
        "writedBy.firstName": 1,
        "writedBy.lastName": 1,
        "writedBy.firstNameEn": 1,
        "writedBy.createdAt": 1,
        "writedBy.updatedAt": 1,
      },
    },

    // { $project: {  } }
  ]);

  res.status(200).json(httpResponseOk(data));
};

exports.findMany = async (req, res) => {
  //const data = await modelItem.find({});

  //const query = { 'data.userId': user._id };
  const data = await modelItem.aggregate([
    // { $match: query },
    { $sort: { createdAt: -1 } },

    {
      $lookup: {
        from: modelWriter.collection.collectionName,
        localField: "writedBy",
        foreignField: "_id",
        as: "writedBy",
      },
    },
    {
      $unwind: "$writedBy",
    },

    // { $project: {  } }
  ]);

  res.status(200).json(httpResponseOk(data));
};

exports.updateOne = async (req, res) => {
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
