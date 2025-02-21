// NTH DESK BACk
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const useragent = require("express-useragent");
let app = express();

const cors = require("cors");
const port = parseInt(process.env.SERVER_PORT) || 3000;

// ------- DAS DATA ------- ------- ------- ------- ------- ------- ------- //

/** ------- MONGODB ------- ------- ------- ------- ------- ------- ------- */
let DATABASE_MONGODB = `mongodb://${process.env.DATABASE_MONGODB_HOST}/${process.env.DATABASE_MONGODB_NAME}`;
if (
  process.env.DATABASE_MONGODB_USERNAME &&
  process.env.DATABASE_MONGODB_PASSWORD
) {
  mongoose.connect(DATABASE_MONGODB, {
    authSource: "admin",
    user: process.env.DATABASE_MONGODB_USERNAME,
    pass: process.env.DATABASE_MONGODB_PASSWORD,
  });
} else {
  mongoose.connect(DATABASE_MONGODB);
}
mongoose.connection.once("open", () => {
  console.log("✅ Successful connection: Mongodb");
});
/** ------- ------- ------- ------- ------- ------- ------- */

app.use(cors());
app.use(express.json({ limit: "1024mb" }));
app.use(express.json());
app.use(useragent.express());
app.set("json spaces", 0);

const routerManager = require("./src/routes/manager");
const routerPublic = require("./src/routes/public");
const routerUser = require("./src/routes/user");

app.get("/", (req, res) => {
  res.json({ app: "api.psiket.com" });
});
app.post("/", (req, res) => {
  res.json({ app: "api.psiket.com" });
});

app.use("/v1", routerManager);
app.use("/v3", routerPublic);
// app.use("/v2", routerUser);

app.use((req, res) => {
  return res.status(404).json({
    status: "Error",
    message: "آدرس مورد نظر یافت نشد",
  });
});

app.use((error, req, res, next) => {
  const status = error?.status || 400;
  const message = error?.message || "";
  return res.status(status).json({
    status: "error",
    message: message,
  });
});

app.listen(port, () => {
  console.log(`⚔️  Example app listening on port ${port} \n`);
});
