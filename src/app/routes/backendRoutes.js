'use strict'

const express = require('express')
const router = express.Router()

// controllers
const ProductController = require('../controllers/ProductController')
const UserController = require('../controllers/UserController')
const TransactionController = require('../controllers/TransactionController')

// middlewares
const TokenAuth = require('../middlewares/TokenAuthMiddleware')
const { ApiAccess } = require('../middlewares/AccessMiddleware')

router.get('/', (req, res) => {
    res.send({
        version: '0.1.0'
    })
})

// login route
router.post('/user/login', [UserController.login])

// product routes
router.get('/products', [TokenAuth, ApiAccess, ProductController.getProduct])
router.post('/products/create', [TokenAuth, ApiAccess, ProductController.create])
router.delete('/products/:id', [TokenAuth, ApiAccess, ProductController.deleteOne])
router.put('/products/update/:id', [TokenAuth, ApiAccess, ProductController.updateOne])

// users routes
router.get('/users', [TokenAuth, ApiAccess, UserController.getUsers])
router.post('/users/create', [TokenAuth, ApiAccess, UserController.create])
router.delete('/users/:id', [TokenAuth, ApiAccess, UserController.deleteOne])
router.put('/users/update/:id', [TokenAuth, ApiAccess, UserController.updateOne])

// transactions routes
router.get('/transactions', [TokenAuth, ApiAccess, TransactionController.getTransactions])
router.post('/transactions/create', [TokenAuth, ApiAccess, TransactionController.create])
router.delete('/transactions/:id', [TokenAuth, ApiAccess, TransactionController.deleteOne])

module.exports = router
