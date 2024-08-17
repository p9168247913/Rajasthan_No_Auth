const express = require("express");
const validate = require("../../middlewares/validate");
const authValidation = require("../../modules/auth/auth.validation");
const authController = require("../../modules/auth/auth.controller");
const controller = require("../../modules/user/controller");
const userValidation = require("../../modules/user/user.validation");
const auth = require("../../middlewares/auth");
const path = require("path");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "./uploads/user",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|PNG)$/)) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

router.post(
  "/register",
  validate(userValidation.signupUser),
  controller.userController.newUser
);

router.post("/login", validate(authValidation.login), authController.login);

router.post("/logout", validate(authValidation.logout), authController.logout);

router.get("/getCurrentUser", auth(), authController.getCurrentUser);

router.get("/getUserById/:id", auth(), controller.getUserById);

router.get("/users", auth("admin"), controller.getAlluser);

router.post("/addUser", controller.addUser);

router.get("/hod", auth(), controller.getAllHod);

router.put("/resetPassword", controller.userController.resetPassword);
// router.put("/resetPassword", auth(), controller.userController.resetPassword);

router.put(
  "/updateUser/:id",
  validate(userValidation.updateUser),
  auth("admin"),
  controller.updateUser
);

router.put("/deleteUser/:id", auth("admin"), controller.deleteUser);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register as user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Invalid email or password
 */
