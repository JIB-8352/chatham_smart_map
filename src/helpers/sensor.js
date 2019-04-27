import { distanceInWordsToNow, format } from "date-fns";
import store from "@/store";
import {
  INUNDATION_DEMO_BOOST,
  INUNDATION_DEMO_MULTIPLIER,
  THUMB_WITH_YEAR_FORMAT,
  THUMB_WO_YEAR_FORMAT
} from "@/helpers/constants";

export default class Sensor {
  constructor(id, coordinates, name, description, datastreams) {
    this.id = id;
    this.coordinates = coordinates;
    this.name = `${name} Sensor`;
    this.description = description;
    this.datastreams = datastreams;
  }

  get placeName() {
    return `${this.name}, Chatham, GA`;
  }

  get chartDatastreams() {
    if (store.state.app.updatingData) {
      return [{}];
    }

    return this.datastreams;
  }

  get waterLevelReading() {
    if (store.state.app.updatingData) {
      return { result: "Loading...", resultTime: "Loading...", inundation: 0 };
    }
    // We made sure that water level was the first datastream:
    const { data, unitSymbol, lookupArray } = this.datastreams[0];
    const dataIndex = lookupArray[store.state.timelapse.sliderVal];
    if (dataIndex) {
      const [resultTime, result] = data[dataIndex];
      const resultString = `${result} ${unitSymbol}`;
      const resultTimeString = store.getters["timelapse/present"]
        ? distanceInWordsToNow(resultTime, {
            addSuffix: true
          })
        : format(
            resultTime,
            store.getters["timelapse/displayYear"]
              ? THUMB_WITH_YEAR_FORMAT
              : THUMB_WO_YEAR_FORMAT
          );
      return {
        result: resultString,
        resultTime: resultTimeString,
        inundation: result * INUNDATION_DEMO_MULTIPLIER + INUNDATION_DEMO_BOOST
      };
    } else {
      return {
        result: "No reading",
        resultTime: "N/A",
        inundation: 0
      };
    }
  }

  get plotLines() {
    return {
      "Water Level": [
        {
          color: "red",
          width: 2,
          value: +Math.random().toFixed(2),
          dashStyle: "shortdash",
          zIndex: 5,
          label: {
            x: 0,
            align: "left",
            text: "DANGER",
            style: {
              color: "red",
              fontSize: "12px",
              fontStyle: "italic"
            }
          }
        }
      ]
    };
  }
  // Follows Carmen GeoJSON format:
  get geoJSON() {
    return {
      id: this.id,
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: this.coordinates
      },
      properties: {
        description: this.description,
        inundation: this.waterLevelReading.inundation
      },
      place_name: this.placeName,
      place_type: ["place"],
      center: this.coordinates
    };
  }
}
