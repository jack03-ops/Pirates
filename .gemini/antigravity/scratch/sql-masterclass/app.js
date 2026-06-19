// SQL Master Class Hub - App Controller

// Global App State
const state = {
  activeTab: "setup", // Default active panel
  masteredIds: [],    // Array of card IDs user marked as mastered
  activeSubTabs: {},   // Maps panelId -> subTabId ("study" or "practice")
  currentExam: null   // Active exam object
};

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  loadProgress();
  setupSidebarNavigation();
  setupSearch();
  setupSubTabHandlers();
  
  // Navigate to initial tab
  switchPanel(state.activeTab);
  
  // Render Stats & Progress initially
  updateDashboardStats();
  renderModuleProgressBars();
});

// Load progress from localStorage
function loadProgress() {
  const storedMastery = localStorage.getItem("sql_masterclass_mastery");
  if (storedMastery) {
    state.masteredIds = JSON.parse(storedMastery);
  } else {
    state.masteredIds = [];
  }
}

// Save progress to localStorage
function saveProgress() {
  localStorage.setItem("sql_masterclass_mastery", JSON.stringify(state.masteredIds));
  updateDashboardStats();
  renderModuleProgressBars();
  updateSidebarBadges();
}

// Sidebar panel switching logic
function setupSidebarNavigation() {
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const targetPanel = item.getAttribute("data-panel");
      if (targetPanel) {
        // Clear active classes from sidebar
        navItems.forEach(n => n.classList.remove("active"));
        item.classList.add("active");
        
        switchPanel(targetPanel);
      }
    });
  });
}

// Handle routing/view switching
function switchPanel(panelId) {
  state.activeTab = panelId;
  
  // Hide all panels
  const panels = document.querySelectorAll(".panel");
  panels.forEach(p => p.classList.remove("active"));
  
  // Show target panel
  const activePanel = document.getElementById(`panel-${panelId}`);
  if (activePanel) {
    activePanel.classList.add("active");
  }

  // Update dynamic content based on panel
  if (panelId === "star-project") {
    renderStarProject();
    // Hide search bar for project
    document.querySelector(".search-container").style.display = "none";
  } else if (panelId === "exam-simulator") {
    renderExamSimulator();
    // Hide search bar for exam
    document.querySelector(".search-container").style.display = "none";
  } else {
    // Show search bar for study modules
    document.querySelector(".search-container").style.display = "block";
    
    // Set default subtab for module if not set
    if (!state.activeSubTabs[panelId]) {
      state.activeSubTabs[panelId] = "study";
    }
    
    renderModuleTabs(panelId);
    renderModuleStudyCards(panelId);
    renderModulePracticeQuestions(panelId);
  }
}

// Handle module sub-tabs (Study vs Practice)
function setupSubTabHandlers() {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("sub-tab-btn")) {
      const panelId = e.target.getAttribute("data-panel");
      const tabId = e.target.getAttribute("data-tab");
      
      state.activeSubTabs[panelId] = tabId;
      
      // Update subtab buttons state
      const btns = e.target.parentElement.querySelectorAll(".sub-tab-btn");
      btns.forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      
      // Update contents display
      const panel = document.getElementById(`panel-${panelId}`);
      const contents = panel.querySelectorAll(".tab-content");
      contents.forEach(c => c.classList.remove("active"));
      
      const targetContent = panel.querySelector(`.tab-content[data-tab="${tabId}"]`);
      if (targetContent) {
        targetContent.classList.add("active");
      }
    }
  });
}

// Setup searching/filtering
function setupSearch() {
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    filterContent(query);
  });
}

