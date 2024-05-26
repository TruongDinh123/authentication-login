"use strict";

const { findByEmail } = require("./user.service")
const {
    BadRequestError, ForbiddenError,
} = require("../core/error.response");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { createTokenPair } = require("../auth/authUtils");
const KeyTokenService = require("./keyToken.service");
const { getInfoData } = require("../utils");

class AccessService {
    static handleRefreshToken = async ({ keyAccount, user, refreshToken }) => {
        const { userId, email } = user;
    
        if (keyAccount.refreshTokensUsed.includes(refreshToken)) {
          await KeyTokenService.deleteKeyById(userId);
          throw new ForbiddenError("Refresh token has been used!! pls relogin");
        }
    
        if (keyAccount.refreshToken !== refreshToken) {
          throw new ForbiddenError("Refresh token has been used!! pls relogin");
        }
    
        const foundAccount = await findByEmail({ email });
        if (!foundAccount) throw new AuthFailureError("Refresh token not found");
    
        //create 1 cap moi
        const tokens = await createTokenPair(
          { userId, email },
          keyAccount.publicKey,
          keyAccount.privateKey
        );
        //update token
        await keyAccount.updateOne({
          $set: {
            refreshToken: tokens.refreshToken,
          },
          $addToSet: {
            refreshTokensUsed: refreshToken,
          },
        });
    
        return {
          user,
          tokens,
        };
      };
      
    static login = async ({ email, password, refreshToken = null }) => {
        const foundAccount = await findByEmail({email});
        if(!foundAccount) {
            throw new BadRequestError("Error: account not found");
        }

        const match = await bcrypt.compare(password, foundAccount.password);
        if(!match) {
            throw new BadRequestError("Error: password is incorrect");
        }

        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        const { _id: userId } = foundAccount;

        const tokens = await createTokenPair(
            { userId, email},
            publicKey,
            privateKey
        );

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
            userId,
        })

        return {
            account: getInfoData({
                fileds: ["_id", "email", "lastName", "roles"],
                object: foundAccount,
            }),
            tokens,
        }
    }
}

module.exports = AccessService;