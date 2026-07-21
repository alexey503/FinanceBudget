document.addEventListener('DOMContentLoaded', function() {
    const toggleFormBtn = document.getElementById('toggleFormBtn');
    const marketplaceFormContainer = document.getElementById('marketplaceFormContainer');
    const marketplaceForm = document.getElementById('marketplaceForm');
    const marketplacesTable = document.getElementById('marketplacesTable');
    const editButton = document.getElementById('editButton');
    const table = document.getElementById('marketplacesTable');
    const marketplaceTypeSelect = document.getElementById('marketplaceType');
    const customTypeInput = document.getElementById('customType');
    
    let isEditMode = false;
    let originalData = [];

    // Загрузка данных при открытии
    loadMarketplaces();

    // Обработчик кнопки "Добавить новый"
    toggleFormBtn.addEventListener('click', function() {
        marketplaceFormContainer.style.display = marketplaceFormContainer.style.display === 'none' ? 'block' : 'none';
    });

    // Обработчик выбора типа маркетплейса
    marketplaceTypeSelect.addEventListener('change', function() {
        if (this.value === 'Другой') {
            customTypeInput.style.display = 'block';
        } else {
            customTypeInput.style.display = 'none';
        }
    });

    // Обработчик отправки формы
    marketplaceForm.addEventListener('submit', function(e) {
        e.preventDefault();
        createMarketplace();
    });

    // Обработчик кнопки редактирования
    editButton.addEventListener('click', function() {
        if (!isEditMode) {
            enableEditMode();
        } else {
            saveChanges();
        }
    });

    function loadMarketplaces() {
        try {
            fetch('/api/marketplaces')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(marketplaces => {
                    originalData = JSON.parse(JSON.stringify(marketplaces));
                    renderMarketplaces(marketplaces);
                })
                .catch(error => {
                    console.error('Error loading marketplaces:', error);
                    const tableBody = document.querySelector('#marketplacesTable tbody');
                    tableBody.innerHTML = `<tr><td colspan="6">Ошибка загрузки: ${error.message}</td></tr>`;
                });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function renderMarketplaces(marketplaces) {
        const tableBody = document.querySelector('#marketplacesTable tbody');
        tableBody.innerHTML = '';

        if (marketplaces && marketplaces.length > 0) {
            marketplaces.forEach((marketplace, index) => {
                const row = document.createElement('tr');
                row.dataset.index = index;
                row.dataset.id = marketplace.id;
                
                row.innerHTML = `
                    <td class="id-cell">${marketplace.id || '-'}</td>
                    <td class="name-cell" data-value="${marketplace.name}">${marketplace.name || '-'}</td>
                    <td class="comment-cell" data-value="${marketplace.comment || ''}">${marketplace.comment || '-'}</td>
                    <td class="web-cell" data-value="${marketplace.web || ''}">${marketplace.web || '-'}</td>
                    <td class="type-cell" data-value="${marketplace.type}">${marketplace.type || '-'}</td>
                    <td class="discount-cell" data-value="${marketplace.discountCard || ''}">${marketplace.discountCard || '-'}</td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            tableBody.innerHTML = '<tr><td colspan="6">Нет данных для отображения</td></tr>';
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
                
                if (i === 2) { // Comment
                    cell.innerHTML = `<textarea>${value}</textarea>`;
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
        const changedMarketplaces = [];

        rows.forEach((row, rowIndex) => {
            const id = parseInt(row.dataset.id);
            const cells = row.querySelectorAll('td');
            
            if (row.dataset.deleted === 'true') {
                changedMarketplaces.push({
                    id: id,
                    deleted: true
                });
                return;
            }
            
            const nameInput = cells[1].querySelector('input');
            const commentInput = cells[2].querySelector('textarea');
            const webInput = cells[3].querySelector('input');
            const typeInput = cells[4].querySelector('input');
            const discountInput = cells[5].querySelector('input');

            const newData = {
                id: id,
                name: nameInput ? nameInput.value : originalData[rowIndex].name,
                comment: commentInput ? commentInput.value : originalData[rowIndex].comment,
                web: webInput ? webInput.value : originalData[rowIndex].web,
                type: typeInput ? typeInput.value : originalData[rowIndex].type,
                discountCard: discountInput ? discountInput.value : originalData[rowIndex].discountCard
            };

            if (hasChanged(originalData[rowIndex], newData)) {
                changedMarketplaces.push(newData);
            }
        });

        if (changedMarketplaces.length > 0) {
            sendChangesToServer(changedMarketplaces);
        } else {
            loadMarketplaces();
        }
    }

    function hasChanged(original, updated) {
        return original.name !== updated.name ||
               original.comment !== updated.comment ||
               original.web !== updated.web ||
               original.type !== updated.type ||
               original.discountCard !== updated.discountCard;
    }

    function sendChangesToServer(changedMarketplaces) {
        fetch('/api/marketplaces/update-batch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(changedMarketplaces)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            console.log('Success:', result);
            loadMarketplaces();
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`Ошибка при сохранении: ${error.message}`);
            loadMarketplaces();
        });
    }

    function createMarketplace() {
        const type = document.getElementById('marketplaceType').value;
        const finalType = type === 'Другой' ? document.getElementById('customType').value : type;

        const marketplaceData = {
            name: document.getElementById('marketplaceName').value,
            comment: document.getElementById('marketplaceComment').value,
            web: document.getElementById('marketplaceWeb').value,
            type: finalType,
            discountCard: document.getElementById('marketplaceDiscountCard').value
        };

        try {
            fetch('/api/marketplaces', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(marketplaceData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(result => {
                console.log('Success:', result);
                loadMarketplaces();
                marketplaceForm.reset();
                marketplaceFormContainer.style.display = 'none';
                customTypeInput.style.display = 'none';
            })
            .catch(error => {
                console.error('Error:', error);
                alert(`Ошибка при создании маркетплейса: ${error.message}`);
            });
        } catch (error) {
            console.error('Error:', error);
            alert(`Ошибка при создании маркетплейса: ${error.message}`);
        }
    }
});
