module.exports = {
    // groups
    users: {
        add: true,
        list: true,
        // changepassword: true,
        edit: true,
        delete: true
    },
    products: {
        add: true,
        list: true,
        edit: true,
        delete: true
    },
    transactions: {
        add: true,
        list: true,
        edit: true,
        delete: true
    },
    // routes
    '/users': true,
    '/products': true,
    '/transactions': true
}