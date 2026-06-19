// SQL Master Class Hub - SQL Practice Questions Database & Evaluator

const MOCK_INTERVIEW_QUESTIONS = {
  setup: [
    { id: "set_q1", q: "What is SQL and why is it used?", keywords: ["structured", "query", "language", "relational", "database", "rdbms"], answer: "SQL stands for Structured Query Language. It is the standard programming language used to communicate with, query, update, and manage relational database management systems (RDBMS) like MySQL, PostgreSQL, and SQL Server." },
    { id: "set_q2", q: "Explain the difference between SQL and MySQL.", keywords: ["language", "rdbms", "database", "open-source", "standard"], answer: "SQL is the standard language used to write queries. MySQL is an open-source relational database management system (RDBMS) that executes those SQL queries to retrieve and manage stored data." },
    { id: "set_q3", q: "How do you verify if MySQL is running on a Linux system?", keywords: ["systemctl", "status", "mysql", "service", "active"], answer: "We verify the status of the MySQL service using systemctl: run the command `sudo systemctl status mysql` or `sudo service mysql status` to check if it is active (running)." },
    { id: "set_q4", q: "What is a MySQL Notebook and how does it help in development?", keywords: ["notebook", "interactive", "code", "markdown", "results"], answer: "A MySQL Notebook (like in MySQL Workbench or VS Code) integrates SQL code, markdown text, and query results in an interactive document, allowing developers to test and document queries step-by-step." },
    { id: "set_q5", q: "What port does MySQL run on by default?", keywords: ["3306", "port", "default"], answer: "MySQL runs on port 3306 by default." },
    { id: "set_q6", q: "How do you connect to MySQL server from the command line?", keywords: ["mysql -u", "mysql -h", "-p", "username", "password"], answer: "We connect using the CLI command: `mysql -u [username] -p` which then prompts for the account password." },
    { id: "set_q7", q: "What is a relational database management system (RDBMS)?", keywords: ["rdbms", "tables", "rows", "columns", "primary key", "foreign key"], answer: "An RDBMS stores data in tables linked by keys (primary and foreign keys). It enforces relational constraints and integrity rules to manage data relationships." },
    { id: "set_q8", q: "How do you install MySQL client on Ubuntu?", keywords: ["apt-get", "install", "mysql-client", "ubuntu"], answer: "We run: `sudo apt-get update` followed by `sudo apt-get install mysql-client` to download and install the client package." },
    { id: "set_q9", q: "What is SQL schema?", keywords: ["schema", "logical", "structure", "metadata", "tables"], answer: "A schema is the logical container defining tables, columns, indexes, data types, constraints, and relationships that structure the database." },
    { id: "set_q10", q: "Explain why client tools like DBeaver or MySQL Workbench are used.", keywords: ["gui", "client", "visualize", "query editor", "connections"], answer: "They provide Graphical User Interfaces (GUIs) to manage database connections, browse tables, visualize relationships, and write queries in a syntax-highlighted editor." }
  ],
  fundamentals: [
    { id: "fund_q1", q: "Explain the command types DDL, DML, TCL, and DCL with examples.", keywords: ["ddl", "dml", "tcl", "dcl", "create", "select", "commit", "grant"], answer: "DDL (Data Definition) structures tables (CREATE, ALTER). DML (Data Manipulation) queries and edits rows (SELECT, INSERT, UPDATE, DELETE). TCL (Transaction Control) manages state (COMMIT, ROLLBACK). DCL (Data Control) controls permissions (GRANT, REVOKE)." },
    { id: "fund_q2", q: "What does CRUD stand for in database systems?", keywords: ["create", "read", "update", "delete", "insert", "select"], answer: "CRUD stands for Create (INSERT), Read (SELECT), Update (UPDATE), and Delete (DELETE) operations, representing the basic data management queries." },
    { id: "fund_q3", q: "What is the difference between TRUNCATE and DELETE commands?", keywords: ["truncate", "delete", "ddl", "dml", "rollback", "where"], answer: "DELETE is a DML command that removes rows one by one based on a WHERE clause and can be rolled back. TRUNCATE is a DDL command that deletes all rows by deallocating table pages, runs much faster, cannot use WHERE, and cannot be rolled back in MySQL." },
    { id: "fund_q4", q: "Explain ACID properties in database transactions.", keywords: ["atomicity", "consistency", "isolation", "durability", "transaction"], answer: "ACID properties guarantee reliability: Atomicity (All-or-nothing execution), Consistency (Transitions from valid to valid state), Isolation (Transactions do not interfere), and Durability (Committed data persists permanently)." },
    { id: "fund_q5", q: "How do you create a table by copying the structure and data of another table?", keywords: ["create table", "as select", "like"], answer: "We use: `CREATE TABLE new_table AS SELECT * FROM old_table;` which copies both the table structure and data rows." },
    { id: "fund_q6", q: "How do you copy only the table structure without any data?", keywords: ["create table", "like", "where 1=0"], answer: "We use: `CREATE TABLE new_table LIKE old_table;` or `CREATE TABLE new_table AS SELECT * FROM old_table WHERE 1=0;`." },
    { id: "fund_q7", q: "How do you add a new column to an existing table in SQL?", keywords: ["alter table", "add", "column", "datatype"], answer: "We run: `ALTER TABLE table_name ADD column_name datatype;`." },
    { id: "fund_q8", q: "How do you rename an existing column in a table?", keywords: ["alter table", "rename column", "to"], answer: "We run: `ALTER TABLE table_name RENAME COLUMN old_name TO new_name;`." },
    { id: "fund_q9", q: "What is the difference between DROP and TRUNCATE?", keywords: ["drop", "truncate", "structure", "schema", "rows"], answer: "DROP deletes both the data rows AND the table structure from the database. TRUNCATE deletes only the data rows, keeping the table structure intact." },
    { id: "fund_q10", q: "How do you change the data type of an existing column?", keywords: ["alter table", "modify", "alter column", "change"], answer: "In MySQL, we run: `ALTER TABLE table_name MODIFY COLUMN column_name new_datatype;`." },
    { id: "fund_q11", q: "Explain the UPDATE statement syntax.", keywords: ["update", "set", "where", "condition"], answer: "We write: `UPDATE table_name SET col1 = val1 WHERE condition;`. Omitting the WHERE clause updates all rows in the table." },
    { id: "fund_q12", q: "What is a transaction in RDBMS?", keywords: ["transaction", "unit of work", "commit", "rollback"], answer: "A transaction is a single logical unit of work containing multiple SQL queries that must either all succeed (COMMIT) or all fail (ROLLBACK) together." },
    { id: "fund_q13", q: "Explain isolation levels in SQL transactions.", keywords: ["isolation", "read uncommitted", "read committed", "repeatable read", "serializable"], answer: "Isolation levels control transaction visibility. The four standard levels are Read Uncommitted, Read Committed, Repeatable Read (MySQL default), and Serializable (strictest)." },
    { id: "fund_q14", q: "What is dirty read, non-repeatable read, and phantom read?", keywords: ["dirty read", "non-repeatable read", "phantom read", "uncommitted", "concurrent"], answer: "A dirty read is reading uncommitted concurrent data. A non-repeatable read is reading modified row values. A phantom read is reading newly inserted rows inside a transaction." },
    { id: "fund_q15", q: "How do you delete rows based on specific conditions?", keywords: ["delete from", "where", "condition"], answer: "We write: `DELETE FROM table_name WHERE condition;`." }
  ],
  keys: [
    { id: "key_q1", q: "What is a constraint in SQL and name common SQL constraints.", keywords: ["constraint", "primary key", "foreign key", "unique", "not null", "check", "default"], answer: "Constraints enforce data integrity. Common constraints are NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK, and DEFAULT." },
    { id: "key_q2", q: "Explain the difference between a Primary Key and a Unique Key.", keywords: ["primary key", "unique", "null", "one", "multiple"], answer: "A table can have only one Primary Key, which uniquely identifies rows and cannot contain NULL values. A table can have multiple Unique Keys, which also enforce uniqueness but allow NULL values." },
    { id: "key_q3", q: "What is a Foreign Key and how does it enforce referential integrity?", keywords: ["foreign key", "primary key", "parent", "child", "referential integrity"], answer: "A Foreign Key is a column in a child table pointing to a Primary Key in a parent table, ensuring that child rows must link to valid parent rows." },
    { id: "key_q4", q: "Explain Super Key, Candidate Key, and Primary Key.", keywords: ["super key", "candidate key", "primary key", "minimal", "uniquely identify"], answer: "A Super Key is any set of columns that uniquely identifies rows. A Candidate Key is a minimal Super Key (no redundant columns). The Primary Key is the candidate key selected to represent the table." },
    { id: "key_q5", q: "What is the difference between a Surrogate Key and a Natural Key?", keywords: ["surrogate key", "natural key", "auto-increment", "business meaning", "id"], answer: "A Natural Key is a column with inherent business meaning (like SSN or Email). A Surrogate Key is a system-generated ID with no business meaning (like auto-increment integers)." },
    { id: "key_q6", q: "What is database Normalization and why is it performed?", keywords: ["normalization", "redundancy", "anomaly", "insert", "update", "delete"], answer: "Normalization structures tables to minimize data redundancy and prevent anomalies during inserts, updates, and deletes." },
    { id: "key_q7", q: "Explain the rules for First Normal Form (1NF).", keywords: ["1nf", "atomic", "single value", "duplicate"], answer: "1NF requires that columns only store atomic (single) values and that there are no repeating groups or duplicate rows." },
    { id: "key_q8", q: "Explain the rules for Second Normal Form (2NF).", keywords: ["2nf", "1nf", "partial dependency", "composite key"], answer: "2NF requires the table to be in 1NF and removes partial dependencies, meaning non-key columns must depend on the entire composite primary key." },
    { id: "key_q9", q: "Explain the rules for Third Normal Form (3NF).", keywords: ["3nf", "2nf", "transitive dependency", "non-key"], answer: "3NF requires the table to be in 2NF and removes transitive dependencies, meaning non-key columns cannot depend on other non-key columns." },
    { id: "key_q10", q: "What is Boyce-Codd Normal Form (BCNF)?", keywords: ["bcnf", "3nf", "candidate key", "determinant"], answer: "BCNF is a stricter version of 3NF. It requires that for every functional dependency A -> B, the determinant A must be a candidate key." }
  ],
  querying: [
    { id: "qur_q1", q: "Explain the execution order of clauses in a SQL SELECT statement.", keywords: ["from", "join", "where", "group by", "having", "select", "order by", "limit"], answer: "The logical execution order is: 1. FROM (and JOINs), 2. WHERE, 3. GROUP BY, 4. HAVING, 5. SELECT, 6. ORDER BY, 7. LIMIT." },
    { id: "qur_q2", q: "What is the difference between WHERE and HAVING clauses?", keywords: ["where", "having", "group by", "aggregation", "row-level"], answer: "WHERE filters row-level records before grouping. HAVING filters aggregated data after the GROUP BY clause executes." },
    { id: "qur_q3", q: "Explain the difference between IN and NOT IN operators in filters.", keywords: ["in", "not in", "list", "matches", "null"], answer: "IN filters rows matching any value in a list. NOT IN filters rows that do not match any value in the list (returns empty results if the list contains NULL)." },
    { id: "qur_q4", q: "What are aggregate functions in SQL? Name the standard five.", keywords: ["aggregation", "sum", "avg", "min", "max", "count"], answer: "Aggregate functions perform calculations on multiple rows, returning a single summary value. The standard five are SUM, AVG, MIN, MAX, and COUNT." },
    { id: "qur_q5", q: "How do you handle NULL values in comparisons?", keywords: ["is null", "is not null", "null", "comparison"], answer: "We cannot use `=` or `!=` with NULL values. We must use the `IS NULL` or `IS NOT NULL` operators." },
    { id: "qur_q6", q: "What is the purpose of the COALESCE function?", keywords: ["coalesce", "first non-null", "fallback", "null"], answer: "COALESCE takes a list of arguments and returns the first non-NULL value, acting as a fallback query." },
    { id: "qur_q7", q: "What is the difference between COUNT(*) and COUNT(column_name)?", keywords: ["count(*)", "count(column)", "null values", "rows"], answer: "COUNT(*) counts all rows in the table, including NULLs. COUNT(column_name) counts only rows where the specified column is not NULL." },
    { id: "qur_q8", q: "How do you alias columns and tables and why?", keywords: ["alias", "as", "readability", "rename"], answer: "We use the `AS` keyword to temporarily rename columns or tables, improving code readability and resolving ambiguities in joins." },
    { id: "qur_q9", q: "Explain the difference between AND and OR operators in a WHERE clause.", keywords: ["and", "or", "both", "either"], answer: "AND requires both conditions to be TRUE to include a row. OR requires either condition to be TRUE." },
    { id: "qur_q10", q: "How do you find duplicate rows in a table using SQL queries?", keywords: ["group by", "having", "count", "duplicate"], answer: "We group by target columns and filter groups: `GROUP BY col HAVING COUNT(*) > 1;`." },
    { id: "qur_q11", q: "Explain the difference between ISNULL() and COALESCE() in MySQL.", keywords: ["isnull", "coalesce", "mysql", "arguments"], answer: "In MySQL, ISNULL(expression) takes one argument and returns 1 if NULL, or 0. COALESCE(val1, val2) takes multiple arguments and returns the first non-NULL item." },
    { id: "qur_q12", q: "How do you sort query results in descending order?", keywords: ["order by", "desc", "sorting"], answer: "We append the DESC keyword: `ORDER BY column_name DESC;`." },
    { id: "qur_q13", q: "How do you restrict the number of rows returned by a query?", keywords: ["limit", "rows", "restrict", "offset"], answer: "We use the LIMIT clause: `LIMIT 10;` or `LIMIT 10 OFFSET 5;` to paginate results." },
    { id: "qur_q14", q: "What is the difference between DISTINCT and GROUP BY?", keywords: ["distinct", "group by", "uniqueness", "aggregation"], answer: "DISTINCT filters out duplicate rows to return unique values. GROUP BY combines rows to perform aggregate calculations on subsets." },
    { id: "qur_q15", q: "What happens when you group by a column without using aggregate functions?", keywords: ["group by", "distinct", "unique"], answer: "It returns a list of unique values in that column, behaving similarly to the DISTINCT keyword." }
  ],
  manipulation: [
    { id: "man_q1", q: "Explain the syntax and use of the CASE WHEN statement.", keywords: ["case when", "then", "else", "end", "conditional logic"], answer: "CASE WHEN implements conditional IF-THEN logic. Syntax: `CASE WHEN condition THEN result ELSE fallback END`." },
    { id: "man_q2", q: "How do you concatenate multiple string columns in SQL?", keywords: ["concat", "concat_ws", "concatenate"], answer: "We use `CONCAT(col1, col2)` or `CONCAT_WS('-', col1, col2)` which automatically inserts a separator between values." },
    { id: "man_q3", q: "How do you extract a substring from a string column?", keywords: ["substring", "substr", "start index", "length"], answer: "We use `SUBSTRING(string, start_position, length)` to extract characters from a string." },
    { id: "man_q4", q: "How do you calculate the difference between two dates in MySQL?", keywords: ["datediff", "date", "interval"], answer: "We use `DATEDIFF(end_date, start_date)` which returns the difference in days between the two dates." },
    { id: "man_q5", q: "How do you add or subtract an interval (e.g. 5 days) from a date?", keywords: ["date_add", "date_sub", "interval", "add", "subtract"], answer: "We use `DATE_ADD(date, INTERVAL 5 DAY)` or `DATE_SUB(date, INTERVAL 1 MONTH)` to modify dates." },
    { id: "man_q6", q: "How do you perform pattern matching using regular expressions in SQL?", keywords: ["regexp", "like", "regular expression", "pattern"], answer: "We use the REGEXP operator (e.g. `column REGEXP '^[0-9]'` matches strings starting with a number)." },
    { id: "man_q7", q: "What is the difference between LIKE and REGEXP?", keywords: ["like", "regexp", "wildcards", "regex", "patterns"], answer: "LIKE supports simple wildcards (`%` and `_`). REGEXP supports full regular expression patterns, allowing complex validation." },
    { id: "man_q8", q: "How do you change the case of a string column?", keywords: ["lower", "upper", "lcase", "ucase"], answer: "We use `LOWER(column)` (or LCASE) and `UPPER(column)` (or UCASE) functions." },
    { id: "man_q9", q: "How do you remove leading and trailing spaces from a string?", keywords: ["trim", "ltrim", "rtrim", "spaces"], answer: "We use `TRIM(column)` to remove both leading and trailing spaces, or LTRIM/RTRIM for specific sides." },
    { id: "man_q10", q: "How do you extract the year, month, or day from a date column?", keywords: ["year()", "month()", "day()", "extract", "date"], answer: "We use the date extractor functions: `YEAR(date_col)`, `MONTH(date_col)`, or `DAY(date_col)`." }
  ],
  relational: [
    { id: "rel_q1", q: "What is a subquery and what is the difference between correlated and uncorrelated subqueries?", keywords: ["subquery", "correlated", "independent", "outer query"], answer: "A subquery is a query nested inside another query. An uncorrelated subquery executes independently once. A correlated subquery references columns from the outer query and executes repeatedly for each row." },
    { id: "rel_q2", q: "What is a View in SQL and why is it used?", keywords: ["view", "virtual table", "query", "security", "logical"], answer: "A View is a virtual table containing a saved SQL query. It does not store physical data but provides simplified, secure access to complex schemas." },
    { id: "rel_q3", q: "Explain the difference between Inner Join, Left Join, Right Join, and Full Outer Join.", keywords: ["inner join", "left join", "right join", "full outer join", "matches"], answer: "INNER JOIN returns rows with matches in both tables. LEFT JOIN returns all left rows plus right matches (NULL if none). RIGHT JOIN does the opposite. FULL OUTER JOIN returns all rows from both tables, with NULLs for unmatched keys." },
    { id: "rel_q4", q: "What is a Self Join and when is it useful?", keywords: ["self join", "alias", "same table"], answer: "A Self Join joins a table to itself using column aliases. It is useful for querying hierarchical relationships, like matching employees to managers in the same table." },
    { id: "rel_q5", q: "Explain the difference between UNION and UNION ALL.", keywords: ["union", "union all", "duplicates", "sorting", "performance"], answer: "UNION combines result sets and removes duplicate rows, requiring sorting. UNION ALL combines sets keeping all duplicates, which is much faster." },
    { id: "rel_q6", q: "What is a Window Function in SQL?", keywords: ["window function", "over", "partition by", "aggregation", "rows"], answer: "Window functions perform calculations across a set of table rows related to the current row, without collapsing them into a single row, using the OVER clause." },
    { id: "rel_q7", q: "Explain ROW_NUMBER(), RANK(), and DENSE_RANK() window functions.", keywords: ["row_number", "rank", "dense_rank", "gaps", "duplicates"], answer: "ROW_NUMBER() assigns sequential integers. RANK() assigns rank values with gaps after duplicates (e.g. 1, 2, 2, 4). DENSE_RANK() assigns ranks without gaps (e.g. 1, 2, 2, 3)." },
    { id: "rel_q8", q: "What are LEAD and LAG window functions used for?", keywords: ["lead", "lag", "offset", "previous", "next"], answer: "LAG fetches column values from a previous row. LEAD fetches values from a subsequent row, helping calculate differences over time." },
    { id: "rel_q9", q: "What is a Cross Join and how many rows does it return?", keywords: ["cross join", "cartesian product", "rows", "multiplied"], answer: "A Cross Join returns the Cartesian product of both tables, where each row in table A is combined with all rows in table B, returning rows count equal to A multiplied by B." },
    { id: "rel_q10", q: "What is the difference between a CTE (Common Table Expression) and a subquery?", keywords: ["cte", "with", "subquery", "readability", "reusable"], answer: "A CTE is defined at the start of a query using `WITH CTE_Name AS (...)`. It is more readable than nested subqueries and can be referenced multiple times in the query." },
    { id: "rel_q11", q: "What is a correlated subquery in HAVING or SELECT clauses?", keywords: ["correlated", "select", "having", "outer query"], answer: "It is a nested query referencing fields in the outer query, dynamically filtering or populating rows based on the active row context." },
    { id: "rel_q12", q: "How do you implement running totals in SQL?", keywords: ["running total", "sum() over", "order by", "rows unbounded preceding"], answer: "We calculate it using cumulative sums: `SUM(amount) OVER (ORDER BY date ROWS UNBOUNDED PRECEDING)`." },
    { id: "rel_q13", q: "What is the partition by clause inside window functions?", keywords: ["partition by", "over", "groups", "window"], answer: "PARTITION BY divides the result set into partitions or groups, executing the window calculations independently for each partition." },
    { id: "rel_q14", q: "Can we use window functions inside a WHERE clause?", keywords: ["where", "window function", "not allowed", "cte", "subquery"], answer: "No, window functions are not allowed in WHERE clauses because WHERE executes before SELECT. We must wrap the query in a CTE or subquery to filter on them." },
    { id: "rel_q15", q: "Explain the difference between EXISTS and IN with subqueries.", keywords: ["exists", "in", "boolean", "null", "performance"], answer: "IN queries a literal list of values. EXISTS returns a boolean (TRUE/FALSE) as soon as it finds a matching row, making it faster for large datasets." }
  ],
  performance: [
    { id: "perf_q1", q: "What is an Index in SQL and how does it speed up queries?", keywords: ["index", "b-tree", "lookup", "speed", "scan"], answer: "An Index is a data structure (commonly B-Tree) that acts as a lookup pointer table, allowing the engine to locate rows without executing full table scans." },
    { id: "perf_q2", q: "What is the difference between a Clustered and a Non-Clustered index?", keywords: ["clustered", "non-clustered", "physical order", "pointer", "leaf node"], answer: "A Clustered Index dictates the physical sorting order of the actual table rows in storage (only one allowed). A Non-Clustered index stores a separate pointer structure that links back to the data rows." },
    { id: "perf_q3", q: "What is the purpose of the EXPLAIN command in query optimization?", keywords: ["explain", "explain analyze", "query plan", "execution cost", "scan type"], answer: "EXPLAIN prints the query execution plan, showing scan types (index vs full scan), join orders, estimated row counts, and bottleneck costs." },
    { id: "perf_q4", q: "Explain EXPLAIN ANALYZE in modern database engines.", keywords: ["explain analyze", "actual time", "runtime", "execution"], answer: "EXPLAIN ANALYZE executes the query and prints actual run times, loop counts, and memory details alongside the plan parameters." },
    { id: "perf_q5", q: "What is Table Partitioning and what are its types?", keywords: ["partitioning", "range", "list", "hash", "pruning"], answer: "Partitioning splits a large table into smaller physical tables based on values. Main types are Range (e.g. by Year), List (e.g. by Region), and Hash (e.g. by ID)." },
    { id: "perf_q6", q: "Explain TCL commands COMMIT and ROLLBACK.", keywords: ["commit", "rollback", "savepoint", "tcl"], answer: "COMMIT saves all transaction modifications permanently to disk. ROLLBACK reverts all active transaction changes back to the previous state." },
    { id: "perf_q7", q: "What are DCL commands GRANT and REVOKE used for?", keywords: ["grant", "revoke", "security", "permissions", "user"], answer: "DCL commands control permissions: GRANT gives users access permissions (SELECT, INSERT) to databases; REVOKE removes those permissions." },
    { id: "perf_q8", q: "What is an index scan vs an index seek?", keywords: ["scan", "seek", "traverse", "b-tree"], answer: "An index scan traverses the entire index tree. An index seek directly navigates the B-Tree levels to retrieve specific matching rows, which is much faster." },
    { id: "perf_q9", q: "How does table partitioning improve query performance?", keywords: ["pruning", "partition pruning", "exclude"], answer: "It enables Partition Pruning: the database engine excludes irrelevant partitions from execution plans, avoiding full table scans." },
    { id: "perf_q10", q: "What is the cost of having too many indexes on a table?", keywords: ["insert", "update", "delete", "write performance", "overhead"], answer: "While indexes speed up SELECT queries, they slow down INSERT, UPDATE, and DELETE operations because the indexes must be rebuilt on every modification." },
    { id: "perf_q11", q: "What is a composite index?", keywords: ["composite index", "multiple columns", "left-to-right"], answer: "An index created on multiple columns. It is evaluated from left to right, meaning queries must filter on the first column to utilize it." },
    { id: "perf_q12", q: "What is a covering index?", keywords: ["covering index", "select", "fetch", "lookup"], answer: "A covering index contains all columns requested by a query. The engine retrieves data directly from the index, avoiding data page lookups." },
    { id: "perf_q13", q: "Explain the difference between locking types (shared vs exclusive).", keywords: ["shared lock", "exclusive lock", "read", "write", "deadlock"], answer: "Shared locks allow concurrent transactions to read data. Exclusive locks block other transactions from reading or writing, ensuring data safety during updates." },
    { id: "perf_q14", q: "What is a deadlock and how do you prevent it?", keywords: ["deadlock", "waiting", "lock order", "transactions"], answer: "A deadlock occurs when two transactions wait for resources locked by each other. We prevent deadlocks by updating resources in the same order." },
    { id: "perf_q15", q: "How does query caching work and why do modern databases disable it?", keywords: ["caching", "invalidation", "stale data", "disabled"], answer: "Query caching stores results of SELECT statements. It is disabled in dynamic databases because updates invalidate cache values, causing performance overhead." }
  ],
  applications: [
    { id: "app_q1", q: "What are Slowly Changing Dimensions (SCD)?", keywords: ["scd", "dimension", "history", "tracking", "warehouse"], answer: "SCD tracks historical changes in dimension table columns (like customer addresses) inside a data warehouse." },
    { id: "app_q2", q: "Explain SCD Type 1, Type 2, and Type 3.", keywords: ["type 1", "type 2", "type 3", "overwrite", "active", "previous"], answer: "Type 1 overwrites old values (no history). Type 2 creates a new row with date bounds (keeps full history). Type 3 adds a new column to store the previous value (partial history)." },
    { id: "app_q3", q: "How do you connect Python to a SQL database using JDBC/ODBC or DB-API?", keywords: ["python", "jdbc", "jaydebeapi", "pyodbc", "connection", "cursor"], answer: "We connect to databases in Python using DB-API libraries (like jaydebeapi for JDBC, or pyodbc). We establish a connection, create a cursor, execute queries, and fetch results." },
    { id: "app_q4", q: "What is a cursor in database programming?", keywords: ["cursor", "iterate", "rows", "fetch"], answer: "A cursor is a control structure pointing to query results. It allows client scripts to iterate through and process rows one-by-one." },
    { id: "app_q5", q: "Explain the structure of an ETL telemetry pipeline in Data Engineering.", keywords: ["etl", "pipeline", "extract", "transform", "load", "staging"], answer: "An ETL pipeline extracts data from APIs or logs, transforms schema structures and handles nulls in staging, and loads records into target databases." },
    { id: "app_q6", q: "How do you implement SCD Type 2 tracking in SQL?", keywords: ["start_date", "end_date", "is_current", "type 2"], answer: "We add tracking columns: `start_date` (insertion timestamp), `end_date` (active bounds, default NULL or far future), and `is_current` (boolean flag)." },
    { id: "app_q7", q: "What is a staging table in ETL workflows?", keywords: ["staging", "temporary", "transform", "load"], answer: "A staging table is a temporary database table used to hold raw data during transformations before loading it into production tables." },
    { id: "app_q8", q: "How do you prevent SQL Injection vulnerabilities in database scripts?", keywords: ["sql injection", "parameterized", "prepared statement", "binding"], answer: "We use parameterized queries or prepared statements, which separate query logic from input variables, preventing SQL injection." },
    { id: "app_q9", q: "What is a Star Schema vs a Snowflake Schema in data warehousing?", keywords: ["star schema", "snowflake schema", "dimension", "fact table", "normalized"], answer: "A Star Schema links fact tables directly to denormalized dimension tables. A Snowflake Schema normalizes dimension tables into hierarchies, saving space." },
    { id: "app_q10", q: "Explain the difference between OLTP and OLAP systems.", keywords: ["oltp", "olap", "transaction", "analytics", "read-heavy", "write-heavy"], answer: "OLTP systems manage day-to-day write-heavy transactions (e.g. banking). OLAP systems support read-heavy analytical queries (e.g. data warehouses)." }
  ]
};

