import { useGeolocation /* , useInterval */ } from "react-use";

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
  // TODO: incorrect formula?
  // const metersPerDegreeLongitude =
  //   Math.cos(latitude) * METERS_PER_DEGREE_LATITUDE;
  const x = longitude * METERS_PER_DEGREE_LATITUDE;
  // const x = longitude * metersPerDegreeLongitude;
  const y = altitude;
  const z = latitude * METERS_PER_DEGREE_LATITUDE;
  return { x, y, z };
}
export function getGeolocationFromPosition([x, y, z]: [
  number,
  number,
  number
]) {
  // TODO: incorrect formula?
  // const metersPerDegreeLongitude =
  //   Math.cos(latitude) * METERS_PER_DEGREE_LATITUDE;
  const longitude = x / METERS_PER_DEGREE_LATITUDE;
  // const x = longitude * metersPerDegreeLongitude;
  const altitude = y;
  const latitude = z / METERS_PER_DEGREE_LATITUDE;
  return { latitude, longitude, altitude };
}
