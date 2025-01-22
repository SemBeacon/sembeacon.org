---
title: Specification
layout: layouts/docs.njk
subtitle: Specification Documentation
tags: docs
menuOrder: 101
---
## Definition
A SemBeacon is a Bluetooth Low Energy transmitter that advertises a namespace and instance identifier and
a Uniform Resource Indicator (URI) linking to a RDF resource on the web describing the beacon's location and
other information relevant to this location.

## Bluetooth Specification

### SemBeacon Flags
The specification provisions 1-byte for flags. These flags provide more context to the installation of the beacon
so applications scanning for a beacon can decide whether or not they want to retrieve the semantic data for these beacons.

| **Bit (MSB)**  | **Description** | **Example** |
|---|---|---|
| 0 | Indicates if the beacon has a position. | 0 = Unsure, 1 = Yes |
| 1 | Indicates if the beacon is private. | 0 = Public, 1 = Private |
| 2 | Indicates if the beacon is attached to a moving object. | 0 = No, 1 = Yes |
| 3 | Indicates if the beacon has a positioning system. | 0 = No, 1 = Yes |
| 4 | Indicates if the beacon has telemetry data. | 0 = No, 1 = Yes |
| 5 - 7 | *Reserved for future use.* ||

### Resource URI
The resource URI should resolve to a semantic description of the beacon. Depending on the BLE version this resource URI
needs to be shortened to fit in the advertisement data.

#### URI Shorteners
- tinyurl.com
- bitly.com
- s.sembeacon.org (*only available in the SemBeacon app*)

## BLE 4.x Specification
![SemBeacon Bluetooth 4.x specification]({{ '/images/specification/sembeacon_specification_v4_2_alpha.svg' | absoluteUrl }})

## BLE 5.x Specification
![SemBeacon Bluetooth 5.x specification]({{ '/images/specification/sembeacon_specification_v5_0_alpha.svg' | absoluteUrl }})
