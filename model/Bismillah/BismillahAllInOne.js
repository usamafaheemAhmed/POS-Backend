const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    discountedPrice: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    extraToppingPrice: { type: Number, required: true }
});

const bismillahSchema = new mongoose.Schema({
    // id: { type: String, required: true },
    category: { type: String, required: true },
    imgURL: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    sizes: [sizeSchema]
});

const Bismillah = mongoose.model('Bismillah', bismillahSchema);

module.exports = Bismillah;