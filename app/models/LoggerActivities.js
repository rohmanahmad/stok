'use strict'

const mongoose = require('mongoose')

const schema = new mongoose
    .Schema({
        _id: {
            type: mongoose.Types.ObjectId,
            default: null
        },
        type: String, // api, page
        path: String,
        userId: String,
        params: {},
        body: {},
        queries: {},
        headers: {},
        cookies: {},
        createAt: Date
    })

const model = mongoose.model('loggerActivities', schema, 'loggerActivities')

module.exports = model
