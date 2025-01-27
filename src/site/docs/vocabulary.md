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
A SemBeacon `sosa:FeatureOfInterest` that is a subclass of `poso:BluetoothBeacon`. Optionally, users can use a beacon
to describe another resource using the `rdfs:seeAlso` predicate.

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
| 4 | `ssn:hasProperty` **min** 1 `sosa:ObserableProperty` |
| 5 | `ssn:hasProperty` **min** 1 `sosa:ActuatableProperty` |
| 6 - 7 | *Reserved for future use.* |

### Example

```turtle
@prefix :          <http://sembeacon.org/example.ttl#> .
@prefix rdf:       <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs:      <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd:       <http://www.w3.org/2001/XMLSchema#> .
@prefix ssn:       <http://www.w3.org/ns/ssn/> .
@prefix ogc:       <http://www.opengis.net/ont/geosparql#> .
@prefix hardware:  <http://w3id.org/devops-infra/hardware#> .
@prefix poso:      <http://purl.org/poso/> .
@prefix posoc:     <http://purl.org/poso/common/> .
@prefix sembeacon: <http://purl.org/sembeacon/> .
@prefix qudt:      <http://qudt.org/schema/qudt/> .
@prefix unit:      <http://qudt.org/vocab/unit/> .

:building_a a ssn:Deployment ;
  rdfs:label "Building A" ;
  sembeacon:namespaceId "e19c5e1ed6a14d698b3115451c3add71"^^xsd:hexBinary .

:room_a1_2 a sembeacon:SemBeacon ;
  rdfs:label "SemBeacon Room A1.2"@en ;
  rdfs:isDefinedBy <http://sembeacon.org/example.ttl#> ;
  sembeacon:namespace :building_a ;
  sembeacon:instanceId "beac0101"^^xsd:hexBinary ;
  hardware:mac "00:11:22:33:44:55" ;
  posoc:referenceRSSI [ # Reference RSSI is a ...
    # ... factory calibrated signal strength
    poso:hasRSS [ qudt:unit unit:DeciB_M ; qudt:numericValue -56 ] ;
    # ... measured at a specific distance
    poso:hasRelativeDistance [ unit:Meter ; qudt:value "1.0"^^xsd:double ] .
  ] ;
  poso:hasPosition [ a poso:AbsolutePosition ;
    poso:hasAccuracy [ ] ;
    poso:xAxisValue [ ] ;
    poso:yAxisValue [ ] ;
    poso:zAxisValue [ ] ] .

:room_a1_3 a posoc:iBeacon ;
  rdfs:label "iBeacon Room A1.3"@en ;
  rdfs:isDefinedBy <http://sembeacon.org/example.ttl#> ;
  sembeacon:namespace :building_a ;
  hardware:mac "00:55:44:33:22:11" ;
  posoc:major 11115 ;
  posoc:minor 12015 ;
  posoc:referenceRSSI [ 
    poso:hasRSS [ qudt:unit unit:DeciB_M ; qudt:numericValue -56 ] ;
    poso:hasRelativeDistance [ unit:Meter ; qudt:value "1.0"^^xsd:double ] .
  ] ;
  poso:hasPosition [ a poso:AbsolutePosition ;
    poso:hasAccuracy [ ] ;
    poso:xAxisValue [ ] ;
    poso:yAxisValue [ ] ;
    poso:zAxisValue [ ] ] .
```
