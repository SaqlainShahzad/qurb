import 'dart:async';
import 'dart:math';

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:location/location.dart';
import 'package:sensors_plus/sensors_plus.dart';
import 'package:shared_preferences/shared_preferences.dart';

class QiblaScreen extends StatefulWidget {
  const QiblaScreen({super.key});

  @override
  State<QiblaScreen> createState() => _QiblaScreenState();
}

class _QiblaScreenState extends State<QiblaScreen> with WidgetsBindingObserver {
  // Sacred Kaaba Coordinates (Mecca, Saudi Arabia)
  final double kaabaLat = 21.4225;
  final double kaabaLon = 39.8262;

  double? userLat;
  double? userLon;
  double qiblaDirection = 0; // Great-circle True Bearing to Kaaba
  double deviceHeading = 0; // Filtered True Heading (0-360)
  double distanceToKaaba = 0; // km
  double declination = 0; // Magnetic declination at current location

  bool isOffline = false;
  bool isLocating = true;
  String locationError = '';

  // Sensor state & diagnostics
  bool _hasSensors = true;
  bool _isSensorActive = false;
  bool _isTilted = false;
  bool _isAligned = false;

  final List<double> _accelerometerValues = [0, 0, 0];
  final List<double> _magnetometerValues = [0, 0, 0];
  bool _hasAccel = false;
  bool _hasMag = false;
  final double _alpha = 0.15; // Low-pass filter coefficient

  // Continuous smoothed angles to eliminate 360° jump/spin glitches
  double _continuousHeading = 0;
  double _continuousNeedleAngle = 0;
  int _lastUiUpdateMs = 0;
  // Drives only the compass dial / readings subtree (not the whole Scaffold).
  final ValueNotifier<int> _uiTick = ValueNotifier<int>(0);

