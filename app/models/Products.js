'use strict'

const mongoose = require('mongoose')

const schema = new mongoose
    .Schema({
        _id: mongoose.Types.ObjectId,
        productCode: String,
        userId: String,
        productName: String,
        stock: Number,
        description: String,
        createAt: Date,
        updateAt: Date
    })

const model = mongoose.model('products', schema, 'products')

module.exports = model
