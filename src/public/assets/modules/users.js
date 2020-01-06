let fn = window.fn;
const limitPerPage = 100;

fn.selectors = {
    contentUser: '#users-content',
    btnAdd: '#modal-trigger-add',
    // filters
    filterPage: '#user-filter-page',
    filterEmail: '#filter-usr-email',
    filterUsername: '#filter-usr-name',
    filterStatus: '#filter-usr-status',
    // modal create new
    modalUser: '#modal-form-user',
    contentModalAdd: '#user-content-add',
    contentModalChangePassword: '#user-content-change-password',
    formUsername: '#username',
    formEmail: '#email',
    formRole: '#role',
    formPassword: '#password',
    formConfirm: '#confirm',
    formDescription: '#description',
    // modal change password & type
    editFormType: '#edit-role',
    editFormPassword: '#edit-password',
    editFormConfirm: '#edit-confirm',
    editFormDescription: '#edit-description',
    btnSave: '#btn-user-save'
}

fn.loadingUser = function () {
    fn.jquery('contentUser').html('<tr><td colspan="6">Memuat...</td></tr>');
}

fn.getFilters = function () {
    try {
        let data = fn.getInputValue({
            email: 'filterEmail',
            username: 'filterUsername',
            status: 'filterStatus',
            page: 'filterPage',
        });
        data['limit'] = limitPerPage;
        return data;
    } catch (err) {
        throw err;
    }
}

fn.getUsers = function () {
    try {
        fn.sendXHR({
            url: '/api/users',
            method: 'GET',
            beforeSend: function () {
                fn.loadingUser();
            },
            data: fn.getFilters()
        })
            .then(function (data) {
                fn.updateRowUserData(data);
            })
            .catch(function (err) {
                fn.alertError(err.error);
            });
    } catch (err) {
        fn.alertError(err.message);
    }
}

fn.updateRowUserData = function (data) {
    try {
        const page = parseInt(fn.getInputValue('filterPage')) || 1;
        let startPage = limitPerPage * (page - 1);
        const access = data.access || {};
        if (access.add) {
            fn.show('btnAdd');
        } else {
            fn.hide('btnAdd');
        }
        const modalAttr = `href='#' data-toggle='modal'`;
        const icons = {
            edit: `<i class='material-icons md-dark pmd-sm' style='color: #fff;'>mode_edit</i>`,
            delete: `<i class='material-icons md-dark pmd-sm' style='color: #fff;'>delete</i>`
        }
        
        fn.currentData = (data.items || []).reduce(function (res, row) {
            res[row.dataId] = row;
            return res;
        }, {});
        let rows = data.items
            .filter(x => x.username !== currentUser)
            .map((r) => {
                const editAction = r.roleType !== 'admin' && access.edit ? `<a ${modalAttr} data-target='#modal-form-user' class='btn btn-xs btn-warning pmd-btn-fab btn-action' onclick='fn.edit(this)'>${icons['edit']}</a>` : '';
                const removeAction = r.roleType !== 'admin' && access.delete ? `<a ${modalAttr} class='btn btn-xs btn-danger pmd-btn-fab btn-action' data-id='${r.dataId}' data-action='fn.deleteConfirmation(this)' onclick='fn.confirm(this)'>${icons['delete']}</a>` : '';
                let accessList = `
                <div data-id='${r.dataId}' style='padding: 10px;'>
                    ${editAction}
                    ${removeAction}
                </div>`;
                startPage += 1;
                const currentClass = r.status ? 'border-green' : 'border-red';
                const row = `<tr>
                    <td data-title="#" class="${currentClass}">${startPage}</td>
                    <td data-title="Role Type">${r.roleType}</td>
                    <td data-title="User ID">${r.userId}</td>
                    <td data-title="Username">${r.username}</td>
                    <td data-title="Email">${r.email}</td>
                    <td data-title="Description">${r.description || '-'}</td>
                    <td data-title="Action">
                        <a href="javascript:void(0);"
                            data-trigger="focus"
                            data-class="custom-popover"
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
        if (rows.length === 0) rows = [`<tr><td colspan="6">Data Tidak Ditemukan</td></tr>`];
        fn.jquery('contentUser').html(rows.join(' '));
        fn.activatePopover();
    } catch (err) {
        throw err;
    }
}

fn.activatePopover = function () {
    fn.jquery('[data-toggle="popover"]').popover();
}

fn.getValueFromModalUser = function () {
    return {
        username: fn.getInputValue('formUsername'),
        email: fn.getInputValue('formEmail'),
        role: fn.getInputValue('formRole'),
        password: fn.getInputValue('formPassword'),
        confirm: fn.getInputValue('formConfirm'),
        description: fn.getInputValue('formDescription'),
    }
}

fn.setValueFromModalUser = function (data) {
    fn.setInputValue('editFormType', data['roleType']);
    fn.setInputValue('editFormDescription', data['description']);
}

fn.createNewUser = function () {
    try {
        const data = fn.getValueFromModalUser();
        if (data.password !== data.confirm) throw new Error('Password Tida Cocok');
        fn.sendXHR({
            url: '/api/users/create',
            method: 'POST',
            data
        })
            .then(function () {
                fn.getUsers();
                fn.hideModal('modalUser');
            })
            .catch(function (err) {
                fn.alertError(err.error);
            });
    } catch (err) {
        fn.alertError(err.message);
    }
}

fn.initCreateNew = function () {
    fn.show('contentModalAdd');
    fn.hide('contentModalChangePassword');
}

fn.edit = function (obj) {
    try {
        const self = fn.jquery(obj);
        const dataId = self.parent(0).data('id');
        const currentRow = fn.currentData[dataId];
        fn.hide('contentModalAdd');
        fn.show('contentModalChangePassword');
        fn.setValueFromModalUser(currentRow);
        fn.jquery('btnSave').attr('data-id', dataId);
    } catch (err) {
        fn.alertError(err.message);
    }
}

fn.updateUser = function (obj) {
    try {
        const id = fn.jquery(obj).data('id');
        const data = {
            role: fn.getInputValue('editFormType'),
            password: fn.getInputValue('editFormPassword'),
            confirm: fn.getInputValue('editFormConfirm'),
            description: fn.getInputValue('editFormDescription')
        }
        debugger
        if (data.password !== '') {
            if (data.password !== data.confirm) throw new Error('Password Tidak Cocok');
        }
        if (!id) throw new Error('Id Tidak Valid');
        fn.sendXHR({
            url: '/api/users/update/' + id,
            method: 'PUT',
            data
        })
            .then(function () {
                fn.getUsers();
                fn.hideModal('modalUser');
            })
            .then(function (err) {
                fn.alertError(err.error);
            });
    } catch (err) {
        fn.alertError(err.message);
    }
}

fn.deleteConfirmation = function (obj) {
    try {
        const self = fn.jquery(obj);
        const dataId = self[0].dataset['deleted'];
        fn.sendXHR({
            url: '/api/users/' + dataId,
            method: 'DELETE'
        })
            .then(function () {
                fn.getUsers();
            })
            .catch(function (err) {
                fn.alertError(err.error);
            });
    } catch (err) {
        fn.alertError(err.message);
    }
}

fn.init = function () {
    fn.currentData = {};
    fn.getUsers();
}

// init first time
fn.init();