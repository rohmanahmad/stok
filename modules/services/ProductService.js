'use strict'

const ProductModel = require('../models/Products')
let service = {}

service.create = async ({ criteria }) => {
    try {
        const data = await ProductModel.create({
            _id: null,
            kodeProduct: 'P-001',
            userId: 'U-001',
            namaProduct: 'Produk 1',
            stok: 10,
            keterangan: 'Ini keterangan produk 1',
            createAt: new Date(),
            updateAt: new Date()
        })
        return data
    } catch (err) {
        throw err
    }
}
service.list = async ({ criteria }) => {
    try {
        const data = await ProductModel.find({})
        return data
    } catch (err) {
        throw err
    }
}

module.exports = service
