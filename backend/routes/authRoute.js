const express = require('express')
const { createUser, loginUser, verifyToken } = require('../controllers/userCtrl')
const router = express.Router()

// Route for handling user registration and login
router.post('/register', createUser)
router.post('/login',loginUser)
router.post('/verifyToken',verifyToken )

module.exports = router