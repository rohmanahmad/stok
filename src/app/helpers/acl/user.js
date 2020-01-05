module.exports = {
    // groups
    users: {
        list: true,
    },
    products: {
        list: true,
    },
    transactions: {
        add: false,
        list: false,
        edit: false,
        delete: false
    },
    // routes
    '/users': true,
    '/products': true,
    '/transactions': false
}