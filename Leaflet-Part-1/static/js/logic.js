var map = L.map('map').setView([37.8, -96], 4);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                var depth = feature.geometry.coordinates[2];
                var mag = feature.properties.mag;
                return L.circle(latlng, {
                    color: depthColor(depth),
                    fillColor: depthColor(depth),
                    fillOpacity: 0.75,
                    radius: mag * 10000
                });
            },
            onEachFeature: function (feature, layer) {
                if (feature.properties && feature.properties.place) {
                    layer.bindPopup(`Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]} km<br>Location: ${feature.properties.place}`);
                }
            }
        }).addTo(map);
    });

function depthColor(depth) {
    return depth > 50 ? '#800026' :
           depth > 30  ? '#BD0026' :
           depth > 20  ? '#E31A1C' :
           depth > 10  ? '#FC4E2A' :
           depth > 5   ? '#FD8D3C' :
                         '#FEB24C';
}

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 5, 10, 20, 30, 50], // These are the breakpoints for the depth categories
        labels = [],
        from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + depthColor(from + 1) + '"></i> ' +
            from + (to ? '&ndash;' + to + ' km' : '+ km'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};


legend.addTo(map);
