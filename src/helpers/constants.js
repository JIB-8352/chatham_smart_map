import { subDays } from "date-fns";

const today = new Date();
const yesterday = subDays(today, 1); // yesterday

const inundationDemoBoost = 0;
const inundationDemoMultiplier = 1;

const datastreamMetadata = {
  "Water Level": { color: "#007CBF" },
  "Air Pressure": { color: "#FFD700" },
  "Air Temperature": { color: "#BA55D3", unitHtml: "&#8451;" }
};
//sensor icons
const framesPerSecond = 15;
const initialOpacity = 1;
const initialRadius = 8;
const maxRadius = 17;

//timelapse generation
const viableMinuteSplits = [1, 5, 10, 15, 20, 30, 60]; //denotes what the timelapse will use as intervals over a single day
const viableDayFractions = [1, 2, 3, 4, 6, 12]; //denotes what the timelapse will use as intervals over many days

//access token
const token =
  "pk.eyJ1IjoicGNoYXdsYTgiLCJhIjoiY2pvb2IxeHhjMGFpbzNwcXJzbjkxenphbCJ9.PLLJazTRjDbljE9IniyWpg";

export {
  yesterday,
  today,
  inundationDemoBoost,
  inundationDemoMultiplier,
  datastreamMetadata,
  framesPerSecond,
  initialOpacity,
  initialRadius,
  maxRadius,
  viableMinuteSplits,
  viableDayFractions,
  token
};

//DEMO VALUES//
//NOTE: all demo values tested on 4/17/2019 data

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
