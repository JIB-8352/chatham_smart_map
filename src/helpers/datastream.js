import { DATASTREAM_METADATA } from "@/helpers/constants";

export default class Datastream {
  constructor(id, name, unitSymbol) {
    this.id = id;
    this.name = name;
    this.unitSymbol = unitSymbol;
    this.lookupArray = [];
    this.data = [];
    this.offset = 0;
  }

  get color() {
    return DATASTREAM_METADATA[this.name].color;
  }

  get unitHtml() {
    return DATASTREAM_METADATA[this.name].unitHtml || this.unitSymbol;
  }

  reset() {
    this.data = [];
    this.lookupArray = [];
  }
}
