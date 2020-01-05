'use strict'

const TransactionModel = require('../models/Transactions')
const ProductService = require('./ProductService')
const Validation = require('../libs/inputValidator')
let service = {}

service.create = async ({ userId, type, date, prdCode, qty, description }) => {
    try {
        let data = Validation.required({ userId, type, date, prdCode, qty })
        data = Validation.isString({ userId, type, date, prdCode, qty })
        data = {...data, ...Validation.isNumber({ qty: parseInt(qty) })}
        if (data.qty < 1) throw new Error('Qty Harus Lebih Dari 0')
        data['status'] = 1
        data['description'] = description
        data['_id'] = null
        const prd = await ProductService.getOne({ productCode: prdCode })
        if (!prd) throw new Error('Produk Tidak Ditemukan Atau Stok Tidak Mencukupi')
        const stok = prd.stock || 0
        let newStock = type === 'out' ? stok - data.qty : stok + data.qty
        if (type === 'out' && newStock < 0) throw new Error('Stok Produk Tidak Mencukupi')
        data = await TransactionModel.create({
            ...data,
            createdAt: new Date()
        })
        await ProductService.updateStock({ id: prd._id, newStock })
        return data
    } catch (err) {
        throw err
    }
}
service.list = async ({ prdCode, date }) => {
    try {
        const data = await TransactionModel.find({}).sort({ $date: -1 })
        return data
    } catch (err) {
        throw err
    }
}

service.deleteOne = async ({ id }) => {
    try {
        if (!id || (id && id.length === 0)) throw new Error('Error Saat Menghapus')
        await TransactionModel.deleteOne({_id: id})
    } catch (err) {
        throw err
    }
}

module.exports = service