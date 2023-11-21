const jwt = require('jsonwebtoken')

// Function to generate a JWT token for a given user ID
const getToken = (id)=>{
    // setting the token expiration to 1 day
    return jwt.sign({id},process.env.JWT_SECRET, {expiresIn: "1d"})
}

module.exports = getToken