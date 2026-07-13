document.addEventListener('DOMContentLoaded', function() {
    loadFuturePayments();
});

function loadFuturePayments() {
    try {
        fetch('/api/operations/futurepay')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(payments => {
                renderFuturePayments(payments);
            })
            .catch(error => {
                console.error('Error loading future payments:', error);
                const tableBody = document.querySelector('#futurePaymentsTable tbody');
                tableBody.innerHTML = `<tr><td colspan="8">Ошибка загрузки: ${error.message}</td></tr>`;
            });
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderFuturePayments(payments) {
    const tableBody = document.querySelector('#futurePaymentsTable tbody');
    tableBody.innerHTML = '';
    const typeNames = {1: 'Расход', 2: 'Доход'};

    if (payments && payments.length > 0) {
        payments.forEach(payment => {
            const row = document.createElement('tr');
            const marketplaceCell = payment.marketplaceName ? payment.marketplaceName : '-';
            const categoryCell = payment.categoryName ? payment.categoryName : '-';
            const accountCell = payment.account ? payment.account.name : '-';
            row.innerHTML = `
                <td>${payment.id || '-'}</td>
                <td>${new Date(payment.dateTime).toLocaleDateString() || '-'}</td>
                <td>${payment.totalAmount || '-'}</td>
                <td>${accountCell}</td>
                <td>${typeNames[payment.operationTypeId] || payment.operationTypeId || '-'}</td>
                <td>${categoryCell}</td>
                <td>${payment.comment || '-'}</td>
                <td>${marketplaceCell}</td>
            `;
            tableBody.appendChild(row);
        });
    } else {
        tableBody.innerHTML = '<tr><td colspan="8">Нет данных для отображения</td></tr>';
    }
}
