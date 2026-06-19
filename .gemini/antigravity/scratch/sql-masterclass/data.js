// SQL Master Class Hub - Study Data & Project Blueprints

const MODULE_METADATA = [
  { id: "setup", title: "1. Setup & Environment", desc: "MySQL installation, verify server status, command-line login, client GUIs, default port 3306, and workspace configuration." },
  { id: "fundamentals", title: "2. Database Fundamentals & Architecture", desc: "SQL Commands (DDL, DML, TCL, DCL), CRUD, TRUNCATE vs DELETE vs DROP, ACID transactions, and Transaction Isolation." },
  { id: "keys", title: "3. Keys, Constraints & Normalization", desc: "Constraints, Primary/Unique/Foreign Keys, Surrogate vs Natural Keys, and Normalization Forms (1NF, 2NF, 3NF, BCNF)." },
  { id: "querying", title: "4. Basic Querying & Filtering", desc: "SELECT execution sequence, WHERE vs HAVING, aggregations (COUNT, SUM, AVG), NULL validation (COALESCE, IS NULL), and sorting." },
  { id: "manipulation", title: "5. Advanced Data Manipulation", desc: "CASE WHEN logic, string manipulation (CONCAT, SUBSTRING), date/time differences, and advanced REGEXP parsing." },
  { id: "relational", title: "6. Relational Queries & Advanced SQL", desc: "Subqueries (Correlated/Uncorrelated), Views, Joins (Left/Inner/Self/Cross), UNION/UNION ALL, and Window functions." },
  { id: "performance", title: "7. Performance, Optimization & Admin", desc: "B-Tree Indexes (Clustered vs Non-Clustered), EXPLAIN ANALYZE, Table Partitioning, and user privilege control (GRANT/REVOKE)." },
  { id: "applications", title: "8. Data Engineering Applications", desc: "Slowly Changing Dimensions (SCD 1/2/3), Python JDBC database connectors, database cursors, and fact/dimension schemas." }
];

