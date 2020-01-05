let fn = window.fn;
const limitPerPage = 10;

fn.selectors = {
    contentTrxAll: '#transactions-all-content',
    contentTrxIn: '#transactions-in-content',
    contentTrxOut: '#transactions-out-content',
    btnAdd: '#modal-trigger-add',
    // filters
    filterAllPage: '#trxfilter-all-page',
    filterOutPage: '#trxfilter-out-page',
    filterInPage: '#trxfilter-in-page',
    // modal create new
    modalTrx: '#modal-form-transaction',
    formTrxType: '#trx-type',
    formTrxDate: '#trx-date',
    formTrxPrd: '#trx-product',
    formTrxQty: '#trx-qty',
    formTrxDescription: '#trx-description',
    btnSave: '#btn-trx-save'
}

fn.init = function () {
    fn.currentData = {};
    fn.currentTab = 'all';
    fn.getTransactions();
    fn.jquery('formTrxDate').val(new Date().toDateInputValue());
    fn.updateListProducts();
}

fn.loadingTrx = function () {
    fn.jquery(`#transaction-${fn.currentTab}-content`).html('<tr><td colspan="6">Memuat...</td></tr>');
}

fn.getFilters = function (type = 'all') {
    const data = fn.getInputValue({
        date: `#trxfilter-${type}-date`,
        prdcode: `#trxfilter-${type}-prdcode`,
    });
    return {...data, type};
}

fn.getTransactions = function () {
    try {
        const type = fn.currentTab;
        const data = fn.getFilters(type);
        fn.sendXHR({
            url: '/api/transactions',
            method: 'GET',
            beforeSend: function () {
                fn.loadingTrx();
            },
            data
        })
            .then(function (data) {
                fn.updateRowTrxData(type, data);
            })
            .catch(function (err) {
                fn.alertError(err.error);
            });
    } catch (err) {
        fn.alertError(err.message);
    }
}

fn.updateRowTrxData = function (type = 'all', data) {
    try {
        const items = data.items || [];
        const actions = data.actions || {};
        const page = parseInt(fn.jquery(`#trxfilter-${type}-page`)) || 1;
        let nStart = (page - 1) * limitPerPage;
        const body = fn.jquery(`#transactions-${type}-content`);
        body.html('');
        for (const r in items) {
            const d = items[r];
            const classBg = (d.type === 'in') ? 'border-green' : 'border-red';
            const prdName = d.product && d.product[0] && d.product[0].productName ? d.product[0].productName : '';
            nStart += 1;
            let tr = '<tr>';
            tr += `<td data-title="#" class="${classBg}">${ nStart }</td>`;
            tr += `<td data-title="Tanggal">${ moment(d.date).format('LL') }</td>`;
            tr += `<td data-title="Tipe Transaksi">${ d.type || '-' }</td>`;
            tr += `<td data-title="Kode Produk">${ d.prdCode || '-' }</td>`;
            tr += `<td data-title="Nama Produk">${ prdName || '-' }</td>`;
            tr += `<td data-title="Qty Produk">${ d.qty || 0 }</td>`;
            tr += `<td data-title="Dibuat">${ moment(d.createdAt).format('LLL') }</td>`;
            tr += `<td data-title="Keterangan">${ d.description || '-' }</td>`;
            tr += '</tr>';
            body.append(tr);
        }
    } catch (err) {
        fn.alertError(err.message);
    }
}

fn.getFormModal = function () {
    try {
        const data = fn.getInputValue({
            type: 'formTrxType',
            date: 'formTrxDate',
            prdCode: 'formTrxPrd',
            qty: 'formTrxQty',
            description: 'formTrxDescription',
        });
        return data;
    } catch (err) {
        fn.alertError(err.message);
    }
}

fn.createNew = function () {
    try {
        const data = fn.getFormModal();
        fn.sendXHR({
            url: '/api/transactions/create',
            method: 'POST',
            data
        })
            .then(function () {
                fn.getTransactions();
                fn.hideModal('modalTrx');
            })
            .catch(function (err) {
                fn.alertError(err.error);
            });
    } catch (err) {
        fn.alertError(err.message);
    }
}

fn.updateListProducts = function () {
    try {
        fn.sendXHR({
            url: '/api/products',
            method: 'GET',
            data: {}
        })
            .then(function (data) {
                const items = data.items || [];
                const body = fn.jquery('formTrxPrd');
                body.html('');
                for (let i of items) {
                    body.append(`<option value="${i.productCode}">${i.productName}</option>`);
                }
            })
            .catch(function (err) {
                fn.alertError(err.error);
            })
    } catch (err) {
        fn.alertError(err.error);
    }
}

// init first load
fn.init();