const md5 = require("md5");
const SHA256 = require("crypto-js/sha256");
const SHA512 = require("crypto-js/sha512");
const randomstring = require("randomstring");
const persianjs = require("persianjs");

const managerModel = require("../models/Manager");

const modelHistory = require("../models/History");
const modelLogin = require("../models/Login");

const historyLogger = async (req, data, hashIdAuth, userType) => {
  const item = new modelHistory({
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    useragent: req.useragent,
    data: data,
  });

  if (userType === "manager") {
    const userItem = await managerModel.findOne({ hashIdAuth: hashIdAuth });
    item.managerId = userItem;
    item.userType = userType;
  }
  try {
    const resualt = await item.save();
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const loginLogger = async (req, data, hashIdAuth, userType, type, status) => {
  const item = new modelLogin({
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    useragent: req.useragent,
    data: data,
    type: type,
    status: status,
  });

  if (userType === "manager") {
    const userItem = await managerModel.findOne({ hashIdAuth: hashIdAuth });
    item.managerId = userItem;
    item.userType = userType;
  }

  try {
    const resualt = await item.save();
    return true;
  } catch (e) {
    // console.log(e);
    return false;
  }
};

const makePublicHashId = (inputKey) => {
  const hashIdPublicSalt = randomstring.generate(128);
  const hashIdPublicString = `${inputKey}-${hashIdPublicSalt}-${Date.now()}`;
  const hashIdPublic = md5(hashIdPublicString);
  return hashIdPublic;
};

const nowDatetime = () => {
  const nowDatetime = new Date();
  const unixtime = nowDatetime.getTime();
  const nowDate = nowDatetime.toLocaleDateString("en-IR");
  const nowDateInt = `${nowDatetime.getFullYear()}${(nowDatetime.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${nowDatetime.getDate().toString().padStart(2, "0")}`;

  const nowDateFix = `${nowDatetime.getFullYear()}-${(
    nowDatetime.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${nowDatetime.getDate().toString().padStart(2, "0")}`;

  const nowTime = nowDatetime.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "numeric",
    minute: "numeric",
    timeZone: "Asia/Tehran",
  });
  const nowTimeInt = parseInt(nowTime.replace(":", ""));

  const nowDatePer = new Date().toLocaleTimeString("fa-IR", {
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Tehran",
  });

  let nowDatePerFix = nowDatePer.split(",")[0];
  nowDatePerFix = nowDatePerFix.replace(/ /g, "");
  nowDatePerFix = nowDatePerFix.replace(/۰/g, "0");
  nowDatePerFix = nowDatePerFix.replace(/۱/g, "1");
  nowDatePerFix = nowDatePerFix.replace(/۲/g, "2");
  nowDatePerFix = nowDatePerFix.replace(/۳/g, "3");
  nowDatePerFix = nowDatePerFix.replace(/۴/g, "4");
  nowDatePerFix = nowDatePerFix.replace(/۵/g, "5");
  nowDatePerFix = nowDatePerFix.replace(/۶/g, "6");
  nowDatePerFix = nowDatePerFix.replace(/۷/g, "7");
  nowDatePerFix = nowDatePerFix.replace(/۸/g, "8");
  nowDatePerFix = nowDatePerFix.replace(/۹/g, "9");
  nowDatePerFix = nowDatePerFix.replace("/", "-");
  nowDatePerFix = nowDatePerFix.replace("/", "-");
  nowDatePerFix = nowDatePerFix.replace("/", "-");
  nowDatePerFix = nowDatePerFix.replace("/", "-");

  const nowDatePerInt = parseInt(nowDatePerFix.replace(/-/g, ""));

  const d = {
    datetimeZone: "UTC",
    datetime: nowDatetime,
    unixtime: parseInt(unixtime),
    dateInt: parseInt(nowDateInt),
    dateIntPer: nowDatePerInt,
    dateFix: nowDateFix,
    dateFixPer: nowDatePerFix,
    //  nowDate: nowDate,
    timeInt: nowTimeInt,
    time: nowTime,
  };
  return d;
};

const dateGToDateObject = (dateInput) => {
  const dateInt = parseInt(dateInput.replaceAll("-", ""));

  return {
    date: dateInput,
    dateInt: dateInt,
  };
};

const englishNumber = (mobile) => {
  return persianjs(mobile).persianNumber().toString();
};

module.exports = {
  dateGToDateObject,
  nowDatetime,
  historyLogger,
  loginLogger,
  makePublicHashId,
  englishNumber,
};
