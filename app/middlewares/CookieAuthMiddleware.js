'use strict'

const { get } = require('../libs/redis')

module.exports = async (req, res, next) => {
    try {
        const xheader = req.cookies.x_stok_key
        if (!xheader || (xheader && xheader.length === 0)) throw new Error('Invalid Auth Header')
        let user = await get(xheader)
        if (!user || (user && user.length === 0)) throw new Error('Invalid Session Data')
        user = JSON.parse(user)
        req.config = { user }
        next()
    } catch (err) {
        // res.redirect('/login')
        console.log(err)
        res.status(400).send('ok')
    }
}
