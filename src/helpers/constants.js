import { subDays } from "date-fns";

export const sensors = new Map();

export const TODAY = new Date();
export const YESTERDAY = subDays(TODAY, 1); // yesterday

export const INUNDATION_DEMO_BOOST = 8;
export const INUNDATION_DEMO_MULTIPLIER = 8;

export const DATASTREAM_METADATA = {
  "Water Level": { color: "#007CBF" },
  "Air Pressure": { color: "#FFD700" },
  "Air Temperature": { color: "#BA55D3", unitHtml: "&#8451;" }
};
//sensor icons
export const FPS = 15;
export const INITIAL_OPACITY = 1;
export const INITIAL_RADIUS = 8;
export const MAX_RADIUS = 17;

//timelapse generation
export const VIABLE_MINUTE_SPLITS = [1, 5, 10, 15, 20, 30, 60]; //denotes what the timelapse will use as intervals over a single day
export const VIABLE_DAY_FRACTIONS = [1, 2, 3, 4, 6, 12]; //denotes what the timelapse will use as intervals over many days

//access token
export const ACCESS_TOKEN =
  "pk.eyJ1IjoicGNoYXdsYTgiLCJhIjoiY2pvb2IxeHhjMGFpbzNwcXJzbjkxenphbCJ9.PLLJazTRjDbljE9IniyWpg";
export const INITIAL_CENTER = { lon: -81.2, lat: 32 };
export const INITIAL_ZOOM = 9.6;

export const GEOCODER_MATCHING_THRESHOLD = 0.65;

export const PICKER_FORMAT = "YYYY-MM-DD";
export const PICKER_TEXT_FORMAT = "ddd, MMM D";
export const CHART_TOOLTIP_FORMAT = "ddd, MMM D, h:mm a";
export const CHART_LABELS_FORMAT = "M/D h:mm a";
export const THUMB_WITH_YEAR_FORMAT = "M/DD/YYYY h:mm a";
export const THUMB_WO_YEAR_FORMAT = "MMMM Do h:mm a";
export const TICK_WITH_YEAR_FORMAT = "MMMM Do, YYYY";
export const TICK_WO_YEAR_FORMAT = "MMMM Do";

export const DATA_FETCH_ERROR_TEXT =
  "We encountered an error while fetching sensor data. You may still use the map.";
export const GEOLOCATE_ERROR_TEXT = "We can't seem to locate you right now.";
//DEMO VALUES//
//NOTE: all demo values tested on 4/17/2019 data

// display normal data

// const INUNDATION_DEMO_BOOST = 0;
// const INUNDATION_DEMO_MULTIPLIER = 1;

// demo cat 1 hurricane

// const INUNDATION_DEMO_BOOST = 0;
// const INUNDATION_DEMO_MULTIPLIER = 3;

// demo cat 2 hurricane

// const INUNDATION_DEMO_BOOST = 3;
// const INUNDATION_DEMO_MULTIPLIER = 5.5;

// demo cat 3 hurricane

// const INUNDATION_DEMO_BOOST = 8;
// const INUNDATION_DEMO_MULTIPLIER = 8;

// demo cat 4 hurricane

// const INUNDATION_DEMO_BOOST = 10;
// const INUNDATION_DEMO_MULTIPLIER = 9;

// demo cat 5 hurricane

// const INUNDATION_DEMO_BOOST = 12;
// const INUNDATION_DEMO_MULTIPLIER = 12;
