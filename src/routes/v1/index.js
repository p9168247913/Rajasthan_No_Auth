const express = require("express");
const config = require("../../config/config");
const authRoute = require("./auth.route");
const docsRoute = require("./docs.route");
const dataRoute = require("./data.route");
const deviceConfigRoute = require("./deviceConfig");
const configLogRoute = require("./configLog");
const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/data",
    route: dataRoute,
  },
  {
    path: "/device-config",
    route: deviceConfigRoute,
  },
  {
    path: "/config-log",
    route: configLogRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: "/docs",
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

// router.route('/upload-file').post(uploadFile);

/* istanbul ignore next */
if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
