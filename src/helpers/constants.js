import { subDays } from "date-fns";

const today = new Date();
const yesterday = subDays(today, 1); // yesterday

const inundationDemoBoost = 12;
const inundationDemoMultiplier = 12;

const datastreamMetadata = {
  "Water Level": { color: "#007CBF" },
  "Air Pressure": { color: "#FFD700" },
  "Air Temperature": { color: "#BA55D3", unitHtml: "&#8451;" }
};

export {
  yesterday,
  today,
  inundationDemoBoost,
  inundationDemoMultiplier,
  datastreamMetadata
};

//DEMO VALUES//
//NOTE: all demo values tested on 4/19/2019 data

// display normal data

// const inundationDemoBoost = 0;
// const inundationDemoMultiplier = 1;

// demo cat 1 hurricane

// const inundationDemoBoost = 0;
// const inundationDemoMultiplier = 3;

// demo cat 2 hurricane

// const inundationDemoBoost = 3;
// const inundationDemoMultiplier = 5.5;

// demo cat 3 hurricane

// const inundationDemoBoost = 8;
// const inundationDemoMultiplier = 8;

// demo cat 4 hurricane

// const inundationDemoBoost = 10;
// const inundationDemoMultiplier = 9;

// demo cat 5 hurricane

// const inundationDemoBoost = 12;
// const inundationDemoMultiplier = 12;
