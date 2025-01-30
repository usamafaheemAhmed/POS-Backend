const Joi = require('joi');

const sizeSchema = Joi.object({
    name: Joi.string().required(),
    discountedPrice: Joi.number().required(),
    originalPrice: Joi.number().required(),
    extraToppingPrice: Joi.number().required()
});

const menuSchema = Joi.object({
    // id: Joi.string().required(),
    clientFK: Joi.string(),
    category: Joi.string().required(),
    imgURL: Joi.string().uri().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    sizes: Joi.array().items(sizeSchema),
    originalPrice: Joi.number(),
    discountedPrice: Joi.number(),
});

module.exports = menuSchema;