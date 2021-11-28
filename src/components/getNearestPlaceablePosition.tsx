import { BOX_WIDTH } from "../utils/constants";

export function getNearestPlaceablePosition([x, y, z]:
  | [number, number, number]
  | number[]) {
  // round to the nearest box
  return [
    Math.round(x / BOX_WIDTH) * BOX_WIDTH,
    Math.round(y / BOX_WIDTH) * BOX_WIDTH,
    Math.round(z / BOX_WIDTH) * BOX_WIDTH,
  ];
}
