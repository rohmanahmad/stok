'use strict'

const md5 = require('md5')
const UserModel = require('../models/Users')
let service = {}
const msg = 'Invalid Username and Password'
const { set } = require('../libs/redis')
const exp = 12 * 60 * 60

service.login = async ({ username, password }) => {
    try {
        const isUsername = (username && username.length > 0)
        const isPassword = (password && password.length > 0)
        const isValid = isUsername && isPassword
        if (!isValid) throw new Error(msg)
        let data = await UserModel.findOne({
            username,
            password: md5(password)
        })
        if (!data) throw new Error(msg)
        const { roleType } = data
        const newExp = new Date().getTime() + exp
        const stringData = JSON.stringify({ username, roleType, exp: newExp })
        const token = md5(stringData)
        set({ token, value: data, exp }) // 12 jam
        return { token, username, roleType, exp: newExp }
    } catch (err) {
        throw err
    }
}
service.getUsers = async ({ username, password }) => {
    try {
        const id = await service.getNewUserID()
        console.log(parseInt(id.replace('U-', '')))
    } catch (err) {
        throw err
    }
}
service.getNewUserID = async () => {
    try {
        const { userId } = await UserModel.findOne({}).sort({$natural: -1})
        console.log(userId)
        return userId
    } catch (err) {
        throw err
    }
}
service.create = async ({ username, password, confirm, email, roleType }) => {
    try {
        if (password !== confirm) throw new Error('Password Doesnt Match')
        roleType = roleType === 'admin' ? 'admin' : 'user'
        const data = await UserModel.updateOne({username}, {
            $setOnInsert: {
                _id: null,
                userId: await this.getNewUserID(),
                username,
                password: md5(password),
                email,
                status: 1,
                roleType,
                createAt: new Date(),
            },
            $set: {
                updateAt: new Date()
            }
        }, { upsert: true })
        return data
    } catch (err) {
        throw err
    }
}

module.exports = service
