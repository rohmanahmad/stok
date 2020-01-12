'use strict'

const ProductServices = require('../services/ProductService')

let controller = {}

controller.login = (req, res) => {
    res.render('login', {activeMenu: ''})
}
controller.logout = (req, res) => {
    res.redirect('/login')
}
controller.register = (req, res) => {
    res.render('register', {activeMenu: ''})
}
controller.forgot= (req, res) => {
    res.render('forgot', {activeMenu: ''})
}
controller.products = async (req, res) => {
    const data = await ProductServices.list(req.body)
    const cache = req.config.cache
    res.render('products', { activeMenu: 'products', title: 'Suvenir', data, cache })
}
controller.transactions = (req, res) => {
    const cache = req.config.cache
    res.render('transactions', {activeMenu: 'transactions', title: "Transaksi", cache})
}
controller.users = (req, res) => {
    const cache = req.config.cache
    res.render('users', {activeMenu: 'users', title: "User", cache})
}

module.exports = controller
