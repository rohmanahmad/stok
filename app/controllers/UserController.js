const userService = require('../services/userService')
const errorHandler = require('../libs/errorHandler')
const errorMessage = function (obj = {}) {
    errorHandler({...obj, controller: 'User'})
}

// initiate the controller
let controller = {}

controller.login = async (req, res, next) => {
    try {
        const data = await userService.login(req.body)
        res.send(data)
    } catch (err) {
        errorMessage({req, res, err})
    }
}
controller.getUsers = async (req, res, next) => {
    try {
        const data = await userService.getUsers(req.query)
        res.send(data)
    } catch (err) {
        console.log(err)
        errorMessage({req, res, err})
    }
}
controller.create = async (req, res, next) => {
    try {
        const data = await userService.create(req.body)
        res.send(data)
    } catch (err) {
        errorMessage({req, res, err})
    }
}

module.exports = controller