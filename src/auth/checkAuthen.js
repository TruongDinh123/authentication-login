"use strict";

const { findById } = require("../services/apiKey.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "refresh-token",
};

const apiKey = async (req, res, next) => {
  try {
    const key = await req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "Forbidden api key error 1",
      });
    }

    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden object key error 2",
      });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {
    console.log("🚀 ~ error:", error);``
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = {
  apiKey,
  asyncHandler,
};
