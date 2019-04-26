import { datastreamMetadata } from "@/helpers/constants";

export default class Datastream {
  constructor(id, name, unitSymbol) {
    this.id = id;
    this.name = name;
    this.unitSymbol = unitSymbol;
    this.observations = [];
    this.offset = 0;
  }

  get color() {
    return datastreamMetadata[this.name].color;
  }

  get unitHtml() {
    return datastreamMetadata[this.name].unitHtml || this.unitSymbol;
  }
}
