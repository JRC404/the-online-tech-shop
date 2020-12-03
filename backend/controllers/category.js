const Category = require('../models/category');
const { errorHandle } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
    const category = new Category(req.body)
    category.save((err, data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandle(err)
            });
        }
        res.json({ data });
    });
};