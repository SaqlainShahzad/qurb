import 'dart:math';
import 'package:flutter_test/flutter_test.dart';

double calculateMagneticDeclination(double latDeg, double lonDeg) {
  const double g10 = -29404.5;
  const double g11 = -1450.7;
  const double h11 = 4652.9;
  const double g20 = -2500.0;
  const double g21 = 3000.0;
  const double h21 = -2990.0;
  const double g22 = 1670.0;
  const double h22 = -730.0;

  final double colatRad = (90.0 - latDeg) * pi / 180.0;
  final double lonRad = lonDeg * pi / 180.0;

  double sinTheta = sin(colatRad);
  if (sinTheta.abs() < 1e-5) sinTheta = 1e-5;
  final double cosTheta = cos(colatRad);

  final double cosPhi = cos(lonRad);
  final double sinPhi = sin(lonRad);
  final double cos2Phi = cos(2.0 * lonRad);
  final double sin2Phi = sin(2.0 * lonRad);

  final double dP10 = -sinTheta;
  final double P11 = sinTheta;
  final double dP11 = cosTheta;

  final double dP20 = -3.0 * sinTheta * cosTheta;
  final double P21 = sqrt(3.0) * sinTheta * cosTheta;
  final double dP21 = sqrt(3.0) * (cosTheta * cosTheta - sinTheta * sinTheta);
  final double dP22 = sqrt(3.0) * sinTheta * cosTheta;

  final double x = (g10 * dP10 +
      (g11 * cosPhi + h11 * sinPhi) * dP11 +
      g20 * dP20 +
      (g21 * cosPhi + h21 * sinPhi) * dP21 +
      (g22 * cos2Phi + h22 * sin2Phi) * dP22);

  final double y = -((1.0 / sinTheta) * (-g11 * sinPhi + h11 * cosPhi) * P11 +
      (1.0 / sinTheta) * (-g21 * sinPhi + h21 * cosPhi) * P21 +
      (2.0 / sinTheta) * (-g22 * sin2Phi + h22 * cos2Phi) * (sqrt(3.0) / 2.0 * sinTheta * sinTheta));

  return atan2(y, x) * 180.0 / pi;
}

double calculateQiblaBearing(double userLat, double userLon) {
  const double kaabaLat = 21.4225;
  const double kaabaLon = 39.8262;

  final double lat1 = userLat * pi / 180.0;
  final double lon1 = userLon * pi / 180.0;
  const double lat2 = kaabaLat * pi / 180.0;
  const double lon2 = kaabaLon * pi / 180.0;

  final double dLon = lon2 - lon1;
  final double y = sin(dLon) * cos(lat2);
  final double x = cos(lat1) * sin(lat2) - sin(lat1) * cos(lat2) * cos(dLon);
  double bearing = atan2(y, x) * 180.0 / pi;
  return (bearing + 360.0) % 360.0;
}

double calculateDeviceHeading(
  double ax, double ay, double az,
  double mx, double my, double mz,
  double declination,
) {
  final double aNorm = sqrt(ax * ax + ay * ay + az * az);
  ax /= aNorm;
  ay /= aNorm;
  az /= aNorm;

  double ex = my * az - mz * ay;
  double ey = mz * ax - mx * az;
  double ez = mx * ay - my * ax;
  final double eNorm = sqrt(ex * ex + ey * ey + ez * ez);
  ex /= eNorm;
  ey /= eNorm;
  ez /= eNorm;

  final double ny = az * ex - ax * ez;

  final double azimuthRad = atan2(ey, ny);
  double magHeading = azimuthRad * 180.0 / pi;
  magHeading = (magHeading + 360.0) % 360.0;

  return (magHeading + declination + 360.0) % 360.0;
}

void main() {
  group('Qibla Compass & Sensor Calculations', () {
    test('Qibla bearing from Islamabad should be ~256 degrees (255.9°)', () {
      final bearing = calculateQiblaBearing(33.6844, 73.0479);
      expect(bearing, closeTo(255.91, 0.1));
    });

    test('Qibla bearing from New York should be ~58 degrees (great-circle)', () {
      final bearing = calculateQiblaBearing(40.7128, -74.0060);
      expect(bearing, closeTo(58.5, 2.0));
    });

    test('WMM Magnetic Declination produces expected values', () {
      final declIslamabad = calculateMagneticDeclination(33.7, 73.0);
      expect(declIslamabad, closeTo(2.5, 1.0));

      final declNewYork = calculateMagneticDeclination(40.7, -74.0);
      expect(declNewYork, closeTo(-11.5, 2.0));
    });

    test('3D Tilt Compensated Heading points North when facing North', () {
      // Flat face up: gravity in +Z
      // Facing North: magnetic field vector has positive Y component
      final heading = calculateDeviceHeading(0, 0, 9.8, 0, 20.0, -35.0, 0.0);
      expect(heading, closeTo(0.0, 1.0));
    });

    test('3D Tilt Compensated Heading points East when facing East', () {
      // Phone top faces East => magnetic North is to the left (-X)
      final heading = calculateDeviceHeading(0, 0, 9.8, -20.0, 0.0, -35.0, 0.0);
      expect(heading, closeTo(90.0, 1.0));
    });

    test('3D Tilt Compensated Heading points West when facing West', () {
      // Phone top faces West => magnetic North is to the right (+X)
      final heading = calculateDeviceHeading(0, 0, 9.8, 20.0, 0.0, -35.0, 0.0);
      expect(heading, closeTo(270.0, 1.0));
    });

    test('Shortest angular path avoids 360 spin', () {
      double current = 359.0;
      double target = 1.0;

      double diff = (target - current) % 360.0;
      if (diff > 180.0) diff -= 360.0;
      if (diff < -180.0) diff += 360.0;

      // Delta should be +2.0, not -358.0!
      expect(diff, closeTo(2.0, 0.001));
    });
  });
}
