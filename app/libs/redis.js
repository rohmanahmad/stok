'use strict'

const redis = require('redis')

const client = redis.createClient({
    url: process.env.REDIS_URI
})

client.on('error', (err) => {
    console.log(err)
    process.exit(0)
})

client.on('connect', () => {
    console.log('redis connected')
})

module.exports = {
    set: ({key, value, exp}) => {
        client.set(key, value, 'EX', exp)
    },
    get: (key) => {
        client.get(key)
    }
}