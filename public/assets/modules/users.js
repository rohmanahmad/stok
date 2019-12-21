let fn = window.fn;

fn.init = function () {
    fn.getUsers();
}

fn.getUsers = function () {
    fn.sendXHR({
        url: '/api/users',
        method: 'GET',
        data: {}
    })
        .then(function (data) {
            console.log(data);
        })
}

// init first time
fn.init();