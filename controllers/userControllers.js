const Joi = require("joi");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const generateToken = require("../utility/generateToken");

const schema = Joi.object({
  name: Joi.string().min(3).max(55).required(),
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string().min(7).max(55).required(),
});

const usernameSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
});

const passwordSchema = Joi.object({
  password: Joi.string().min(7).max(55).required(),
});

const emailSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
});

/**
 * @description This registers a user
 * @description The routes are POST request of /api/user/register
 * @access This a public routes
 * @author Onuorah Bonaventure Chukwudi
 */

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, username, password } = req.body;

  if (!name || !email || !username || !password) {
    res.status(400);
    throw new Error(
      "You cannot send an incomplete field. Please check your field and try again."
    );
  } else {
    const emailExist = await User.findOne({ email });
    const usernameExist = await User.findOne({ username });

    if (emailExist) {
      res.status(400);
      throw new Error("Email address is taken. Please try a unique one.");
    } else {
      if (usernameExist) {
        res.status(400);
        throw new Error("Username is taken. Please try a unique one.");
      } else {
        const newUser = await User.create({
          name,
          username,
          email,
          password,
        });

        if (newUser) {
          res.send({
            message: "Account created successfully",
          });
        } else {
          res.status(500);
          throw new Error(
            "An error has occured at our end and Registration failed. Please try again."
          );
        }
      }
    }
  }
});

/**
 * @description This allows a user to login
 * @description The routes are POST request of /api/user/login
 * @required req.body.username and req.body.password
 * @access This a public routes
 * @author Onuorah Bonaventure Chukwudi
 */

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error(
      "You cannot send an incomplete form. Please make sure you send a valid username and it's corresponding password."
    );
  }

  const usernameExist = await User.findOne({ username });

  if (!usernameExist) {
    res.status(400);
    throw new Error(
      "User does not exist in our system. Please check your spelling."
    );
  }

  if (await usernameExist.matchPassword(password)) {
    res.json({
      _id: usernameExist._id,
      name: usernameExist.name,
      email: usernameExist.email,
      username: usernameExist.username,
      isAdmin: usernameExist.isAdmin,
      token: generateToken(usernameExist._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid username or password");
  }
});

module.exports = {
  registerUser,
  loginUser,
  schema,
  usernameSchema,
  passwordSchema,
  emailSchema,
};
