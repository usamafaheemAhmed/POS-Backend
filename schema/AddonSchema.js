const Joi = require('joi');

const sizeSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required()
});

const addonSchema = Joi.object({
    // id: Joi.string().required(),
    clientFK: Joi.string(),
    category: Joi.string().required(),
    name: Joi.string().required(),
    sizes: Joi.array().items(sizeSchema).required()
});

module.exports = addonSchema;