import _ from "lodash"
import axios, { AxiosInstance } from "axios"

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

  async queryBounds(query: { lat: { min: number; max: number }; lon: { min: number; max: number } }): Promise<any> {
    let response = await this.http.get("/", {
      params: {
        lat: _.join([query.lat.min, query.lat.max], ","),
        lon: _.join([query.lon.min, query.lon.max], ","),
      },
    })
    return response
  }
}
