const Airtable = require('airtable');

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_KEY,
});
const base = Airtable.base(process.env.AIRTABLE_BASE);

module.exports = {

  async findRecord(field, value) {
    return new Promise((res) => {
      base('Table 1').select({
        filterByFormula: `{${field}}="${value}"`,
      }).firstPage((err, results) => {
        if (err) {
          // handle err;
          console.log(err);
          res(false);
        }
        if (results.length === 0) { res(false); }
        res(results);
      });
    });
  },

  storeRecord(record) {
    return new Promise((res) => {
      base('Table 1').create(record, (err, id) => {
        if (err) {
          console.error(err);
          res(false);
        }
        res(id);
      });
    });
  },

  updateRecord(record) {
    return new Promise((res) => {
      base('Table 1').update(record.id, record, (err, result) => {
        if (err) {
          console.error(err);
          res(false);
        }
        res(result);
      });
    });
  },
};
