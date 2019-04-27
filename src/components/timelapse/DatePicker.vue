<template>
  <div
    class="datepicker-trigger"
    id="datepicker-trigger"
    :class="{ disabled: updatingData }"
  >
    <i class="material-icons">calendar_today</i>
    <p class="first">{{ formattedDate(dateOne) }}</p>
    <div class="vertical-line"></div>
    <p class="second">{{ formattedDate(dateTwo) }}</p>
    <AirbnbStyleDatepicker
      :trigger-element-id="'datepicker-trigger'"
      :mode="'range'"
      :fullscreen-mobile="true"
      :date-one="dateOne"
      :date-two="dateTwo"
      :end-date="endDate"
      @date-one-selected="
        val => {
          setDateOne({ val });
        }
      "
      @date-two-selected="
        val => {
          setDateTwo({ val });
        }
      "
      @opened="onOpen"
      @apply="onApply"
      @closed="onClosed"
      @cancelled="applyClicked = true"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import {
  parse,
  addMinutes,
  isToday,
  differenceInMinutes,
  startOfDay,
  format
} from "date-fns";
import { PICKER_FORMAT, PICKER_TEXT_FORMAT } from "@/helpers/constants";

export default {
  data() {
    return {
      // We want onApply changes to occur if a user closes the date picker by clicking outside, so use
      // this variable to track if picker was closed by clicking outside.
      applyClicked: false
    };
  },
  methods: {
    onApply() {
      let startDate = parse(this.dateOne);
      let endDate = parse(this.dateTwo); // not to be confused with this.endDate!
      const minutesOffset = differenceInMinutes(new Date(), endDate);
      if (isToday(startDate)) {
        startDate = startOfDay(startDate);
        endDate = new Date();
      } else if (isToday(endDate)) {
        // if the latter date is today, make the time match current time
        endDate = addMinutes(endDate, minutesOffset);
        startDate = addMinutes(startDate, minutesOffset);
      } else if (!minutesOffset) {
        endDate = startDate;
      }
      this.$store.commit("timelapse/setIsPlaying", { isPlaying: false });
      this.$store.commit("timelapse/setSliderVal", { sliderVal: 0 });
      this.$store.commit("timelapse/setDates", { startDate, endDate });
      this.applyClicked = true;
    },
    onClosed() {
      const oldDateOne = format(
        this.$store.state.timelapse.startDate,
        PICKER_FORMAT
      );
      const oldDateTwo = format(
        this.$store.state.timelapse.endDate,
        PICKER_FORMAT
      );
      if (
        !this.applyClicked &&
        (oldDateOne !== this.dateOne || oldDateTwo !== this.dateTwo)
      ) {
        this.onApply();
      }
    },
    onOpen() {
      this.applyClicked = false;
      this.$store.commit("timelapse/setIsPlaying", { isPlaying: false });
    },
    formattedDate(date) {
      return date ? format(date, PICKER_TEXT_FORMAT) : "";
    },
    ...mapMutations("picker", ["setDateOne", "setDateTwo"])
  },
  computed: {
    ...mapState("picker", ["dateOne", "dateTwo", "endDate"]),
    ...mapState("app", ["updatingData"])
  }
};
</script>

<style scoped>
div.datepicker-trigger {
  background-color: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  padding: 5px;
  height: 40px;
  width: 260px;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
}

.first {
  margin-left: 52px;
  pointer-events: none;
  position: absolute;
}

i {
  margin-left: 5px;
  pointer-events: none;
  position: absolute;
}

.second {
  margin-left: 156px;
  pointer-events: none;
  position: absolute;
}

div.vertical-line {
  margin-left: 142px;
  width: 1px;
  background-color: lightgrey;
  height: 80%;
  position: absolute;
}

div.disabled {
  background-color: #ccc;
  pointer-events: none;
}

div[id^="airbnb-style-datepicker-wrapper"] {
  bottom: 40px !important;
  top: auto !important;
}
</style>