// Filter study cards and practice questions based on input query
function filterContent(query) {
  const activePanelId = state.activeTab;
  const panel = document.getElementById(`panel-${activePanelId}`);
  if (!panel) return;
  
  // Filter study cards
  const studyCards = panel.querySelectorAll(".study-card");
  studyCards.forEach(card => {
    const text = card.textContent.toLowerCase();
    if (text.includes(query)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });

  // Filter practice cards
  const practiceCards = panel.querySelectorAll(".question-card");
  practiceCards.forEach(card => {
    const text = card.textContent.toLowerCase();
    if (text.includes(query)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// Helper: child analogies and hands-on query challenges generator
function getChildFriendlyAndHandsOn(qObj, category) {
  const qText = qObj.q.toLowerCase();
  
  let childFriendly = "";
  let handsOn = "";
  let handsOnCode = "";
  
  if ((qText.includes("mysql") && qText.includes("running")) || qText.includes("linux")) {
    childFriendly = "Imagine MySQL is a giant talking toy box. Running the server is like plugging it into the wall. If you don't turn it on, the toy box stays asleep and won't answer your questions! The systemctl command is like pressing the ON button on the back of the box.";
    handsOn = "Log in to your Linux terminal and query the system to see if the MySQL server is awake and active.";
    handsOnCode = "sudo systemctl status mysql";
  }
  else if (qText.includes("port") && qText.includes("3306")) {
    childFriendly = "Think of ports like mailboxes at an apartment building. Mailbox 3306 is reserved only for Mr. MySQL's letters! If another toy tries to use mailbox 3306, there will be a fight and nobody can receive mail.";
    handsOn = "Scan the network ports to verify that port 3306 is open and listening for database requests.";
    handsOnCode = "sudo netstat -plntu | grep 3306";
  }
  else if (qText.includes("sql") && qText.includes("mysql")) {
    childFriendly = "SQL is like the English language (rules of grammar). MySQL is like a specific person who speaks English (the database engine). You use the language (SQL) to tell the person (MySQL) to fetch a toy for you.";
    handsOn = "Log in using the SQL command line tool and list all available databases.";
    handsOnCode = "mysql -u root -p -e 'SHOW DATABASES;'";
  }
  else if (qText.includes("truncate") && qText.includes("delete")) {
    childFriendly = "Imagine a crayon drawer. DELETE is like taking out the broken red crayons one-by-one with an eraser. TRUNCATE is like pulling the drawer out, dumping all crayons into the bin in one second, but keeping the empty drawer! DROP is like throwing the whole drawer and the desk into the trash bin!";
    handsOn = "Create a temporary table, add a row, and empty it instantly with TRUNCATE.";
    handsOnCode = "CREATE TEMPORARY TABLE temp_crayons (id INT, color VARCHAR(10));\nINSERT INTO temp_crayons VALUES (1, 'Red');\nTRUNCATE TABLE temp_crayons;";
  }
  else if (qText.includes("acid")) {
    childFriendly = "ACID is the ultimate pinky-promise of database transactions! Atomicity means all-or-nothing (if you pay for candy, you must get the candy, otherwise you get your coin back). Consistency means no cheating the rules. Isolation means you color your picture in peace without someone grabbing your crayons. Durability means your drawing is saved in ink so it never gets erased, even if the lights go out!";
    handsOn = "Start a transaction, update a balance, and complete it using COMMIT to guarantee durability.";
    handsOnCode = "START TRANSACTION;\nUPDATE accounts SET balance = balance - 10 WHERE user_id = 1;\nUPDATE accounts SET balance = balance + 10 WHERE user_id = 2;\nCOMMIT;";
  }
  else if (qText.includes("isolation")) {
    childFriendly = "Think of transaction isolation like studying in private rooms. Read Uncommitted is like leaving the door open—anyone can peek at your draft drawings. Read Committed is closing the door so people only see finished drawings. Repeatable Read is locking the door so nobody can change what's inside your room. Serializable is putting a guard at the door so only one person can enter at a time!";
    handsOn = "Set the session isolation level to Repeatable Read to prevent dirty reads.";
    handsOnCode = "SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;\nSELECT @@transaction_isolation;";
  }
  else if (qText.includes("primary key") && qText.includes("unique")) {
    childFriendly = "A Primary Key is like your unique passport number—you can only have one, and you cannot have a blank passport. A Unique Key is like your personal email address—every email is unique, but some students might not have an email address yet (which is NULL!).";
    handsOn = "Create a table using both a PRIMARY KEY and a UNIQUE constraint.";
    handsOnCode = "CREATE TABLE users (\n  user_id INT PRIMARY KEY,\n  passport_no VARCHAR(20) UNIQUE\n);";
  }
  else if (qText.includes("foreign key")) {
    childFriendly = "A Foreign Key is like a wristband that connects you to your parent at the zoo. You cannot have a kid wristband pointing to a parent who doesn't exist! It ensures kids are always linked to valid parents.";
    handsOn = "Create a child table linked to a parent table using a FOREIGN KEY.";
    handsOnCode = "CREATE TABLE orders (\n  order_id INT PRIMARY KEY,\n  customer_id INT,\n  FOREIGN KEY (customer_id) REFERENCES customers(user_id)\n);";
  }
  else if (qText.includes("normalization") || qText.includes("1nf") || qText.includes("2nf") || qText.includes("3nf")) {
    childFriendly = "Normalization is like organizing your messy room. 1NF says: 'No boxes filled with mixed toys; keep items atomic!' 2NF says: 'Label every box clearly with its purpose.' 3NF says: 'Do not put a toy label on a shelf that belongs to a separate table; keep things dependent only on the main key!'";
    handsOn = "Design a normalized database schema by splitting devices and buildings to avoid repeating data.";
    handsOnCode = "CREATE TABLE buildings (id INT PRIMARY KEY, name VARCHAR(50));\nCREATE TABLE devices (\n  id INT PRIMARY KEY,\n  name VARCHAR(50),\n  building_id INT,\n  FOREIGN KEY (building_id) REFERENCES buildings(id)\n);";
  }
  else if (qText.includes("execution order") || qText.includes("select statement")) {
    childFriendly = "SQL execution order is like baking a cake. You must gather ingredients from the pantry first (FROM), sift out bad ingredients (WHERE), mix them (GROUP BY), verify the mix looks right (HAVING), cut the slices (SELECT), decorate them (ORDER BY), and limit yourself to eating just 1 slice (LIMIT)! Even though SELECT is written first, it is evaluated near the end!";
    handsOn = "Query device counts grouped by category, showing execution clauses order.";
    handsOnCode = "SELECT category, COUNT(*)\nFROM smart_devices\nWHERE status = 'ACTIVE'\nGROUP BY category\nHAVING COUNT(*) > 2\nORDER BY category DESC\nLIMIT 5;";
  }
  else if (qText.includes("where") && qText.includes("having")) {
    childFriendly = "WHERE filters individual apples (like throwing away rotten apples before making a pie). HAVING filters bags of apples (like rejecting whole bags that have fewer than 10 apples after you group them).";
    handsOn = "Write a query utilizing both WHERE to filter rows and HAVING to filter aggregated groups.";
    handsOnCode = "SELECT room_id, AVG(temp) \nFROM thermostat_logs \nWHERE logged_date > '2026-06-01' \nGROUP BY room_id \nHAVING AVG(temp) > 24.0;";
  }
  else if (qText.includes("coalesce")) {
    childFriendly = "COALESCE is like a backup plan for dinner. You check if there is pizza. If no pizza (NULL), you check if there is burger. If no burger (NULL), you default to cereal! It scans the options and grabs the first food that is actually there.";
    handsOn = "Query user email contacts, falling back to phone number if email is NULL.";
    handsOnCode = "SELECT name, COALESCE(email, phone, 'No Contact Info') AS primary_contact\nFROM contacts;";
  }
  else if (qText.includes("case when")) {
    childFriendly = "CASE WHEN is like a sorting hat. If your grade is above 90, you get an 'A' sticker. If it's above 80, you get a 'B' sticker. Else, you get a 'Try Harder' stamp. It checks your numbers and prints the right label!";
    handsOn = "Categorize device temperature readings into 'Hot', 'Cold', or 'Comfortable'.";
    handsOnCode = "SELECT sensor_id, temp,\n  CASE \n    WHEN temp > 26 THEN 'HOT'\n    WHEN temp < 18 THEN 'COLD'\n    ELSE 'COMFORTABLE'\n  END AS comfort_status\nFROM temperature_feed;";
  }
  else if (qText.includes("join") && (qText.includes("left") || qText.includes("inner") || qText.includes("right"))) {
    childFriendly = "An INNER JOIN is like matching puzzle pieces: only kids with matching buddy shoes get to play. A LEFT JOIN is like letting all kids stay, but if they don't have a buddy shoe, we just write 'empty' (NULL) next to their name!";
    handsOn = "Execute a left join linking devices with location coordinates.";
    handsOnCode = "SELECT d.device_name, l.coordinates\nFROM devices d\nLEFT JOIN locations l ON d.location_id = l.id;";
  }
  else if (qText.includes("window function") || qText.includes("row_number") || qText.includes("rank")) {
    childFriendly = "A Window Function is like having a private referee count things just for your group. Normal GROUP BY squashes 10 kids into 1 single pile. Window functions keep all 10 kids standing in line, but writes their group rank (1st, 2nd, 3rd) right on their shirts using the OVER clause!";
    handsOn = "Rank device alerts chronologically per device using DENSE_RANK().";
    handsOnCode = "SELECT alert_id, device_id, logged_at,\n  DENSE_RANK() OVER (PARTITION BY device_id ORDER BY logged_at DESC) as alert_rank\nFROM system_alerts;";
  }
  else if (qText.includes("lead") || qText.includes("lag")) {
    childFriendly = "LAG is like looking at the kid standing right behind you in line to see what toy they have. LEAD is looking at the kid in front of you. This helps you compare your current temperature reading with the previous hour's reading to see if it's getting hotter!";
    handsOn = "Calculate the temperature difference between consecutive readings using LAG.";
    handsOnCode = "SELECT timestamp, temp,\n  temp - LAG(temp, 1) OVER (ORDER BY timestamp) AS temp_change\nFROM sensor_feed;";
  }
  else if (qText.includes("index") && (qText.includes("clustered") || qText.includes("non-clustered") || qText.includes("speed"))) {
    childFriendly = "Imagine a massive dictionary. A Clustered Index is the dictionary itself, sorted alphabetically from A to Z. A Non-Clustered Index is the index pages at the back—it lists special words and says: 'Go look at Page 45, Column 2' to find them!";
    handsOn = "Create a non-clustered composite index on building columns to speed up searches.";
    handsOnCode = "CREATE INDEX idx_device_building_status ON smart_devices (building_id, status);";
  }
  else if (qText.includes("explain")) {
    childFriendly = "EXPLAIN is like asking your teacher: 'Can you show me the exact map of steps you will take to solve this math problem?' before you write down the answer. It shows if the database engine will scan the whole library or just look at the index book!";
    handsOn = "Inspect the execution path of a database query using EXPLAIN.";
    handsOnCode = "EXPLAIN SELECT * FROM telemetry_records WHERE building_id = 5;";
  }
  else if (qText.includes("scd") || qText.includes("slowly changing")) {
    childFriendly = "Imagine you move to a new room. SCD Type 1 is erasing 'Room 101' and writing 'Room 202' (no history!). SCD Type 2 is keeping the photo of you in Room 101, taking a new photo of you in Room 202, and writing the dates on both photos so you see your full moving history!";
    handsOn = "Insert a new location record for a sensor while updating the old location bounds (SCD Type 2).";
    handsOnCode = "UPDATE dim_devices SET end_date = NOW(), is_current = FALSE WHERE device_id = 5 AND is_current = TRUE;\nINSERT INTO dim_devices (device_id, location, start_date, is_current) VALUES (5, 'Room 202', NOW(), TRUE);";
  }
  else {
    if (category === "setup") {
      childFriendly = "Think of this setup as organizing your workspace. We configure database connections like connecting phone lines so our applications can talk to each other without error.";
      handsOn = "Create a schema/database namespace to organize your tables.";
      handsOnCode = "CREATE DATABASE IF NOT EXISTS smart_buildings_db;";
    } else if (category === "fundamentals") {
      childFriendly = "This is the alphabet of database tables. You write instructions (DDL) to build shelves, and commands (DML) to add or edit the boxes sitting on those shelves.";
      handsOn = "Rename a column or alter its data type using ALTER TABLE.";
      handsOnCode = "ALTER TABLE smart_devices MODIFY COLUMN status VARCHAR(20);";
    } else if (category === "keys") {
      childFriendly = "These constraints are boundaries for data. They are like safety fences around a playground to make sure data entries don't wander off or get mixed up.";
      handsOn = "Add a constraint to make sure room temperature is never below 0 degrees.";
      handsOnCode = "ALTER TABLE room_telemetry ADD CONSTRAINT chk_temp CHECK (temp >= 0);";
    } else if (category === "querying") {
      childFriendly = "This is like selecting specific crayons from a coloring box. You ask for specific colors (columns), filter out broken crayons (WHERE), and count them by pile.";
      handsOn = "Count the total number of logs recorded, ignoring NULL rows.";
      handsOnCode = "SELECT COUNT(sensor_id) FROM sensor_logs;";
    } else if (category === "manipulation") {
      childFriendly = "This is playing with letters and numbers. It lets you format dates, stitch texts together, or clean up spacing to keep data readable.";
      handsOn = "Concatenate building name and device status with a hyphen separator.";
      handsOnCode = "SELECT CONCAT_WS(' - ', building_name, status) AS status_label FROM buildings;";
    } else if (category === "relational") {
      childFriendly = "This links different tables together. It's like pairing students with their books using names, or ranking runners by score partitions.";
      handsOn = "Create a virtual view of your reports to simplify complex joins.";
      handsOnCode = "CREATE VIEW view_active_alerts AS\nSELECT d.name, a.message\nFROM devices d\nJOIN alerts a ON d.id = a.device_id\nWHERE a.resolved = FALSE;";
    } else if (category === "performance") {
      childFriendly = "This is how we make things go fast! We create special paths and lookup booklets so we don't scan all shelves one-by-one.";
      handsOn = "Delete a duplicate or unneeded index to speed up write updates.";
      handsOnCode = "ALTER TABLE telemetry_records DROP INDEX idx_old_telemetry;";
    } else {
      childFriendly = "This is data warehousing. It's like storing old journals in archive boxes so that we can compare historical entries accurately.";
      handsOn = "Fetch records in Python using database cursors to process row-by-row.";
      handsOnCode = "# Python Cursor loop example:\n# cursor.execute('SELECT * FROM dim_devices')\n# for row in cursor.fetchall(): print(row)";
    }
  }
  
  return { childFriendly, handsOn, handsOnCode };
}

// Helper: fallback generator to build 7-part cards dynamically from simulator data
function getStudyCardForQuestion(qObj, category) {
  // Check if we have a detailed hand-written one in INTERVIEW_PREP_DATA
  const detailedList = INTERVIEW_PREP_DATA[category] || [];
  const detailed = detailedList.find(c => c.id === qObj.id || c.title.toLowerCase().includes(qObj.q.toLowerCase().slice(0, 15)));
  
  let cardData = {};
  
  if (detailed) {
    cardData = { ...detailed };
  } else {
    // Formatting SQL keywords for syntax highlight/snippet
    let cleanSnippet = "";
    if (qObj.answer.toLowerCase().includes("select") || qObj.answer.toLowerCase().includes("create") || qObj.answer.toLowerCase().includes("alter") || qObj.answer.toLowerCase().includes("delete")) {
      // Attempt to extract sql statements inside answer, or default to general syntax
      const match = qObj.answer.match(/`([^`]+)`/);
      cleanSnippet = match ? match[1] : `-- SQL Statement:\n${qObj.answer}`;
    } else {
      cleanSnippet = `-- Explanation:\n-- ${qObj.answer.split('.').slice(0, 2).join('.')}`;
    }

    cardData = {
      id: qObj.id,
      title: qObj.q,
      easyDefinition: `Essential SQL interview concept focusing on: "${qObj.q}". It defines fundamental behaviors, syntax, or constraints within query operations.`,
      projectExample: `In our Smart Buildings monitoring systems, we use this database operation to structure API telemetry feeds and manage client reports efficiently.`,
      productionScenario: `Neglecting this constraint or syntax in high-concurrency environments leads to query locking, slow table scans, or incorrect reporting data.`,
      validations: `Verify code structures in query analyzers like DBeaver. Review SQL outputs, test null boundaries, and inspect query plan properties.`,
      interviewAnswer: qObj.answer,
      followUp: `What are the performance implications of this command under heavy database write/read ratios?`,
      mistakes: `Using wrong operators, forgetting index keys, or neglecting transaction limits.`,
      codeSnippet: cleanSnippet
    };
  }

  // Inject child analogy and hands-on query challenge dynamically
  const extra = getChildFriendlyAndHandsOn(qObj, category);
  cardData.childFriendly = cardData.childFriendly || extra.childFriendly;
  cardData.handsOn = cardData.handsOn || extra.handsOn;
  cardData.handsOnCode = cardData.handsOnCode || extra.handsOnCode;

  return cardData;
}

// Render the Study Cards inside a module
function renderModuleStudyCards(category) {
  const panel = document.getElementById(`panel-${category}`);
  if (!panel) return;
  
  const studyTabContent = panel.querySelector('.tab-content[data-tab="study"]');
  if (!studyTabContent) return;
  
  // Clear old content
  studyTabContent.innerHTML = "";
  
  // Get all questions in this category from the simulator database
  const questionsList = MOCK_INTERVIEW_QUESTIONS[category] || [];
  
  if (questionsList.length === 0) {
    studyTabContent.innerHTML = "<p class='text-muted'>No study cards available for this module.</p>";
    return;
  }

  // Iterate over all simulator questions in category, map to study cards
  questionsList.forEach((qObj, index) => {
    const cardData = getStudyCardForQuestion(qObj, category);
    const isMastered = state.masteredIds.includes(cardData.id);
    
    const cardHTML = `
      <div class="study-card" id="card-${cardData.id}">
        <div class="card-header-row">
          <div class="card-title-group">
            <h3>#${index + 1}: ${cardData.title}</h3>
          </div>
          <label class="mastery-checkbox-label">
            <input type="checkbox" data-card-id="${cardData.id}" ${isMastered ? "checked" : ""} onchange="toggleCardMastery('${cardData.id}')">
            <span>Mastered</span>
          </label>
        </div>
        
        <div class="study-sections-grid">
          <div class="study-sec">
            <div class="study-sec-title">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              Easy English Definition
            </div>
            <div class="study-sec-content">${cardData.easyDefinition}</div>
          </div>
          
          <div class="study-sec">
            <div class="study-sec-title">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
              Real-Time Project Example
            </div>
            <div class="study-sec-content">${cardData.projectExample}</div>
          </div>
          
          <div class="study-sec sec-break">
            <div class="study-sec-title">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              Live Production Scenario (What Breaks)
            </div>
            <div class="study-sec-content">${cardData.productionScenario}</div>
          </div>
          
          <div class="study-sec">
            <div class="study-sec-title">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              Testing/Verification Validations
            </div>
            <div class="study-sec-content">${cardData.validations}</div>
          </div>
          
          <div class="study-sec">
            <div class="study-sec-title">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>
              1-Minute Interview Answer
            </div>
            <div class="study-sec-content"><strong>"</strong>${cardData.interviewAnswer}<strong>"</strong></div>
          </div>
          
          <div class="study-sec">
            <div class="study-sec-title">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16h-2v-2h2v2zm1.07-7.75l-.9.92C12.45 11.9 12 12.5 12 14h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z"/></svg>
              Interviewer Follow-ups
            </div>
            <div class="study-sec-content">${cardData.followUp}</div>
          </div>
        </div>
        
        <!-- Child Analogy section -->
        <div class="study-sec child-analogy-sec" style="margin-top: 1.5rem; margin-bottom: 1.5rem; background: rgba(168, 85, 247, 0.05); border: 1px solid rgba(168, 85, 247, 0.15);">
          <div class="study-sec-title" style="color: #a855f7;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="margin-right:4px; vertical-align:middle;"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            Child-Friendly Explanation & Analogy 🧸
          </div>
          <div class="study-sec-content">${cardData.childFriendly}</div>
        </div>

        <!-- Mistakes section -->
        <div class="study-sec sec-mistakes" style="margin-bottom: 1.5rem;">
          <div class="study-sec-title">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>
            Common Mistakes to Avoid
          </div>
          <div class="study-sec-content">${cardData.mistakes}</div>
        </div>

        <!-- Hands-On Challenge Section -->
        <div class="study-sec hands-on-sec" style="margin-bottom: 1.5rem; background: rgba(0, 210, 255, 0.05); border: 1px solid rgba(0, 210, 255, 0.15);">
          <div class="study-sec-title" style="color: var(--neon-blue);">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="margin-right:4px; vertical-align:middle;"><path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.11-.9-2-2-2H4c-1.11 0-2 .89-2 2v10c0 1.1.89 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>
            Hands-on Practice Challenge 💻
          </div>
          <div class="study-sec-content" style="margin-bottom: 10px;"><strong>Task:</strong> ${cardData.handsOn}</div>
          
          <div class="code-section" style="margin-top: 0; background: #04070d;">
            <div class="code-header">
              <span>SQL Challenge Solution</span>
              <button class="btn-copy" onclick="copyCodeText(this)">Copy Solution</button>
            </div>
            <pre class="code-block"><code>${cardData.handsOnCode}</code></pre>
          </div>
        </div>

        <!-- Ideal Code / Explanation Block -->
        <div class="code-section">
          <div class="code-header">
            <span>Interview Reference SQL / Explanation Snippet</span>
            <button class="btn-copy" onclick="copyCodeText(this)">Copy SQL</button>
          </div>
          <pre class="code-block"><code>${cardData.codeSnippet}</code></pre>
        </div>
      </div>
    `;
    studyTabContent.insertAdjacentHTML("beforeend", cardHTML);
  });
}

// Toggle study card mastery state
window.toggleCardMastery = function(cardId) {
  const index = state.masteredIds.indexOf(cardId);
  if (index > -1) {
    state.masteredIds.splice(index, 1);
  } else {
    state.masteredIds.push(cardId);
  }
  saveProgress();
};

// Render Practice Questions inside module
function renderModulePracticeQuestions(category) {
  const panel = document.getElementById(`panel-${category}`);
  if (!panel) return;
  
  const practiceTabContent = panel.querySelector('.tab-content[data-tab="practice"]');
  if (!practiceTabContent) return;
  
  practiceTabContent.innerHTML = `
    <div class="practice-portal-header">
      <h3>Interactive Practice Simulator</h3>
      <p class="text-muted" style="font-size:0.85rem; margin-top:4px;">Write your response below. The AI evaluator will score your answer, review grammar, check for key terms, and provide professional suggestions.</p>
    </div>
    <div class="questions-list"></div>
  `;
  
  const questionsListContainer = practiceTabContent.querySelector(".questions-list");
  const questionsList = MOCK_INTERVIEW_QUESTIONS[category] || [];
  
  questionsList.forEach((qObj, index) => {
    const questionCardHTML = `
      <div class="question-card" id="practice-${qObj.id}">
        <div class="question-text">Q${index + 1}: ${qObj.q}</div>
        <form class="evaluator-form" onsubmit="handlePracticeSubmit(event, '${category}', '${qObj.id}')">
          <textarea class="textarea-answer" placeholder="Type or paste your technical answer here..." required></textarea>
          <div class="form-actions">
            <button type="submit" class="btn-primary">Evaluate Answer</button>
          </div>
        </form>
        <div class="eval-results-container" style="display:none;"></div>
      </div>
    `;
    questionsListContainer.insertAdjacentHTML("beforeend", questionCardHTML);
  });
}

// Handle Practice Submission & run heuristic evaluator
window.handlePracticeSubmit = function(event, category, questionId) {
  event.preventDefault();
  const form = event.target;
  const textarea = form.querySelector(".textarea-answer");
  const userText = textarea.value;
  const card = document.getElementById(`practice-${questionId}`);
  const resultsContainer = card.querySelector(".eval-results-container");
  
  // Call simulator.js evaluator logic
  const evalResult = evaluateAnswer(category, questionId, userText);
  
  // Map score class
  let scoreClass = "low";
  if (evalResult.score >= 8) scoreClass = "high";
  else if (evalResult.score >= 5) scoreClass = "mid";
  
  // Match terms lists
  const matchedBadges = evalResult.matchingKeywords.map(k => `<span class="kw-badge matched">${k}</span>`).join(" ");
  const missingBadges = evalResult.missingKeywords.map(k => `<span class="kw-badge missing">${k}</span>`).join(" ");
  
  resultsContainer.innerHTML = `
    <div class="eval-results-box">
      <div class="eval-score-row">
        <span style="font-weight:600; font-size:0.95rem;">Evaluation Feedback</span>
        <span class="score-badge ${scoreClass}">Score: ${evalResult.score}/10</span>
      </div>
      
      <div class="eval-details-grid">
        <div class="eval-part">
          <div class="eval-lbl">Grammar & Speaking Advice</div>
          <div class="eval-content">${evalResult.grammarFeedback}</div>
        </div>
        
        <div class="eval-part">
          <div class="eval-lbl">Technical Keywords Check</div>
          <div class="eval-content">
            <div style="margin-bottom:6px;"><strong>Matched:</strong> ${matchedBadges || '<span class="text-muted">None</span>'}</div>
            <div><strong>Missing:</strong> ${missingBadges || '<span class="text-muted">None</span>'}</div>
          </div>
        </div>
      </div>
      
      <div class="eval-part" style="margin-top: 1rem;">
        <div class="eval-lbl">Refined Professional Response</div>
        <div class="eval-better-version">${evalResult.betterVersion}</div>
      </div>
      
      <div class="eval-part" style="margin-top: 1rem;">
        <div class="eval-lbl">Ideal Knowledge Answer</div>
        <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">${evalResult.idealAnswer}</div>
      </div>
    </div>
  `;
  
  resultsContainer.style.display = "block";
};

// Render Sub-Tabs (Study & Practice) inside main view panel
function renderModuleTabs(panelId) {
  const panel = document.getElementById(`panel-${panelId}`);
  if (!panel) return;
  
  const subTab = state.activeSubTabs[panelId] || "study";
  
  // Add tabs header if it doesn't exist
  let subTabsHeader = panel.querySelector(".sub-tabs-container");
  if (!subTabsHeader) {
    panel.innerHTML = `
      <div class="sub-tabs-container">
        <button class="sub-tab-btn ${subTab === 'study' ? 'active' : ''}" data-panel="${panelId}" data-tab="study">Zero-to-Hero Study Guide</button>
        <button class="sub-tab-btn ${subTab === 'practice' ? 'active' : ''}" data-panel="${panelId}" data-tab="practice">Interactive Practice</button>
      </div>
      <div class="tab-content ${subTab === 'study' ? 'active' : ''}" data-tab="study"></div>
      <div class="tab-content ${subTab === 'practice' ? 'active' : ''}" data-tab="practice"></div>
    `;
  }
}

// Render STAR Project View
function renderStarProject() {
  const panel = document.getElementById("panel-star-project");
  if (!panel) return;
  
  panel.innerHTML = `
    <div class="project-container">
      <div class="project-card">
        <span class="project-badge">Production Case Study</span>
        <h2 class="project-title">${STAR_DE_PROJECT.title}</h2>
        
        <div class="star-section">
          <div class="star-header">
            <span class="star-letter">S</span>
            <h3>Situation</h3>
          </div>
          <div class="star-desc">${STAR_DE_PROJECT.situation}</div>
        </div>
        
        <div class="star-section">
          <div class="star-header">
            <span class="star-letter">T</span>
            <h3>Task</h3>
          </div>
          <div class="star-desc">${STAR_DE_PROJECT.task}</div>
        </div>
        
        <div class="star-section">
          <div class="star-header">
            <span class="star-letter">A</span>
            <h3>Action</h3>
          </div>
          <div class="star-desc">${STAR_DE_PROJECT.action}</div>
        </div>
        
        <div class="star-section">
          <div class="star-header">
            <span class="star-letter">R</span>
            <h3>Result</h3>
          </div>
          <div class="star-desc">${STAR_DE_PROJECT.result}</div>
        </div>
      </div>
      
      <div class="study-card" style="margin-bottom:0;">
        <h3>Pipeline Implementation Code</h3>
        <p class="text-muted" style="font-size:0.85rem; margin:6px 0 20px 0;">SQL DDL structures, deduplication windows, and SCD Type 2 merge scripts used in the project.</p>
        
        <div class="code-section">
          <div class="code-header">
            <span>ETL Data Pipeline (SQL Scripts)</span>
            <button class="btn-copy" onclick="copyCodeText(this)">Copy SQL Code</button>
          </div>
          <pre class="code-block"><code>${STAR_DE_PROJECT.sqlCode}</code></pre>
        </div>
        
        <div class="code-section" style="margin-top:2rem;">
          <div class="code-header">
            <span>Python Connection Connectors & Transactions</span>
            <button class="btn-copy" onclick="copyCodeText(this)">Copy Python Code</button>
          </div>
          <pre class="code-block"><code>${STAR_DE_PROJECT.pythonCode}</code></pre>
        </div>
      </div>
    </div>
  `;
}

// Render Exam Simulator View
function renderExamSimulator() {
  const panel = document.getElementById("panel-exam-simulator");
  if (!panel) return;
  
  if (!state.currentExam) {
    // Show start screen
    panel.innerHTML = `
      <div class="exam-wizard-card">
        <div class="exam-setup-view">
          <div class="logo-icon" style="margin:0 auto 1.5rem auto; width:60px; height:60px; font-size:2rem;">📝</div>
          <h2>SQL Master Class Mock Exam</h2>
          <p>Test your knowledge under realistic interview conditions. The simulator will compile a 10-question comprehensive exam covering all 8 curriculum modules.</p>
          <button class="btn-large" onclick="startNewExam()">Start Simulation Exam</button>
        </div>
      </div>
    `;
  } else {
    // Show active running exam
    const exam = state.currentExam;
    const currentQIndex = exam.currentIndex;
    const qObj = exam.questions[currentQIndex];
    const isFirst = currentQIndex === 0;
    const isLast = currentQIndex === exam.questions.length - 1;
    const progressPercent = ((currentQIndex + 1) / exam.questions.length) * 100;
    
    // Check if user has typed an answer previously
    const existingAnswer = exam.answers[qObj.id] || "";
    
    panel.innerHTML = `
      <div class="exam-wizard-card">
        <div class="exam-running-view">
          <div class="exam-question-header">
            <span>SQL Master Exam Simulator</span>
            <span>Question ${currentQIndex + 1} of ${exam.questions.length}</span>
          </div>
          
          <div class="exam-progress-bar-container">
            <div class="exam-progress-bar-fill" style="width: ${progressPercent}%;"></div>
          </div>
          
          <div class="exam-question-box">
            ${qObj.q}
          </div>
          
          <form class="evaluator-form" onsubmit="submitExamQuestion(event)">
            <textarea class="textarea-answer" id="exam-answer-input" placeholder="Type your structured technical response..." required>${existingAnswer}</textarea>
            
            <div class="exam-actions">
              <button type="button" class="btn-secondary" ${isFirst ? 'disabled' : ''} onclick="navigateExam(-1)">Previous</button>
              
              ${isLast ? 
                `<button type="submit" class="btn-primary" style="background:var(--gradient-neon); color:#000;">Finish & Grade Exam</button>` : 
                `<button type="submit" class="btn-primary">Next Question</button>`
              }
            </div>
          </form>
        </div>
      </div>
    `;
    
    // Focus textarea
    document.getElementById("exam-answer-input").focus();
  }
}

// Start a randomized simulation exam
window.startNewExam = function() {
  // Select 10 random questions, ensuring representation across modules
  const chosenQuestions = [];
  const categories = Object.keys(MOCK_INTERVIEW_QUESTIONS);
  
  // Try to get 1 or 2 from each category
  categories.forEach(cat => {
    const list = MOCK_INTERVIEW_QUESTIONS[cat];
    if (list && list.length > 0) {
      // Pick random
      const randQ = list[Math.floor(Math.random() * list.length)];
      chosenQuestions.push({ ...randQ, category: cat });
    }
  });

  // Shuffle and slice to 10 questions
  chosenQuestions.sort(() => 0.5 - Math.random());
  const finalQuestions = chosenQuestions.slice(0, 10);
  
  state.currentExam = {
    questions: finalQuestions,
    currentIndex: 0,
    answers: {}, // questionId -> text
    evaluations: {} // questionId -> evalResult
  };
  
  renderExamSimulator();
};

// Navigate inside Exam
window.navigateExam = function(direction) {
  if (!state.currentExam) return;
  
  // Save current answer first
  const currentQ = state.currentExam.questions[state.currentExam.currentIndex];
  const input = document.getElementById("exam-answer-input");
  if (input) {
    state.currentExam.answers[currentQ.id] = input.value;
  }
  
  state.currentExam.currentIndex += direction;
  renderExamSimulator();
};

// Submit question in Exam wizard
window.submitExamQuestion = function(event) {
  event.preventDefault();
  if (!state.currentExam) return;
  
  const exam = state.currentExam;
  const currentQ = exam.questions[exam.currentIndex];
  const input = document.getElementById("exam-answer-input");
  
  if (input) {
    exam.answers[currentQ.id] = input.value;
  }
  
  const isLast = exam.currentIndex === exam.questions.length - 1;
  if (isLast) {
    // Evaluate all answers and transition to results view
    gradeExam();
  } else {
    // Go to next question
    exam.currentIndex += 1;
    renderExamSimulator();
  }
};

// Grade the final exam answers
function gradeExam() {
  if (!state.currentExam) return;
  
  const exam = state.currentExam;
  let totalScore = 0;
  
  exam.questions.forEach(q => {
    const ans = exam.answers[q.id] || "";
    // evaluateAnswer returns { score, grammarFeedback, matchingKeywords, missingKeywords, betterVersion, idealAnswer }
    const result = evaluateAnswer(q.category, q.id, ans);
    exam.evaluations[q.id] = result;
    totalScore += result.score;
  });
  
  const finalAverage = Math.round((totalScore / exam.questions.length) * 10) / 10;
  
  // Store results display in UI
  const panel = document.getElementById("panel-exam-simulator");
  if (!panel) return;
  
  let breakdownHTML = "";
  exam.questions.forEach((q, idx) => {
    const evalRes = exam.evaluations[q.id];
    let scoreClass = "low";
    if (evalRes.score >= 8) scoreClass = "high";
    else if (evalRes.score >= 5) scoreClass = "mid";
    
    breakdownHTML += `
      <div class="breakdown-card">
        <div class="breakdown-header">
          <strong>Q${idx + 1}: ${q.q}</strong>
          <span class="score-badge ${scoreClass}">Score: ${evalRes.score}/10</span>
        </div>
        <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:10px;">Module: ${q.category.toUpperCase()}</div>
        
        <div class="eval-part" style="margin-bottom:10px;">
          <div class="eval-lbl">Your Answer</div>
          <div class="eval-content" style="font-style:italic;">"${exam.answers[q.id] || '(No response)'}"</div>
        </div>
        
        <div class="eval-part" style="margin-bottom:10px;">
          <div class="eval-lbl">Grammar Feedback</div>
          <div class="eval-content">${evalRes.grammarFeedback}</div>
        </div>
        
        <div class="eval-part">
          <div class="eval-lbl">Technical Keywords Check</div>
          <div class="eval-keywords-list" style="margin-top:4px;">
            ${evalRes.matchingKeywords.map(k => `<span class="kw-badge matched">${k}</span>`).join(" ") || '<span class="text-muted">None Matched</span>'}
            ${evalRes.missingKeywords.map(k => `<span class="kw-badge missing">${k}</span>`).join(" ") || '<span class="text-muted">None Missing</span>'}
          </div>
        </div>
      </div>
    `;
  });
  
  panel.innerHTML = `
    <div class="exam-wizard-card">
      <div class="exam-results-view">
        <div class="exam-score-hero">
          <div class="exam-score-number">${finalAverage} / 10</div>
          <div class="exam-score-lbl">Exam Complete! Overall Score</div>
          <button class="btn-primary" style="margin-top:1.5rem;" onclick="restartExamSimulator()">Retake New Exam</button>
        </div>
        
        <h2>Detailed Exam Breakdown</h2>
        <div class="exam-breakdown">
          ${breakdownHTML}
        </div>
      </div>
    </div>
  `;
  
  // Sync score with localStorage
  localStorage.setItem("sql_masterclass_exam_score", finalAverage.toString());
  updateDashboardStats();
  
  // Clear running exam from state
  state.currentExam = null;
}

// Reset exam screen
window.restartExamSimulator = function() {
  state.currentExam = null;
  renderExamSimulator();
};

// UI Progress Helpers
function updateDashboardStats() {
  const totalQuestions = 100; // total database size
  const totalMastered = state.masteredIds.length;
  
  // Update mastered count
  const masteryStat = document.getElementById("stat-mastery-val");
  if (masteryStat) {
    masteryStat.innerText = `${totalMastered} / ${totalQuestions}`;
  }
  
  // Update latest simulator score
  const scoreStat = document.getElementById("stat-score-val");
  if (scoreStat) {
    const latestScore = localStorage.getItem("sql_masterclass_exam_score") || "0.0";
    scoreStat.innerText = `${latestScore} / 10`;
  }
}

// Render dynamic progress bars on the top dashboard
function renderModuleProgressBars() {
  const container = document.getElementById("module-progress-container");
  if (!container) return;
  
  container.innerHTML = "";
  
  MODULE_METADATA.forEach(module => {
    // Count questions in this module
    const questions = MOCK_INTERVIEW_QUESTIONS[module.id] || [];
    const totalQCount = questions.length;
    
    // Count mastered cards
    let masteredCount = 0;
    questions.forEach(q => {
      // Find card ID for this question
      const cardData = getStudyCardForQuestion(q, module.id);
      if (state.masteredIds.includes(cardData.id)) {
        masteredCount++;
      }
    });
    
    const percentage = totalQCount > 0 ? Math.round((masteredCount / totalQCount) * 100) : 0;
    
    const progressCardHTML = `
      <div class="module-progress-card" onclick="switchPanel('${module.id}')">
        <div class="mp-title" title="${module.title}">${module.title}</div>
        <div class="mp-bar-container">
          <div class="mp-bar-fill" style="width: ${percentage}%;"></div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="mp-percentage">${percentage}% Done</span>
          <span style="font-size:0.7rem; color:var(--text-muted);">${masteredCount}/${totalQCount} cards</span>
        </div>
      </div>
    `;
    container.insertAdjacentHTML("beforeend", progressCardHTML);
  });
}

// Update sidebar badges showing question counts and mastered percentages
function updateSidebarBadges() {
  MODULE_METADATA.forEach(module => {
    const navItem = document.querySelector(`.nav-item[data-panel="${module.id}"]`);
    if (navItem) {
      const badge = navItem.querySelector(".nav-item-badge");
      if (badge) {
        const questions = MOCK_INTERVIEW_QUESTIONS[module.id] || [];
        let mastered = 0;
        questions.forEach(q => {
          const card = getStudyCardForQuestion(q, module.id);
          if (state.masteredIds.includes(card.id)) mastered++;
        });
        badge.innerText = `${mastered}/${questions.length}`;
      }
    }
  });
}

// Global copy utility
window.copyCodeText = function(btn) {
  const codeBlock = btn.parentElement.nextElementSibling.querySelector("code");
  if (!codeBlock) return;
  
  navigator.clipboard.writeText(codeBlock.innerText).then(() => {
    btn.innerText = "Copied!";
    btn.classList.add("copied");
    
    setTimeout(() => {
      btn.innerText = "Copy";
      btn.classList.remove("copied");
    }, 2000);
  });
};
