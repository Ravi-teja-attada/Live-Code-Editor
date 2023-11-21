const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
})
// Middleware to hash the user's password before saving to the database
userSchema.pre('save', async function(next){
    // Hashing the password only if it has been modified
    if(!this.isModified('password')) next()

    // Generating a salt and hashing the password
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

// Method to compare entered password with the stored hashed password
userSchema.methods.isPasswordMatched = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

module.exports = mongoose.model('User', userSchema)