---
title: Tools
layout: layouts/docs.njk
subtitle: SemBeacon Tools and Examples
tags: docs
menuOrder: 104
redirect_from:
  - /tools/
---

## ESP32
We provide a library that can be used to create and scan for SemBeacon's with the Arduino-ESP32 library. The library can be found in [this repository](https://github.com/SemBeacon/arduino-esp32).

```cpp
// Create a SemBeacon
BLESemBeacon beacon = BLESemBeacon();
beacon.setManufacturerId(0x4c00);                           // Manufacturer of the beacon
beacon.setSignalPower(-56);                                 // RSSI at 1m distance
beacon.setNamespaceId(BLEUUID(BEACON_UUID));                // Namespace UUID
beacon.setInstanceId(0xBEACBEAC);                           // Instance Identifier
beacon.setResourceURI("https://tinyurl.com/3u9tpt7k");      // URI to the resource

// Start the advertising
BLESemBeaconAdvertising* advertising = new BLESemBeaconAdvertising();
advertising->setBeacon(&beacon);
advertising->start();
```

## Android
SemBeacon provides an extension on top of the [android-beacon-library](https://github.com/AltBeacon/android-beacon-library/) by [AltBeacon](https://github.com/AltBeacon) which adds the ability to scan for SemBeacons and broadcast the data. The library can be found in [this repository](https://github.com/SemBeacon/android-library).

```java
BeaconManager beaconManager = BeaconManager.getInstanceForApplication(this.getApplicationContext());
// Clear AltBeacon from the added parsers to prevent it from having a higher priority
beaconManager.getBeaconParsers().clear();
// Detect a SemBeacon
beaconManager.getBeaconParsers().add(new SemBeaconParser());
// Add AltBeacon again
beaconManager.getBeaconParsers().add(new BeaconParser().
    setBeaconLayout(BeaconParser.ALTBEACON_LAYOUT));
```

While this tool enables you to broadcast and scan for SemBeacons, it does not provide the necesarry tools for extracting semantic data from the public URI.

An example implementation of this library can be found [here](https://github.com/SemBeacon/android-beacon-scanner).

## iOS
*Currently no tools for iOS exist to demonstrate SemBeacon capabilities.*