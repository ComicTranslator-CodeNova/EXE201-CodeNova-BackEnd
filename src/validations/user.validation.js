const Joi = require("joi");

exports.updateProfileSchema = Joi.object({
  display_name: Joi.string().max(100).allow(null, ""),
  avatar_url: Joi.string().uri().allow(null, "")
});

exports.changeEmailSchema = Joi.object({
  new_email: Joi.string().email().required()
});
