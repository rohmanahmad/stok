'use strict'

const transactionService = require('../services/TransactionService')
const errorHandler = require('../libs/errorHandler')
const { getAccess } = require('../helpers/access')

const errorMessage = function (obj = {}) {
    errorHandler({...obj, controller: 'User'})
    console.log(obj.err)
}

// initiate the controller
let controller = {}

controller.getTransactions = async (req, res, next) => {
    try {
        const access = getAccess(req.roleAccess, 'transactions')
        const items = await transactionService.list(req.query)
        res.send({ access, items })
    } catch (err) {
        errorMessage({req, res, err})
    }
}
controller.create = async (req, res, next) => {
    try {
        const userId = req.config.user.userId 
        const data = await transactionService.create({userId, ...req.body})
        res.send(data)
    } catch (err) {
        errorMessage({req, res, err})
    }
}
controller.deleteOne = async (req, res, next) => {
    try {
        const { id } = req.params
        const data = await transactionService.deleteOne({ id })
        res.send(data)
    } catch (err) {
        errorMessage({req, res, err})
    }
}

module.exports = controller
