document.addEventListener('DOMContentLoaded', function() {
    // Получаем элементы DOM
    const operationForm = document.getElementById('operationForm');
    const operationsTableBody = document.querySelector('#operationsTable tbody');

    // Загрузка данных при открытии
    loadCategories();
            loadOperations();
    loadMarketplaces();

    // Обработчик отправки формы
    operationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        createOperation();
    });

    // Функция загрузки категорий
    async function loadCategories() {
        try {
            const response = await fetch('/api/categories');
            if (!response.ok) throw new Error('Ошибка загрузки категорий');
            const categories = await response.json();

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

    // Функция загрузки маркетплейсов
    async function loadMarketplaces() {
        try {
            const response = await fetch('/api/marketplaces');
            if (!response.ok) throw new Error('Ошибка загрузки маркетплейсов');
            const marketplaces = await response.json();

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
            renderOperations(operations);
        } catch (error) {
            console.error('Error loading operations:', error);
            operationsTableBody.innerHTML = `<tr><td colspan="6">Ошибка загрузки: ${error.message}</td></tr>`;
        }
    }

    // Функция отрисовки данных
    function renderOperations(operations) {
        operationsTableBody.innerHTML = '';
        const typeNames = {1: 'Расход', 2: 'Доход', 3: 'Перевод'};
        const marketplaceNames = {}; // This would need to be populated from loadMarketplaces data

        if (operations && operations.length > 0) {
            operations.forEach(op => {
                const row = document.createElement('tr');
                const marketplaceCell = op.marketplaceId ? (marketplaceNames[op.marketplaceId] || op.marketplaceId) : '-';
                row.innerHTML = `
                    <td>${new Date(op.dateTime).toLocaleDateString() || '-'}</td>
                    <td>${op.totalAmount || '-'}</td>
                    <td>${typeNames[op.operationTypeId] || op.operationTypeId || '-'}</td>
                    <td>${op.categoryIds?.[0] || '-'}</td>
                    <td>${op.comment || '-'}</td>
                    <td>${marketplaceCell}</td>
                `;
                operationsTableBody.appendChild(row);
});
        } else {
            operationsTableBody.innerHTML = '<tr><td colspan="6">Нет данных для отображения</td></tr>';
        }
    }

    // Функция создания операции
    async function createOperation() {
        const categorySelect = document.getElementById('operationCategory');
        const categoryId = categorySelect.value;

        if (!categoryId) {
            alert('Пожалуйста, выберите категорию');
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
            accountId: 1, // TODO: нужно добавить выбор счета
            marketplaceId: marketplaceId ? parseInt(marketplaceId) : null,
            operationTypeId: parseInt(document.getElementById('operationType').value),
            categoryIds: [parseInt(categoryId)]
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
