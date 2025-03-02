import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

document.addEventListener('DOMContentLoaded', () => {
  const mapElement = document.getElementById('map');
  const locations = JSON.parse(mapElement.dataset.locations);

  const map = L.map('map').setView(
    [locations[0].coordinates[1], locations[0].coordinates[0]],
    10,
  );

  L.tileLayer(
    `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=d328c9bee9554d6391214d85e59fab02`,
    {
      attribution: '&copy; OpenStreetMap contributors',
    },
  ).addTo(map);

  locations.forEach((loc) => {
    L.marker([loc.coordinates[1], loc.coordinates[0]])
      .addTo(map)
      .bindPopup(loc.description);
  });
});
