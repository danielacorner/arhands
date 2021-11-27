/** rotate a 3d point about the origin [0,0,0] by an angle (in degrees) */
export function rotatePoint(
  point: [number, number, number] | number[],
  angle: number
) {
  const [x, y, z] = point;
  const [xRotated, yRotated, zRotated] = [
    x * Math.cos(angle) - y * Math.sin(angle),
    x * Math.sin(angle) + y * Math.cos(angle),
    z,
  ];
  return [xRotated, yRotated, zRotated];
}
