const Joi = require("joi");

const usersSchema = (users) => {
    const schema = Joi.object({
        firstName: Joi.string(),
        lastName: Joi.string(),
        email: Joi.string(),
        password: Joi.string(),
        gender: Joi.string(),
        phone: Joi.string(),
        subscription: Joi.string(),
        Roll: Joi.string(),
    });
    return schema.validate(users);
};

module.exports = usersSchema;
