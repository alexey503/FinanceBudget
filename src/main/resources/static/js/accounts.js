document.addEventListener('DOMContentLoaded', function() {
    const toggleFormBtn = document.getElementById('toggleFormBtn');
    const accountFormContainer = document.getElementById('accountFormContainer');
    const accountForm = document.getElementById('accountForm');
    const accountsTable = document.getElementById('accountsTable');
    const editButton = document.getElementById('editButton');
    const table = document.getElementById('accountsTable');
    
    let isEditMode = false;
    let originalData = [];

    // Загрузка данных при открытии
    loadAccounts();

    // Обработчик кнопки "Добавить новый"
    toggleFormBtn.addEventListener('click', function() {
        accountFormContainer.style.display = accountFormContainer.style.display === 'none' ? 'block' : 'none';
    });

    // Обработчик отправки формы
    accountForm.addEventListener('submit', function(e) {
        e.preventDefault();
        createAccount();
    });

    // Обработчик кнопки редактирования
    editButton.addEventListener('click', function() {
        if (!isEditMode) {
            enableEditMode();
        } else {
            saveChanges();
        }
    });

    function loadAccounts() {
        try {
            fetch('/api/accounts')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(accounts => {
                    originalData = JSON.parse(JSON.stringify(accounts));
                    renderAccounts(accounts);
                })
                .catch(error => {
                    console.error('Error loading accounts:', error);
                    const tableBody = document.querySelector('#accountsTable tbody');
                    tableBody.innerHTML = `<tr><td colspan="5">Ошибка загрузки: ${error.message}</td></tr>`;
                });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function renderAccounts(accounts) {
        const tableBody = document.querySelector('#accountsTable tbody');
        tableBody.innerHTML = '';

        if (accounts && accounts.length > 0) {
            accounts.forEach((account, index) => {
                const row = document.createElement('tr');
                row.dataset.index = index;
                row.dataset.id = account.id;
                
                row.innerHTML = `
                    <td class="id-cell">${account.id || '-'}</td>
                    <td class="name-cell" data-value="${account.name}">${account.name || '-'}</td>
                    <td class="balance-cell" data-value="${account.balance}">${account.balance || '-'}</td>
                    <td class="type-cell" data-value="${account.accountType}">${account.accountType || '-'}</td>
                    <td class="number-cell" data-value="${account.accountNumber}">${account.accountNumber || '-'}</td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            tableBody.innerHTML = '<tr><td colspan="5">Нет данных для отображения</td></tr>';
        }
    }

    function enableEditMode() {
        isEditMode = true;
        table.classList.add('edit-mode');
        editButton.textContent = 'Сохранить';
        editButton.classList.add('save-mode');

        const rows = table.querySelectorAll('tbody tr');
        rows.forEach((row, rowIndex) => {
            const cells = row.querySelectorAll('td');
            
            // Добавляем обработчик двойного клика на ID для удаления
            const idCell = cells[0];
            idCell.style.cursor = 'pointer';
            idCell.addEventListener('dblclick', function() {
                if (row.dataset.deleted === 'true') {
                    row.dataset.deleted = 'false';
                    idCell.innerHTML = row.dataset.id;
                    idCell.style.color = 'black';
                } else {
                    row.dataset.deleted = 'true';
                    idCell.innerHTML = '✕';
                    idCell.style.color = 'red';
                    idCell.style.fontSize = '20px';
                    idCell.style.fontWeight = 'bold';
                }
            });
            
            // Делаем остальные ячейки редактируемыми
            for (let i = 1; i < cells.length; i++) {
                const cell = cells[i];
                const value = cell.dataset.value || cell.textContent;
                
                if (i === 2) { // Balance
                    cell.innerHTML = `<input type="number" step="0.01" value="${value}">`;
                } else {
                    cell.innerHTML = `<input type="text" value="${value}">`;
                }
            }
        });
    }

    function saveChanges() {
        isEditMode = false;
        table.classList.remove('edit-mode');
        editButton.textContent = 'Редактировать';
        editButton.classList.remove('save-mode');

        const rows = table.querySelectorAll('tbody tr');
        const changedAccounts = [];

        rows.forEach((row, rowIndex) => {
            const id = parseInt(row.dataset.id);
            const cells = row.querySelectorAll('td');
            
            if (row.dataset.deleted === 'true') {
                changedAccounts.push({
                    id: id,
                    deleted: true
                });
                return;
            }
            
            const nameInput = cells[1].querySelector('input');
            const balanceInput = cells[2].querySelector('input');
            const typeInput = cells[3].querySelector('input');
            const numberInput = cells[4].querySelector('input');

            const newData = {
                id: id,
                name: nameInput ? nameInput.value : originalData[rowIndex].name,
                balance: balanceInput ? parseFloat(balanceInput.value) : originalData[rowIndex].balance,
                accountType: typeInput ? typeInput.value : originalData[rowIndex].accountType,
                accountNumber: numberInput ? numberInput.value : originalData[rowIndex].accountNumber
            };

            if (hasChanged(originalData[rowIndex], newData)) {
                changedAccounts.push(newData);
            }
        });

        if (changedAccounts.length > 0) {
            sendChangesToServer(changedAccounts);
        } else {
            loadAccounts();
        }
    }

    function hasChanged(original, updated) {
        return original.name !== updated.name ||
               original.balance !== updated.balance ||
               original.accountType !== updated.accountType ||
               original.accountNumber !== updated.accountNumber;
    }

    function sendChangesToServer(changedAccounts) {
        fetch('/api/accounts/update-batch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(changedAccounts)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            console.log('Success:', result);
            loadAccounts();
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`Ошибка при сохранении: ${error.message}`);
            loadAccounts();
        });
    }

    function createAccount() {
        const accountData = {
            name: document.getElementById('accountName').value,
            balance: parseFloat(document.getElementById('accountBalance').value),
            accountType: document.getElementById('accountType').value,
            accountNumber: document.getElementById('accountNumber').value
        };

        try {
            fetch('/api/accounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(accountData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(result => {
                console.log('Success:', result);
                loadAccounts();
                accountForm.reset();
                accountFormContainer.style.display = 'none';
            })
            .catch(error => {
                console.error('Error:', error);
                alert(`Ошибка при создании счета: ${error.message}`);
            });
        } catch (error) {
            console.error('Error:', error);
            alert(`Ошибка при создании счета: ${error.message}`);
        }
    }
});
