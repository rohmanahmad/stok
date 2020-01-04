'use strict'

const ProductModel = require('../models/Products')
const Validation = require('../libs/inputValidator')
let service = {}

service.create = async ({ userId, prdId, prdName, prdQty, prdDescription }) => {
    try {
        let data = Validation.required({ userId, prdId, prdName, prdQty })
        data = Validation.isString({productCode: prdId, productName: prdName, description: prdDescription})
        data = {...data, ...Validation.isNumber({ stock: parseInt(prdQty) })}
        data['status'] = 1
        if (await ProductModel.findOne({ productCode: prdId })) throw new Error(`Product "${prdId}" already exists.`)
        data = await ProductModel.updateOne({ productCode: prdId }, {
            $setOnInsert: {
                ...data,
                createdAt: new Date()
            },
            $set: {
                updatedAt: new Date()
            }
        }, { upsert: true })
        return data
    } catch (err) {
        throw err
    }
}
service.list = async ({ criteria }) => {
    try {
        const data = await ProductModel.find({}).sort({$natural: -1})
        return data
    } catch (err) {
        throw err
    }
}

service.deleteOne = async ({ id }) => {
    try {
        if (!id || (id && id.length === 0)) throw new Error('Invalid Parameter')
        await ProductModel.deleteOne({_id: id})
    } catch (err) {
        throw err
    }
}

service.updateOne = async (id, {prdId, prdName, prdDescription, prdQty}) => {
    try {
        let data = {}
        data['productId'] = prdId
        data['stock'] = parseInt(prdQty)
        data['productName'] = prdName
        data['description'] = prdDescription
        data['updatedAt'] = new Date()
        data['status'] = 1
        await ProductModel.updateOne({ _id: id }, { $set: data })
    } catch (err) {
        throw err
    }
}

service.getOne = async ({id, productCode}) => {
    try {
        let criteria = {}
        if (id) criteria['_id'] = id
        if (productCode) criteria['productCode'] = productCode
        return await ProductModel.findOne(criteria)
    } catch (err) {
        throw err
    }
}

service.updateStock = async ({id, newStock}) => {
    try {
        await ProductModel.updateOne({_id: id}, {$set: {
            updatedAt: new Date(),
            stock: newStock
        }})
    } catch (err) {
        throw err
    }
}

module.exports = service
