let fn = window.fn;

fn.selectors = {
    username: '#input-username',
    password: '#input-password'
}

fn.init = function () {}

fn.doLogin = function () {
    const data = fn.getInputValue({
        username: 'username',
        password: 'password'
    })
    fn.sendXHR({
        url: '/api/user/login',
        method: 'POST',
        data
    })
        .then(function (res) {
            for (let key in res) {
                ls.setItem(key, res[key]);
            }
            window.location.href = '/users';
        })
        .catch(function (err) {
            alert(err.message);
        });
}
