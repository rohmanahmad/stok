'use strict'

const { result } = require('lodash')

const access = {
    admin: require('./acl/admin'),
    user: require('./acl/user')
}

exports.getAccess = (type = 'user', controller) => {
    try {
        return result(access, `[${type}][${controller}]`, {})
    } catch (err) {
        console.log(err)
        return []
    }
}