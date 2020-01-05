let fn = window.fn;
const limitPerPage = 10;

fn.selectors = {
    contentProduct: '#products-content',
    footerProduct: '#products-footer',
    btnAdd: '#modal-trigger-add',
    // filters
    filterPage: '#product-filter-page',
    filterPrdCode: '#filter-prd-code',
    filterPrdName: '#filter-prd-name',
    filterUserId: '#filter-prd-userid',
    filterStatus: '#filter-prd-status',
    modalProduct: '#modal-form-product',
    // modal create new
    contentModalProductAdd: '#product-content-add',
    formPrdId: '#prd-id',
    formPrdName: '#prd-name',
    formPrdQty: '#prd-qty',
    formPrdDescription: '#prd-description',
    // modal change password & type
    contentModalProductEdit: '#product-content-edit',
    editFormPrdId: '#edit-prd-id',
    editFormPrdName: '#edit-prd-name',
    editFormPrdQty: '#edit-prd-qty',
    editFormPrdDescription: '#edit-prd-description',
    btnSave: '#btn-product-save'
}

fn.init = function () {
    fn.currentData = {};
    fn.getProducts();
}

fn.loadingProduct = function () {
    fn.jquery('contentProduct').append('<tr id="loading"><td colspan="6">Memuat...</td></tr>');
}

fn.getFilters = function () {
    try {
        const data = fn.getInputValue({
            prdCode: 'filterPrdCode',
            prdName: 'filterPrdName',
            userid: 'filterUserId',
            status: 'filterStatus'
        });
        const page = parseInt(fn.jquery('filterPage').val());
        return {...data, page, limit: limitPerPage};
    } catch (err) {
        throw err;
    }
}

fn.getProducts = function (isLoadMore = false) {
    try {
        if (!isLoadMore) fn.jquery('filterPage').val(1);
        const data = fn.getFilters();
        fn.sendXHR({
            url: '/api/products',
            method: 'GET',
            beforeSend: function () {
                fn.loadingProduct();
            },
            data
        })
            .then(function (data) {
                fn.removeElement('#loading');
                fn.updateRowProductData(data, isLoadMore);
            })
            .catch(function (err) {
                fn.alertError(err.error);
                throw err;
            });
    } catch (err) {
        fn.alertError(err.message);
    }
}

fn.showMore = function () {
    try {
        const d = fn.getFilters();
        fn.jquery('filterPage').val(d.page + 1);
        fn.getProducts(true); //loadmore = true
    } catch (err) {
        throw err;
    }
}

