'use strict'

const { lodash: { result } } = require('../helpers/utils')
const LoggerModel = require('../models/LoggerActivities')

let activity = {}

activity.create = async ({ req }) => {
    try {
        const userId = result(req, 'config.user.userId', null)
        const path = req.originalUrl
        const type = (path.indexOf('api/') > -1) ? 'api' : 'page'
        const params = req.params
        const queries = req.query
        const body = req.body
        const headers = req.headers
        const cookies = req.cookies
        if (!userId) {
            debugger
        }
        await LoggerModel.create({
            type,
            userId,
            path,
            params,
            queries,
            body,
            headers,
            cookies,
            createdAt: new Date()
        })
    } catch (err) {
        throw err
    }
}

module.exports = activity
