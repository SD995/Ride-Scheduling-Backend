import jwt from "jsonwebtoken";

const generateAccessToken = function(user){
    return jwt.sign({
        _id: user._id,
        email: user.email,
        username: user.username,
        fullname: user.fullname
    },process.env.ACCESS_TOKEN_SECRET,{
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}
const generateRefreshToken = function(user){
    return jwt.sign(
    {
        _id: this._id,
    },
    process.env.REFERESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFERESH_TOKEN_EXPIRY
    })
}

export {generateAccessToken,generateRefreshToken};