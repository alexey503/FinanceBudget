CREATE DATABASE finance_db;
CREATE USER finance_user WITH PASSWORD 'finance_pass';
GRANT ALL PRIVILEGES ON DATABASE finance_db TO finance_user;

select * from budget_main_operation
select * from marketplace
