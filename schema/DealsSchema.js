const Joi = require('joi');

const dealSchema = Joi.object({
    clientFK: Joi.string(),
    category: Joi.string().required(),
    imgURL: Joi.string().uri().required(),
    name: Joi.string().required(),
    items: Joi.array().items(Joi.string()).required(),
    originalPrice: Joi.number().required(),
});

module.exports = dealSchema;