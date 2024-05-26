"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { apiKey, asyncHandler } = require("../../auth/checkAuthen");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

//signUp
router.post("/login",  apiKey, asyncHandler(accessController.login));
router.use(authentication);

router.post(
    "/refreshToken",
    asyncHandler(accessController.handlerRefreshToken)
);
module.exports = router;