// Heuristic Evaluation Engine
function evaluateAnswer(category, questionId, userText) {
  const cleanUserText = userText.trim().toLowerCase();
  
  if (cleanUserText.length < 5) {
    return {
      score: 1,
      grammarFeedback: "Your answer is too short. Please provide a complete explanation.",
      matchingKeywords: [],
      missingKeywords: [],
      confidenceScore: 2,
      betterVersion: "Please write a more detailed response."
    };
  }

  // Find the question object
  const questionsList = MOCK_INTERVIEW_QUESTIONS[category] || [];
  const questionObj = questionsList.find(q => q.id === questionId);
  
  if (!questionObj) {
    return {
      score: 5,
      grammarFeedback: "Question not found in the simulator bank.",
      matchingKeywords: [],
      missingKeywords: [],
      confidenceScore: 5,
      betterVersion: "Unable to evaluate."
    };
  }

  const keywords = questionObj.keywords;
  const matched = [];
  const unmatched = [];
  
  keywords.forEach(keyword => {
    if (cleanUserText.includes(keyword)) {
      matched.push(keyword);
    } else {
      unmatched.push(keyword);
    }
  });

  // Basic Score out of 10 based on keyword match percentage
  const matchRatio = matched.length / keywords.length;
  let rawScore = Math.round(matchRatio * 7) + 2; // base score 2, max score 9
  
  // Length bonus
  if (cleanUserText.split(/\s+/).length > 30) {
    rawScore += 1;
  }
  rawScore = Math.min(rawScore, 10); // cap at 10

  // Grammar check heuristics (checking common Spoken English mistakes in interviews)
  const grammarCorrections = [];
  
  if (cleanUserText.includes("i am having") || cleanUserText.includes("i'm having 3 years") || cleanUserText.includes("i'm having 6 years")) {
    grammarCorrections.push('Instead of "I am having X years experience", say "I have X years of experience".');
  }
  if (cleanUserText.includes("work on") && (cleanUserText.includes("from 6 years") || cleanUserText.includes("since 6 years") || cleanUserText.includes("since 3 years"))) {
    grammarCorrections.push('Instead of "working here since X years", say "working here for X years".');
  }
  if (cleanUserText.includes("discuss about")) {
    grammarCorrections.push('Instead of "discuss about", say "discuss". ("Discuss" already implies "about").');
  }
  if (cleanUserText.includes("revert back")) {
    grammarCorrections.push('Instead of "revert back", say "revert" or "reply".');
  }
  if (cleanUserText.includes("passed out in")) {
    grammarCorrections.push('Instead of "I passed out in 2020", say "I graduated in 2020". ("Passed out" means fainting).');
  }
  if (cleanUserText.includes("in database side") || cleanUserText.includes("in backend side")) {
    grammarCorrections.push('Instead of "in database side", say "on the database side" or "at the database level".');
  }
  if (cleanUserText.includes("explain you")) {
    grammarCorrections.push('Instead of "let me explain you", say "let me explain to you".');
  }
  if (cleanUserText.includes("i did testing") || cleanUserText.includes("i did querying")) {
    grammarCorrections.push('Instead of "I did Y", use stronger verbs like "I executed Y" or "I was responsible for optimizing".');
  }

  // General grammar suggestions if no specific checks triggered
  if (grammarCorrections.length === 0) {
    grammarCorrections.push("Your grammar and sentence structure look solid! Speak clearly and maintain a professional pace.");
  }

  // Confidence score logic
  let confidence = Math.round(matchRatio * 5) + 3; // base 3
  if (cleanUserText.split(/\s+/).length > 25) confidence += 2;
  confidence = Math.min(confidence, 10);

  const betterVersionText = `Here is a refined version of your answer:\n"In my SQL projects, ${questionObj.answer}"`;

  return {
    score: rawScore,
    grammarFeedback: grammarCorrections.join(" "),
    matchingKeywords: matched,
    missingKeywords: unmatched,
    confidenceScore: confidence,
    betterVersion: betterVersionText,
    idealAnswer: questionObj.answer
  };
}
