import { CHART_TOOLTIP_FORMAT, CHART_LABELS_FORMAT } from "@/helpers/constants";
import { format } from "date-fns";

export const removeCrosshair = (chart, index) => {
  if (chart.series[0].hasGroupedData) {
    chart.series[0].groupedData[index].setState();
  } else {
    chart.series[0].data[index].setState();
  }
  chart.tooltip.hide();
};

export const addCrosshair = (chart, index) => {
  let newIndex;
  if (chart.series[0].hasGroupedData) {
    /* Each entry in groupMap has a start and a length property which can be used to figure
     out the group data index that Highstock mapped our original index to. */
    newIndex = chart.series[0].groupMap.findIndex(
      el => index >= el.start && el.start + el.length > index
    );
    chart.series[0].groupedData[newIndex].setState("hover");
    chart.tooltip.refresh(chart.series[0].groupedData[newIndex]);
  } else {
    newIndex = index;
    chart.series[0].data[newIndex].setState("hover");
    chart.tooltip.refresh(chart.series[0].data[newIndex]);
  }

  return newIndex;
};

export const tooltipFormatter = ({ series, point }) => {
  let xValue;
  let yLabel;
  /* If we have grouped data and that the point is not the only entry in the group, we want
    to inform the user that the tooltip will display averaged data collected between some interval. */
  if (series.hasGroupedData && point.dataGroup.length > 1) {
    const { start, length } = point.dataGroup;
    /* Get the first and last entries in this data group, format their time and split into individual
      components so they can be compared. */
    const firstX = format(series.xData[start], CHART_TOOLTIP_FORMAT).split(
      ", "
    );
    const lastX = format(
      series.xData[start + length - 1],
      CHART_TOOLTIP_FORMAT
    ).split(", ");

    if (firstX[1] === lastX[1]) {
      /* They have the same date, so take day and date from just one but time (hours:minutes) from both
      - the two times will be different since the data group has more than one entry. */
      xValue = `${[firstX[0], firstX[1], firstX[2]].join(", ")} to ${lastX[2]}`;
    } else {
      /* Different dates, so display dates and time from both. Skip displaying the days to save space. */
      xValue = `${[firstX[1], firstX[2]].join(", ")} to ${[
        lastX[1],
        lastX[2]
      ].join(", ")}`;
    }
    yLabel = `Avg. ${series.name}`;
  } else {
    xValue = format(point.x, CHART_TOOLTIP_FORMAT);
    yLabel = series.name;
  }

  return `
      <div class="tev">
        <span style="font-size: 10px">${xValue}</span><br/>
        <span style="color: ${
          point.color
        }">\u25CF</span> ${yLabel}: <b>${+point.y.toFixed(3)}</b><br/>
      </div>`;
};

export const labelsFormatter = obj => {
  if (obj.isFirst || obj.isLast) {
    // Only display two labels on the x-axis, the first and the last.
    return format(obj.value, CHART_LABELS_FORMAT);
  }
};
