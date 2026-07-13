document.addEventListener('DOMContentLoaded', function() {
    // Получаем элементы DOM
    const operationForm = document.getElementById('operationForm');
    const operationsTableBody = document.querySelector('#operationsTable tbody');
    const editButton = document.getElementById('editButton');
    const table = document.getElementById('operationsTable');
    
    let isEditMode = false;
    let originalData = [];
    let categoriesData = [];
    let accountsData = [];
    let marketplacesData = [];

    // Загрузка данных при открытии
    loadCategories();
    loadAccounts();
    loadOperations();
    loadMarketplaces();

    // Обработчик отправки формы
    operationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        createOperation();
    });

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
            const categories = await response.json();
            categoriesData = categories;

            const select = document.getElementById('operationCategory');
            select.innerHTML = '';
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                select.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading categories:', error);
            document.getElementById('operationCategory').innerHTML =
                '<option value="">Ошибка загрузки категорий</option>';
        }
    }

    // Функция загрузки счетов
    async function loadAccounts() {
        try {
            const response = await fetch('/api/accounts');
            if (!response.ok) throw new Error('Ошибка загрузки счетов');
            const accounts = await response.json();
            accountsData = accounts;

            const select = document.getElementById('operationAccount');
            select.innerHTML = '';
            accounts.forEach(acc => {
                const option = document.createElement('option');
                option.value = acc.id;
                option.textContent = acc.name;
                select.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading accounts:', error);
            document.getElementById('operationAccount').innerHTML =
                '<option value="">Ошибка загрузки счетов</option>';
        }
    }

    // Функция загрузки маркетплейсов
    async function loadMarketplaces() {
        try {
            const response = await fetch('/api/marketplaces');
            if (!response.ok) throw new Error('Ошибка загрузки маркетплейсов');
            const marketplaces = await response.json();
            marketplacesData = marketplaces;

            const select = document.getElementById('operationMarketplace');
            marketplaces.forEach(mp => {
                const option = document.createElement('option');
                option.value = mp.id;
                option.textContent = mp.name;
                select.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading marketplaces:', error);
        }
    }

    // Функция загрузки данных
    async function loadOperations() {
        try {
            const response = await fetch('/api/operations');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const operations = await response.json();
            originalData = JSON.parse(JSON.stringify(operations)); // Глубокая копия
            renderOperations(operations);
        } catch (error) {
            console.error('Error loading operations:', error);
            operationsTableBody.innerHTML = `<tr><td colspan="8">Ошибка загрузки: ${error.message}</td></tr>`;
        }
    }

    // Функция отрисовки данных
    function renderOperations(operations) {
        operationsTableBody.innerHTML = '';
        const typeNames = {1: 'Расход', 2: 'Доход'};

        if (operations && operations.length > 0) {
            operations.forEach((op, index) => {
                const row = document.createElement('tr');
                row.dataset.index = index;
                row.dataset.id = op.id;
                
                const marketplaceCell = op.marketplaceName ? op.marketplaceName : '-';
                const categoryCell = op.categoryName ? op.categoryName : '-';
                const accountCell = op.account ? op.account.name : '-';
                
                row.innerHTML = `
                    <td class="id-cell">${op.id || '-'}</td>
                    <td class="date-cell" data-value="${op.dateTime}">${new Date(op.dateTime).toLocaleDateString() || '-'}</td>
                    <td class="amount-cell" data-value="${op.totalAmount}">${op.totalAmount || '-'}</td>
                    <td class="account-cell" data-value="${op.accountId}" data-name="${accountCell}">${accountCell}</td>
                    <td class="type-cell" data-value="${op.operationTypeId}">${typeNames[op.operationTypeId] || op.operationTypeId || '-'}</td>
                    <td class="category-cell" data-value="${op.categoryId}" data-name="${categoryCell}">${categoryCell}</td>
                    <td class="comment-cell" data-value="${op.comment || ''}">${op.comment || '-'}</td>
                    <td class="marketplace-cell" data-value="${op.marketplaceId || ''}" data-name="${marketplaceCell}">${marketplaceCell}</td>
                `;
                operationsTableBody.appendChild(row);
            });
        } else {
            operationsTableBody.innerHTML = '<tr><td colspan="8">Нет данных для отображения</td></tr>';
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
                    const typeNames = {1: 'Расход', 2: 'Доход'};
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

        // Собираем измененные данные
        const rows = table.querySelectorAll('tbody tr');
        const changedOperations = [];

        rows.forEach((row, rowIndex) => {
            const id = parseInt(row.dataset.id);
            const cells = row.querySelectorAll('td');
            
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
            loadOperations();
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
            loadOperations();
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`Ошибка при сохранении: ${error.message}`);
            loadOperations();
        });
    }

    // Функция создания операции
    async function createOperation() {
        const categorySelect = document.getElementById('operationCategory');
        const categoryId = categorySelect.value;

        if (!categoryId) {
            alert('Пожалуйста, выберите категорию');
            return;
        }
        const accountSelect = document.getElementById('operationAccount');
        const accountId = accountSelect.value;

        if (!accountId) {
            alert('Пожалуйста, выберите счет');
            return;
        }
        const marketplaceSelect = document.getElementById('operationMarketplace');
        const marketplaceId = marketplaceSelect.value;
        const dateStr = document.getElementById('operationDate').value;
        const timeStr = document.getElementById('operationTime').value;

        const operationData = {
            dateTime: `${dateStr}T${timeStr}:00`, // Формат: "YYYY-MM-DDTHH:MM:00"
            totalAmount: parseFloat(document.getElementById('operationAmount').value),
            comment: document.getElementById('operationDescription').value,
            accountId: parseInt(accountId),
            marketplaceId: marketplaceId ? parseInt(marketplaceId) : null,
            operationTypeId: parseInt(document.getElementById('operationType').value),
            categoryId: parseInt(categoryId)
        };

        try {
            const response = await fetch('/api/operations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(operationData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Success:', result);

            // Обновляем список и сбрасываем форму
            loadOperations();
            operationForm.reset();
        } catch (error) {
            console.error('Error:', error);
            alert(`Ошибка при создании операции: ${error.message}`);
        }
    }
});
