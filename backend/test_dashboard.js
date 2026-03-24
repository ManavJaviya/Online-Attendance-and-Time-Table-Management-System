const fs = require('fs');
const dashboardController = require('./controllers/dashboardController');

const req = {};
const res = {
  json: function(data) {
    fs.writeFileSync('output_utf8.json', JSON.stringify(data, null, 2), 'utf-8');
    process.exit(0);
  },
  status: function(code) {
    return this;
  }
};

dashboardController.getDashboardStats(req, res).catch(err => {
    console.error(err);
    process.exit(1);
});
