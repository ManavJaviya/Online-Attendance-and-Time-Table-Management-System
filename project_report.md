# Project Report: Online Attendance and Time Table Management System

---

## 1. PROJECT OVERVIEW

**Project Title:** Online Attendance and Time Table Management System (OATTMS)  
**Tagline:** Streamlining academic scheduling and attendance tracking for modern educational institutions.

**Problem Statement:**  
Traditional educational institutions often rely on manual, paper-based or disjointed spreadsheet methods for tracking student attendance and managing complex class timetables. This leads to administrative inefficiencies, data entry errors, delayed reporting, and communication gaps—especially when ad-hoc changes like lecture swaps or faculty substitutions occur. 

**Goals:**
1. **Automate Attendance Tracking:** Eliminate manual roll calls by digitizing the attendance recording process.
2. **Centralize Timetable Management:** Provide a unified interface to view, update, and swap lectures without causing schedule conflicts.
3. **Enhance Visibility and Reporting:** Deliver real-time analytics and attendance trend visualization to students, faculty, and administrators.
4. **Improve Communication:** Ensure schedule changes reflect instantly across all relevant dashboards.

**Scope:**
- **In Scope:** Role-based secure login, dynamic timetable creation and swapping, real-time attendance marking (present/absent), automated data synchronization between frontend and database, CSV-based bulk import for student data, and role-specific dashboards with interactive charts.
- **Out of Scope:** Grading systems, financial/fee management, HR/payroll for faculty, and biometric hardware integrations.

**Success Criteria:**
- 100% elimination of double-booked lectures or classrooms.
- Real-time chart accuracy reflecting database states (0 data mismatch).
- Sub-2-second response time for attendance submission and timetable querying.
- Seamless CSV upload processing for student data bulk-creation.

**Stakeholders:**
- **Admin:** System administrators managing overall data, user accounts, master timetables, and institution-wide reports.
- **Faculty:** Teachers reading timetables, marking daily attendance, and swapping assigned lectures with peers.
- **Students:** End-users viewing their own attendance statistics, tracking missed classes, and viewing their weekly timetables.
- **Institution Management (Sponsors):** Leadership utilizing system analytics to monitor overall academic performance.

**Assumptions Made During Development:**
- All users have access to internet-enabled devices (PC/Mobile) to access the web portal.
- Faculty will mark attendance promptly within the designated time frame.
- An initial dataset of subjects and faculty profiles is pre-defined or imported prior to daily operations.

---

## 2. TECHNICAL STACK

**Programming Languages:**
- **JavaScript (ES6+)** – Core language for both frontend and backend logic.
- **HTML5 & CSS3** – Markup and styling.

**Frameworks and Libraries:**
- **Frontend:** React.js (v19) – For building a fast, component-based Single Page Application (SPA). React Router DOM (v7) for client-side routing.
- **Backend:** Express.js (v5) & Node.js – Lightweight, fast backend routing and API creation.
- **UI/Charting:** Recharts (v3) – For rendering interactive graphical data (e.g., Weekly Attendance Trends).

**Database and Storage:**
- **Primary Database:** Firebase Firestore – A NoSQL cloud database for real-time synchronization and scalable document storage (collections for `class_sessions`, `timetable`, etc.).
- **Authentication:** Firebase Authentication – Secure user identity management.
- **Local Cache/Storage:** JSON File system (`students.json`, `studentLoginData.json`) – Used for supplementary local fast-read mechanisms and data sync verification.

**APIs and Third-Party Integrations:**
- **Axios (v1.14):** Used for robust promise-based HTTP requests between the React frontend and Express backend.
- **Firebase Admin SDK (v13):** Backend integration with Firebase services with elevated privileges.
- **CORS:** Middleware to enable cross-origin requests safely.

**DevOps and Development Tools:**
- **Dev Tools:** VS Code, Git, npm, React Scripts.
- **Testing Tools:** React Testing Library, Jest.

**Justification for Technology Stack:**
- **React & Express:** Provides a unified JavaScript ecosystem (MERN-like stack without MongoDB), reducing context-switching for developers.
- **Firebase:** Reduces overhead on building complex authentication and real-time database infrastructure from scratch. Firestore's document-model fits well with attendance records and timetables.

---

## 3. REQUIREMENTS AND CONSTRAINTS

**Milestones & Timeline:**
- Development structured over an estimated 12-week life cycle encompassing Discovery, Core Dev, Refinement (charts/syncing), and Deployment. (A "Hard Deadline" of end-of-semester deployment).

