let fn = window.fn;

fn.selectors = {
    contentUser: '#users-content',
}

fn.init = function () {
    fn.getUsers();
}

fn.getUsers = function () {
    try {
        fn.sendXHR({
            url: '/api/users',
            method: 'GET',
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
        const actions = data.actions;
        if (actions.add) {
            fn.jquery('#form-user').show();
        } else {
            fn.jquery('#form-user').hide();
        }
        const editActions = actions.edit ? `<a class="list-group-item" href="javascript:void(0);" onclick="fn.edit()">edit</a>` : '';
        const removeActions = actions.remove ? `<a class="list-group-item" href="javascript:void(0);" onclick="fn.delete()">delete</a>` : '';
        
        const actionsList = `<div class="list-group pmd-z-depth pmd-list pmd-card-list">
            ${editActions}
            ${removeActions}
        </div>`;
        const rows = data.items.map(r => {
            const row = `<tr>
                <td data-title="#"></td>
                <td data-title="User ID"></td>
                <td data-title="Username"></td>
                <td data-title="Email"></td>
                <td data-title="Status"></td>
                <td data-title="Action">
                    <a href="javascript:void(0);"
                        data-trigger="click"
                        title="Available Actions"
                        data-toggle="popover"
                        data-placement="left"
                        data-content="${actionsList}">
                            <i class="material-icons md-dark pmd-sm">more_vert</i>
                    </a>
                </td>
            </tr>`;
            return row;
        });
        debugger
        fn.jquery(contentUser).html(rows);
    } catch (err) {
        throw err;
    }
}

// init first time
fn.init();