import Joi from "joi";

export const noteValidationSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().max(5000).required(),
  date: Joi.string().required(),
  time: Joi.string().required(),
  status: Joi.string().required(),
  is_expired: Joi.boolean().required(),
});
