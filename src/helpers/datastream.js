import { differenceInMilliseconds } from "date-fns";
import { datastreamMetadata } from "@/helpers/constants";

export default class Datastream {
  constructor(id, name, unitSymbol) {
    this.id = id;
    this.name = name;
    this.unitSymbol = unitSymbol;
    this.observations = [];
    this.cache = new Map();
    this.offset = 0;
  }

  get color() {
    return datastreamMetadata[this.name].color;
  }

  get unitHtml() {
    return datastreamMetadata[this.name].unitHtml || this.unitSymbol;
  }

  get observationsNavLink() {
    // Get observations in descending order of result time
    return `https://api.sealevelsensors.org/v1.0/Datastreams(${
      this.id
    })/Observations?$select=result,resultTime&$orderby=resultTime+desc`;
  }

  closestUrlFromCache(endDate, fallback = this.observationsNavLink) {
    // Look in the cache for a URL corresponding to a date >= endDate. If no entry satisfies this requirement,
    // return the fallback URL.
    let link = undefined;
    let minDiff = Infinity;
    for (let [resultTime, curLink] of this.cache.entries()) {
      const diff = differenceInMilliseconds(resultTime, endDate);
      if (diff >= 0 && diff < minDiff) {
        minDiff = diff;
        link = curLink;
      }
    }
    // If link is undefined or does not contain $skip, no point using it
    if (!link) {
      return fallback;
    }
    const skipLink = link.match(/(?:\$skip=)(\d+)/);
    if (!skipLink) {
      return fallback;
    }
    const skipFallback = fallback.match(/(?:\$skip=)(\d+)/); // Check if fallback contains the $skip query param
    if (!skipFallback) {
      return link; // use link if fallback has no $skip query param
    }
    // otherwise use whichever link has highest numeric value for the $skip query param
    return +skipLink[1] > +skipFallback[1] ? link : fallback;
  }

  addToCache(resultTime, curLink) {
    this.cache.set(resultTime, curLink);
    // Since ES6 Maps preserves the insertion order, this is a FIFO eviction scheme.
    // The maximum size of 50 was arbitrarily chosen to prevent the cache from getting too big.
    if (this.cache.size > 50) {
      this.cache.delete(this.cache.keys().next().value);
    }
  }
}