**Budget Estimate:**
- **Development Hours:** ~400-500 hours (Design, UI, API, Database, Testing).
- **Hosting/Infrastructure:** Firebase Free Tier (Spark plan) for development, transitioning to minimal Blaze plan costs for production; basic Node.js hosting (e.g., Vercel, Render) ~$20/month.
- **Licenses:** Strictly open-source (MIT/ISC licenses via npm). Total software license cost: $0.

**Security Requirements:**
- **Authentication:** Enforcement of signed-in sessions for all routes; password hashing handled via Firebase Auth.
- **Access Control:** Route protection on the frontend (e.g., Students cannot access `/admin` or `/faculty` pages) and token verification/role checks on backend endpoints.
- **Data Protection:** Firestore Security Rules restricting read/write capabilities by document owner/role.

**Compliance Requirements:**
- Basic data privacy principles adhering to standard PII protection (encrypting passwords, securing emails and roll numbers).

**Technical Constraints:**
- The application relies on modern web browsers (Chrome, Firefox, Safari versions specified in `browserslist`).
- Network limits: Relies heavily on API calls; a continuous internet connection is required.

**Team Constraints:**
- Designed to be developed and maintained by a small full-stack engineering team.

---

## 4. FUNCTIONAL REQUIREMENTS

**User Roles:** Admin, Faculty, Student.

**User Stories by Role:**

*Admin:*
1. "As an Admin, I want to bulk upload student data via a CSV file so that I can quickly onboard a new batch without manual entry."
2. "As an Admin, I want to view a centralized reports dashboard so that I can monitor institution-wide attendance trends."
3. "As an Admin, I want to manage system users (Create, Read, Update, Delete) so that I maintain correct access control."
4. "As an Admin, I want to define the master timetable so that the base schedule is set for the semester."
5. "As an Admin, I want to inspect lecture swaps to ensure there are no unintended faculty clashes."

*Faculty:*
1. "As a Faculty member, I want to view my daily assigned timetable so that I know exactly when and where I need to teach."
2. "As a Faculty member, I want to mark student attendance for a specific session quickly so that administrative work is minimized."
3. "As a Faculty member, I want to initiate a lecture swap with another faculty member so that I can manage my absences efficiently."
4. "As a Faculty member, I want to view class-wise attendance reports so that I can identify students who are falling behind."
5. "As a Faculty member, I want to see a chart of my attendance statistics to measure my overall course engagement."

*Student:*
1. "As a Student, I want to view my personal attendance dashboard so that I know my current standing."
2. "As a Student, I want to see exactly which classes I have missed so that I can catch up on materials."
3. "As a Student, I want to view the weekly timetable so that I know my class schedule."
4. "As a Student, I want to see visual charts showing my attendance over the past weeks to understand my trend."
5. "As a Student, I want to securely log in using my roll number/email so that my academic data remains private."

**Core Features:**
- **Authentication system:** Secure user login and distinct role segregation.
- **Timetable Configuration:** Master generation, viewing, and real-time editing.
- **Lecture Swap Mechanism:** Faculty capability to swap lecture ownership.
- **Dynamic Attendance Marking:** Real-time logging of present/absent statuses mapping accurately to sessions.
- **Data Visualization & Dashboards:** Weekly charts, percentage calculators, and clash detection.
- **CSV Data Import:** Admin control for bulk uploading student users, matching `userId`.

**Acceptance Criteria (Top 5 Features):**
1. **Attendance Submission:** Given a faculty member has completed taking attendance, When they click "Submit", Then the data is securely saved to Firestore `class_sessions` and the local JSON store, reflecting instantly on the faculty report.
2. **CSV Upload:** Given an Admin provides a correctly formatted CSV, When the file is uploaded, Then the system validates the `userId` field, creates new users, ignores duplicates, and updates `students.json` successfully.
3. **Lecture Swap:** Given Faculty A wants to give a lecture to Faculty B, When the swap is confirmed in the dropdown UI, Then the timetable database updates the assigned `faculty_id` without creating overlapping schedules for Faculty B.
4. **Attendance Chart Display:** Given a student has 5 days of attendance records, When they load the Dashboard, Then the Recharts component dynamically maps days to data points without reflecting "0%" for valid attended days.
5. **Role-based Redirection:** Given a Student attempts to access `/admin/dashboard`, When the URL is executed, Then the system intercepts the request and redirects the user to `/student/dashboard` or a 403 error page.

---

## 5. NON-FUNCTIONAL REQUIREMENTS

