const JWT = require('jsonwebtoken')

const SECRET =process.env.SECRET

function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        name:user.fullName,
        email: user.email,
        profileimg: user.profileImgURL,
        role: user.role,
    }
    const token = JWT.sign(payload, SECRET)
    return token
}

function validateToken(token) {
    const payload = JWT.verify(token, SECRET)
    // console.log("payload", payload);
    return payload;
}

module.exports = {
    createTokenForUser,
    validateToken,

}