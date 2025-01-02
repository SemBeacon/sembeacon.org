---
title: Privacy Policy
layout: layouts/default.njk
subtitle: Privacy policy for SemBeacon libraries and applications
---
## SemBeacon Application
SemBeacon is an application maintained by [Maxim Van de Wynckel](https://maximvdw.be) and the [Vrije Universiteit Brussel](https://vub.be) for scanning and retrieving information about Bluetooth Low Energy SemBeacons and other related beacons such as iBeacon, AltBeacon or Eddystone.

The application will scan for nearby beacons, which requires the use of the **location** permission. This information is not shared with SemBeacon or other parties and is only used to process the beacon information. This collection is necessary for the functioning of the application whose only functionality is the scanning of beacons.

### Solid Login
SemBeacon does not require users to log in, but offers the possibility to login via [**Solid**](https://solidproject.org/). User accounts can be created with a [Pod provider](https://solidproject.org/users/get-a-pod) which can be chosen by the user or self hosted. Any account deletion and terms of service has to be checked with the Pod provider.

#### Pod Access
The application will retrieve the user information (WebID) to enable the user to broadcast its WebID using a simulated SemBeacon. The application will not store or access any other information in the Pod unless referenced in the WebID resource.

### Permissions
- **Location (Precise)**: This permission is used both for getting the GPS location in the Beacon Map page as well as
a required permission to scan for beacons as these beacons can be used to determine the location.
- **Nearby Devices**: This permission allows nearby devices to detect your phone. This permission is used for the simulation of beacons.
- **Notifications**: An "ongoing" notification is used when simulating a beacon. This is to ensure that users are aware that the phone is broadcasting a beacon in the background.

### Error Logs
The application collects error logs using [Sentry](https://sentry.io/). These logs help us to identify and fix issues within the application. The collected data is anonymized and does not contain any personal information.

### Changes
Changes to the privacy policy will be mentioned within app updates or as modification on this website.

