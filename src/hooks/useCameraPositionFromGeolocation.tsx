import { useGeolocation /* , useInterval */ } from "react-use";
import { useGeolocationInMeters } from "../components/METERS_PER_DEGREE_LATITUDE";

/** convert geolocation to canvas camera position
 */

export function useCameraPositionFromGeolocation() {
  // heading = degrees how far off from heading due north the device is pointing
  // const { heading } = useGeolocation();
  // const [x, y, z] = useGeolocationInMeters();
  // // need to rotate the scene to match the camera heading
  // const [xRotated, yRotated, zRotated] = rotatePoint([x, y, z], heading);
  // return [xRotated, yRotated, zRotated];
  return useGeolocationInMeters();
}
