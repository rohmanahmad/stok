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
        console.log()
    } catch (err) {
        throw err
    }
}
service.getNewUserID = async () => {
    try {
        const pattern = 'U-000'
        const { userId } = await UserModel.findOne({}).sort({$natural: -1})
        const lastId = `${parseInt(userId.replace('U-', '')) + 1}`
        const lenChar = lastId.length
        const newId = pattern.substring(0, pattern.length - lenChar) + lastId
        return newId
    } catch (err) {
        throw err
    }
}
service.checkExists = function (username) {
    try {
        const exists = await UserModel.findOne({username})
        if (exists) throw new Error(`${username} already exists!`)
    } catch (err) {
        throw err
    }
}
service.create = async ({ username, password, confirm, email, roleType }) => {
    try {
        if (password !== confirm) throw new Error('Password Doesnt Match')
        roleType = roleType === 'admin' ? 'admin' : 'user'
        await this.checkExists(username)
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
