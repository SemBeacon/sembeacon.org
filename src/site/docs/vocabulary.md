---
title: Ontology
layout: layouts/docs.njk
subtitle: Specification Documentation
tags: docs
menuOrder: 102
---

The vocabulary for describing a SemBeacon is based on the [Positioning System Ontology (POSO)](https://github.com/OpenHPS/POSO), an ontology that helps to describe a positioning system.

A documentation for the SemBeacon ontology can be found [here]({{ '/terms/1.0/' | absoluteUrl }}).

### Classes

#### `sembeacon:SemBeacon`
A SemBeacon `sosa:FeatureOfInterest` that is a subclass of `poso:BluetoothBeacon`.

### Data Properties

#### `sembeacon:instanceId`
The 4-byte instance ID as hexadecimal representation using `xsd:hexBinary`. This property should be added
to a `sembeacon:SemBeacon`.

#### `sembeacon:namespaceId`
The 16-byte namespace ID as hexadecimal representation using `xsd:hexBinary`. This property should be added
to a `sembeacon:SemBeacon` or a `ssn:Deployment` if linked using the object property `sembeacon:namespace`.

#### `sembeacon:shortResourceURI`
The short resource URI as `xsd:anyURI`. This is the shortened resource URI if available.

### Object Properties

#### `sembeacon:namespace`
An optional namespace link to a deployment that has a `sembeacon:namespaceId`.

### Semantic Flags
The semantic flags specified in the advertisement data need to indicate that data is available online.

| **Bit**  | **Axiom** |
|---|---|
| 0 | `poso:hasPosition` **min** 1 `poso:AbsolutePosition` |
| 1 | N.a. |
| 2 | N.a. |
| 3 | `poso:inDeployment` **min** 1 `ssn:Deployment` |
| 4 | `sosa:observes` **min** 1 `sosa:ObservableProperty` |
| 5 - 7 | *Reserved for future use.* |