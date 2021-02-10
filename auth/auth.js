const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/user");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

passport.use(
  "authenticate",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    catchAsync(async (email, password, done) => {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new ExpressError("The email you entered was incorrect!", 400);
      }
      const validate = await user.verifyPassword(password);
      if (!validate) {
        throw new ExpressError("The password is incorrect, try again.", 400);
      }

      return done(null, user, { message: "Authenticated successfully" });
    })
  )
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.TOKEN_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    catchAsync(async (token, done) => {
      return done(null, token);
    })
  )
);
