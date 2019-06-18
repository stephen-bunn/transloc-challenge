import _ from "lodash"
import { FeatureCollection } from "geojson"
import axios, { AxiosInstance } from "axios"

interface QueryBounds {
  lat: { min: number; max: number }
  lon: { min: number; max: number }
}

export default class GeoIPV4Service {
  private http: AxiosInstance

  constructor() {
    this.http = axios.create({
      baseURL: "http://10.0.2.15:5000/api/geo/ipv4",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
  }

  public async queryBounds(query: QueryBounds): Promise<FeatureCollection> {
    return (await this.http.get("/", {
      params: {
        lat: _.join([query.lat.min, query.lat.max], ","),
        lon: _.join([query.lon.min, query.lon.max], ","),
      },
    })).data
  }
}