const INTERVIEW_PREP_DATA = {
  setup: [
    {
      id: "set_study_1",
      title: "MySQL Linux Server Verification & Configuration",
      easyDefinition: "The process of verifying if the database server daemon is active and configured on the correct network port (default 3306), allowing incoming connection queries.",
      projectExample: "In our Smart Buildings project, the MySQL backend is deployed on an Ubuntu EC2 instance. We must log in and check that the service daemon responds correctly before deploying backend APIs.",
      productionScenario: "The database service crashes due to an out-of-memory error. Microservices show 'Connection Refused' exceptions. We check the status, restart the daemon, and inspect the logs for memory allocations.",
      validations: "Run 'sudo systemctl status mysql' to check running state. Check open ports using 'sudo netstat -plntu | grep 3306' or 'ss -lntu'.",
      interviewAnswer: "To verify if MySQL is running on a Linux system, I run 'sudo systemctl status mysql'. If the service is active (running), I check if it listens on port 3306 by running 'netstat -plntu'. If stopped, I start it using 'sudo systemctl start mysql'. I connect using command-line syntax 'mysql -u root -p' to verify direct query interface.",
      followUp: "How do you modify the default MySQL port from 3306 to another port?",
      mistakes: "Assuming the service is up because the server is pingable. Ping only checks network ICMP, not the actual MySQL database daemon running state.",
      codeSnippet: "# Check MySQL daemon status\nsudo systemctl status mysql\n\n# Restart MySQL daemon if crashed\nsudo systemctl restart mysql\n\n# Connect to MySQL via command line\nmysql -u db_user -h localhost -p"
    }
  ],
  fundamentals: [
    {
      id: "fund_study_1",
      title: "TRUNCATE vs DELETE vs DROP",
      easyDefinition: "Three SQL commands used to remove data or tables, differing in execution speed, logging, capability to rollback, and structural effects.",
      projectExample: "In our data loading pipeline, we use TRUNCATE on temporary staging tables because we want to clear all data instantly without logging overhead. We use DELETE on production tables to remove specific expired records. We use DROP only when decommissioned schemas are retired.",
      productionScenario: "Running a DELETE statement without a WHERE clause on a 10-million-row table locks the table for minutes and fills the transaction log (undo tablespace), causing disk space issues. Using TRUNCATE takes less than a second.",
      validations: "Check active transaction logs size after run. Verify if data can be recovered (ROLLBACK works for DELETE but not TRUNCATE/DROP). Check table schema status in 'INFORMATION_SCHEMA.TABLES'.",
      interviewAnswer: "DELETE is a DML command that deletes rows based on conditions, logs individual row deletions (allowing rollback), and triggers delete triggers. TRUNCATE is a DDL command that deallocates data pages, deletes all rows instantly without logging individual row actions, cannot be rolled back in MySQL, and doesn't fire triggers. DROP is a DDL command that deletes both the data rows and the table structure itself from the database.",
      followUp: "Does TRUNCATE reset the AUTO_INCREMENT counter of a table?",
      mistakes: "Believing TRUNCATE can be rolled back in standard MySQL setups, or forgetting that omitting a WHERE clause in a DELETE statement will delete all records.",
      codeSnippet: "-- DELETE with condition (log space used, rollback possible)\nDELETE FROM building_alerts WHERE logged_date < '2026-01-01';\n\n-- TRUNCATE entire table (instant, no rollback, resets auto-increment)\nTRUNCATE TABLE staging_telemetry;\n\n-- DROP table (deletes structure and data)\nDROP TABLE old_device_logs;"
    },
    {
      id: "fund_study_2",
      title: "ACID Properties & Transaction Isolation Levels",
      easyDefinition: "ACID guarantees that database transactions are processed reliably. Isolation levels define how transactions see changes made by other concurrent transactions.",
      projectExample: "When booking a conference room in our Smart Buildings application, we use a transaction to guarantee that room booking inserts and billing updates occur together, preventing double-bookings.",
      productionScenario: "Under high concurrency, two API requests book the same room at the same time. If the isolation level is set to 'Read Uncommitted', one transaction might see uncommitted data and fail, or cause double booking due to a dirty read.",
      validations: "Verify isolation level using 'SELECT @@transaction_isolation;'. Run concurrent connection sessions to simulate race conditions and check for lock timeouts.",
      interviewAnswer: "ACID stands for Atomicity, Consistency, Isolation, and Durability. Isolation levels control concurrency anomalies like dirty reads, non-repeatable reads, and phantom reads. The four standard isolation levels are Read Uncommitted, Read Committed, Repeatable Read (which is MySQL default and prevents dirty/non-repeatable reads), and Serializable, which uses locks to prevent phantom reads.",
      followUp: "How does InnoDB implement Repeatable Read without locking rows? (Hint: MVCC / Multi-Version Concurrency Control)",
      mistakes: "Using Serializable isolation by default, which causes massive locking overhead and leads to frequent deadlock timeouts in high-traffic applications.",
      codeSnippet: "-- Check transaction isolation level\nSELECT @@transaction_isolation;\n\n-- Set transaction isolation level for current session\nSET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;\n\n-- Run transactions explicitly\nSTART TRANSACTION;\nUPDATE room_bookings SET status = 'BOOKED' WHERE room_id = 101;\nCOMMIT;"
    }
  ],
  keys: [
    {
      id: "key_study_1",
      title: "Database Normalization (1NF, 2NF, 3NF, BCNF)",
      easyDefinition: "A systematic process of structuring database schemas to eliminate redundancy and prevent insert, update, and delete anomalies.",
      projectExample: "Designing a schema for IoT devices where we separate device info (device_id, model, firmware) from telemetry logs (log_id, device_id, temperature, timestamp) to prevent repeating model details in every event row.",
      productionScenario: "Storing customer name, address, and order details in a single table. If a customer changes address, we must update multiple order rows. If we delete all orders for a customer, we accidentally lose the customer details (delete anomaly).",
      validations: "Confirm primary keys are defined. Review schemas to verify there are no partial dependencies (2NF violation) or transitive dependencies (3NF violation).",
      interviewAnswer: "Normalization reduces data redundancy. 1NF requires atomic values in columns and no duplicate rows. 2NF requires 1NF and that all non-key columns depend on the entire composite primary key (eliminating partial dependencies). 3NF requires 2NF and that non-key columns do not depend on other non-key columns (eliminating transitive dependencies). BCNF is a stricter version where every determinant must be a candidate key.",
      followUp: "When would you intentionally denormalize a database schema?",
      mistakes: "Over-normalizing a reporting database (OLAP), which leads to slow queries because the engine has to execute 15-way joins to retrieve a single report.",
      codeSnippet: "-- 3NF Design Example: Separate table for Devices and Models\nCREATE TABLE device_models (\n    model_id INT PRIMARY KEY,\n    model_name VARCHAR(50),\n    manufacturer VARCHAR(50)\n);\n\nCREATE TABLE smart_devices (\n    device_id INT PRIMARY KEY,\n    mac_address VARCHAR(17) UNIQUE,\n    model_id INT,\n    FOREIGN KEY (model_id) REFERENCES device_models(model_id)\n);"
    }
  ],
  querying: [
    {
      id: "qur_study_1",
      title: "Logical SQL Query Execution Order",
      easyDefinition: "The specific sequence in which a database engine processes the different clauses of a SELECT statement, which differs from how the query is written.",
      projectExample: "When writing a query to identify rooms with more than 10 alerts, we cannot use an alias defined in SELECT inside the WHERE clause, because WHERE is executed before SELECT.",
      productionScenario: "Using aggregate aliases in the WHERE clause causes a syntax error. Understanding execution order prevents syntax failures and helps write optimized queries.",
      validations: "Use EXPLAIN to verify how the optimizer parses the filters. Rewrite filter conditions from HAVING to WHERE if they filter individual rows, as WHERE executes much earlier and reduces rows to group.",
      interviewAnswer: "Although we write SELECT first, the database engine executes clauses in this order: 1. FROM (and JOINs), 2. WHERE (filters individual rows), 3. GROUP BY (groups rows), 4. HAVING (filters groups), 5. SELECT (evaluates column expressions), 6. ORDER BY (sorts results), and 7. LIMIT (restricts output rows).",
      followUp: "Can you use window functions in the WHERE clause? Why or why not?",
      mistakes: "Attempting to filter aggregated results inside the WHERE clause, or referencing a SELECT column alias in the WHERE clause.",
      codeSnippet: "-- Logical Query Sequence: WHERE filters first, then GROUP, then HAVING\nSELECT \n    device_type,\n    COUNT(*) AS alert_count\nFROM building_alerts               -- 1. Get data source\nWHERE priority = 'HIGH'            -- 2. Filter rows\nGROUP BY device_type               -- 3. Group rows\nHAVING COUNT(*) > 10               -- 4. Filter grouped rows\nORDER BY alert_count DESC          -- 5. Sort output rows\nLIMIT 5;                           -- 6. Paginate result"
    }
  ],
  manipulation: [
    {
      id: "man_study_1",
      title: "CASE WHEN Conditional Logic",
      easyDefinition: "A flow control structure that allows you to perform conditional logic (if-then-else) inside SQL queries, returning specific values based on evaluations.",
      projectExample: "In our Smart Buildings dashboard, we categorize temperature telemetry readings: anything above 26°C is 'Hot', below 18°C is 'Cold', and in-between is 'Normal'.",
      productionScenario: "Reporting alerts without human-readable levels. Raw numbers like priority status codes (1, 2, 3) must be mapped to ('Low', 'Medium', 'High') dynamically in customer-facing reports.",
      validations: "Always include an 'ELSE' statement in CASE WHEN blocks to handle unexpected nulls or default boundary values. Verify boundary values (e.g., 18 and 26) are correctly captured.",
      interviewAnswer: "The CASE statement is SQL's way of executing conditional logic. It evaluates conditions sequentially and returns the corresponding value in the THEN clause when a condition is met. If no conditions match, it returns the value in the ELSE clause. If no ELSE is provided, it returns NULL. It is extremely useful in SELECT columns, ORDER BY clauses, and aggregate functions.",
      followUp: "How can you use CASE WHEN inside SUM() to pivot rows into columns?",
      mistakes: "Forgetting to end the block with the 'END' keyword, or missing the 'ELSE' block which leads to accidental NULL values in the output.",
      codeSnippet: "-- CASE WHEN for category mapping\nSELECT \n    device_id,\n    temperature,\n    CASE \n        WHEN temperature > 26.0 THEN 'CRITICAL HOT'\n        WHEN temperature < 18.0 THEN 'CRITICAL COLD'\n        ELSE 'NORMAL'\n    END AS thermal_status\nFROM thermostat_telemetry;"
    }
  ],
  relational: [
    {
      id: "rel_study_1",
      title: "SQL Joins & Window Functions",
      easyDefinition: "Joins combine rows from multiple tables based on related columns. Window functions perform calculations across a partition of rows related to the current row without collapsing the rows.",
      projectExample: "We join the `devices` table with `locations` to find device coordinates. We then use ROW_NUMBER() partitioned by device_id and sorted by timestamp to extract the latest telemetry reading for each device.",
      productionScenario: "Executing duplicate row checks using self-joins is slow. Replacing it with ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...) improves execution speeds by avoiding full self-joins.",
      validations: "Verify joins use index columns. Ensure OVER() partition columns don't have extremely high cardinality without index coverage. Confirm difference between RANK() and DENSE_RANK() output gaps.",
      interviewAnswer: "An INNER JOIN returns rows with matches in both tables. A LEFT JOIN returns all rows from the left table and matched rows from the right table. Window functions use the OVER clause. ROW_NUMBER() assigns a unique sequential integer. RANK() assigns ranks with gaps if values match, while DENSE_RANK() assigns consecutive ranks without gaps.",
      followUp: "What is the difference between LEAD and LAG window functions?",
      mistakes: "Using a window function directly in the WHERE clause, which triggers a syntax error (you must wrap it in a CTE or a subquery).",
      codeSnippet: "-- Get the rank of device alerts by timestamp\nWITH ranked_alerts AS (\n    SELECT \n        device_id,\n        alert_message,\n        logged_at,\n        DENSE_RANK() OVER (\n            PARTITION BY device_id \n            ORDER BY logged_at DESC\n        ) AS alert_rank\n    FROM device_alerts\n)\nSELECT * \nFROM ranked_alerts \nWHERE alert_rank = 1; -- Get only the latest alert for each device"
    }
  ],
  performance: [
    {
      id: "perf_study_1",
      title: "Clustered vs Non-Clustered Indexes & EXPLAIN ANALYZE",
      easyDefinition: "Indexes are lookup tables to retrieve data faster. EXPLAIN ANALYZE runs queries and outputs the actual execution plan, showing step-by-step performance costs.",
      projectExample: "We create a composite non-clustered index on (building_id, device_type) because users filter dashboard queries on these columns. We run EXPLAIN ANALYZE to ensure the engine uses 'Index Seek' instead of 'Table Scan'.",
      productionScenario: "A query takes 20 seconds because it performs a full table scan on a 5-million-row telemetry table. Adding an index reduces the query execution time to under 10 milliseconds.",
      validations: "Execute EXPLAIN ANALYZE before query statements. Verify index usage in the output tree structure. Ensure write latency doesn't degrade from too many active indexes.",
      interviewAnswer: "A clustered index defines the physical order of data rows on disk (only one allowed, usually primary key). A non-clustered index is a separate structure containing pointers to actual data rows (multiple allowed). EXPLAIN ANALYZE is a debugging tool that runs the query and outputs the actual execution plan with execution timings, loop counts, and costs, helping locate slow index scans.",
      followUp: "What is a covering index and why is it extremely fast?",
      mistakes: "Adding indexes on columns with low cardinality (like boolean active flags), which the optimizer ignores, adding write overhead without improving select speeds.",
      codeSnippet: "-- Generate actual runtime execution plan\nEXPLAIN ANALYZE\nSELECT device_id, status, count(*)\nFROM telemetry_records\nWHERE building_id = 5 AND status = 'ERROR'\nGROUP BY device_id, status;"
    }
  ],
  applications: [
    {
      id: "app_study_1",
      title: "Slowly Changing Dimensions (SCD Type 1, 2, and 3)",
      easyDefinition: "Design patterns used in data warehousing to track historical changes in dimension tables (like customer addresses or device locations) over time.",
      projectExample: "In our Smart Buildings network, a thermostat device is relocated from Room 101 to Room 202. We implement SCD Type 2 to retain historical logs of alerts recorded while it was in Room 101.",
      productionScenario: "Using SCD Type 1 overwrites the old room ID. When we run a historical alert count report for Room 101, all previous alerts for that device appear under Room 202, corrupting spatial analysis reports.",
      validations: "Check active date range bounds (start_date <= end_date or is_current flag). Verify that updates correctly end-date the active record and insert a new row.",
      interviewAnswer: "SCD Type 1 overwrites historical data, meaning there is no history tracking. SCD Type 2 preserves history by adding a new row with start_date, end_date, and an active/current flag, which is standard in data warehousing. SCD Type 3 tracks limited history by adding a new column (like 'previous_value') to the same row.",
      followUp: "How do you handle primary keys in an SCD Type 2 table? (Hint: Surrogate Keys)",
      mistakes: "Updating an SCD Type 2 row without close-dating (setting end_date) the previous active row, resulting in overlapping active dates for the same business key.",
      codeSnippet: "-- SCD Type 2 table structure\nCREATE TABLE dim_devices (\n    device_key INT AUTO_INCREMENT PRIMARY KEY, -- Surrogate Key\n    device_id INT,                             -- Natural Business Key\n    mac_address VARCHAR(17),\n    assigned_room VARCHAR(20),\n    start_date DATE NOT NULL,\n    end_date DATE NULL,\n    is_current BOOLEAN DEFAULT TRUE\n);"
    }
  ]
};

