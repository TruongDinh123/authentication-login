"use strict";
const { SuccessReponse } = require("../core/success.reponse");
const AccessService = require("../services/access.service");

class AccessController {
    handlerRefreshToken = async (req, res, next) => {
        new SuccessReponse({
          message: "Get token success",
          metadata: await AccessService.handleRefreshToken({
            refreshToken: req.refreshToken,
            user: req.user,
            keyAccount: req.keyAccount,
          }),
        }).send(res);
    };
      
    login = async (req, res, next) => {
        try {
          new SuccessReponse({
            metadata: await AccessService.login(req.body),
          }).send(res);
        } catch (error) {
          console.error(error);
        }
    };
}
module.exports = new AccessController();