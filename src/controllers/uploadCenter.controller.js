const multer = require('multer');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const md5 = require('md5');
const SHA256 = require('crypto-js/sha256');
const SHA512 = require('crypto-js/sha512');
const randomstring = require('randomstring');
const mongoose = require('mongoose');
const axios = require('axios');
const redis = require('redis');
let { Entity, Schema, Client, Repository } = require('redis-om');

const SERVER_UPLOAD_PATH = process.env.SERVER_UPLOAD_PATH;

const modelItem = require('../models/UploadCenter');

const modelManager = require('../models/Manager');

const { httpResponseOk, httpResponseError } = require('../utils/httpResponse');

exports.create = async (req, res) => {
  const managerItem = await modelManager.findOne({ hashIdAuth: req.systemUser.hashIdAuth });

  const des = req.body.des || null;

  if (!req.uploadFileNameInServerStatus) {
    res.status(400).json(httpResponseError((message = req.uploadFileNameInServerStatusMessage)));
  } else {
    const fileName = req.uploadFileNameInServer;
    const fileSize = req.uploadFileSize;
    const fileNameBeforeSave = req.uploadFileNameBeforeSave;
    const ext = req.uploadFileNameExt;
    const d = {
      fileName: fileName,
      fileSize: fileSize,
      fileNameBeforeSave: fileNameBeforeSave,
      fileNameExt: ext,
      des: des,
      managerId: managerItem,
    };
    const item = new modelItem(d);

    try {
      const resualtInsert = await item.save();
      res.status(200).json(httpResponseOk(d));
    } catch (e) {
      res.status(400).json(httpResponseError(e.message));
    }
  }
};

exports.findOne = async (req, res) => {
  const data = await modelItem.findOne({ _id: req.params.id });
  res.status(200).json(httpResponseOk(data));
};

exports.findMany = async (req, res) => {
  const fileNameExt = req.query.fileNameExt || 'all';
  const page = req.query.page || 0;
  const limit = 21;
  const skip = page * limit;
  const sort = {
    updatedAt: -1,
  };

  let query = {};
  if (fileNameExt !== 'all') {
    query = {
      fileNameExt: fileNameExt,
    };
  }

  //const fields = 'createdAt fileName fileNameBeforeSave fileNameExt fileSize';

  //let data = await modelItem.find(query, fields).skip(skip).limit(limit).sort(['updatedAt', -1]).exec();

  const fields = ['createdAt', 'fileName', 'fileNameBeforeSave', 'fileNameExt', 'fileSize', 'des'];

  const data = await modelItem.find(query, fields, {
    skip: skip, // Starting Row
    limit: limit, // Ending Row
    sort: sort,
  });

  res.status(200).json(httpResponseOk(data));
};
