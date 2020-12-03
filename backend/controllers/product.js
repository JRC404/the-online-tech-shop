const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: 'Image could not be upload'
            });
        };

        // check all fields
        const { name, description, price, category, quantity, shipping } = fields;

        if(!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: "All fields are require."
            });
        };

        let product = new Product(fields);

        // max photo size 1mb
        if(files.photo) {
            if(files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1mb in size"
                });
            };
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        };

        product.save((err, result) => {
          if(err) {
            console.log("product create error", err)
            return res.status(400).json({
                error: errorHandler(err)
            });
          };
          res.json(result);  
        });
    });
};