- **Performance Targets:** Frontend initial load under 1.5 seconds. API endpoints to process timetable swaps or attendance saves under 500ms.
- **Reliability and Uptime:** Target 99.9% uptime reliant on Firebase Infrastructure. Fallback local JSON structures provide limited debugging and redundancy.
- **Scalability Plan:** The architecture (stateless Express APIs + Firebase NoSQL) inherently scales horizontally. Firestore allows 10,000+ simultaneous read/write operations per second, effectively handling 10x institution growth.
- **Accessibility Standards:** HTML structure follows logical semantic flows (`<main>`, `<nav>`). Target WCAG 2.1 AA (contrast ratios, readable typography).
- **Maintainability:** Component-based React architecture ensures modular UI. Centralized backend controllers (`attendanceController.js`, `timetableController.js`) ensure separated business logic.
- **Security Standards:** Protection against SQL injection (mitigated by Firestore NoSQL paradigm), CSRF, and XSS (React sanitizes by default). Password handling strictly delegated to Firebase Auth.

---

## 6. DATA CONSIDERATIONS

**Key Entities/Models:**
1. **User (Admin, Faculty, Student):**
   - Fields: `userId` / `uid`, `email`, `role`, `name`, `department`, `class` (for students).
2. **Timetable Slot:**
   - Fields: `day`, `timeSlot`, `subject`, `facultyId`, `classAssigned`, `room`.
3. **Class Session (Attendance event):**
   - Fields: `sessionId`, `date`, `timeSlot`, `subject`, `facultyId`, `attendanceMap` (Map of studentIds to booleans/status).

**Relationships:**
- **Faculty to Timetable Slot:** One-to-Many.
- **Student to Class Session:** Many-to-Many (tracked via the `attendanceMap` taking `userId` or roll number).
- **Class to Timetable:** One-to-Many.

**Data Sources:**
- User Input (Forms, Dropdowns).
- Admin CSV File uploads.
- Firebase Authentication state.

**Data Privacy Policy:**
- User emails and names are stored behind Firebase Auth and Firestore Security Rules.
- PII is strictly limited to academic context (no explicit addresses or highly sensitive personal data stored unless necessary).
- Data retention aligned with the academic year; older sessions can be archived into offline storage JSON backups.

---

## 7. SYSTEM ARCHITECTURE AND DESIGN

**High-Level Architecture:**
The system is built on a **Client-Server Architecture** utilizing a decoupled SPA communicating via RESTful APIs to an Express Node.js backend. The backend interfaces with Firebase Cloud Services.

**Major Components:**
- **React Frontend (`frontend/src`):** Contains `pages` (e.g., `AdminDashboardPage`, `FacultyAttendancePage`), `components` (reusable UI elements), `api` handlers (Axios config), and `styles`.
- **Express Backend (`backend/`):** Contains `server.js` (entry point), `routes/` (API endpoint definitions), and `controllers/` (business logic for auth, timetable, reports, users).
- **Firebase Backend-as-a-Service:** Manages token issuing and persistent database collections.

**Interaction Flow (e.g., Marking Attendance):**
1. React UI forms HTTP POST request via Axios containing session details.
2. Express `attendanceController` receives request, validates data payload and JWT.
3. Express processes the request, writing data to `Firestore` and additionally ensuring synchronization with local file state (`students.json` / `output.json`) for caching/debug.
4. Response 200 OK returned to the client, triggering Recharts UI update.

**Deployment Architecture:**
- **Dev:** Localhost environments (Node running on 3000 and 5000).
- **Production (Planned):** Frontend bundled via Webpack and hosted on a CDN (e.g., Firebase Hosting), Backend deployed to a Node.js cloud provider. Database relies on Firebase Cloud environment.

---

## 8. MODULES AND FEATURES (IMPLEMENTATION DETAILS)

1. **Authentication Module (`authController.js`, `LoginPage.js`)**
   - *Purpose:* Handle user verification and token passing.
   - *Tech:* Firebase Auth, React Router protected routes.
   - *Status:* Complete.

2. **Dashboard & Routing Module (`dashboardController.js`, `App.js`)**
   - *Purpose:* Serve relevant data overviews to specific roles and prevent unauthorized page access.
   - *Tech:* React Router, Express aggregated GET routes.
   - *Status:* Complete.

3. **Timetable Management Module (`timetableController.js`, `ManageTimetablePage.js`)**
   - *Purpose:* Creating schedules, swapping faculties seamlessly using dropdown interfaces.
   - *Tech:* Firestore `timetable` collections, Axios.
   - *Status:* Complete (Recently patched to fix data synchronization consistency between JSON and Firestore).

