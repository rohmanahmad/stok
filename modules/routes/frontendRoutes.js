'use strict'

const express = require('express')
const router = express.Router()

const viewController = require('../controllers/viewController')

router.get('/', (req, res) => {
    res.redirect('/transactions')
})
router.get('/login', viewController.login)
router.get('/logout', viewController.logout)
// router.get('/register', viewController.register)
// router.get('/forgot', viewController.forgot)
router.get('/products', viewController.products)
router.get('/transactions', viewController.transactions)
router.get('/users', viewController.users)

module.exports = router
