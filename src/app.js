const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const cors = require("cors");
const httpStatus = require("http-status");
const config = require("./config/config");
const morgan = require("./config/morgan");
const { authLimiter } = require("./middlewares/rateLimiter");
const routes = require("./routes/v1");
const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");
const session = require("express-session");
const { jwtStrategy } = require("./config/passport");
const ftp = require("ftp");
const DataModel = require("./modules/iotData/dataModel");
const ProcessedFile = require("./modules/processedData/processedDatamodel");
const csv = require("csv-parser");
const logger = require("./config/logger");
const bodyParser = require("body-parser");
const cronjob = require("../src/modules/iotData/cronJob");
const logRequestMiddleware = require("./middlewares/logger");
const errRequestMiddleware = require("./middlewares/errorMiddleware");
const passport = require("passport");

const app = express();

// parse json request body
app.use(express.json({ limit: "50mb" }));

// parse urlencoded request body
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// app.use((req, res, next) => {
//   console.log('Incoming Request Body:', req.body);
//   next();
// });

app.use(logRequestMiddleware);

if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());

// limit repeated failed requests to auth endpoints
if (config.env === "production") {
  app.use("/v1/auth", authLimiter);
}

//Middleware
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

// const client = new ftp();

// const fetchAndProcessCsvFiles = () => {
//   client.list("/upload", async (err, list) => {
//     if (err) {
//       logger.error("Error listing files:", err);
//       return;
//     }

//     const csvFiles = list.filter((file) => file.name.endsWith(".csv"));
//     if (csvFiles.length === 0) {
//       logger.info("No CSV files found.");
//       return;
//     }

//     for (const csvFile of csvFiles) {
//       const alreadyProcessed = await ProcessedFile.findOne({
//         filename: csvFile.name,
//       });
//       if (alreadyProcessed) {
//         continue;
//       }

//       client.get(`/upload/${csvFile.name}`, (err, stream) => {
//         if (err) {
//           logger.error("Error getting file:", err);
//           return;
//         }

//         const results = [];
//         let duplicatesFound = false;
//         stream
//           .pipe(
//             csv({
//               headers: [
//                 "Station ID",
//                 "Latitude",
//                 "Longitude",
//                 "Name of place",
//                 "Panchayat Samiti",
//                 "District",
//                 "Date and Time",
//                 "Mobile Number",
//                 "Battery voltage",
//                 "Water Temperature",
//                 "Corrected Water Level",
//                 "Raw water level",
//                 "Atmospheric pressure",
//               ],
//               separator: ",",
//             })
//           )
//           .on("data", async (data) => {
//             logger.info("Processing:", data);
//             const newDataPacket = {
//               stationId: data["Station ID"],
//               latitude: data["Latitude"],
//               longitude: data["Longitude"],
//               placeName: data["Name of place"],
//               panchayatSamiti: data["Panchayat Samiti"],
//               district: data["District"],
//               dateTime: data["Date and Time"],
//               mobileNumber: data["Mobile Number"],
//               batteryVoltage: data["Battery voltage"],
//               waterTemperature: data["Water Temperature"],
//               correctedWaterLevel: data["Corrected Water Level"],
//               rawWaterLevel: data["Raw water level"],
//               atmosphericPressure: data["Atmospheric pressure"],
//             };

//             try {
//               await DataModel.create(newDataPacket);
//               results.push(newDataPacket);
//             } catch (err) {
//               if (err.code === 11000) {
//                 logger.info(
//                   `Duplicate entry found for stationId: ${newDataPacket.stationId}, dateTime: ${newDataPacket.dateTime}`
//                 );
//               } else {
//                 logger.error("Error inserting data packet:", err);
//               }
//             }
//           })
//           .on("end", async () => {
//             if (!duplicatesFound) {
//               try {
//                 await ProcessedFile.create({ filename: csvFile.name });
//                 logger.info(`${csvFile.name} processed and stored to DB`);
//               } catch (error) {
//                 logger.error(
//                   "Error storing processed file record to DB:",
//                   error
//                 );
//               }
//             } else {
//               logger.info(
//                 `File ${csvFile.name} not marked as processed due to duplicates.`
//               );
//             }
//           });
//       });
//     }
//   });
// };

// client.on("ready", () => {
//   logger.info("Connected to FTP server");
//   fetchAndProcessCsvFiles();
//   setInterval(fetchAndProcessCsvFiles, 10000);
// });

// client.on("error", (err) => {
//   logger.error("FTP client error:", err);

//   setTimeout(() => {
//     client.connect({
//       host: "3.110.173.8",
//       port: 21,
//       user: "aqua",
//       password: "acer",
//     });
//   }, 10000);
// });

// client.connect({
//   host: "3.110.173.8",
//   port: 21,
//   user: "twdlr",
//   password: "NI6PpXnQ6#dW",
// });

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});
// jwt authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use("jwt", jwtStrategy);

app.use("/v1", routes);

app.all("/", (req, res) => {
  res.send("Hello from APIs");
});

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

cronjob;

// handle error
app.use(errRequestMiddleware);
app.use(errorHandler);

module.exports = app;
