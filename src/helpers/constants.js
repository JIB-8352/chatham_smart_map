import { subDays } from "date-fns";

// A map of sensor objects
export const sensors = new Map();

// To ensure that components get the same, static copy of yesterday and today's date
export const TODAY = new Date();
export const YESTERDAY = subDays(TODAY, 1);

export const INUNDATION_DEMO_BOOST = 8;
export const INUNDATION_DEMO_MULTIPLIER = 8;

/* Add any meta-data based on datastream type here; for now we store the color of the line chart 
  and the decimal value for the datastream's unit represented through a UTF-8 symbol (if required).
  For now, we only have three types of datastreams 'Water Level', 'Air Pressure' and 'Air Temperature'. */
export const DATASTREAM_METADATA = {
  "Water Level": { color: "#007CBF" },
  "Air Pressure": { color: "#FFD700" },
  "Air Temperature": { color: "#BA55D3", unitHtml: "&#8451;" }
};

// To control the UI for the pulsating sensors on the map
export const FPS = 15;
export const INITIAL_OPACITY = 1;
export const INITIAL_RADIUS = 8;
export const MAX_RADIUS = 17;

// Used for time interval generation
export const VIABLE_MINUTE_SPLITS = [1, 5, 10, 15, 20, 30, 60]; // Denotes intervals over a single day
export const VIABLE_DAY_FRACTIONS = [1, 2, 3, 4, 6, 12]; // Denotes intervals over many days

// Mapbox access token
export const ACCESS_TOKEN =
  "pk.eyJ1IjoicGNoYXdsYTgiLCJhIjoiY2pvb2IxeHhjMGFpbzNwcXJzbjkxenphbCJ9.PLLJazTRjDbljE9IniyWpg";

// The nextLink returned by the Sea Level Sensors API skips a 100 results.
export const API_SKIP_COUNT = 100;

/* Initial coordinates and zoom level for the map; can be adjusted to give a different view of Chatham
County when the map loads */
export const INITIAL_CENTER = { lon: -81.2, lat: 32 };
export const INITIAL_ZOOM = 9.6;

/* We use this value when the user attempts to search sensors by name. If the  string-similarity
  package we are using returns a value greater than the threshold, the geocoder displays sensor names
  in its results. */
export const GEOCODER_MATCHING_THRESHOLD = 0.65;

/* Collection of date formatting strings used throughout the app; based on formats supported by the
  date-fns library. */
/* The date picker uses two formats - the first one internally, to represent dates in AirbnbStyleDatepicker,
  the second one for displaying the selected dates to the user in the text div. */
export const PICKER_FORMAT = "YYYY-MM-DD";
export const PICKER_TEXT_FORMAT = "ddd, MMM D";
export const CHART_TOOLTIP_FORMAT = "ddd, MMM D, h:mm a";
export const CHART_LABELS_FORMAT = "M/D h:mm a";
/* The timelapse bar displays dates in thumb labels (rectangular ovals that show above the bar when the
  timelapse is playing) and tick labels (labels for the first and the last tick present below the bar).
  Each label may or may not be required to display the year. */
export const THUMB_WITH_YEAR_FORMAT = "M/DD/YYYY h:mm a";
export const THUMB_WO_YEAR_FORMAT = "MMMM Do h:mm a";
export const TICK_WITH_YEAR_FORMAT = "MMMM Do, YYYY";
export const TICK_WO_YEAR_FORMAT = "MMMM Do";

// Text that shows up in the warning alert depending on the error
export const DATA_FETCH_ERROR_TEXT =
  "We encountered an error while fetching sensor data. You may still use the map.";
export const GEOLOCATE_ERROR_TEXT = "We can't seem to locate you right now.";

// ADDITIONAL INUNDATION LAYER DEMO VALUES //
// NOTE: all demo values tested on 4/17/2019 data

// To display normal data:
// const INUNDATION_DEMO_BOOST = 0;
// const INUNDATION_DEMO_MULTIPLIER = 1;

// To demo a cat 1 hurricane:
// const INUNDATION_DEMO_BOOST = 0;
// const INUNDATION_DEMO_MULTIPLIER = 3;

// To demo a cat 2 hurricane:
// const INUNDATION_DEMO_BOOST = 3;
// const INUNDATION_DEMO_MULTIPLIER = 5.5;

// To demo a cat 3 hurricane:
// const INUNDATION_DEMO_BOOST = 8;
// const INUNDATION_DEMO_MULTIPLIER = 8;

// To demo a cat 4 hurricane:
// const INUNDATION_DEMO_BOOST = 10;
// const INUNDATION_DEMO_MULTIPLIER = 9;

// To demo a cat 5 hurricane:
// const INUNDATION_DEMO_BOOST = 12;
// const INUNDATION_DEMO_MULTIPLIER = 12;
