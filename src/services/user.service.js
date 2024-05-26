const userModel = require("../models/user.model")

const findByEmail = async({
    email,
    select = {
        email: 1,
        password: 1,
        lastName: 1,
        roles: 1,
        status: 1,
    }
}) => {
    return await userModel.findOne({email}).select(select).lean();
}

const findUserById = async (userId) => {
    try {
        const user = await userModel.findOne({id: userId}).lean();
        return user;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findByEmail,
    findUserById,
}