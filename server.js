const express = require('express');
const cors = require('cors');
const app = express();
const fetch = require('node-fetch');
const os = require('os');
const fs = require('fs');

app.use(cors());
const Datastore  = require('nedb');
const port=process.env.PORT || 3000;
app.listen(port, () => console.log("listening to 80"));
app.use(express.static('public'));
app.use(express.json({limit: 'imb'}))

const database = new Datastore('database.db');
database.loadDatabase();

//create a server object:
app.post('/api/photos', (request, response) => {

  const data = request.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  database.insert(data);
  const img = request.body.image64.replace("data:image/png;base64,", "");
  var buf = new Buffer.from(img, 'base64');
  var fs = require('fs');
  fs.writeFile("C:/Users/mscheele/image.png", buf, err => {if (err) throw err; console.log("File saved")});
  response.json({
    status: 'success',
    latitude: request.body.lat,
    longitude: request.body.long,
    tag: request.body.tags
  });
});

app.get('/api', (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.end;
      return
    }
    response.json(data);
  });
});

app.get('/weather/:latlong', async (request, response) => {
    const latlong = request.params.latlong.split(',');
    const lat = latlong[0];
    const long = latlong[1];
    const fetch_response =  await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact.json?lat=${lat}&lon=${long}`);
    const fetch_icon_response =  await fetch(`https://api.met.no/weatherapi/weathericon/2.0/data`, {gzip: true, resolveWithFullResponse: true, encoding: null, headers: {'Accept' : 'application/x-download'}});
    console.log(fetch_icon_response.body);
    const data = await fetch_response.json();
    //const tid = data.timeseries(0).time;
    response.json(data);
  }
);
