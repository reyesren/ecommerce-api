const passport = require("passport");
const ExpressError = require("../utils/ExpressError");
const { authSchema } = require("../validation/validateAuthRequests");
const { validateBody } = require("../utils/utility");

const authenticateUser = (req, res, next) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err, decryptedToken, jwtError) => {
      if (typeof jwtError == "object") {
        throw new ExpressError(jwtError, 401);
      }
      req.userId = decryptedToken.userId;
      req.fullName = decryptedToken.fullName;
      req.shippingAddress = decryptedToken.shippingAddress;
      return next();
    }
  )(req, res, next);
};

const validateCredentials = (req, res, next) => {
  validateBody(req, res, next, authSchema);
};

module.exports = {
  authenticateUser: authenticateUser,
  validateCredentials: validateCredentials,
};
