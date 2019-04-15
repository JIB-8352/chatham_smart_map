import { subDays } from "date-fns";

const today = new Date();
const yesterday = subDays(today, 1); // yesterday

const datastreamColors = {
  "Water Level": "#007CBF",
  "Air Pressure": "#FFD700",
  "Air Temperature": "#BA55D3"
};

export { yesterday, today, datastreamColors };
