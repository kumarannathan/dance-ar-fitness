
interface EuclideanDistanceCompatibleObject {
  x: number;
  y: number;
}

export const getEuclideanDistance = (start: EuclideanDistanceCompatibleObject, end: EuclideanDistanceCompatibleObject) => {
  return Math.sqrt(((end.x - start.x) ** 2) + ((end.y - start.y) ** 2));
};

// Gets the angle between a and b given the distances a, b, and c in
// a triangle.
export const getAngleFromDistances = (a: number, b: number, c: number) => {
  // https://en.wikipedia.org/wiki/Law_of_cosines
  return Math.acos(((a ** 2) + (b ** 2) - (c ** 2))/(2*a*b));
}

export const radToDeg = (angle: number) => {
  return angle * 180 / Math.PI;
}