4. **Attendance Module (`attendanceController.js`, `FacultyAttendancePage.js`)**
   - *Purpose:* Core capability for faculty to track presents/absents.
   - *Tech:* React State mapping array of student IDs to boolean values, submitted to NoSQL map.
   - *Status:* Complete.

5. **Reporting & Analytics Module (`reportsController.js`, `ReportsPage.js`)**
   - *Purpose:* Extract insights, draw weekly trends, missed class counts.
   - *Tech:* Recharts library, Firestore Aggregation queries.
   - *Status:* Complete (Recently patched to fix zero-percent day mappings).

6. **User Admin Module (`userController.js`, `ManageUsersPage.js`, `UploadStudentDataPage.js`)**
   - *Purpose:* CRUD for users, processing CSV bulk uploads for rapid student onboarding, validating by `userId`.
   - *Tech:* File system (`fs`), CSV parsing algorithms, JSON data sync.
   - *Status:* Complete.

---

## 9. MILESTONES AND TIMELINE

| Phase | Duration | Key Tasks | Deliverables |
|---|---|---|---|
| **Discovery & Design** | 2 Weeks | Requirement gathering, UI mockups, database ER diagrams. | Architecture doc, UI wireframes. |
| **Foundation Development** | 3 Weeks | Setting up Firebase, React boilerplate, Express router, Authentication. | Basic login system, empty dashboards. |
| **Core Feature Build** | 4 Weeks | Timetable CRUD, Attendance logic, Student data mapping. | Functional Attendance & Timetable features. |
| **Analytics & Sub-features** | 2 Weeks | CSV uploading via ID, Recharts integration, lecture swapping. | Completed Admin Reports, Swap UI, Upload UI. |
| **Testing & Refinement** | 1 Week | Fixing chart zero-data bugs, JSON-Firestore sync issues, UI polishing. | Bug-free RC release. |

**Top 5 Risks & Mitigations:**
1. *Risk:* Inconsistent synchronization between local JSON and Firestore. *Mitigation:* Centralize write operations; if Firestore succeeds, execute JSON write synchronously.
2. *Risk:* CSV upload malformation crashing the backend. *Mitigation:* Implement strict schema validation (checking for `userId`) before processing file streams.
3. *Risk:* High latency fetching heavy attendance reports. *Mitigation:* Use Firestore's server-side aggregation and pagination.
4. *Risk:* Unauthorized timetable swaps. *Mitigation:* Backend verification ensuring user ID requesting the swap belongs to the designated faculty.
5. *Risk:* Charts displaying confusing/inaccurate data (e.g. `0%` bugs). *Mitigation:* Ensure strict date-time normalization at the API level before data hits Recharts.

---

## 10. TESTING STRATEGY

- **Unit Testing:** React components tested utilizing Jest and React Testing Library (configured natively as seen in `package.json`).
- **Backend API Testing:** Manual endpoint testing and debugging scripts (e.g., `debug_attendance.js`, `testDb.js`).
- **Integration Testing:** End-to-end data flow tests simulating a full cycle: login -> view timetable -> mark attendance -> view report.
- **Coverage Targets:** Core complex logic blocks (CSV parsing, Date-mapping for charts, Timetable swap logic) target high validation coverage.

**Sample Test Cases:**

| Test ID | Scenario | Steps | Expected Result | Status |
|---|---|---|---|---|
| TC-01 | Admin Login | 1. Navigate to `/`. 2. Enter Admin credentials. 3. Click Submit | Redirected to `/admin-dashboard` | Pass |
| TC-02 | File Upload Validation | 1. Go to Upload Student Data. 2. Upload CSV mapping `username` instead of `userId`. | System rejects upload, shows error. | Pass |
| TC-03 | File Upload Success | 1. Upload valid CSV with `userId`. | Students imported, JSON files updated. | Pass |
| TC-04 | Faculty Swap Consistency | 1. Faculty A swaps lecture to Faculty B. 2. Verify Firestore. 3. Verify `students.json`. | Both DB and JSON reflect Faculty B. | Pass |
| TC-05 | Attendance Chart Day Mapping | 1. Faculty marks attendance for Monday. 2. Student views Dashboard. | Recharts accurately shows percentage for 'Mon'. | Pass |
| TC-06 | Admin Reports UI View | 1. Visit Reports Page. 2. Click Attendance Tab | Aggregated stats for all classes loaded. | Pass |
| TC-07 | Student Missed Classes | 1. Mark student absent. 2. Student logs in. | Missed class appears instantly in list. | Pass |
| TC-08 | Route Protection | 1. Student logs in. 2. Edits URL to `/faculty-dashboard`. | Access Denied / Redirect. | Pass |

