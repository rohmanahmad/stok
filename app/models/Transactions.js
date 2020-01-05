'use strict'

const mongoose = require('mongoose')

const schema = new mongoose
    .Schema({
        _id: mongoose.Types.ObjectId,
        userId: String,
        type: String,
        date: Date,
        prdCode: String,
        qty: Number,
        nominal: Number,
        description: String,
        status: Number,
        createAt: Date,
        updateAt: Date
    })

const model = mongoose.model('transactions', schema, 'transactions')

module.exports = model
