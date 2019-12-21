window.fn = {}
const ls = localStorage;

let utils = window.fn;
utils.currentToken = ls.getItem('token');

utils.sendXHR = function (opt) {
    if (!opt.headers) opt.headers = {}
    if (utils.currentToken) opt.headers['x-auth-token'] = utils.currentToken;
    return new Promise(function (resolve, reject) {
        opt.success = function (res) {
            resolve(res);
        }
        opt.error = function (err) {
            reject(err);
        }
        $.ajax(opt);
    })
}

utils.jquery = function (selector) {
    return $(selector);
}

utils.getInputValue = function (selectors) { // selectors => object
    try {
        if (!selectors) throw new Error('No Selector');
        if (Object.keys(selectors).length <= 0) throw new Error('No Selector Defined');
        let jquerySelectors = {}
        for (let x in selectors) {
            const s = selectors[x];
            jquerySelectors[x] = this.jquery(this.selectors[s] || s).val();
        }
        return jquerySelectors;
    } catch (err) {
        alert(err.message);
    }
}
