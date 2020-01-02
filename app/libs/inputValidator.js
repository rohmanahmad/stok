'use strict'

let validator = {}

validator.required = function (input = {}) {
    try {
        for (const key in input) {
            const value = input[key]
            if (!value || (value && value.length <= 0)) throw new Error(`${key} required`)
        }
        return input
    } catch (err) {
        throw err
    }
}

validator.isNumber = function (input = {}) {
    try {
        for (const key in input) {
            const value = input[key]
            if (typeof value !== 'number') throw new Error(`${key} is not a number`)
        }
        return input
    } catch (err) {
        throw err
    }
}

validator.isString = function (input = {}) {
    try {
        for (const key in input) {
            const value = input[key]
            if (typeof value !== 'string') throw new Error(`${key} is not a string`)
        }
        return input
    } catch (err) {
        throw err
    }
}


module.exports = validator
