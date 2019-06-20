import _ from "lodash"
import { FeatureCollection } from "geojson"
import axios, { AxiosInstance } from "axios"

// the expected input type for bounding box queries
interface QueryBounds {
  lat: { min: number; max: number }
  lon: { min: number; max: number }
}

/**
 * The service used for requesting GeoJSON points from the Geolite IPV4 API.
 *
 * @export
 * @class GeoIPV4Service
 */
export default class GeoIPV4Service {
  /**
   * The client used for accessing the API.
   *
   * @private
   * @type {AxiosInstance}
   * @memberof GeoIPV4Service
   */
  private http: AxiosInstance

  /**
   * Creates an instance of GeoIPV4Service.
   * @memberof GeoIPV4Service
   */
  constructor() {
    this.http = axios.create({
      baseURL: process.env.VUE_APP_API_BASE,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
  }

  /**
   * Queries for GeoJSON points given some bounding box coordinates.
   *
   * @param {QueryBounds} query The bounding box to query
   * @returns {Promise<FeatureCollection>} The collection of intersected GeoJSON points
   * @memberof GeoIPV4Service
   */
  public async queryBounds(query: QueryBounds): Promise<FeatureCollection> {
    return (await this.http.get("/", {
      params: {
        lat: _.join([query.lat.min, query.lat.max], ","),
        lon: _.join([query.lon.min, query.lon.max], ","),
      },
    })).data
  }
}
