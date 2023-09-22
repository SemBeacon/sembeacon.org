---
title: Implementation
layout: layouts/docs.njk
subtitle: Specification Implementation
tags: docs
menuOrder: 103
---
<div class="alert alert-warn">Work in progress</div>

## Spatial Grouping and Environment Analysis
SemBeacon helps to describe environments and the Physical Things within. Once a list is created of all
Things that should be described, grouping can be performed.

Physical things, environments and beacons should be grouped on a spatial level. However, as all grouped
instances will be fetched at the same time, developers are free to decide to split up the spatial grouping
when needed. In general, spatial grouping should be performed on *floors* or *buildings*. If users are expected to navigate
over multiple floors (e.g. in a hospital) then the spatial grouping can be performed on the whole building. 

In addition to the Physical Things that need to be described, multiple beacons need to cover the spatial area so nearby SemBeacon scanners can pick up the advertisements.

![Signal strenght range](/images/implementation/coverage_legend.svg)
![Coverage of a map with signal strength](/images/implementation/coverage_map.png){ width=100% }

## Semantic Environment
After analyzing the environment and performing spatial grouping, a semantic description of the environment(s) should be created.
We will make use of the SemBeacon vocabulary along with POSO and M3 Lite.

## Beacon Implementation and Deployment
The beacon implementation is similar to existing Eddystone, iBeacon or AltBeacon implementations. On our GitHub page we offer an ESP32 library for creating a beacon.

## Scanning Application

1.  **State**: The application keeps a local state of the `namespaces` it encounters and the associated `resource URIs`.
    Each `namespace` keeps track of the beacons and physical things located within those namespaces.
2.  **Passive scanning**: The scanning application should start with a passive scan for iBeacon/AltBeacon compatible data.
    The application passively scans for incoming advertisements until AltBeacon compatible manufacturer data is detected that includes a 128-bit UUID (i.e. `namespace` identifier).
3.  **Beacon identification**: A beacon is identified with a `namespace` and `instance` identifier. The application checks if it
    has knowledge about the `namespace` identifier in its local state. If the `namespace` was not previously discovered, an active scan is performed. If the `namespace` was previously discovered and no cache timeout occurs, the passive scanning is continued.
3.  **Active scanning**: Active scanning involves a scan request by the scanning application. 
4.  **SemBeacon identification**: SemBeacons will respond with a scan response that includes the Eddystone-URL compatible
    resource URI. Compatible scanners will detect a SemBeacon when it has an AltBeacon advertisement and Eddystone-URL scan response.
5.  **Data retrieval**: In case no information about the namespace was available, the resource URI is accessed to retrieve the
    location of the beacon, as well as other beacons within the same namespace. Depending on the SemBeacon flags and the implementation of the application to act on these flags, the data might not be retrieved.
6.  **Passive scanning**: The application continues the passive scan until an unknown namespace is found, in which case step (3)
    is performed again.


