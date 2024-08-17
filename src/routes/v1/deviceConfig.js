const express = require("express");
const validate = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");
const deviceConfigController = require("../../modules/deviceConfig/controller");
const router = express.Router();

const authMiddleware = require("../../middlewares/auth2");

router.use(authMiddleware);

router.post("/add", deviceConfigController.addDeviceConfig);

// router.put("/update/:id", deviceConfigController.updateDeviceConfig);

router.put("/delete/:id", deviceConfigController.deleteDeviceConfig);

// router.post("/dummy-data", dataController.dummyData);

router.get("/", deviceConfigController.getAllDeviceConfig);

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
