const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listings: Joi.object({  
        title: Joi.string().required().messages({
            "string.empty": "Title is required."
        }),
        description: Joi.string().required().messages({
            "string.empty": "Description is required."
        }),
        price: Joi.number().min(0).required().messages({
            "number.base": "Price must be a number.",
            "number.min": "Price must be at least 0.",
            "any.required": "Price is required."
        }),
        image: Joi.object({  
            filename: Joi.string().allow("", null),
            url: Joi.string().allow("", null)
        }),
        country: Joi.string().required().messages({
            "string.empty": "Country is required."
        }),
        location: Joi.string().required().messages({
            "string.empty": "Location is required."
        })
    }).required() 
});
