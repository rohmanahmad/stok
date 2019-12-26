let fn = window.fn;

fn.selectors = {
    contentUser: '#users-content',
}

fn.init = function () {
    fn.listNumber = 0;
    fn.getUsers();
}

fn.loadingUser = function () {
    fn.jquery('contentUser').html('<tr><td colspan="6">Loading...</td></tr>');
}

fn.getUsers = function () {
    try {
        fn.sendXHR({
            url: '/api/users',
            method: 'GET',
            beforeSend: function () {
                fn.loadingUser();
            },
            data: {}
        })
            .then(function (data) {
                fn.updateRowUserData(data);
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        console.error(err);
    }
}

fn.updateRowUserData = function (data) {
    try {
        const access = data.access || {};
        if (access.add) {
            fn.jquery('#form-user').show();
        } else {
            fn.jquery('#form-user').hide();
        }
        const editActions = access.edit ? `<a class='list-group-item list-group-item-warning' href='javascript:void(0);' onclick='fn.edit()'>Edit</a>` : '';
        const removeActions = access.remove ? `<a class='list-group-item list-group-item-danger' href='javascript:void(0);' onclick='fn.delete()'>Delete</a>` : '';
        
        let accessList = `
        <div class='list-group pmd-z-depth pmd-list pmd-card-list'>
            ${editActions}
            ${removeActions}
        </div>`;
        // accessList = '<button>hello</button>'
        let rows = data.items.map((r) => {
            fn.listNumber += 1;
            const currentClass = r.status ? 'border-green' : 'border-red';
            const row = `<tr>
                <td data-title="#" class="${currentClass}">${fn.listNumber}</td>
                <td data-title="Role Type">${r.roleType}</td>
                <td data-title="User ID">${r.userId}</td>
                <td data-title="Username">${r.username}</td>
                <td data-title="Email">${r.email}</td>
                <td data-title="Status">${r.status ? 'active': 'inactive'}</td>
                <td data-title="Action">
                    <a href="javascript:void(0);"
                        data-trigger="click"
                        data-class="custom-popover"
                        title="Available Actions"
                        data-toggle="popover"
                        data-placement="bottom"
                        data-content="${accessList}"
                        data-html="true">
                            <i class="material-icons md-dark pmd-sm">more_vert</i>
                    </a>
                </td>
            </tr>`;
            return row;
        });
        if (rows.length === 0) rows = [`<tr><td colspan="6"> Data Not Found</td></tr>`];
        fn.jquery('contentUser').html(rows.join(' '));
        fn.activatePopover();
    } catch (err) {
        throw err;
    }
}

fn.activatePopover = function () {
    fn.jquery('[data-toggle="popover"]').popover();
}

fn.edit = function () {

}

// init first time
fn.init();