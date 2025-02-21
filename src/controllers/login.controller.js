const excel = require("exceljs");
const jmoment = require("jalali-moment");

const modelItem = require("../models/Login");
const modelManager = require("../models/Manager");

const { httpResponseOk, httpResponseError } = require("../utils/httpResponse");

exports.create = async (req, res) => {};

exports.findOne = async (req, res) => {
  res.status(200).json(httpResponseOk());
};

exports.findMany = async (req, res) => {
  const data = await modelItem.find({});

  res.status(200).json(httpResponseOk(data));
};

exports.updateOne = async (req, res) => {
  res.status(200).json(httpResponseOk());
};

exports.downloadExcel = async (req, res) => {
  if (req.body.type) {
    query = { "data.type": req.body.type };
  }

  let page = 0;
  let perPage = 21;
  let query = {};

  if (req.params.page) {
    page = Math.max(0, req.params.page);
  }
  if (page < 0) {
    page = 0;
  }

  const data = await itemModel.aggregate([
    // ترتیب مهم است //
    { $match: query },
    { $sort: { createdAt: -1 } },

    {
      $lookup: {
        from: modelManager.collection.collectionName,
        localField: "managerId",
        foreignField: "_id",
        as: "manager",
      },
    },
    {
      $unwind: "$manager",
    },

    { $skip: page * perPage },
    { $limit: perPage },
  ]);

  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet("Tutorials");

  worksheet.columns = [
    { header: "#", key: "#", width: 3 },
    { header: "User", key: "user", width: 25 },
    { header: "Url", key: "url", width: 25 },
    { header: "Ip", key: "ip", width: 25 },
    { header: "Os", key: "os", width: 15 },
    { header: "Browser", key: "browser", width: 15 },
    { header: "Date", key: "date", width: 15 },
    { header: "Time", key: "time", width: 15 },
  ];

  let tutorials = [];

  data.map((item, index) => {
    const date = jmoment(item.createdAt).locale("fa").format("D MMM YYYY");
    const time = jmoment(item.createdAt).locale("fa").format("HH:mm:ss");
    let i = {
      "#": index + 1,
      ip: item.ip,
      os: item.useragent.os,
      browser: item.useragent.browser,
      //date: item.createdAt,
    };
    i.date = date;
    i.time = time;
    tutorials.push(i);
  });

  // Add Array Rows
  worksheet.addRows(tutorials);

  // res is a Stream object
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + "tutorials.xlsx"
  );

  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
};

exports.deleteOne = async (req, res) => {
  res.status(200).json(httpResponseOk());
};
