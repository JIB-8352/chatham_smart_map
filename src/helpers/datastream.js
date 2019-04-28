import { DATASTREAM_METADATA } from "@/helpers/constants";

export default class Datastream {
  constructor(id, name, unitSymbol) {
    this.id = id;
    this.name = name;
    this.unitSymbol = unitSymbol;
    /* this.data will be a large collection of observations; this.lookupArray is used to track the
    indices of observations whose resultTime is closest to a date in the
    store.getters["timelapse/times"] array. Certain entries of this array may be undefined. */
    this.lookupArray = [];
    /* An array to contain all observations. Each observation is an array with resultTime as the first
      entry and the result as the second entry. Storing an observation as an array instead of an object
      lets us directly use this.data as a data source for our charts. */
    this.data = [];
    /* Sometimes, we have to add a constant to each observation's result (like the sensor elevation
      for water level datastreams). Implementing this requirement through a property of each datastream
      object simplifies things. */
    this.offset = 0;
  }

  get color() {
    return DATASTREAM_METADATA[this.name].color;
  }

  get unitHtml() {
    return DATASTREAM_METADATA[this.name].unitHtml || this.unitSymbol;
  }

  // Discards old observations and and lookup indices - do this before new data is fetched.
  reset() {
    this.data = [];
    this.lookupArray = [];
  }
}
