// Controller File (BismillahController.js)
const dynamicFunction = async (model, query, req, res) => {
    try {
        const result = await model.find(query);
        res.json(result); // Send the response here
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: "An error occurred" }); // Send the error response
    }
};

module.exports = { dynamicFunction };