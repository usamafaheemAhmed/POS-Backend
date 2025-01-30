const express = require('express');
const { dynamicFunction } = require('../controller/BismillahController');

const addonModal = require('../model/AddonModal'); // Adjust the path as necessary
const addonSchema = require('../schema/AddonSchema'); // Adjust the path as necessary

const router = express.Router();


router.get('/', (req, res) => {
    dynamicFunction(addonModal, { clientFK: req.id }, req, res);
});

router.post('/', (req, res) => {
    const { error } = addonSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details);
    }

    req.body.clientFK = req.id;

    const newAddon = new addonModal(req.body);
    newAddon.save((err, savedAddon) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).send(savedAddon);
    });
});

router.post('/bulk', (req, res) => {
    const entries = req.body;

    if (!Array.isArray(entries)) {
        return res.status(400).send({ message: 'Entries should be an array' });
    }

    const validationErrors = entries.map(entry => addonSchema.validate(entry).error).filter(error => error);

    if (validationErrors.length > 0) {
        return res.status(400).send(validationErrors);
    }

    
    // Add clientFK to each entry
    entries.forEach(entry => {
        entry.clientFK = req.id;
    });

    addonModal.insertMany(entries, (err, savedEntries) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).send(savedEntries);
    });
});

router.put('/:id', (req, res) => {
    const { error } = addonSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details);
    }

    addonModal.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedAddon) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (!updatedAddon) {
            return res.status(404).send({ message: 'Addon not found' });
        }
        res.status(200).send(updatedAddon);
    });
});

router.delete('/:id', (req, res) => {
    addonModal.findByIdAndDelete(req.params.id, (err, deletedAddon) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (!deletedAddon) {
            return res.status(404).send({ message: 'Addon not found' });
        }
        res.status(200).send({ message: 'Addon deleted successfully' });
    });
});

module.exports = router;