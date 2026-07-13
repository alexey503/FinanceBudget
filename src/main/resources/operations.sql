--select * from budget_main_operation
select budget_main_operation.account_id, category_id, * from budget_main_operation;

update budget_main_operation set category_id = 4 where id in (8,9,10)
update budget_main_operation set account_id = 3 where id in (3,4,5)
delete from budget_main_operation where id = 19
