const express = require('express');
const { dynamicFunction } = require('../controller/BismillahController');
const router = express.Router();

const dealModal = require('../model/DealModal'); // Adjust the path as necessary
const dealSchema = require('../schema/DealsSchema'); // Adjust the path as necessary

router.get('/', (req, res) => {  // No longer async here
    // console.log("i am here")
    dynamicFunction(dealModal, { clientFK: req.id }, req, res); // Call the function, passing req and res
});

// router.get('/:clientFk', (req, res) => {  // No longer async here
//     dynamicFunction(dealModal, { clientFK: req.params.clientFk }, req, res); // Call the function, passing req and res
// });

router.post('/', (req, res) => {
    const { error } = dealSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details);
    }

    req.body.clientFK = req.id;

    const newMenu = new dealModal(req.body);
    newMenu.save((err, savedMenu) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).send(savedMenu);
    });
});

router.post('/bulk', (req, res) => {
    const entries = req.body;

    if (!Array.isArray(entries)) {
        return res.status(400).send({ message: 'Entries should be an array' });
    }

    const validationErrors = entries.map(entry => dealSchema.validate(entry).error).filter(error => error);

    if (validationErrors.length > 0) {
        return res.status(400).send(validationErrors);
    }

    dealModal.insertMany(entries, (err, savedEntries) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).send(savedEntries);
    });
});


router.put('/:id', (req, res) => {
    const { error } = dealSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details);
    }

    dealModal.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedMenu) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (!updatedMenu) {
            return res.status(404).send({ message: 'Menu not found' });
        }
        res.status(200).send(updatedMenu);
    });
});

router.delete('/:id', (req, res) => {
    dealModal.findByIdAndDelete(req.params.id, (err, deletedMenu) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (!deletedMenu) {
            return res.status(404).send({ message: 'Menu not found' });
        }
        res.status(200).send({ message: 'Menu deleted successfully' });
    });
});

module.exports = router;