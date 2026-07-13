document.addEventListener('DOMContentLoaded', function() {
    const editButton = document.getElementById('editButton');
    const table = document.getElementById('futurePaymentsTable');
    let isEditMode = false;
    let originalData = [];
    let categoriesData = [];
    let accountsData = [];
    let marketplacesData = [];

    // Загрузка данных при открытии
    loadCategories();
    loadAccounts();
    loadMarketplaces();
    loadFuturePayments();

    // Обработчик кнопки редактирования
    editButton.addEventListener('click', function() {
        if (!isEditMode) {
            // Включаем режим редактирования
            enableEditMode();
        } else {
            // Сохраняем изменения
            saveChanges();
        }
    });

    // Функция загрузки категорий
    async function loadCategories() {
        try {
            const response = await fetch('/api/categories');
            if (!response.ok) throw new Error('Ошибка загрузки категорий');
            categoriesData = await response.json();
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    // Функция загрузки счетов
    async function loadAccounts() {
        try {
            const response = await fetch('/api/accounts');
            if (!response.ok) throw new Error('Ошибка загрузки счетов');
            accountsData = await response.json();
        } catch (error) {
            console.error('Error loading accounts:', error);
        }
    }

    // Функция загрузки маркетплейсов
    async function loadMarketplaces() {
        try {
            const response = await fetch('/api/marketplaces');
            if (!response.ok) throw new Error('Ошибка загрузки маркетплейсов');
            marketplacesData = await response.json();
        } catch (error) {
            console.error('Error loading marketplaces:', error);
        }
    }

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
                    originalData = JSON.parse(JSON.stringify(payments)); // Глубокая копия
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
            payments.forEach((payment, index) => {
                const row = document.createElement('tr');
                row.dataset.index = index;
                row.dataset.id = payment.id;
                
                const marketplaceCell = payment.marketplaceName ? payment.marketplaceName : '-';
                const categoryCell = payment.categoryName ? payment.categoryName : '-';
                const accountCell = payment.account ? payment.account.name : '-';
                
                row.innerHTML = `
                    <td class="id-cell">${payment.id || '-'}</td>
                    <td class="date-cell" data-value="${payment.dateTime}">${new Date(payment.dateTime).toLocaleDateString() || '-'}</td>
                    <td class="amount-cell" data-value="${payment.totalAmount}">${payment.totalAmount || '-'}</td>
                    <td class="account-cell" data-value="${payment.accountId}" data-name="${accountCell}">${accountCell}</td>
                    <td class="type-cell" data-value="${payment.operationTypeId}">${typeNames[payment.operationTypeId] || payment.operationTypeId || '-'}</td>
                    <td class="category-cell" data-value="${payment.categoryId}" data-name="${categoryCell}">${categoryCell}</td>
                    <td class="comment-cell" data-value="${payment.comment || ''}">${payment.comment || '-'}</td>
                    <td class="marketplace-cell" data-value="${payment.marketplaceId || ''}" data-name="${marketplaceCell}">${marketplaceCell}</td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            tableBody.innerHTML = '<tr><td colspan="8">Нет данных для отображения</td></tr>';
        }
    }

    function enableEditMode() {
        isEditMode = true;
        table.classList.add('edit-mode');
        editButton.textContent = 'Сохранить';
        editButton.classList.add('save-mode');

        // Делаем ячейки редактируемыми
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach((row, rowIndex) => {
            const cells = row.querySelectorAll('td');
            
            // Добавляем обработчик двойного клика на ID для удаления
            const idCell = cells[0];
            idCell.style.cursor = 'pointer';
            idCell.addEventListener('dblclick', function() {
                if (row.dataset.deleted === 'true') {
                    // Восстанавливаем запись
                    row.dataset.deleted = 'false';
                    idCell.innerHTML = row.dataset.id;
                    idCell.style.color = 'black';
                } else {
                    // Помечаем запись как удаленную
                    row.dataset.deleted = 'true';
                    idCell.innerHTML = '✕';
                    idCell.style.color = 'red';
                    idCell.style.fontSize = '20px';
                    idCell.style.fontWeight = 'bold';
                }
            });
            
            // Пропускаем ID ячейку (индекс 0)
            for (let i = 1; i < cells.length; i++) {
                const cell = cells[i];
                const value = cell.dataset.value || cell.textContent;
                
                if (i === 1) { // Дата
                    const dateValue = new Date(cell.dataset.value).toISOString().split('T')[0];
                    cell.innerHTML = `<input type="date" value="${dateValue}">`;
                } else if (i === 2) { // Сумма
                    cell.innerHTML = `<input type="number" step="0.01" value="${value}">`;
                } else if (i === 3) { // Счет
                    const accountId = cell.dataset.value;
                    let selectHtml = '<select>';
                    accountsData.forEach(acc => {
                        const selected = acc.id == accountId ? 'selected' : '';
                        selectHtml += `<option value="${acc.id}" ${selected}>${acc.name}</option>`;
                    });
                    selectHtml += '</select>';
                    cell.innerHTML = selectHtml;
                } else if (i === 4) { // Тип
                    const typeId = cell.dataset.value;
                    let selectHtml = '<select>';
                    selectHtml += `<option value="1" ${typeId == 1 ? 'selected' : ''}>Расход</option>`;
                    selectHtml += `<option value="2" ${typeId == 2 ? 'selected' : ''}>Доход</option>`;
                    selectHtml += '</select>';
                    cell.innerHTML = selectHtml;
                } else if (i === 5) { // Категория
                    const categoryId = cell.dataset.value;
                    let selectHtml = '<select>';
                    categoriesData.forEach(cat => {
                        const selected = cat.id == categoryId ? 'selected' : '';
                        selectHtml += `<option value="${cat.id}" ${selected}>${cat.name}</option>`;
                    });
                    selectHtml += '</select>';
                    cell.innerHTML = selectHtml;
                } else if (i === 6) { // Описание
                    cell.innerHTML = `<textarea>${value}</textarea>`;
                } else if (i === 7) { // Маркетплейс
                    const marketplaceId = cell.dataset.value;
                    let selectHtml = '<select>';
                    selectHtml += '<option value="">Нет</option>';
                    marketplacesData.forEach(mp => {
                        const selected = mp.id == marketplaceId ? 'selected' : '';
                        selectHtml += `<option value="${mp.id}" ${selected}>${mp.name}</option>`;
                    });
                    selectHtml += '</select>';
                    cell.innerHTML = selectHtml;
                }
            }
        });
    }

    function saveChanges() {
        isEditMode = false;
        table.classList.remove('edit-mode');
        editButton.textContent = 'Редактировать';
        editButton.classList.remove('save-mode');

        // Собираем измененные данные и удаленные записи
        const rows = table.querySelectorAll('tbody tr');
        const changedOperations = [];

        rows.forEach((row, rowIndex) => {
            const id = parseInt(row.dataset.id);
            const cells = row.querySelectorAll('td');
            
            // Проверяем, помечена ли запись как удаленная
            if (row.dataset.deleted === 'true') {
                // Отправляем запись с nextId = null (удаленная)
                changedOperations.push({
                    id: id,
                    deleted: true
                });
                return;
            }
            
            const dateInput = cells[1].querySelector('input[type="date"]');
            const amountInput = cells[2].querySelector('input[type="number"]');
            const accountSelect = cells[3].querySelector('select');
            const typeSelect = cells[4].querySelector('select');
            const categorySelect = cells[5].querySelector('select');
            const commentInput = cells[6].querySelector('textarea');
            const marketplaceSelect = cells[7].querySelector('select');

            const newData = {
                id: id,
                dateTime: dateInput ? dateInput.value + 'T12:00:00' : originalData[rowIndex].dateTime,
                totalAmount: amountInput ? parseFloat(amountInput.value) : originalData[rowIndex].totalAmount,
                accountId: accountSelect ? parseInt(accountSelect.value) : originalData[rowIndex].accountId,
                operationTypeId: typeSelect ? parseInt(typeSelect.value) : originalData[rowIndex].operationTypeId,
                categoryId: categorySelect ? parseInt(categorySelect.value) : originalData[rowIndex].categoryId,
                comment: commentInput ? commentInput.value : originalData[rowIndex].comment,
                marketplaceId: marketplaceSelect && marketplaceSelect.value ? parseInt(marketplaceSelect.value) : null
            };

            // Проверяем, изменилась ли запись
            if (hasChanged(originalData[rowIndex], newData)) {
                changedOperations.push(newData);
            }
        });

        if (changedOperations.length > 0) {
            // Отправляем измененные операции на сервер
            sendChangesToServer(changedOperations);
        } else {
            // Перезагружаем данные
            loadFuturePayments();
        }
    }

    function hasChanged(original, updated) {
        return original.dateTime !== updated.dateTime ||
               original.totalAmount !== updated.totalAmount ||
               original.accountId !== updated.accountId ||
               original.operationTypeId !== updated.operationTypeId ||
               original.categoryId !== updated.categoryId ||
               original.comment !== updated.comment ||
               original.marketplaceId !== updated.marketplaceId;
    }

    function sendChangesToServer(changedOperations) {
        fetch('/api/operations/update-batch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(changedOperations)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            console.log('Success:', result);
            loadFuturePayments();
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`Ошибка при сохранении: ${error.message}`);
            loadFuturePayments();
        });
    }
});
