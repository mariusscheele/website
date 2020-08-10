



function getLatLong() {
    if ('geolocation' in navigator) {
      console.log("Works");
      navigator.geolocation.getCurrentPosition(async function(position) {
        long = position.coords.longitude;
        lat = position.coords.latitude;
        document.getElementById('lat').textContent = lat;
        document.getElementById('long').textContent = long;
        mymap.setView([lat, long], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
          }).addTo(mymap);
        L.marker([lat, long]).addTo(mymap);
      })
    } else {
      console.log("Geo do not exists");
    }
  }

async function getIssCoords() {
    const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
    const data = await response.json();
    isslat = data.latitude;
    isslong= data.longitude;
    document.getElementById('isslat').textContent = isslat;
    document.getElementById('isslong').textContent = isslong;
}

function mapIss() {
    getIssCoords();
    mymap.flyTo([isslat, isslong], 4);
    var circle = L.circle([isslat, isslong], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500
    }).addTo(mymap);
    var polygon = L.polygon([[lat, long], [isslat, isslong]]).addTo(mymap);
}

async function getData() {
  //const search = document.getElementById('search').value;
  //if (search == "") {
  //  console.log(search);
  //};
  const response = await fetch('/api');
  const data = await response.json();

  for (item of data) {
    const root = document.createElement('div');
    const tags = document.createElement('div');
    tags.textContent = "tag: " + item.tags;
    const location = document.createElement('div');
    location.textContent = `lat: ${item.lat}, long: ${item.long}` ;

    root.append(tags, location);
    document.body.append(root);
  }

  console.log(data);
}

async function saveImage(image64) {
  const tags = document.getElementById('tags').value;

  //const image64 = video.canvas.toDataURL();
  const data = { lat, long, tags, image64 };

  options = {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
  const response = await fetch('/api/photos', options);
  const dataJson = await response.json();
  console.log(dataJson);
}

async function saveLatLong() {
  const tags = document.getElementById('tags').value;

  //const image64 = video.canvas.toDataURL();
  const data = { lat, long, tags, image64 };

  options = {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
  const response = await fetch('/api', options);
  const dataJson = await response.json();
  console.log(dataJson);
}

async function getWeatherData() {
  
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(async function(position) {
      long = position.coords.longitude;
      lat = position.coords.latitude;
      const url = `/weather/${lat},${long}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data.properties.timeseries[0].data.instant.details);
    });
  } else {
    console.log("Geo do not exists")
  }
}
