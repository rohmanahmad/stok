const productService = require('../services/ProductService')
const errorHandler = require('../libs/errorHandler')
const { getAccess } = require('../helpers/access')

const errorMessage = function (obj = {}) {
    errorHandler({...obj, controller: 'Product'})
    console.log(obj.err)
}

// initiate the controller
let controller = {}

controller.getProduct = async (req, res, next) => {
    try {
        const access = getAccess(req.roleAccess, 'products')
        const items = await productService.list({criteria: req.query})
        res.send({access, items})
    } catch (err) {
        errorMessage({req, res, err})
    }
}
controller.create = async (req, res, next) => {
    try {
        const { userId } = req.config.user
        console.log(userId)
        let data = { ...req.body, userId }
        await productService.create(data)
        res.send('ok')
    } catch (err) {
        errorMessage({req, res, err})
    }
}

controller.updateOne = async (req, res, next) => {
    try {
        await productService.updateOne(req.params['id'], req.body)
        res.send({
            statusCode: 200,
            message: 'Success'
        })
    } catch (err) {
        errorMessage({req, res, err})
    }
}
controller.deleteOne = async (req, res, next) => {
    try {
        const { id } = req.params
        await productService.deleteOne({ id })
        res.send({
            statusCode: 200,
            message: 'Success'
        })
    } catch (err) {
        errorMessage({req, res, err})
    }
}

module.exports = controller