fn.updateRowProductData = function (data, isLoadMore = false) {
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
            res[row._id] = row;
            return res;
        }, {});
        let rows = data.items
            .map((r) => {
                const editAction = access.edit ? `<a ${modalAttr} data-target='#modal-form-product' class='btn btn-xs btn-warning pmd-btn-fab btn-action' onclick='fn.edit(this)'>${icons['edit']}</a>` : '';
                const removeAction = access.delete ? `<a ${modalAttr} class='btn btn-xs btn-danger pmd-btn-fab btn-action' data-id='${r._id}' data-action='fn.deleteConfirmation(this)' onclick='fn.confirm(this)'>${icons['delete']}</a>` : '';
                let accessList = `
                <div data-id='${r._id}' style='padding: 10px;'>
                    ${editAction}
                    ${removeAction}
                </div>`;
                startPage += 1;
                const currentClass = r.status ? 'border-green' : 'border-red';
                const row = `<tr>
                    <td data-title="#" class="${currentClass}">${startPage}</td>
                    <td data-title="Kode Produk">${r.productCode}</td>
                    <td data-title="Nama Produk">${r.productName}</td>
                    <td data-title="Stok">${r.stock}</td>
                    <td data-title="Dibuat">${moment(r.createdAt).format('DD/MM/YYYY')}</td>
                    <td data-title="Keterangan">${r.description || '-'}</td>
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
        if (rows.length === 0 && !isLoadMore) rows = [`<tr><td colspan="6" style="text-align: left;">Data Tidak Ditemukan</td></tr>`];
        if (rows.length === limitPerPage) {
            fn.jquery('footerProduct').html(fn.isButtonMore(true));
        } else {
            fn.jquery('footerProduct').html(fn.isButtonMore(false));
        }
        if (isLoadMore) {
            fn.jquery('contentProduct').append(rows.join(' '));
        } else {
            fn.jquery('contentProduct').html(rows.join(' '));
        }
        fn.activatePopover();
    } catch (err) {
        throw err;
    }
}

fn.isButtonMore = function (status = true) {
    if (status) {
        return `<button onclick="fn.showMore();" class="btn btn-primary btn-xs pmd-btn-raised pmd-ripple-effect">Tampilkan Lebih Banyak...</button>`;
    }
    return '';
}

fn.activatePopover = function () {
    fn.jquery('[data-toggle="popover"]').popover();
}

fn.getValueFromModalProduct = function () {
    return {
        prdId: fn.getInputValue('formPrdId'),
        prdName: fn.getInputValue('formPrdName'),
        prdQty: fn.getInputValue('formPrdQty'),
        prdDescription: fn.getInputValue('formPrdDescription'),
    }
}

fn.setValueFromModalProduct = function (data = {}) {
    fn.setInputValue('formPrdId', '');
    fn.setInputValue('formPrdName', '');
    fn.setInputValue('formPrdQty', '');
    fn.setInputValue('formPrdDescription', '');

    fn.setInputValue('editFormPrdId', data['productCode'] || '');
    fn.setInputValue('editFormPrdName', data['productName'] || '');
    fn.setInputValue('editFormPrdQty', data['stock'] || '');
    fn.setInputValue('editFormPrdDescription', data['description'] || '');
}

fn.createNewProduct = function () {
    try {
        const data = fn.getValueFromModalProduct();
        if (data.password !== data.confirm) throw new Error('Password Tida Cocok');
        fn.sendXHR({
            url: '/api/products/create',
            method: 'POST',
            data
        })
            .then(function () {
                fn.getProducts();
                fn.hideModal('modalProduct');
            })
            .catch(function (err) {
                fn.alertError(err.error);
            });
    } catch (err) {
        fn.alertError(err.message);
    }
}

fn.initCreateNew = function () {
    fn.show('contentModalProductAdd');
    fn.hide('contentModalProductEdit');
    fn.setValueFromModalProduct();
}

fn.edit = function (obj) {
    try {
        const self = fn.jquery(obj);
        const dataId = self.parent(0).data('id');
        const currentRow = fn.currentData[dataId];
        fn.hide('contentModalProductAdd');
        fn.show('contentModalProductEdit');
        fn.setValueFromModalProduct(currentRow);
        fn.jquery('btnSave').attr('data-id', dataId);
    } catch (err) {
        fn.alertError(err.message);
    }
}

fn.updateProduct = function (obj) {
    try {
        const id = fn.jquery(obj).data('id');
        const data = {
            // prdId: fn.getInputValue('editFormPrdId'),
            prdName: fn.getInputValue('editFormPrdName'),
            prdQty: fn.getInputValue('editFormPrdQty'),
            prdDescription: fn.getInputValue('editFormPrdDescription')
        }
        if (data.password !== '') {
            if (data.password !== data.confirm) throw new Error('Password Tidak Cocok');
        }
        if (!id) throw new Error('Id Tidak Valid');
        fn.sendXHR({
            url: '/api/products/update/' + id,
            method: 'PUT',
            data
        })
            .then(function () {
                fn.getProducts();
                fn.hideModal('modalProduct');
            })
            .then(function (err) {
                throw err;
            });
    } catch (err) {
        fn.alertError(err.message);
    }
}

fn.deleteConfirmation = function (obj) {
    try {
        debugger
        const self = fn.jquery(obj);
        const dataId = self[0].dataset['deleted'];
        fn.sendXHR({
            url: '/api/products/' + dataId,
            method: 'DELETE'
        })
            .then(function () {
                fn.getProducts();
            })
            .catch(function (err) {
                throw err;
            });
    } catch (err) {
        fn.alertError(err.message);
    }
}

// run firstly
fn.init();