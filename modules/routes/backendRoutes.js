'use strict'

const express = require('express')
const router = express.Router()

const ProductController = require('../controllers/ProductController')
const UserController = require('../controllers/UserController')

router.get('/', (req, res) => {
    res.send({
        version: '0.1.0'
    })
})
router.get('/products', ProductController.getProduct)
router.get('/products/create', ProductController.create)

// users routes
router.get('/users', UserController.getUsers)
router.get('/users/create', UserController.create)

module.exports = router
