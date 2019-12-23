const userService = require('../services/userService')
const errorHandler = require('../libs/errorHandler')
const { getAccess } = require('../helpers/access')

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
        console.log(req.roleAccess)
        const access = getAccess(req.roleAccess, 'users')
        const items = await userService.getUsers(req.query)
        res.send({ access, items })
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