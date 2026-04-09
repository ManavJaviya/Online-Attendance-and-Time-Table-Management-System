const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'frontend/src/components/admin/Lowattendancetable.js',
  'frontend/src/components/admin/Recentactivity.js',
  'frontend/src/pages/AdminDashboardPage.js',
  'frontend/src/pages/FacultyAttendancePage.js',
  'frontend/src/pages/ManageTimetablePage.js',
  'frontend/src/pages/ManageUsersPage.js',
  'frontend/src/pages/ReportsPage.js',
  'frontend/src/pages/UploadStudentDataPage.js',
  'frontend/src/pages/FacultyReportsPage.js'
];

filesToUpdate.forEach(file => {
  const fullPath = path.join(__dirname, file);
  let content = fs.readFileSync(fullPath, 'utf8');

  // Add import if not exists
  if (!content.includes('API_BASE_URL')) {
    // Find the last import
    const importRegex = /^import\s+.*?;?\s*$/gm;
    let match;
    let lastImportIndex = 0;
    while ((match = importRegex.exec(content)) !== null) {
      lastImportIndex = match.index + match[0].length;
    }
    
    // In components it's easier to just put it after react import
    // Let's just prepend it or put it after the imports
    
    // determine relative path to config.js
    const isComponentAdmin = file.includes('components/admin');
    const importPath = isComponentAdmin ? '../../config' : '../config';
    
    const importStmt = `import { API_BASE_URL } from '${importPath}';\n`;
    
    // Insert after the first import or at the top
    if (content.startsWith('import')) {
        const firstNewLine = content.indexOf('\n');
        content = content.slice(0, firstNewLine + 1) + importStmt + content.slice(firstNewLine + 1);
    } else {
        content = importStmt + content;
    }
  }

  // Replace all forms of http://localhost:5000 string literals
  // Double quotes
  content = content.replace(/"http:\/\/localhost:5000([^"]*)"/g, '`${API_BASE_URL}$1`');
  // Single quotes
  content = content.replace(/'http:\/\/localhost:5000([^']*)'/g, '`${API_BASE_URL}$1`');
  // Template literals without expressions inside the base url part
  content = content.replace(/`http:\/\/localhost:5000([^`]*)`/g, '`${API_BASE_URL}$1`');

  fs.writeFileSync(fullPath, content);
  console.log(`Updated ${file}`);
});
