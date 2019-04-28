import {
  YESTERDAY,
  TODAY,
  VIABLE_MINUTE_SPLITS,
  VIABLE_DAY_FRACTIONS,
  THUMB_WITH_YEAR_FORMAT,
  THUMB_WO_YEAR_FORMAT,
  TICK_WITH_YEAR_FORMAT,
  TICK_WO_YEAR_FORMAT
} from "@/helpers/constants";
import {
  addHours,
  format,
  isToday,
  differenceInDays,
  distanceInWordsToNow,
  startOfHour,
  differenceInMinutes,
  addMinutes,
  startOfDay
} from "date-fns";

const getDefaultState = () => ({
  startDate: YESTERDAY,
  endDate: TODAY,
  isPlaying: false,
  /* start at "present"/the last tick, sliderVal = maxVal = 13. The value comes from the fact that
  the time interval generation code generates 14 times when startDate = YESTERDAY and endDate = TODAY */
  sliderVal: 13,
  thumbLabel: true
});

const state = getDefaultState();

const mutations = {
  setDates(state, { startDate, endDate }) {
    state.startDate = startDate;
    state.endDate = endDate;
  },
  setIsPlaying(state, { isPlaying }) {
    state.isPlaying = isPlaying;
  },
  toggleIsPlaying(state) {
    state.isPlaying = !state.isPlaying;
  },
  setSliderVal(state, { sliderVal }) {
    state.sliderVal = sliderVal;
  },
  setThumbLabel(state, { thumbLabel }) {
    state.thumbLabel = thumbLabel;
  },
  resetState(state) {
    Object.assign(state, getDefaultState());
  }
};

const getters = {
  // time interval generation code; times in an array of ISO strings.
  times({ startDate, endDate }) {
    // takes two dates and returns an array of ISO date strings
    const daysDifference = differenceInDays(endDate, startDate);
    const timeArray = [];
    if (!daysDifference) {
      // if the same day is selected twice
      let minutesDifference = 60 * 24; //minutes in a day
      if (isToday(startDate) || isToday(endDate)) {
        minutesDifference = differenceInMinutes(
          new Date(),
          startOfDay(startDate)
        ); // split into minutes instead of days
      }
      for (const minuteSplit of VIABLE_MINUTE_SPLITS) {
        for (let j = 1; j < 25; j++) {
          if (j * minuteSplit >= minutesDifference) {
            const midnightStartDay = startOfDay(startDate);
            let workingTime = midnightStartDay;
            for (let k = 0; k < j; k++) {
              workingTime = addMinutes(midnightStartDay, minuteSplit * k);
              timeArray[k] = workingTime.toISOString();
            }
            if (isToday(endDate)) {
              timeArray.push(endDate.toISOString()); // add exact present time at the end
            }
            return timeArray;
          }
        }
      }
    } else {
      for (const dayFraction of VIABLE_DAY_FRACTIONS) {
        // splitting days into numbers of hours
        for (let j = 12; j < 24; j++) {
          // splitting timelapse bar itself into fractions
          if ((daysDifference * dayFraction) % j === 0) {
            let workingDate = startDate;
            for (let k = 0; k <= j; k++) {
              // populate array of date strings
              workingDate = addHours(startDate, (daysDifference / j) * 24 * k);
              const roundedWorkingDate = startOfHour(workingDate);
              timeArray[k] = roundedWorkingDate.toISOString();
            }
            if (isToday(endDate)) {
              timeArray.push(workingDate.toISOString()); // add exact present time at the end
            }
            return timeArray;
          }
        }
      }
    }
  },
  maxVal(state, getters) {
    return getters.times.length - 1;
  },
  displayYear({ startDate, endDate }) {
    return startDate.getFullYear() !== endDate.getFullYear();
  },
  tickLabels({ startDate, endDate }, { maxVal, displayYear }) {
    // we only display the first and the last tick label
    const newLabels = [];
    if (isToday(endDate)) {
      newLabels[0] = distanceInWordsToNow(startDate, { addSuffix: true });
      newLabels[maxVal] = "Present";
    } else {
      newLabels[0] = format(
        startDate,
        displayYear ? TICK_WITH_YEAR_FORMAT : TICK_WO_YEAR_FORMAT
      );
      newLabels[maxVal] = format(
        endDate,
        displayYear ? TICK_WITH_YEAR_FORMAT : TICK_WO_YEAR_FORMAT
      );
    }
    return newLabels;
  },
  // Syntax for using a parameter passed to a getter:
  getThumbLabel: (state, { times, displayYear }) => val => {
    return format(
      times[val],
      displayYear ? THUMB_WITH_YEAR_FORMAT : THUMB_WO_YEAR_FORMAT
    );
  },
  present({ sliderVal, endDate }, { maxVal }) {
    // If the timelapse is in "present" mode
    return sliderVal === maxVal && isToday(endDate);
  },
  threshold(state, getters) {
    return Math.round(
      0.1 * differenceInMinutes(getters.times[1], getters.times[0])
    );
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};
