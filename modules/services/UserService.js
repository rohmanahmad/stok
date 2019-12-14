'use strict'

const md5 = require('md5')
const UserModel = require('../models/Users')
let service = {}

service.login = async ({ username, password }) => {
    // 
}
service.getUsers = async ({ username, password }) => {
    // 
}
service.create = async ({ username, password, email }) => {
    try {
        const data = await UserModel.create({
            _id: null,
            userId: 'U-001',
            username: 'username1',
            password: md5('hello'),
            email: 'username1@mail.com',
            status: 1,
            roleType: 'admin',
            createAt: new Date(),
            updateAt: new Date()
        })
        return data
    } catch (err) {
        throw err
    }
}

module.exports = service