// STAR Data Engineering Telemetry Project Specification
const STAR_DE_PROJECT = {
  title: "STAR Project: Real-Time IoT Telemetry ETL Pipeline & SCD Type 2 Historical Tracking",
  situation: `In our Smart Buildings infrastructure platform, we had to process telemetry event streams from 10,000+ IoT sensors (measuring temperature, humidity, and status). The existing system overwrote device locations in the database (SCD Type 1). As a result, historical reports were inaccurate: if a sensor was moved from 'Building A' to 'Building B', all its past sensor records incorrectly showed as originating from 'Building B'. Additionally, duplicate tracking events caused double-counting anomalies in reporting metrics.`,
  task: `I was tasked with designing a robust, staging-based ETL pipeline. The goals were to:
1. Extract and load high-throughput sensor telemetry into a staging area.
2. Deduplicate telemetry events (retaining only the first occurrence based on event time).
3. Implement an SCD Type 2 dimension table to accurately track historical changes in sensor locations.
4. Maintain optimal write performance using indexes and table partitioning.`,
  action: `I implemented the solution in four steps:
1. **Schema Design**: Created a partitioned staging table for raw loads, a surrogate-key dimension table with history bounds, and a telemetry fact table.
2. **Deduplication logic**: Wrote queries using ROW_NUMBER() window functions to extract only the earliest, unique log packet.
3. **SCD Type 2 Load Query**: Built transaction-wrapped statements to automatically end-date active records in the dimension table and insert new rows upon location change detection.
4. **Python Pipeline Orchestration**: Wrote a Python script utilizing database connections and cursors to pull data from staging, run checks, and load into production.`,
  result: `The system successfully processed over 5 million daily events. Data accuracy for historical reports reached 100%. Running aggregations and historical analysis returned results in under 500 milliseconds (compared to 8 seconds previously) due to partitioning, index optimization, and removing duplicate records.`,
  sqlCode: `-- 1. CREATE SCD TYPE 2 DEVICE DIMENSION TABLE
CREATE TABLE dim_smart_sensors (
    sensor_key INT AUTO_INCREMENT PRIMARY KEY, -- Surrogate key
    sensor_uuid VARCHAR(50) NOT NULL,          -- Natural key
    sensor_type VARCHAR(20) NOT NULL,
    current_building VARCHAR(50) NOT NULL,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_sensor_uuid (sensor_uuid),
    INDEX idx_active_sensor (sensor_uuid, is_active)
);

-- 2. CREATE RAW STAGING TABLE (PARTITIONED BY DATE RANGE)
CREATE TABLE staging_sensor_telemetry (
    event_id VARCHAR(50),
    sensor_uuid VARCHAR(50),
    temperature DECIMAL(5,2),
    humidity DECIMAL(5,2),
    reported_at TIMESTAMP,
    ingested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE (YEAR(reported_at)) (
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION p2026 VALUES LESS THAN (2027),
    PARTITION pFuture VALUES LESS THAN MAXVALUE
);

-- 3. DEDUPLICATION QUERY (RETAINING FIRST EVENT PER HOUR/SENSOR)
WITH ranked_telemetry AS (
    SELECT 
        event_id,
        sensor_uuid,
        temperature,
        humidity,
        reported_at,
        ROW_NUMBER() OVER (
            PARTITION BY sensor_uuid, DATE_FORMAT(reported_at, '%Y-%m-%d %H:00:00')
            ORDER BY reported_at ASC
        ) AS row_num
    FROM staging_sensor_telemetry
)
SELECT event_id, sensor_uuid, temperature, humidity, reported_at
FROM ranked_telemetry
WHERE row_num = 1;

-- 4. TRANSACTION-WRAPPED SCD TYPE 2 UPDATE ALGORITHM
-- Step 4a: End-date the existing active sensors whose locations changed
UPDATE dim_smart_sensors d
INNER JOIN staging_sensor_telemetry s 
    ON d.sensor_uuid = s.sensor_uuid
SET d.end_time = s.reported_at,
    d.is_active = FALSE
WHERE d.is_active = TRUE 
  AND d.current_building <> 'Staging_New_Building_Placeholder'; 
  -- In production, check against the incoming staging building location.

-- Step 4b: Insert new active record for the updated locations
INSERT INTO dim_smart_sensors (sensor_uuid, sensor_type, current_building, start_time, is_active)
SELECT DISTINCT s.sensor_uuid, 'Thermostat', 'Building B', s.reported_at, TRUE
FROM staging_sensor_telemetry s
LEFT JOIN dim_smart_sensors d 
    ON s.sensor_uuid = d.sensor_uuid AND d.is_active = TRUE
WHERE d.sensor_key IS NULL;`,
  pythonCode: `import mysql.connector
import logging

logging.basicConfig(level=logging.INFO)

def run_etl_pipeline():
    conn = None
    try:
        # Establish connection to RDBMS
        conn = mysql.connector.connect(
            host="localhost",
            user="db_user",
            password="secure_password",
            database="smart_buildings_dw",
            port=3306
        )
        cursor = conn.cursor()
        
        # Disable auto-commit to handle ACID transaction manually
        conn.autocommit = False
        
        logging.info("Starting ETL Pipeline Execution...")
        
        # 1. Update old locations in Dimension table (Close-dating SCD Type 2)
        update_scd2_query = """
        UPDATE dim_smart_sensors d
        INNER JOIN staging_sensor_telemetry s ON d.sensor_uuid = s.sensor_uuid
        SET d.end_time = s.reported_at, d.is_active = False
        WHERE d.is_active = True AND d.current_building != 'Building B';
        """
        cursor.execute(update_scd2_query)
        logging.info(f"SCD Type 2: Closed {cursor.rowcount} outdated sensor dimensions.")
        
        # 2. Insert new locations into Dimension table
        insert_scd2_query = """
        INSERT INTO dim_smart_sensors (sensor_uuid, sensor_type, current_building, start_time, is_active)
        SELECT DISTINCT s.sensor_uuid, 'Thermostat', 'Building B', s.reported_at, True
        FROM staging_sensor_telemetry s
        LEFT JOIN dim_smart_sensors d ON s.sensor_uuid = d.sensor_uuid AND d.is_active = True
        WHERE d.sensor_key IS NULL;
        """
        cursor.execute(insert_scd2_query)
        logging.info(f"SCD Type 2: Inserted {cursor.rowcount} new active sensor dimensions.")
        
        # Commit transaction as a single atomic unit
        conn.commit()
        logging.info("ETL Transaction committed successfully!")
        
    except mysql.connector.Error as err:
        if conn:
            conn.rollback()
            logging.error(f"Transaction rolled back due to error: {err}")
    finally:
        if conn:
            cursor.close()
            conn.close()`
};
