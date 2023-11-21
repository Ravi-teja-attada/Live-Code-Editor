const jwt = require('jsonwebtoken')

// Function to generate a refresh token for a given user ID
const getrefreshToken = (id)=>{
    //setting the token expiration to 3 days
    return jwt.sign({id},process.env.JWT_SECRET, {expiresIn: "3d"})
}

module.exports = getrefreshToken