  StreamSubscription? _accelSub;
  StreamSubscription? _magSub;
  StreamSubscription? _connSub;
  Timer? _sensorTimeoutTimer;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _initConnectivity();
    _initLocation();
    // Start sensors after first frame to ensure smooth route entry transition
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _initSensors();
    });
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    // Gracefully manage sensor hardware lifecycle
    if (state == AppLifecycleState.paused ||
        state == AppLifecycleState.inactive ||
        state == AppLifecycleState.hidden) {
      _pauseSensors();
    } else if (state == AppLifecycleState.resumed) {
      _resumeSensors();
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _pauseSensors();
    _connSub?.cancel();
    _uiTick.dispose();
    super.dispose();
  }

  Future<void> _initConnectivity() async {
    try {
      final connectivityResult = await (Connectivity().checkConnectivity());
      _updateConnectionStatus(connectivityResult);
      _connSub = Connectivity().onConnectivityChanged.listen(
        (result) => _updateConnectionStatus(result),
        onError: (_) {},
      );
    } catch (_) {}
  }

  void _updateConnectionStatus(dynamic result) {
    bool offline = true;
    if (result is List) {
      offline = !result.any((element) => element != ConnectivityResult.none);
    } else {
      offline = result == ConnectivityResult.none;
    }
    if (mounted) {
      setState(() {
        isOffline = offline;
      });
    }
  }

  /// Computes the Earth's magnetic declination (in degrees) using degree 1 & 2
  /// Gauss spherical harmonics (WMM approximation).
  /// Positive value indicates East declination; negative indicates West.
  double _calculateMagneticDeclination(double latDeg, double lonDeg) {
    try {
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
    } catch (_) {
      return 0.0;
    }
  }

  Future<void> _initLocation() async {
    if (mounted) {
      setState(() {
        isLocating = true;
        locationError = '';
      });
    }

    final prefs = await SharedPreferences.getInstance();

    // Instant load from cache
    if (prefs.containsKey('qibla_cached_lat') && prefs.containsKey('qibla_cached_lon')) {
      userLat = prefs.getDouble('qibla_cached_lat');
      userLon = prefs.getDouble('qibla_cached_lon');
      _calculateQibla();
    }

    try {
      final Location location = Location();

      bool serviceEnabled = await location.serviceEnabled();
      if (!serviceEnabled) {
        serviceEnabled = await location.requestService();
        if (!serviceEnabled) {
          if (userLat == null && mounted) {
            setState(() {
              locationError = 'Location service disabled. Please enable GPS.';
            });
          }
          return;
        }
      }

      PermissionStatus permissionGranted = await location.hasPermission();
      if (permissionGranted == PermissionStatus.denied) {
        permissionGranted = await location.requestPermission();
        if (permissionGranted != PermissionStatus.granted) {
          if (userLat == null && mounted) {
            setState(() {
              locationError = 'Location permission denied. Please allow location access.';
            });
          }
          return;
        }
      }

      final LocationData locationData = await location.getLocation().timeout(
        const Duration(seconds: 8),
      );

      if (locationData.latitude != null && locationData.longitude != null) {
        userLat = locationData.latitude;
        userLon = locationData.longitude;

        await prefs.setDouble('qibla_cached_lat', userLat!);
        await prefs.setDouble('qibla_cached_lon', userLon!);

        _calculateQibla();
      }
    } catch (e) {
      debugPrint('Location service note: $e');
      if (userLat == null && mounted) {
        setState(() {
          locationError = 'Unable to get GPS location. Showing cached view.';
        });
      }
    } finally {
      if (mounted) {
        setState(() {
          isLocating = false;
        });
      }
    }
  }

  void _calculateQibla() {
    if (userLat == null || userLon == null) return;

    // Calculate magnetic declination for true vs magnetic North alignment
    declination = _calculateMagneticDeclination(userLat!, userLon!);

    final double lat1 = userLat! * pi / 180.0;
    final double lon1 = userLon! * pi / 180.0;
    final double lat2 = kaabaLat * pi / 180.0;
    final double lon2 = kaabaLon * pi / 180.0;

    // Great Circle forward azimuth calculation
    final double dLon = lon2 - lon1;
    final double y = sin(dLon) * cos(lat2);
    final double x = cos(lat1) * sin(lat2) - sin(lat1) * cos(lat2) * cos(dLon);
    double bearing = atan2(y, x) * 180.0 / pi;
    qiblaDirection = (bearing + 360.0) % 360.0;

    // Haversine distance formula
    final double dLat = lat2 - lat1;
    final double a = sin(dLat / 2.0) * sin(dLat / 2.0) +
        cos(lat1) * cos(lat2) * sin(dLon / 2.0) * sin(dLon / 2.0);
    final double c = 2.0 * atan2(sqrt(a), sqrt(max(0.0, 1.0 - a)));
    distanceToKaaba = 6371.0 * c;

    if (mounted) setState(() {});
  }

  void _initSensors() {
    _sensorTimeoutTimer?.cancel();
    _isSensorActive = false;

    // Timeout: if no magnetometer data after 3 seconds, gracefully display compass fallback
    _sensorTimeoutTimer = Timer(const Duration(seconds: 3), () {
      if (mounted && !_isSensorActive) {
        setState(() {
          _hasSensors = false;
        });
      }
    });

    try {
      _accelSub = accelerometerEventStream(samplingPeriod: SensorInterval.gameInterval).listen(
        (AccelerometerEvent event) {
          if (!_hasAccel) {
            _accelerometerValues[0] = event.x;
            _accelerometerValues[1] = event.y;
            _accelerometerValues[2] = event.z;
            _hasAccel = true;
          } else {
            _accelerometerValues[0] = _alpha * event.x + (1.0 - _alpha) * _accelerometerValues[0];
            _accelerometerValues[1] = _alpha * event.y + (1.0 - _alpha) * _accelerometerValues[1];
            _accelerometerValues[2] = _alpha * event.z + (1.0 - _alpha) * _accelerometerValues[2];
          }
          _updateHeading();
        },
        onError: (err) {
          debugPrint('Accelerometer stream error: $err');
        },
        cancelOnError: false,
      );
    } catch (e) {
      debugPrint('Accelerometer subscription error: $e');
    }

    try {
      _magSub = magnetometerEventStream(samplingPeriod: SensorInterval.gameInterval).listen(
        (MagnetometerEvent event) {
          if (!_isSensorActive) {
            _isSensorActive = true;
            if (!_hasSensors && mounted) {
              setState(() {
                _hasSensors = true;
              });
            }
          }
          if (!_hasMag) {
            _magnetometerValues[0] = event.x;
            _magnetometerValues[1] = event.y;
            _magnetometerValues[2] = event.z;
            _hasMag = true;
          } else {
            _magnetometerValues[0] = _alpha * event.x + (1.0 - _alpha) * _magnetometerValues[0];
            _magnetometerValues[1] = _alpha * event.y + (1.0 - _alpha) * _magnetometerValues[1];
            _magnetometerValues[2] = _alpha * event.z + (1.0 - _alpha) * _magnetometerValues[2];
          }
          _updateHeading();
        },
        onError: (err) {
          debugPrint('Magnetometer stream error: $err');
          if (mounted) {
            setState(() {
              _hasSensors = false;
            });
          }
        },
        cancelOnError: false,
      );
    } catch (e) {
      debugPrint('Magnetometer subscription error: $e');
      _hasSensors = false;
    }
  }

  void _pauseSensors() {
    _sensorTimeoutTimer?.cancel();
    _sensorTimeoutTimer = null;
    _accelSub?.cancel();
    _accelSub = null;
    _magSub?.cancel();
    _magSub = null;
    _hasAccel = false;
    _hasMag = false;
    _isSensorActive = false;
  }

  void _resumeSensors() {
    if (!mounted) return;
    _pauseSensors();
    _initSensors();
  }

  void _updateHeading() {
    if (!_hasAccel || !_hasMag) return;

    double ax = _accelerometerValues[0];
    double ay = _accelerometerValues[1];
    double az = _accelerometerValues[2];

    final double aNorm = sqrt(ax * ax + ay * ay + az * az);
    if (aNorm < 1e-4) return;
    ax /= aNorm;
    ay /= aNorm;
    az /= aNorm;

    // Detect if device is held too upright (tilt > 60° from horizontal)
    final bool tilted = az.abs() < 0.45;
    bool needsFullRebuild = false;
    if (tilted != _isTilted) {
      _isTilted = tilted;
      needsFullRebuild = true; // tilt banner lives outside the compass subtree
    }

    final double mx = _magnetometerValues[0];
    final double my = _magnetometerValues[1];
    final double mz = _magnetometerValues[2];

    // 3D Tilt-Compensated Rotation Matrix via Vector Cross Products:
    // East vector: E = M x A (perpendicular to both Magnetic field and Gravity)
    double ex = my * az - mz * ay;
    double ey = mz * ax - mx * az;
    double ez = mx * ay - my * ax;

    final double eNorm = sqrt(ex * ex + ey * ey + ez * ez);
    if (eNorm < 1e-4) return;
    ex /= eNorm;
    ey /= eNorm;
    ez /= eNorm;

    // North vector: N = A x E (orthogonal in horizontal plane)
    final double ny = az * ex - ax * ez;

    // Azimuth of device forward (+Y axis in portrait) projected on horizontal plane
    final double azimuthRad = atan2(ey, ny);
    double magHeading = azimuthRad * 180.0 / pi;
    magHeading = (magHeading + 360.0) % 360.0;

    // Apply magnetic declination to obtain True Geographic Heading
    final double trueHeading = (magHeading + declination + 360.0) % 360.0;

    // Continuous heading angle tracking (shortest angular distance delta)
    double diff = (trueHeading - _continuousHeading) % 360.0;
    if (diff > 180.0) diff -= 360.0;
    if (diff < -180.0) diff += 360.0;
    _continuousHeading += diff * 0.22;

    final double displayHeading = (_continuousHeading % 360.0 + 360.0) % 360.0;

    // Continuous needle angle tracking relative to top of device
    final double targetNeedle = qiblaDirection - _continuousHeading;
    double needleDiff = (targetNeedle - _continuousNeedleAngle) % 360.0;
    if (needleDiff > 180.0) needleDiff -= 360.0;
    if (needleDiff < -180.0) needleDiff += 360.0;
    _continuousNeedleAngle += needleDiff * 0.22;

    // Kaaba alignment check (within 3 degrees)
    double alignmentError = ((displayHeading - qiblaDirection).abs() % 360.0);
    if (alignmentError > 180.0) alignmentError = 360.0 - alignmentError;
    final bool nowAligned = (userLat != null) && (alignmentError <= 3.0);

    if (nowAligned && !_isAligned) {
      HapticFeedback.selectionClick();
    }
    if (nowAligned != _isAligned) {
      needsFullRebuild = true;
    }
    _isAligned = nowAligned;
    deviceHeading = displayHeading;

    // Throttle UI updates to ~60fps (16ms). Only the compass subtree is rebuilt on a
    // normal sensor tick; the whole screen is rebuilt only when tilt/alignment flips.
    final int now = DateTime.now().millisecondsSinceEpoch;
    if (needsFullRebuild || now - _lastUiUpdateMs > 16) {
      _lastUiUpdateMs = now;
      if (!mounted) return;
      if (needsFullRebuild) {
        setState(() {});
      } else {
        _uiTick.value++;
      }
    }
  }

  String _getCardinal(double deg) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    int idx = ((deg + 11.25) % 360 / 22.5).floor();
    return directions[idx % 16];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0B101E),
      appBar: AppBar(
        title: const Text(
          'Qibla Compass',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Colors.white70),
            tooltip: 'Refresh Location & Sensors',
            onPressed: () {
              _initLocation();
              _resumeSensors();
            },
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Online / Offline Status Badge
            Container(
              padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 14),
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              decoration: BoxDecoration(
                color: isOffline ? Colors.orange.withOpacity(0.15) : Colors.green.withOpacity(0.15),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: isOffline ? Colors.orange : Colors.green,
                ),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    isOffline ? Icons.wifi_off : Icons.wifi,
                    color: isOffline ? Colors.orange : Colors.green,
                    size: 14,
                  ),
                  const SizedBox(width: 6),
                  Text(
                    isOffline ? 'Offline - Using cached location' : 'Online - Live location',
                    style: TextStyle(
                      color: isOffline ? Colors.orange : Colors.green,
                      fontWeight: FontWeight.w600,
                      fontSize: 11,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 12),

            // Location coordinates & Kaaba distance display
            if (isLocating && userLat == null)
              const Padding(
                padding: EdgeInsets.all(16.0),
                child: CircularProgressIndicator(color: Color(0xFFD4AF37)),
              )
            else if (locationError.isNotEmpty && userLat == null)
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Text(
                  locationError,
                  style: const TextStyle(color: Colors.redAccent, fontSize: 14),
                  textAlign: TextAlign.center,
                ),
              )
            else if (userLat != null)
              Column(
                children: [
                  Text(
                    '${userLat!.toStringAsFixed(4)}°, ${userLon!.toStringAsFixed(4)}°',
                    style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 14),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${distanceToKaaba.toStringAsFixed(0)} km to Kaaba',
                    style: const TextStyle(
                      color: Color(0xFFD4AF37),
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),

            // Alignment Status Badge
            const SizedBox(height: 10),
            if (_isAligned)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: const Color(0xFF2E7D32).withOpacity(0.3),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFF4CAF50), width: 1.5),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF4CAF50).withOpacity(0.3),
                      blurRadius: 10,
                      spreadRadius: 1,
                    ),
                  ],
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.check_circle, color: Color(0xFF4CAF50), size: 18),
                    SizedBox(width: 8),
                    Text(
                      'Facing Kaaba / قبلہ رخ درست ہے',
                      style: TextStyle(
                        color: Color(0xFF4CAF50),
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
              )
            else if (!_hasSensors)
              Container(
                margin: const EdgeInsets.symmetric(horizontal: 24),
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.amber.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.amber.withOpacity(0.6)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.explore_off, color: Colors.amber, size: 18),
                    const SizedBox(width: 8),
                    Flexible(
                      child: Text(
                        'Compass sensor unavailable. Face ${qiblaDirection.toStringAsFixed(0)}° (${_getCardinal(qiblaDirection)}) to orient toward Kaaba.',
                        style: const TextStyle(color: Colors.white70, fontSize: 11),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ],
                ),
              )
            else if (_isTilted)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.amber.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.amber),
                ),
                child: const Text(
                  'Hold phone flat horizontally',
                  style: TextStyle(color: Colors.amber, fontSize: 12, fontWeight: FontWeight.w600),
                ),
              ),

            const Spacer(),

            // Compass Dial & Needle (rebuilt on every sensor tick, isolated from the rest of the screen)
            ValueListenableBuilder<int>(
              valueListenable: _uiTick,
              builder: (context, _, __) {
                final double dialAngle = -_continuousHeading * pi / 180.0;
                final double needleAngle = _continuousNeedleAngle * pi / 180.0;
                return RepaintBoundary(
                  child: Center(
              child: Stack(
                alignment: Alignment.center,
                children: [
                  // Outer Glow when aligned with Kaaba
                  AnimatedContainer(
                    duration: const Duration(milliseconds: 250),
                    width: 300,
                    height: 300,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      boxShadow: _isAligned
                          ? [
                              BoxShadow(
                                color: const Color(0xFFD4AF37).withOpacity(0.45),
                                blurRadius: 30,
                                spreadRadius: 4,
                              ),
                            ]
                          : [],
                    ),
                  ),

                  // Rotating Compass Dial
                  Transform.rotate(
                    angle: dialAngle,
                    child: Container(
                      width: 290,
                      height: 290,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: const Color(0xFF131B2E),
                        border: Border.all(
                          color: _isAligned
                              ? const Color(0xFFD4AF37)
                              : Colors.white.withOpacity(0.2),
                          width: _isAligned ? 3 : 2,
                        ),
                      ),
                      child: Stack(
                        children: [
                          // Cardinal Directions
                          const Positioned(
                            top: 10,
                            left: 0,
                            right: 0,
                            child: Text(
                              'N',
                              textAlign: TextAlign.center,
                              style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold, fontSize: 22),
                            ),
                          ),
                          Positioned(
                            bottom: 10,
                            left: 0,
                            right: 0,
                            child: Text(
                              'S',
                              textAlign: TextAlign.center,
                              style: TextStyle(color: Colors.white.withOpacity(0.6), fontWeight: FontWeight.bold, fontSize: 16),
                            ),
                          ),
                          Positioned(
                            top: 0,
                            bottom: 0,
                            right: 12,
                            child: Center(
                              child: Text(
                                'E',
                                style: TextStyle(color: Colors.white.withOpacity(0.6), fontWeight: FontWeight.bold, fontSize: 16),
                              ),
                            ),
                          ),
                          Positioned(
                            top: 0,
                            bottom: 0,
                            left: 12,
                            child: Center(
                              child: Text(
                                'W',
                                style: TextStyle(color: Colors.white.withOpacity(0.6), fontWeight: FontWeight.bold, fontSize: 16),
                              ),
                            ),
                          ),

                          // Compass Dial Crosshairs
                          Center(
                            child: Container(
                              width: 1,
                              height: 240,
                              color: Colors.white.withOpacity(0.08),
                            ),
                          ),
                          Center(
                            child: Container(
                              width: 240,
                              height: 1,
                              color: Colors.white.withOpacity(0.08),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  // Rotating Qibla Needle (pointing directly to Kaaba relative to device)
                  Transform.rotate(
                    angle: needleAngle,
                    child: SizedBox(
                      width: 240,
                      height: 240,
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          // Needle Shaft
                          Positioned(
                            top: 24,
                            bottom: 120,
                            child: Container(
                              width: 4,
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  colors: [Color(0xFFD4AF37), Colors.transparent],
                                  begin: Alignment.topCenter,
                                  end: Alignment.bottomCenter,
                                ),
                                borderRadius: BorderRadius.circular(2),
                              ),
                            ),
                          ),
                          // Kaaba / Needle Head Icon
                          Positioned(
                            top: 0,
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(4),
                                  decoration: BoxDecoration(
                                    color: _isAligned ? const Color(0xFF4CAF50) : const Color(0xFFD4AF37),
                                    shape: BoxShape.circle,
                                    boxShadow: [
                                      BoxShadow(
                                        color: (_isAligned ? const Color(0xFF4CAF50) : const Color(0xFFD4AF37)).withOpacity(0.6),
                                        blurRadius: 8,
                                      ),
                                    ],
                                  ),
                                  child: const Icon(
                                    Icons.explore,
                                    color: Colors.black87,
                                    size: 22,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                const Text(
                                  'قبلہ',
                                  style: TextStyle(
                                    color: Color(0xFFD4AF37),
                                    fontWeight: FontWeight.bold,
                                    fontSize: 11,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  // Center Pivot Pin
                  Container(
                    width: 18,
                    height: 18,
                    decoration: BoxDecoration(
                      color: _isAligned ? const Color(0xFF4CAF50) : const Color(0xFFD4AF37),
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.black54, width: 2),
                      boxShadow: [
                        BoxShadow(
                          color: (_isAligned ? const Color(0xFF4CAF50) : const Color(0xFFD4AF37)).withOpacity(0.5),
                          blurRadius: 6,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
                );
              },
            ),

            const Spacer(),

            // Detailed Readings Panel
            ValueListenableBuilder<int>(
              valueListenable: _uiTick,
              builder: (context, _, __) => Container(
              margin: const EdgeInsets.symmetric(horizontal: 20),
              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
              decoration: BoxDecoration(
                color: const Color(0xFF131B2E),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white.withOpacity(0.1)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildReadingItem(
                    label: 'Heading',
                    value: '${deviceHeading.toStringAsFixed(0)}° ${_getCardinal(deviceHeading)}',
                    color: Colors.white,
                  ),
                  Container(width: 1, height: 32, color: Colors.white.withOpacity(0.15)),
                  _buildReadingItem(
                    label: 'Qibla',
                    value: '${qiblaDirection.toStringAsFixed(0)}° ${_getCardinal(qiblaDirection)}',
                    color: const Color(0xFFD4AF37),
                  ),
                  Container(width: 1, height: 32, color: Colors.white.withOpacity(0.15)),
                  _buildReadingItem(
                    label: 'Declination',
                    value: '${declination >= 0 ? '+' : ''}${declination.toStringAsFixed(1)}°',
                    color: Colors.white70,
                  ),
                ],
              ),
            ),
            ),

            Padding(
              padding: const EdgeInsets.only(top: 12.0, bottom: 20.0),
              child: Text(
                'Hold phone flat and away from magnets or metal objects',
                style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 11),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildReadingItem({
    required String label,
    required String value,
    required Color color,
  }) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          label,
          style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 10, fontWeight: FontWeight.w500),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: TextStyle(color: color, fontSize: 15, fontWeight: FontWeight.bold),
        ),
      ],
    );
  }
}
