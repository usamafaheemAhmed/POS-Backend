const express = require('express');
const router = express.Router();

const menuModel = require('../model/menuModal/menuModal'); // Adjust the path as necessary
const addonModel = require('../model/AddonModal'); // Adjust the path as necessary
const dealModel = require('../model/DealModal'); // Adjust the path as necessary

router.get('/:clientFk', async (req, res) => {
    try {
        const { clientFk } = req.params;  

        // Fetch data from all collections
        const menuResponse = await menuModel.find({ clientFK: clientFk });
        const addonResponse = await addonModel.find({ clientFK: clientFk });
        const dealResponse = await dealModel.find({ clientFK: clientFk });

        res.json({
            menu: menuResponse,
            addon: addonResponse,
            deal: dealResponse
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});

module.exports = router;
