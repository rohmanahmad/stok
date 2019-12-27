'use strict'

const md5 = require('md5')
const validate = require('validator')
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
        const key = md5(stringData)
        set({ key, value: stringData, exp }) // 12 jam
        return { token: key, username, roleType, exp: newExp }
    } catch (err) {
        throw err
    }
}
service.getUsers = async ({ username, email, status, page, limit }, myusername) => {
    try {
        let criteria = {}
        criteria['username'] = {
            '$ne': myusername
        }
        if (username) criteria['username']['$eq'] = new RegExp(username)
        if (email) criteria['email'] = email
        if (status) criteria['status'] = parseInt(status)
        limit = (limit && parseInt(limit) > 0) ? parseInt(limit) : 10
        page = (page && parseInt(page)) ? parseInt(page) : 1
        const skip = (page - 1) * limit
        const data = await UserModel.find(criteria).skip(skip).limit(limit)
        let row = []
        for (const r of data) {
            const {email: e, username: u, roleType, status: s, userId, createdAt, updateAt} = r
            row.push({email: e, username: u, roleType, status: s, userId, createdAt, updateAt})
        }
        return row
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
service.checkExists = async (username, email) => {
    try {
        const exists = await UserModel.findOne({$or: [{username}, {email}]})
        if (exists) throw new Error(`${username} or ${email} already exists!`)
    } catch (err) {
        throw err
    }
}

function validateUserForm (data) {
    try {
        const {username, email, password} = data
        if (!username || (username && username.length < 5)) throw new Error('Username Min 5 karakter')
        if (!password || (password && password.length < 5)) throw new Error('Password Terlalu Pendek')
        if (!validate.isEmail(email)) throw new Error(`${email} is not valid email`)
    } catch (err) {
        throw err
    }
}
service.create = async ({ username, password, confirm, email, roleType }) => {
    try {
        if (password !== confirm) throw new Error('Password Tidak Cocok')
        validateUserForm({ username, password, email, roleType })
        roleType = roleType === 'admin' ? 'admin' : 'user'
        await service.checkExists(username, email)
        const data = await UserModel.updateOne({username}, {
            $setOnInsert: {
                // _id: null,
                userId: await service.getNewUserID(),
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
