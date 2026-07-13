--select * from budget_main_operation
select id, next_id, comment, date_time, total_amount from budget_main_operation order by id
select budget_main_operation.account_id, category_id, * from budget_main_operation;

update budget_main_operation set category_id = 4 where id in (8,9,10)
update budget_main_operation set account_id = 3 where id in (3,4,5)
delete from budget_main_operation where id = 19

-- Инициализация поля NextId: для всех операций nextId = id
update budget_main_operation set next_id = id;
update budget_main_operation set total_amount = 444 where id = 21

select * from budget_main_operation where id = 7

-- Копирование операции с id=7 в новую запись (без указания id, чтобы БД сгенерировала новый)
-- Новая запись получит nextId = id старой записи (7)
insert into budget_main_operation (next_id, date_time, total_amount, comment, receipt_id, account_id, marketplace_id, operation_type_id, special_type_id, category_id)
select 7, date_time, total_amount, comment, receipt_id, account_id, marketplace_id, operation_type_id, special_type_id, category_id
from budget_main_operation where id = 7;


