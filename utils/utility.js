const ExpressError = require("../utils/ExpressError");
const mongoose = require("mongoose");

const isValidMongooseId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ExpressError(
      "The entry with that id cannot be found! Please enter another one.",
      400
    );
  else {
    return true;
  }
};

const validateBody = (req, res, next, schema) => {
  const { error } = schema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateQueryParams = (req, schema) => {
  console.log(req);
  const { error } = schema.validate(req);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    return;
  }
};

const convertDateToReadable = (dateInput) => {
  let month = "" + (dateInput.getMonth() + 1),
    day = "" + dateInput.getDate(),
    year = dateInput.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

module.exports = {
  isValidMongooseId: isValidMongooseId,
  validateBody: validateBody,
  convertDateToReadable,
  validateQueryParams,
};
