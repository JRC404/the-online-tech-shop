const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');

exports.productById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if(err || !product) {
            return res.status(400).json({
                error: "Product not found."
            });
        };
        req.product = product;
        next();
    });
};

exports.read = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
};


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

exports.remove = (req, res) => {
    let product = req.product
    product.remove((err, DeletedProduct) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            "message": "Product deleted."
        })
    })
}

exports.update = (req, res) => {
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

        let product = req.product
        product = _.extend(product, fields);

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