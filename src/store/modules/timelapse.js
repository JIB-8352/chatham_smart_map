import { yesterday, today } from "@/helpers/constants";
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
  startDate: yesterday,
  endDate: today,
  isPlaying: false,
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
  times({ startDate, endDate }) {
    // takes two dates and returns an array of ISO date strings
    const daysDifference = differenceInDays(endDate, startDate);
    let timeArray = [];
    if (!daysDifference) {
      // if the same day is selected twice
      let minutesDifference = 60 * 24; //minutes in a day
      if (isToday(startDate) || isToday(endDate)) {
        minutesDifference = differenceInMinutes(
          new Date(),
          startOfDay(startDate)
        ); // split into minutes instead of days
      }
      const viableMinuteSplits = [1, 5, 10, 15, 20, 30, 60];
      for (let minuteSplit of viableMinuteSplits) {
        for (let j = 1; j < 25; j++) {
          if (j * minuteSplit >= minutesDifference) {
            let midnightStartDay = startOfDay(startDate);
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
      const viableDayFractions = [1, 2, 3, 4, 6, 12];
      for (let dayFraction of viableDayFractions) {
        // splitting days into numbers of hours
        for (let j = 12; j < 24; j++) {
          // splitting timelapse bar itself into fractions
          if ((daysDifference * dayFraction) % j === 0) {
            let workingDate = startDate;
            for (let k = 0; k <= j; k++) {
              // populate array of date strings
              workingDate = addHours(startDate, (daysDifference / j) * 24 * k);
              let roundedWorkingDate = startOfHour(workingDate);
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
    let newLabels = [];
    if (isToday(endDate)) {
      newLabels[0] = distanceInWordsToNow(startDate, { addSuffix: true });
      newLabels[maxVal] = "Present";
    } else {
      newLabels[0] = format(
        startDate,
        displayYear ? "MMMM Do, YYYY" : "MMMM Do"
      );
      newLabels[maxVal] = format(
        endDate,
        displayYear ? "MMMM Do, YYYY" : "MMMM Do"
      );
    }
    return newLabels;
  },
  getThumbLabel: (state, { times, displayYear }) => val => {
    return format(
      times[val],
      displayYear ? "M/DD/YYYY h:mm aa" : "MMMM Do h:mm aa"
    );
  },
  present({ sliderVal, endDate }, { maxVal }) {
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
