const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
    name: { type: String, required: true, default: '' },
    price: { type: Number, required: true, default: '' }
}, { _id: false });

const addonModalSchema = new mongoose.Schema({
    // id: { type: String, required: true },
    clientFK: { type: mongoose.Schema.Types.ObjectId, ref: 'users', },
    category: { type: String, required: true, default: '' },
    name: { type: String, required: true, default: '' },
    sizes: { type: [sizeSchema], required: true, default: [] }
});

const addonModal = mongoose.model('addonModal', addonModalSchema);

module.exports = addonModal;