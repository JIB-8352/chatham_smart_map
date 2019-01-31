import axios from "axios";
import encodeUrl from "encodeurl";

const addGeocoder = (map, accessToken) => {
  const geocoder = new MapboxGeocoder({ accessToken });
  map.addControl(geocoder, "top-left");

  let marker;
  geocoder.on("result", function(ev) {
    if (marker) {
      marker.remove();
    }
    marker = new mapboxgl.Marker({
      color: "crimson"
    })
      .setLngLat(ev.result.geometry.coordinates)
      .addTo(map);
  });
  geocoder.on("clear", () => {
    if (marker) {
      marker.remove();
    }
  });
};

const getSensorData = () => {
  // URL to get ids of all Things:
  const thingsUrl =
    "https://api.sealevelsensors.org/v1.0/Things?$select=@iot.id";
  // URL to get the 'Water Level' Datastream and Location data of a particular Thing; we expand the Datastream Observation to obtain the latest reading ('result') using certain query parameters.
  const liveDataUrl = id =>
    encodeUrl(
      `https://api.sealevelsensors.org/v1.0/Things(${id})?
  $expand=Datastreams($filter=name eq 'Water Level';
  $expand=Observations($select=resultTime,result;$orderBy=resultTime desc;$top=1)),
  Locations($select=name,location)`
    );

  axios
    .get(thingsUrl)
    .then(response => {
      // Make requests in parallel
      const urlArr = response.data.value.map(el => liveDataUrl(el["@iot.id"]));
      const axiosArr = urlArr.map(el => axios.get(el));
      axios
        .all(axiosArr)
        .then(responses => {
          // Here we can access the JSON data for each response: responses.map(el => el.data)
        })
        .catch(() => {
          throw Error("Oops!");
        });
    })
    .catch(() => {
      throw Error("Oops!");
    });
};

export { addGeocoder, getSensorData };
