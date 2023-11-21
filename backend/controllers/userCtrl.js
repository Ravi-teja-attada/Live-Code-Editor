const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const getrefreshToken = require("../config/refreshToken");
const jwt = require("jsonwebtoken");

// Route handler to create a new user
const createUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Checking if a user with the provided username already exists
  const findUser = await User.findOne({ username });
  if (!findUser) {
    // Creating a new user if no existing user is found
    const newUser = await User.create({
      username,
      password,
    });
    res.json(newUser);
  } else {
    throw new Error("User already existed");
  }
});

// Route handler to log in a user
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const findUser = await User.findOne({ username: username });
  if (!findUser) throw new Error("User not registered");
  let updateUser;
  if (await findUser.isPasswordMatched(password)) {
    // Generating a refresh token using the getRefreshToken function
    const refreshToken = getrefreshToken(findUser?._id);
    // Updating the user's refresh token in the database
    updateUser = await User.findByIdAndUpdate(
      findUser?._id,
      { refreshToken: refreshToken },
      { new: true }
    );

    // Setting the refreshToken as a HTTP-only cookie with a maximum age of 72 hours
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json(updateUser);
  } else {
    throw new Error("Incorrect password");
  }
});

const verifyToken = asyncHandler(async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded?.id);
    if (user) res.json(user);
  } catch (err) {
    console.log("error is ", err);
    throw new Error("Something went wrong");
  }
});

module.exports = { createUser, loginUser, verifyToken };
