const express = require("express");
const validate = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");
const auth2 = require("../../middlewares/auth2");
const dataValidations = require("../../modules/iotData/dataValidations");
const dataController = require("../../modules/iotData/controller");
const router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/add", dataController.addData);

// router.post("/dummy-data", dataController.dummyData);

router.get("/", dataController.getAllData);

// router.get("/unique-id", auth(), dataController.getUniqueStationId);

// router.get("/download", auth("district"), dataController.downloadAllData);

// router.get(
//   "/latest-data",
//   auth("district"),
//   dataController.getLatestDataByStationId
// );

// router.put('/update/:id', validate(departmentValidations), auth(), departmentController.updateDepartment);

// router.put('/delete/:id', auth(), departmentController.deleteDepartment);

module.exports = router;
