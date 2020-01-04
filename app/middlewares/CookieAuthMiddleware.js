'use strict'

const { get } = require('../libs/redis')
const { create: createActivity } = require('../libs/activityLogger')

module.exports = async (req, res, next) => {
    try {
        const xheader = req.cookies.x_stok_key
        if (!xheader || (xheader && xheader.length === 0)) throw new Error('Invalid Auth Header')
        let user = await get(xheader)
        if (!user || (user && user.length === 0)) throw new Error('Invalid Session Data')
        user = JSON.parse(user)
        req.config = { user, cache: xheader }
        if (!req.activityCreated) req.activityCreated = await createActivity({req})
        next()
    } catch (err) {
        console.log(err)
        res.redirect('/login')
    }
}
