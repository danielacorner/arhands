import { useGeolocation /* , useInterval */ } from "react-use";
import { BOX_WIDTH } from "../utils/constants";

// https://gis.stackexchange.com/questions/2951/algorithm-for-offsetting-a-latitude-longitude-by-some-amount-of-meters
const METERS_PER_DEGREE_LATITUDE = 111132.92;
// const METERS_PER_DEGREE_ALTITUDE = 111132.92;
/** gets your geolocation and converts it into meters (the unit in threejs) */
export const useGeolocationInMeters = () => {
  const { altitude, latitude, longitude } = useGeolocation();
  const { x, y, z } = getGeolocationInMeters({ latitude, longitude, altitude });
  return [x, y, z];
};
export function getGeolocationInMeters({
  latitude,
  longitude,
  altitude,
}: {
  latitude: number;
  longitude: number;
  altitude: number;
}) {
  const metersPerDegreeLongitude =
    Math.cos(latitude) * METERS_PER_DEGREE_LATITUDE;
  const x = longitude * metersPerDegreeLongitude;
  const y = altitude;
  const z = latitude * METERS_PER_DEGREE_LATITUDE;
  return { x, y, z };
}
