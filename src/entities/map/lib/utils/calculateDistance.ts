type Positions = {
  lat1: number;
  lng1: number;
  lat2: number;
  lng2: number;
};

export const calculateDistance = (positions: Positions) => {
  const EARTH_RADIUS = 6372795;
  // Radians
  const lat1 = (positions.lat1 * Math.PI) / 180;
  const lat2 = (positions.lat2 * Math.PI) / 180;
  const long1 = (positions.lng1 * Math.PI) / 180;
  const long2 = (positions.lng2 * Math.PI) / 180;
  // cosines and sinus of central angle
  const cl1 = Math.cos(lat1);
  const cl2 = Math.cos(lat2);
  const sl1 = Math.sin(lat1);
  const sl2 = Math.sin(lat2);
  const delta = long2 - long1;
  const cdelta = Math.cos(delta);
  const sdelta = Math.sin(delta);
  // Haversine's formula
  const y = Math.sqrt(
    Math.pow(cl2 * sdelta, 2) + Math.pow(cl1 * sl2 - sl1 * cl2 * cdelta, 2),
  );
  const x = sl1 * sl2 + cl1 * cl2 * cdelta;
  // Arc Length
  const ad = Math.atan2(y, x);
  const dist = ad * EARTH_RADIUS;

  return dist;
};
