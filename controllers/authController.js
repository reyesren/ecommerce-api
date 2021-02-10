const passport = require("passport");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
// const jwt_decode = require("jwt-decode");

// get all users and get user by id
const authenticateUser = async (req, res, next) => {
  passport.authenticate(
    "authenticate",
    catchAsync(async (err, user, info) => {
      if (err || !user) {
        return next(err);
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        const token = jwt.sign(
          {
            userId: user._id,
            shippingAddress: user.shippingAddress,
          },
          process.env.TOKEN_SECRET,
          {
            expiresIn: 3600,
          }
        );

        return res.json({ token });
      });
    })
  )(req, res, next);
};

module.exports = {
  authenticateUser: authenticateUser,
};
