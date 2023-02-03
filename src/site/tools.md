---
title: Tools
layout: layouts/default.njk
subtitle: SemBeacon Tools and Examples
---

## ESP32
We provide a library that can be used to create and scan for SemBeacon's with the Arduino-ESP32 library.

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
SemBeacon provides an extension on top of the [android-beacon-library](https://github.com/AltBeacon/android-beacon-library/) by [AltBeacon](https://github.com/AltBeacon) which adds the ability to scan for SemBeacons and broadcast the data.

While this tool enables you to broadcast and scan for SemBeacons, it does not provide the necesarry tools for extracting semantic data from the public URI.

## iOS
*Currently no tools for iOS exist to demonstrate SemBeacon capabilities.*