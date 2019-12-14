'use strict'

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
controller.products = (req, res) => {
    res.render('products', {activeMenu: 'products', title: "Produk"})
}
controller.transactions = (req, res) => {
    res.render('transactions', {activeMenu: 'transactions', title: "Transaksi"})
}
controller.users = (req, res) => {
    res.render('users', {activeMenu: 'users', title: "User"})
}

module.exports = controller
