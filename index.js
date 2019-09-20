
require('dotenv').config();
const oauthshim = require('oauth-shim');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const database = require('./airtable.js');
const linkedin = require('./linkedin.js');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

async function customHandler(req, res, next) {
  // Check that this is a login redirect with an access_token (not a RESTful API call via proxy)
  if (req.oauthshim
&& req.oauthshim.redirect
&& req.oauthshim.data
&& req.oauthshim.data.access_token
&& req.oauthshim.options
&& !req.oauthshim.options.path) {
    // do something with the token (req.oauthshim.data.access_token)
    if (req.oauthshim.options.network === 'linkedin ') {
      await linkedin.store(req.oauthshim.data.access_token);
    }
  }

  // Call next to complete the operation
  next();
}

app.all('/proxy', oauthshim.interpret,
  customHandler,
  oauthshim.proxy,
  oauthshim.redirect,
  oauthshim.unhandled);

app.get('/create', cors(), async (req, res) => {
  const result = await database.storeRecord(req.query);
  res.send(result);
});

app.get('/find/:id', cors(), async (req, res) => {
  const exists = await database.findRecord('id', req.params.id);
  res.send(exists);
});

app.get('/linkedin/share/:id/:access_token', cors(), async (req, res) => {
  try {
    await linkedin.shareArticle(req.params.id, req.params.access_token);
    res.send('success');
  } catch (e) {
    res.send(e.message);
  }
});

app.get('/linkedin/profile/:access_token', cors(), async (req, res) => {
  try {
    const profile = await linkedin.getProfile(req.params.access_token);
    res.send(profile);
  } catch (e) {
    res.send(e.messgae);
  }
});
const creds = require('./credentials.js');

oauthshim.init(creds);

app.listen(process.env.PORT);

console.log(`OAuth Shim listening on ${process.env.PORT}`);
