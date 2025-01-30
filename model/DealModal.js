const mongoose = require('mongoose');

const dealModalSchema = new mongoose.Schema({
    clientFK: { type: mongoose.Schema.Types.ObjectId, ref: 'users', },
    category: { type: String, required: true, default: '' },
    imgURL: { type: String, required: true, default: '' },
    name: { type: String, required: true, default: '' },
    items: { type: [String], required: true, default: [] },
    originalPrice: { type: Number, required: true, default: 0 }
});

const dealModal = mongoose.model('dealModal', dealModalSchema);

module.exports = dealModal;