---

## 11. DELIVERABLES

- **Code Artifacts:** Fully functional Github repository with `/frontend` and `/backend` directories.
- **Data Schemas:** Firestore `.rules` and index files; local fallback mock data structures (`test_students.json`, `oldTimetable.json`).
- **Environment configurations:** Baseline `package.json` configurations and `.firebaserc`.
- **System Documentation:** Included inline code comments and generic `README.md`. 
- **Debug Tooling:** Provided backend scripts (`debug_dates.js`, `testPut.js`) for system maintenance.

---

## 12. RESULTS AND DISCUSSION

**Achievements:**
The system successfully replaced disjointed tracking mechanisms with a unified platform. Role-based dashboards operate seamlessly, fetching real-time data from Firestore. The inclusion of interactive data visualization (Recharts) deeply enhances the user experience.

**Challenges Faced & Solutions:**
- *Challenge:* Ensuring timetable swap consistency. When a faculty user swapped a class manually, the changes had to instantly sync between Firestore and local JSON datasets to avoid system fragmentation.
- *Solution:* Refactored the `timetableController` to utilize robust transaction-like methods ensuring both persistence layers updated together. Replaced generic free-text fields with programmatic Dropdown UI components to eliminate typo-induced orphaned timetable slots.
- *Challenge:* Attendance Trend charts displaying 0% incorrectly due to data timestamp mismatch.
- *Solution:* Diagnosed backend date handling, standardizing date-object normalization when aggregating `class_sessions` into frontend chart props.
- *Challenge:* Bulk Student Uploads failing due to schema differences (`username` vs `userId`).
- *Solution:* Updated parsing logic to rigidly validate using the modern `userId` primary key, gracefully handling duplicate records rather than crashing.

---

## 13. CONCLUSION AND FUTURE SCOPE

**Conclusion:**
OATTMS successfully meets its primary goals by fully digitizing student attendance and streamlining faculty scheduling. Administrative overhead is drastically reduced thanks to bulk CSV management and instant schedule conflict resolution. The application is performant, visually intuitive, and secure.

**Future Enhancements (Future Scope):**
1. **Biometric/RFID Integration:** Integrate hardware scanners for touchless automated attendance in physical classrooms.
2. **Mobile Application:** Expand the React web architecture into React Native for a dedicated push-notification enabled mobile app.
3. **Automated Reminders:** Implement Node.js Cron jobs to send automated emails to students dropping below a 75% attendance threshold.
4. **Offline Support:** Incorporate Progressive Web App (PWA) service workers allowing faculty to mark attendance offline and auto-sync when reconnected to Wi-Fi.
5. **Advanced Analytics:** Integrate machine learning models to predict student dropout latency based on attendance trends.

---

## 14. REFERENCES

1. "Express - Node.js web application framework." *Expressjs.com*. [https://expressjs.com/](https://expressjs.com/)
2. "React – A JavaScript library for building user interfaces." *Reactjs.org*. [https://reactjs.org/](https://reactjs.org/)
3. "Firebase Documentation." *Google Developers*. [https://firebase.google.com/docs](https://firebase.google.com/docs)
4. "Recharts: A composable charting library built on React components." *Recharts.org*. [https://recharts.org/](https://recharts.org/)
5. "Axios – Promise based HTTP client for the browser and node.js." [https://axios-http.com/](https://axios-http.com/)
6. "REST API Design Best Practices." *Microsoft Azure Architecture Center*.

---

## 15. APPENDIX

**Abbreviations:**
- **OATTMS:** Online Attendance and Time Table Management System
- **SPA:** Single Page Application
- **API:** Application Programming Interface
- **JSON:** JavaScript Object Notation
- **CRUD:** Create, Read, Update, Delete
- **JWT:** JSON Web Token
- **CSV:** Comma-Separated Values
- **PII:** Personally Identifiable Information

**Reviewer Note:**
> [!NOTE]
> *To complete this document to absolute perfection, please provide the following details if you have specific preferences:*
> 1. Exact Name/Affiliation of your institution to brand the report.
> 2. Hard budget/timeline numbers if this was created for a specific academic thesis or commercial gig.
> 3. Additional un-documented future scope ideas you wish to include.
