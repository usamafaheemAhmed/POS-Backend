const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    discountedPrice: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    extraToppingPrice: { type: Number, required: true }
},{ _id: false });

const menuModalSchema = new mongoose.Schema({
    // id: { type: String, required: true },
    clientFK: { type: mongoose.Schema.Types.ObjectId, ref: 'users', },
    category: { type: String, required: true, default: '' },
    imgURL: { type: String, required: true, default: '' },
    name: { type: String, required: true, default: '' },
    description: { type: String, required: true, default: '' },
    sizes: { type: [sizeSchema], default: [] },
    originalPrice: { type: Number, default: 0 },
    discountedPrice: { type: Number, default: 0 }
});

const menuModal = mongoose.model('menuModal', menuModalSchema);

module.exports = menuModal;