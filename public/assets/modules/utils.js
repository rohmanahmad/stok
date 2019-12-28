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
            if (err.status === 402) window.location.href = '/logout';
            reject(err);
        }
        $.ajax(opt);
    })
}

utils.jquery = function (selector) {
    return $(this.selectors[selector] || selector);
}

utils.getInputValue = function (selectors) { // selectors => object
    try {
        if (!selectors) throw new Error('No Selector');
        if (Object.keys(selectors).length <= 0) throw new Error('No Selector Defined');
        if (typeof selectors === 'object') {
            let jquerySelectors = {}
            for (let x in selectors) {
                const s = selectors[x];
                jquerySelectors[x] = this.jquery(this.selectors[s] || s).val();
            }
            return jquerySelectors;
        } else {
            return this.jquery(this.selectors[selectors] || selectors).val();
        }
    } catch (err) {
        alert(err.message);
    }
}

utils.setInputValue = function (selector, value) {
    const obj = utils.jquery(selector);
    obj.val = value;
}

utils.show = function (selectors = []) {
    if (selectors) {
        if (typeof selectors !== 'object') selectors = [selectors];
        for (const selector of selectors) {
            utils.jquery(selector).removeClass('hide');
        }
    }
}

utils.hide = function (selectors = []) {
    if (selectors) {
        if (typeof selectors !== 'object') selectors = [selectors];
        for (const selector of selectors) {
            utils.jquery(selector).addClass('hide');
        }
    }
}

utils.confirm = function (obj) {
    const o = fn.jquery(obj)
    const data = o.data();
    utils.jquery('#confirmation').modal('show');
    utils.jquery('#handle-yes')
        .attr('onclick', data.action)
        .attr('data-deleted', data.id);
}

const currentUser = ls.getItem('username');
$('#current-user').html(currentUser);