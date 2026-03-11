# Alee Technical Architecture
## AI-Powered Disease Detection & Smart Farming Advisory Platform

**Version:** 1.0  
**Date:** March 2026  
**Prepared by:** Raymond Wayesu (CTO)  
**For:** Paul Mubiri (Founder/CEO)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Solution Overview](#2-solution-overview)
3. [System Architecture](#3-system-architecture)
4. [Technology Stack](#4-technology-stack)
5. [Mobile Application Architecture](#5-mobile-application-architecture)
6. [Backend Services Architecture](#6-backend-services-architecture)
7. [AI/ML Pipeline](#7-aiml-pipeline)
8. [IoT Sensor Integration](#8-iot-sensor-integration)
9. [Database Design](#9-database-design)
10. [API Specifications](#10-api-specifications)
11. [Security Architecture](#11-security-architecture)
12. [Offline Capabilities](#12-offline-capabilities)
13. [SMS Gateway Integration](#13-sms-gateway-integration)
14. [Deployment Architecture](#14-deployment-architecture)
15. [Scalability Strategy](#15-scalability-strategy)
16. [Development Roadmap](#16-development-roadmap)
17. [Cost Estimates](#17-cost-estimates)
18. [Team Structure](#18-team-structure)

---

## 1. Executive Summary

### 1.1 Business Context

Alee is an AI-powered agricultural technology platform designed to transform plantain (gonja) farming in Uganda and across Africa. The platform combines two core capabilities:

1. **AI Disease Scout:** A mobile application that uses computer vision to instantly identify plant diseases from photos, enabling early intervention and preventing crop loss.

2. **Smart Farm Advisor:** An IoT-based precision farming system that collects soil and environmental data, combines it with satellite imagery, and delivers personalised farming recommendations via SMS.

### 1.2 Key Objectives

| Objective | Target Metric |
|-----------|---------------|
| Disease Detection Accuracy | ≥90% for 7 major plantain diseases |
| Offline Functionality | 100% core features available offline |
| Farmer Response Time | <3 seconds for disease diagnosis |
| Yield Improvement | 40-64% increase through precision farming |
| Cost per Farmer | <UGX 50,000/season for full service |

### 1.3 Target Users

- **Primary:** Smallholder gonja farmers in Kassanda District and Central Uganda
- **Secondary:** Agricultural cooperatives, extension officers, government programmes
- **Tertiary:** Agri-input suppliers, financial institutions, insurance providers

---

## 2. Solution Overview

### 2.1 Combined Solution Architecture

The platform integrates two complementary modules into a unified system:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Alee Platform                          │
├─────────────────────────────────┬───────────────────────────────────────┤
│      AI Disease Scout           │        Smart Farm Advisor             │
│                                 │                                       │
│  • Photo-based diagnosis        │  • Soil sensor data collection        │
│  • Offline AI model             │  • Satellite imagery analysis         │
│  • Disease outbreak alerts      │  • Weather integration                │
│  • Treatment recommendations    │  • Personalised SMS advice            │
│  • Community disease mapping    │  • Yield prediction                   │
└─────────────────────────────────┴───────────────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │   Shared Platform Core    │
                    ├───────────────────────────┤
                    │  • User management        │
                    │  • Farm registry          │
                    │  • Data analytics         │
                    │  • Notification engine    │
                    │  • Billing & subscriptions│
                    └───────────────────────────┘
```

### 2.2 Core Features

#### Module 1: AI Disease Scout

| Feature | Description | Priority |
|---------|-------------|----------|
| Photo Capture | Camera integration with auto-focus and quality checks | P0 |
| Offline Diagnosis | On-device ML model for instant classification | P0 |
| Disease Library | Educational content for 7+ plantain diseases | P0 |
| Treatment Guide | Step-by-step treatment recommendations | P0 |
| SMS Alerts | Outbreak warnings to nearby farmers | P0 |
| Disease Mapping | Geo-referenced disease occurrence tracking | P1 |
| History Log | Track past diagnoses and treatments | P1 |
| Expert Escalation | Connect to agronomist for complex cases | P2 |

#### Module 2: Smart Farm Advisor

| Feature | Description | Priority |
|---------|-------------|----------|
| Sensor Dashboard | Real-time soil moisture, pH, nutrient levels | P0 |
| SMS Advisory | Personalised farming tips via SMS | P0 |
| Weather Integration | 7-day forecasts and rain alerts | P0 |
| Satellite Analysis | NDVI-based crop health monitoring | P1 |
| Yield Prediction | AI-powered harvest forecasting | P1 |
| Input Calculator | Fertiliser and water requirements | P1 |
| Historical Trends | Season-over-season comparisons | P2 |

---

## 3. System Architecture

### 3.1 High-Level Architecture Diagram

```
                              ┌─────────────────────────────────────┐
                              │           EXTERNAL SERVICES          │
                              │  ┌─────────┐ ┌─────────┐ ┌────────┐ │
                              │  │ Weather │ │Satellite│ │  SMS   │ │
                              │  │   API   │ │  Data   │ │Gateway │ │
                              │  └────┬────┘ └────┬────┘ └───┬────┘ │
                              └───────┼──────────┼──────────┼───────┘
                                      │          │          │
                    ┌─────────────────┴──────────┴──────────┴─────────────────┐
                    │                     CLOUD LAYER                          │
                    │   ┌─────────────────────────────────────────────────┐   │
                    │   │              Google Cloud Platform               │   │
                    │   │  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │   │
                    │   │  │ Cloud    │ │ Cloud    │ │  Vertex AI /     │ │   │
                    │   │  │ Run      │ │ Storage  │ │  TensorFlow      │ │   │
                    │   │  └────┬─────┘ └────┬─────┘ └────────┬─────────┘ │   │
                    │   │       │            │                │           │   │
                    │   │  ┌────┴────────────┴────────────────┴─────┐    │   │
                    │   │  │           API Gateway                  │    │   │
                    │   │  │     (Firebase / Cloud Endpoints)       │    │   │
                    │   │  └────────────────┬───────────────────────┘    │   │
                    │   │                   │                            │   │
                    │   │  ┌────────────────┴───────────────────────┐    │   │
                    │   │  │           Backend Services             │    │   │
                    │   │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐  │    │   │
                    │   │  │  │  Auth   │ │  Farm   │ │  ML     │  │    │   │
                    │   │  │  │ Service │ │ Service │ │ Service │  │    │   │
                    │   │  │  └─────────┘ └─────────┘ └─────────┘  │    │   │
                    │   │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐  │    │   │
                    │   │  │  │  IoT    │ │  Alert  │ │Analytics│  │    │   │
                    │   │  │  │ Service │ │ Service │ │ Service │  │    │   │
                    │   │  │  └─────────┘ └─────────┘ └─────────┘  │    │   │
                    │   │  └────────────────────────────────────────┘    │   │
                    │   │                   │                            │   │
                    │   │  ┌────────────────┴───────────────────────┐    │   │
                    │   │  │         Database Layer                 │    │   │
                    │   │  │  ┌──────────┐  ┌──────────┐            │    │   │
                    │   │  │  │ Firestore│  │ BigQuery │            │    │   │
                    │   │  │  │ (Primary)│  │(Analytics)│           │    │   │
                    │   │  │  └──────────┘  └──────────┘            │    │   │
                    │   │  └────────────────────────────────────────┘    │   │
                    │   └─────────────────────────────────────────────────┘   │
                    └─────────────────────────┬───────────────────────────────┘
                                              │
            ┌─────────────────────────────────┼─────────────────────────────────┐
            │                                 │                                 │
    ┌───────┴───────┐                 ┌───────┴───────┐                 ┌───────┴───────┐
    │ MOBILE LAYER  │                 │   IoT LAYER   │                 │  SMS LAYER    │
    │               │                 │               │                 │               │
    │ ┌───────────┐ │                 │ ┌───────────┐ │                 │ ┌───────────┐ │
    │ │  Android  │ │                 │ │   Soil    │ │                 │ │   USSD    │ │
    │ │    App    │ │                 │ │  Sensors  │ │                 │ │  Gateway  │ │
    │ └───────────┘ │                 │ └───────────┘ │                 │ └───────────┘ │
    │ ┌───────────┐ │                 │ ┌───────────┐ │                 │ ┌───────────┐ │
    │ │ On-device │ │                 │ │  Weather  │ │                 │ │   SMS     │ │
    │ │ ML Model  │ │                 │ │  Station  │ │                 │ │  Delivery │ │
    │ └───────────┘ │                 │ └───────────┘ │                 │ └───────────┘ │
    │ ┌───────────┐ │                 │ ┌───────────┐ │                 │               │
    │ │  Offline  │ │                 │ │  LoRaWAN  │ │                 │               │
    │ │   Cache   │ │                 │ │  Gateway  │ │                 │               │
    │ └───────────┘ │                 │ └───────────┘ │                 │               │
    └───────────────┘                 └───────────────┘                 └───────────────┘
            │                                 │                                 │
            └─────────────────────────────────┼─────────────────────────────────┘
                                              │
                                    ┌─────────┴─────────┐
                                    │      FARMERS      │
                                    │  (End Users)      │
                                    └───────────────────┘
```

### 3.2 Component Descriptions

#### 3.2.1 Mobile Layer
- **Android App:** Native application for smartphones with camera access
- **On-device ML Model:** TensorFlow Lite model for offline disease detection
- **Offline Cache:** SQLite database for local data storage and sync

#### 3.2.2 IoT Layer
- **Soil Sensors:** Measure moisture (0-100%), pH (3.5-9.0), NPK levels
- **Weather Station:** Temperature, humidity, rainfall, wind speed
- **LoRaWAN Gateway:** Long-range, low-power connectivity for rural areas

#### 3.2.3 Cloud Layer
- **API Gateway:** Firebase / Cloud Endpoints for request routing
- **Backend Services:** Microservices architecture on Cloud Run
- **Database:** Firestore (real-time) + BigQuery (analytics)

#### 3.2.4 SMS Layer
- **USSD Gateway:** For farmers without smartphones
- **SMS Delivery:** Africa's Talking API for bulk messaging

---

## 4. Technology Stack

### 4.1 Complete Technology Stack

| Layer | Technology | Justification |
|-------|------------|---------------|
| **Mobile App** | | |
| Framework | Flutter (Dart) | Cross-platform, single codebase, Google ecosystem |
| Local Database | SQLite + Hive | Offline-first capability |
| ML Runtime | TensorFlow Lite | Optimised for mobile inference |
| Camera | camera + image_picker packages | Native camera access |
| **Backend** | | |
| Runtime | Node.js (Express) | Lightweight, async, large ecosystem |
| Framework | NestJS | Modular architecture, TypeScript support |
| API Protocol | REST + gRPC | REST for mobile, gRPC for inter-service |
| **AI/ML** | | |
| Training | TensorFlow / Keras | Industry standard, Google ecosystem |
| Serving | Vertex AI | Managed ML infrastructure |
| Edge Inference | TensorFlow Lite | Mobile-optimised models |
| **Database** | | |
| Primary | Cloud Firestore | Real-time sync, offline support |
| Analytics | BigQuery | Scalable analytics warehouse |
| Cache | Redis (Memorystore) | Session management, caching |
| **IoT** | | |
| Protocol | MQTT over LoRaWAN | Low power, long range |
| Edge Gateway | The Things Network | Open LoRaWAN infrastructure |
| Device Management | Cloud IoT Core | Secure device provisioning |
| **Infrastructure** | | |
| Cloud Provider | Google Cloud Platform | Accelerator credits, AI tools |
| Compute | Cloud Run | Serverless, auto-scaling |
| CDN | Cloud CDN | Fast content delivery |
| DNS | Cloud DNS | Reliable DNS management |
| **DevOps** | | |
| CI/CD | Cloud Build | Native GCP integration |
| Containers | Docker | Consistent deployment |
| IaC | Terraform | Infrastructure as code |
| Monitoring | Cloud Monitoring + Logging | Full observability |
| **External APIs** | | |
| SMS | Africa's Talking | Uganda coverage, reliability |
| Weather | OpenWeatherMap | Free tier available |
| Satellite | Sentinel Hub / Google Earth Engine | NDVI analysis |
| Maps | Google Maps Platform | Geolocation services |

### 4.2 Version Requirements

```yaml
# Mobile
flutter: ">=3.19.0"
dart: ">=3.3.0"
tflite_flutter: "^0.10.4"

# Backend
node: ">=20.0.0"
nestjs: "^10.3.0"
typescript: "^5.4.0"

# ML
tensorflow: ">=2.15.0"
keras: ">=3.0.0"

# Infrastructure
terraform: ">=1.7.0"
docker: ">=25.0.0"
```

---

## 5. Mobile Application Architecture

### 5.1 App Architecture (Clean Architecture)

```
┌─────────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                              │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                        UI Widgets                              │  │
│  │   Home  │  Camera  │  Diagnosis  │  Farm  │  Sensors  │  SMS  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                     State Management                           │  │
│  │              (BLoC Pattern with flutter_bloc)                  │  │
│  └───────────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────┤
│                        DOMAIN LAYER                                  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                       Use Cases                                │  │
│  │  DiagnosePlant │ GetFarmData │ SendAlert │ SyncData │ GetTips │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                        Entities                                │  │
│  │   Farm  │  Plant  │  Disease  │  Sensor  │  Advisory  │  User │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                   Repository Interfaces                        │  │
│  └───────────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────┤
│                         DATA LAYER                                   │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                   Repository Implementations                   │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────┐      ┌──────────────────────────────┐    │
│  │   Remote Data Source │      │     Local Data Source        │    │
│  │   (Firebase/REST API)│      │   (SQLite + Hive + TFLite)   │    │
│  └──────────────────────┘      └──────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.2 Key Flutter Packages

```yaml
dependencies:
  # Core
  flutter_bloc: ^8.1.0          # State management
  get_it: ^7.6.0                # Dependency injection
  dartz: ^0.10.1                # Functional programming
  equatable: ^2.0.5             # Value equality
  
  # Networking
  dio: ^5.4.0                   # HTTP client
  connectivity_plus: ^5.0.0     # Network detection
  
  # Database
  sqflite: ^2.3.0               # SQLite
  hive: ^2.2.3                  # Fast key-value store
  
  # ML/AI
  tflite_flutter: ^0.10.4       # TensorFlow Lite
  camera: ^0.10.5               # Camera access
  image: ^4.1.0                 # Image processing
  
  # Firebase
  firebase_core: ^2.25.0
  firebase_auth: ^4.17.0
  cloud_firestore: ^4.15.0
  firebase_storage: ^11.6.0
  firebase_messaging: ^14.7.0
  
  # Location & Maps
  geolocator: ^10.1.0
  google_maps_flutter: ^2.5.0
  
  # Utilities
  intl: ^0.18.0                 # Localization
  shared_preferences: ^2.2.0    # Simple storage
```

### 5.3 Screen Flow

```
┌──────────────┐
│   Splash     │
│   Screen     │
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐
│   Onboarding │────▶│    Login/    │
│   (First run)│     │   Register   │
└──────────────┘     └──────┬───────┘
                            │
                            ▼
                    ┌──────────────┐
                    │     Home     │
                    │   Dashboard  │
                    └──────┬───────┘
                           │
       ┌───────────────────┼───────────────────┐
       │                   │                   │
       ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Disease    │   │    Farm      │   │   Profile    │
│   Scanner    │   │   Manager    │   │   Settings   │
└──────┬───────┘   └──────┬───────┘   └──────────────┘
       │                   │
       ▼                   ▼
┌──────────────┐   ┌──────────────┐
│   Diagnosis  │   │   Sensor     │
│   Result     │   │   Dashboard  │
└──────┬───────┘   └──────┬───────┘
       │                   │
       ▼                   ▼
┌──────────────┐   ┌──────────────┐
│   Treatment  │   │   SMS        │
│   Guide      │   │   History    │
└──────────────┘   └──────────────┘
```

### 5.4 Disease Detection Flow (On-Device)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DISEASE DETECTION PIPELINE                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1. CAPTURE                2. PREPROCESS              3. INFERENCE   │
│  ┌─────────┐              ┌─────────────┐            ┌───────────┐  │
│  │ Camera  │──────────────│ Resize to   │────────────│ TFLite    │  │
│  │ (Photo) │              │ 224x224 RGB │            │ Interpreter│  │
│  └─────────┘              └─────────────┘            └───────────┘  │
│       │                         │                          │        │
│       │                         │                          │        │
│       ▼                         ▼                          ▼        │
│  ┌─────────┐              ┌─────────────┐            ┌───────────┐  │
│  │ Quality │              │ Normalize   │            │ Softmax   │  │
│  │ Check   │              │ (0-1 float) │            │ Output    │  │
│  └─────────┘              └─────────────┘            └───────────┘  │
│                                                            │        │
│                                                            │        │
│  4. CLASSIFICATION                    5. RESULT                     │
│  ┌───────────────────────────────────────────────────────┐         │
│  │ Class Probabilities:                                  │         │
│  │   • Healthy:           0.05                           │         │
│  │   • Black Sigatoka:    0.87  ◄── HIGHEST              │         │
│  │   • BXW:               0.03                           │         │
│  │   • Fusarium Wilt:     0.02                           │         │
│  │   • Panama Disease:    0.02                           │         │
│  │   • Bunchy Top:        0.01                           │         │
│  └───────────────────────────────────────────────────────┘         │
│                                 │                                   │
│                                 ▼                                   │
│                        ┌───────────────┐                            │
│                        │ Confidence    │                            │
│                        │ > 80%? ──────▶ Show Diagnosis              │
│                        │ < 80%? ──────▶ "Uncertain - Retake"        │
│                        └───────────────┘                            │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 6. Backend Services Architecture

### 6.1 Microservices Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        API GATEWAY                                   │
│                  (Firebase Cloud Functions)                          │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ AUTH SERVICE  │   │ FARM SERVICE  │   │  ML SERVICE   │
│               │   │               │   │               │
│ • Registration│   │ • Farm CRUD   │   │ • Cloud       │
│ • Login/JWT   │   │ • Plot mgmt   │   │   inference   │
│ • User profile│   │ • Crop tracking│  │ • Model       │
│ • Permissions │   │ • Geolocation │   │   updates     │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│  IOT SERVICE  │   │ ALERT SERVICE │   │ANALYTICS SVC  │
│               │   │               │   │               │
│ • Sensor data │   │ • SMS sending │   │ • Dashboards  │
│ • MQTT broker │   │ • Push notif  │   │ • Reports     │
│ • Thresholds  │   │ • Outbreak    │   │ • Predictions │
│ • Aggregation │   │   detection   │   │ • Exports     │
└───────────────┘   └───────────────┘   └───────────────┘
```

### 6.2 Service Specifications

#### Auth Service
```
Endpoint Base: /api/v1/auth

POST   /register         # Create new user account
POST   /login            # Authenticate and get JWT
POST   /refresh          # Refresh access token
POST   /logout           # Invalidate token
GET    /profile          # Get user profile
PUT    /profile          # Update profile
POST   /verify-phone     # SMS verification
POST   /forgot-password  # Reset password flow
```

#### Farm Service
```
Endpoint Base: /api/v1/farms

GET    /                 # List user's farms
POST   /                 # Create new farm
GET    /:farmId          # Get farm details
PUT    /:farmId          # Update farm
DELETE /:farmId          # Delete farm

GET    /:farmId/plots    # List plots in farm
POST   /:farmId/plots    # Add plot to farm
GET    /:farmId/sensors  # List sensors
POST   /:farmId/diagnoses # Submit disease diagnosis
GET    /:farmId/history  # Diagnosis history
```

#### ML Service
```
Endpoint Base: /api/v1/ml

POST   /diagnose         # Cloud-based disease detection
GET    /model/version    # Current model version
GET    /model/download   # Download latest model for offline
POST   /feedback         # Submit correction feedback
GET    /diseases         # Disease reference library
```

#### IoT Service
```
Endpoint Base: /api/v1/iot

GET    /sensors          # List all sensors
POST   /sensors          # Register new sensor
GET    /sensors/:id      # Get sensor details
GET    /sensors/:id/data # Get sensor readings
POST   /sensors/:id/data # Submit sensor data (device API)

GET    /readings/:farmId # Aggregated farm readings
GET    /alerts/:farmId   # Active sensor alerts
```

#### Alert Service
```
Endpoint Base: /api/v1/alerts

POST   /sms              # Send SMS to farmer
POST   /broadcast        # Broadcast to area
GET    /history          # Alert history
POST   /outbreak         # Report disease outbreak
GET    /nearby/:lat/:lng # Get nearby disease reports
```

---

## 7. AI/ML Pipeline

### 7.1 Model Training Pipeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ML TRAINING PIPELINE                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐                                                    │
│  │ DATA SOURCES │                                                    │
│  ├──────────────┤                                                    │
│  │ • PlantVillage Dataset (87,000+ images)                          │
│  │ • Tumaini Project (banana diseases)                              │
│  │ • IITA/NARO disease image collections                            │
│  │ • Field-collected images (ongoing)                               │
│  └──────┬───────┘                                                    │
│         │                                                            │
│         ▼                                                            │
│  ┌──────────────┐                                                    │
│  │ DATA PREP    │                                                    │
│  ├──────────────┤                                                    │
│  │ • Resize to 224x224                                              │
│  │ • Data augmentation (rotation, flip, brightness)                 │
│  │ • Train/Val/Test split (70/15/15)                                │
│  │ • Class balancing (oversampling minority)                        │
│  └──────┬───────┘                                                    │
│         │                                                            │
│         ▼                                                            │
│  ┌──────────────┐                                                    │
│  │ MODEL ARCH   │                                                    │
│  ├──────────────┤                                                    │
│  │ Base: MobileNetV3-Small (transfer learning)                      │
│  │ • Pre-trained on ImageNet                                        │
│  │ • Fine-tuned on plantain diseases                                │
│  │ • Custom classification head (7 classes)                         │
│  │ • Size: ~6MB (quantized)                                         │
│  └──────┬───────┘                                                    │
│         │                                                            │
│         ▼                                                            │
│  ┌──────────────┐                                                    │
│  │ TRAINING     │                                                    │
│  ├──────────────┤                                                    │
│  │ • Platform: Vertex AI Training                                   │
│  │ • GPU: NVIDIA T4                                                 │
│  │ • Epochs: 50 with early stopping                                 │
│  │ • Optimizer: Adam (lr=0.001)                                     │
│  │ • Loss: Categorical cross-entropy                                │
│  └──────┬───────┘                                                    │
│         │                                                            │
│         ▼                                                            │
│  ┌──────────────┐                                                    │
│  │ OPTIMIZATION │                                                    │
│  ├──────────────┤                                                    │
│  │ • Post-training quantization (INT8)                              │
│  │ • TFLite conversion                                              │
│  │ • Edge TPU compilation (optional)                                │
│  │ • Benchmark: <200ms inference on mid-range phone                 │
│  └──────┬───────┘                                                    │
│         │                                                            │
│         ▼                                                            │
│  ┌──────────────┐                                                    │
│  │ DEPLOYMENT   │                                                    │
│  ├──────────────┤                                                    │
│  │ • Model stored in Cloud Storage                                  │
│  │ • Versioned with semantic versioning                             │
│  │ • App downloads on first run + periodic updates                  │
│  │ • A/B testing for new models                                     │
│  └──────────────┘                                                    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.2 Disease Classes

| Class ID | Disease Name | Common Symptoms | Treatment Priority |
|----------|--------------|-----------------|-------------------|
| 0 | Healthy | Green leaves, no spots | N/A |
| 1 | Black Sigatoka | Yellow/brown leaf spots | Medium |
| 2 | Banana Bacterial Wilt (BXW) | Yellowing, premature ripening | Critical |
| 3 | Fusarium Wilt (Panama) | Yellowing from older leaves | Critical |
| 4 | Bunchy Top Virus | Stunted growth, narrow leaves | High |
| 5 | Banana Weevil Damage | Tunnels in pseudostem | Medium |
| 6 | Nutrient Deficiency | Various leaf discoloration | Low |

### 7.3 Model Performance Targets

| Metric | Target | Current Benchmark |
|--------|--------|-------------------|
| Overall Accuracy | ≥90% | 92% (Tumaini) |
| Per-class Recall (BXW) | ≥95% | 91% |
| Per-class Recall (Sigatoka) | ≥90% | 93% |
| Inference Time (mobile) | <300ms | ~200ms |
| Model Size | <10MB | ~6MB |
| False Negative Rate (critical) | <5% | - |

---

## 8. IoT Sensor Integration

### 8.1 Sensor Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      IoT SENSOR NETWORK                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  FARM LEVEL                           GATEWAY LEVEL                  │
│  ┌─────────────────┐                  ┌─────────────────────────┐   │
│  │  SENSOR NODE 1  │                  │   LoRaWAN GATEWAY       │   │
│  │  ┌───────────┐  │                  │                         │   │
│  │  │ Soil      │  │ ────LoRa────▶   │  • RAK7243 Pilot        │   │
│  │  │ Moisture  │  │                  │  • Solar powered        │   │
│  │  └───────────┘  │                  │  • GSM backhaul         │   │
│  │  ┌───────────┐  │                  │                         │   │
│  │  │ Soil pH   │  │                  └───────────┬─────────────┘   │
│  │  │ Sensor    │  │                              │                  │
│  │  └───────────┘  │                              │ HTTPS/MQTT       │
│  │  ┌───────────┐  │                              │                  │
│  │  │ NPK       │  │                              ▼                  │
│  │  │ Sensor    │  │                  ┌─────────────────────────┐   │
│  │  └───────────┘  │                  │  THE THINGS NETWORK     │   │
│  │  ┌───────────┐  │                  │  (LoRaWAN Backend)      │   │
│  │  │ Battery   │  │                  └───────────┬─────────────┘   │
│  │  │ (18650)   │  │                              │                  │
│  │  └───────────┘  │                              │ Webhook          │
│  └─────────────────┘                              │                  │
│                                                   ▼                  │
│  ┌─────────────────┐                  ┌─────────────────────────┐   │
│  │  SENSOR NODE 2  │                  │  GOOGLE CLOUD IOT       │   │
│  │  (Same config)  │ ────LoRa────▶   │                         │   │
│  └─────────────────┘                  │  • Device Registry      │   │
│                                       │  • Pub/Sub Integration  │   │
│  ┌─────────────────┐                  │  • BigQuery Storage     │   │
│  │  WEATHER STATION│                  │                         │   │
│  │  ┌───────────┐  │ ────LoRa────▶   └───────────┬─────────────┘   │
│  │  │ Temp/Humid│  │                              │                  │
│  │  │ Rain Gauge│  │                              │                  │
│  │  │ Wind Speed│  │                              ▼                  │
│  │  └───────────┘  │                  ┌─────────────────────────┐   │
│  └─────────────────┘                  │  ALEE BACKEND  │   │
│                                       │  (IoT Service)          │   │
│                                       └─────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 8.2 Sensor Specifications

| Component | Model | Specifications | Est. Cost (UGX) |
|-----------|-------|----------------|-----------------|
| MCU | ESP32-S3 | Wi-Fi + BLE, low power | 25,000 |
| Soil Moisture | Capacitive v2.0 | 0-100%, ±3% accuracy | 8,000 |
| Soil pH | SEN0161-V2 | 3.5-9.0 pH, ±0.1 accuracy | 35,000 |
| NPK Sensor | RS485 NPK | N/P/K mg/kg | 80,000 |
| LoRa Module | SX1276 | 868/915MHz, 10km range | 20,000 |
| Solar Panel | 6V 2W | Charging | 15,000 |
| Battery | 18650 3.7V | 3000mAh | 10,000 |
| Enclosure | IP65 ABS | Weatherproof | 12,000 |
| **Total per node** | | | **~205,000** |

### 8.3 Data Transmission Protocol

```json
// Sensor data payload (uplink)
{
  "device_id": "GNJA-S001",
  "timestamp": "2026-03-15T10:30:00Z",
  "readings": {
    "soil_moisture": 45.2,
    "soil_ph": 6.5,
    "nitrogen": 120,
    "phosphorus": 45,
    "potassium": 180,
    "temperature": 28.5,
    "humidity": 72,
    "rainfall_mm": 0
  },
  "battery_level": 85,
  "signal_strength": -65
}
```

### 8.4 Alert Thresholds

| Parameter | Low Alert | Optimal Range | High Alert |
|-----------|-----------|---------------|------------|
| Soil Moisture | <30% | 40-70% | >85% |
| Soil pH | <5.5 | 5.5-7.0 | >7.5 |
| Nitrogen (N) | <100 mg/kg | 100-200 mg/kg | >300 mg/kg |
| Phosphorus (P) | <30 mg/kg | 30-80 mg/kg | >120 mg/kg |
| Potassium (K) | <150 mg/kg | 150-250 mg/kg | >350 mg/kg |
| Temperature | <15°C | 20-30°C | >35°C |

---

## 9. Database Design

### 9.1 Firestore Collections Schema

```
firestore/
├── users/
│   └── {userId}/
│       ├── profile: { name, phone, email, district, created_at }
│       ├── settings: { language, notifications, sms_enabled }
│       └── farms/ (subcollection)
│
├── farms/
│   └── {farmId}/
│       ├── owner_id: string
│       ├── name: string
│       ├── location: { lat, lng, district, village }
│       ├── size_acres: number
│       ├── created_at: timestamp
│       ├── plots/ (subcollection)
│       │   └── {plotId}/
│       │       ├── name: string
│       │       ├── crop_type: string (gonja, matooke, etc.)
│       │       ├── plant_count: number
│       │       ├── planting_date: timestamp
│       │       └── polygon: geopoint[]
│       │
│       ├── sensors/ (subcollection)
│       │   └── {sensorId}/
│       │       ├── device_id: string
│       │       ├── type: string (soil, weather)
│       │       ├── location: geopoint
│       │       ├── last_reading: timestamp
│       │       └── status: string (active, offline)
│       │
│       └── diagnoses/ (subcollection)
│           └── {diagnosisId}/
│               ├── timestamp: timestamp
│               ├── image_url: string
│               ├── disease_detected: string
│               ├── confidence: number
│               ├── location: geopoint
│               ├── treatment_applied: string
│               └── outcome: string (resolved, ongoing)
│
├── sensor_readings/
│   └── {readingId}/
│       ├── sensor_id: string
│       ├── farm_id: string
│       ├── timestamp: timestamp
│       ├── readings: map (moisture, ph, npk, etc.)
│       └── alerts_triggered: string[]
│
├── advisories/
│   └── {advisoryId}/
│       ├── farm_id: string
│       ├── user_id: string
│       ├── type: string (fertilizer, irrigation, disease)
│       ├── message: string
│       ├── sent_via: string (sms, push, app)
│       ├── sent_at: timestamp
│       └── read_at: timestamp
│
├── disease_outbreaks/
│   └── {outbreakId}/
│       ├── disease: string
│       ├── location: geopoint
│       ├── radius_km: number
│       ├── reported_by: string (userId)
│       ├── reported_at: timestamp
│       ├── verified: boolean
│       └── affected_farms: string[]
│
└── app_config/
    ├── model_version: string
    ├── model_url: string
    ├── diseases: array
    ├── treatments: map
    └── advisory_templates: map
```

### 9.2 BigQuery Analytics Schema

```sql
-- Farm analytics table
CREATE TABLE `alee.analytics.farm_events` (
  event_id STRING NOT NULL,
  event_type STRING NOT NULL,  -- diagnosis, advisory, sensor_reading
  farm_id STRING NOT NULL,
  user_id STRING NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  
  -- Diagnosis data
  disease_detected STRING,
  confidence FLOAT64,
  
  -- Sensor data
  soil_moisture FLOAT64,
  soil_ph FLOAT64,
  nitrogen FLOAT64,
  phosphorus FLOAT64,
  potassium FLOAT64,
  
  -- Location
  latitude FLOAT64,
  longitude FLOAT64,
  district STRING,
  
  -- Metadata
  app_version STRING,
  device_type STRING,
  offline_mode BOOLEAN
);

-- Advisory effectiveness tracking
CREATE TABLE `alee.analytics.advisory_outcomes` (
  advisory_id STRING NOT NULL,
  farm_id STRING NOT NULL,
  advisory_type STRING,
  sent_at TIMESTAMP,
  read_at TIMESTAMP,
  action_taken BOOLEAN,
  yield_before FLOAT64,
  yield_after FLOAT64,
  feedback_score INT64
);
```

---

## 10. API Specifications

### 10.1 Authentication

All API calls require Bearer token authentication:

```http
Authorization: Bearer <firebase_id_token>
```

### 10.2 Core API Endpoints

#### POST /api/v1/diagnose

Submit a plant image for disease detection.

**Request:**
```json
{
  "image": "<base64_encoded_image>",
  "farm_id": "farm_abc123",
  "location": {
    "lat": 0.5167,
    "lng": 32.5833
  },
  "offline_result": {
    "disease": "black_sigatoka",
    "confidence": 0.87
  }
}
```

**Response:**
```json
{
  "diagnosis_id": "diag_xyz789",
  "disease": "black_sigatoka",
  "confidence": 0.91,
  "severity": "moderate",
  "treatment": {
    "immediate": [
      "Remove affected leaves",
      "Improve air circulation"
    ],
    "chemical": {
      "product": "Mancozeb 80% WP",
      "dosage": "2.5g per litre",
      "frequency": "Every 14 days"
    },
    "prevention": [
      "Avoid overhead irrigation",
      "Space plants 3m apart"
    ]
  },
  "nearby_cases": 3,
  "last_outbreak": "2026-02-20"
}
```

#### GET /api/v1/farms/{farmId}/advisory

Get personalised farming advice.

**Response:**
```json
{
  "farm_id": "farm_abc123",
  "generated_at": "2026-03-15T10:00:00Z",
  "weather_forecast": {
    "next_7_days": [
      {"date": "2026-03-15", "temp_high": 28, "rain_prob": 20},
      {"date": "2026-03-16", "temp_high": 30, "rain_prob": 60}
    ]
  },
  "advisories": [
    {
      "type": "irrigation",
      "priority": "high",
      "message": "Soil moisture at 32%. Water your south plot today.",
      "plot_id": "plot_south"
    },
    {
      "type": "fertilizer",
      "priority": "medium",
      "message": "Potassium levels low. Apply 2kg muriate of potash per plant.",
      "plot_id": "plot_north"
    }
  ],
  "yield_prediction": {
    "expected_harvest": "2026-07-15",
    "estimated_yield_kg": 4500,
    "confidence": 0.75
  }
}
```

#### POST /api/v1/alerts/sms

Send SMS to a farmer.

**Request:**
```json
{
  "user_id": "user_abc123",
  "message_template": "disease_alert",
  "parameters": {
    "disease": "BXW",
    "location": "Kassanda East",
    "action": "Check your plants for yellowing"
  },
  "priority": "high"
}
```

**Response:**
```json
{
  "message_id": "msg_123456",
  "status": "queued",
  "recipient": "+256700123456",
  "estimated_delivery": "2026-03-15T10:00:30Z"
}
```

---

## 11. Security Architecture

### 11.1 Security Layers

```
┌─────────────────────────────────────────────────────────────────────┐
│                      SECURITY ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    PERIMETER SECURITY                          │  │
│  │  • Cloud Armor DDoS protection                                 │  │
│  │  • WAF rules for common attacks                                │  │
│  │  • Rate limiting (100 req/min per user)                        │  │
│  │  • Geo-blocking (Africa-only for launch)                       │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    AUTHENTICATION                              │  │
│  │  • Firebase Authentication (phone + email)                     │  │
│  │  • JWT tokens with 1-hour expiry                              │  │
│  │  • Refresh tokens with 30-day expiry                          │  │
│  │  • Device fingerprinting                                       │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    AUTHORIZATION                               │  │
│  │  • Role-based access control (RBAC)                           │  │
│  │    - Farmer: Own data only                                     │  │
│  │    - Cooperative: Members' aggregated data                     │  │
│  │    - Admin: Full access                                        │  │
│  │  • Firestore security rules                                    │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    DATA PROTECTION                             │  │
│  │  • Encryption at rest (AES-256)                               │  │
│  │  • Encryption in transit (TLS 1.3)                            │  │
│  │  • PII anonymization for analytics                            │  │
│  │  • GDPR/POPIA compliance                                       │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    IOT SECURITY                                │  │
│  │  • Device certificates (X.509)                                │  │
│  │  • Secure boot                                                 │  │
│  │  • Encrypted payloads (AES-128)                               │  │
│  │  • OTA update signing                                          │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 11.2 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /farms/{farmId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Farms - owner access only
    match /farms/{farmId} {
      allow read: if request.auth != null && 
                    resource.data.owner_id == request.auth.uid;
      allow write: if request.auth != null && 
                     request.resource.data.owner_id == request.auth.uid;
      
      // Subcollections inherit farm-level access
      match /{subcollection}/{docId} {
        allow read, write: if request.auth != null &&
                             get(/databases/$(database)/documents/farms/$(farmId)).data.owner_id == request.auth.uid;
      }
    }
    
    // Disease outbreaks - anyone can read, authenticated can write
    match /disease_outbreaks/{outbreakId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                              resource.data.reported_by == request.auth.uid;
    }
    
    // App config - read only
    match /app_config/{docId} {
      allow read: if request.auth != null;
      allow write: if false; // Admin SDK only
    }
  }
}
```

---

## 12. Offline Capabilities

### 12.1 Offline Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     OFFLINE ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    MOBILE DEVICE                               │  │
│  │                                                                 │  │
│  │  ┌─────────────────┐    ┌─────────────────┐                    │  │
│  │  │  TFLite Model   │    │   Disease DB    │                    │  │
│  │  │  (~6MB cached)  │    │  (SQLite 2MB)   │                    │  │
│  │  └─────────────────┘    └─────────────────┘                    │  │
│  │                                                                 │  │
│  │  ┌─────────────────┐    ┌─────────────────┐                    │  │
│  │  │   Farm Data     │    │   Pending Sync  │                    │  │
│  │  │  (Hive cache)   │    │   Queue (Hive)  │                    │  │
│  │  └─────────────────┘    └─────────────────┘                    │  │
│  │                                                                 │  │
│  │  ┌─────────────────────────────────────────────────────────┐   │  │
│  │  │                  SYNC ENGINE                             │   │  │
│  │  │  • Background sync when online                           │   │  │
│  │  │  • Conflict resolution (last-write-wins)                 │   │  │
│  │  │  • Retry with exponential backoff                        │   │  │
│  │  └─────────────────────────────────────────────────────────┘   │  │
│  │                                                                 │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 12.2 Offline Feature Matrix

| Feature | Offline Support | Sync Behaviour |
|---------|-----------------|----------------|
| Disease Detection | ✅ Full | Upload image when online |
| View Past Diagnoses | ✅ Full | Cached locally |
| Treatment Guides | ✅ Full | Pre-downloaded |
| Farm Data Entry | ✅ Full | Queue for sync |
| Sensor Readings | ⚠️ Last cached | Auto-refresh when online |
| Weather Forecast | ⚠️ Last 24hr | Auto-refresh when online |
| SMS Advisory History | ✅ Full | Cached locally |
| New Alerts | ❌ Requires network | - |
| Model Updates | ❌ Requires network | Background download |

### 12.3 Sync Queue Implementation

```dart
// Pending sync item structure
class SyncItem {
  final String id;
  final String type;        // 'diagnosis', 'farm_update', 'sensor_data'
  final Map<String, dynamic> data;
  final DateTime createdAt;
  int retryCount;
  SyncStatus status;        // pending, syncing, failed, completed
}

// Sync engine pseudo-code
class SyncEngine {
  Future<void> processQueue() async {
    final pendingItems = await hive.getPendingSyncItems();
    
    for (final item in pendingItems) {
      try {
        await uploadToServer(item);
        await markAsCompleted(item);
      } catch (e) {
        if (item.retryCount < 5) {
          await scheduleRetry(item, 
            delay: Duration(minutes: pow(2, item.retryCount)));
        } else {
          await markAsFailed(item);
          notifyUser("Sync failed for ${item.type}");
        }
      }
    }
  }
}
```

---

## 13. SMS Gateway Integration

### 13.1 Africa's Talking Integration

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SMS GATEWAY ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────┐         ┌─────────────────────────────────┐   │
│  │ ALERT SERVICE   │         │    AFRICA'S TALKING API         │   │
│  │                 │         │                                  │   │
│  │ ┌─────────────┐ │  HTTPS  │  • Bulk SMS endpoint            │   │
│  │ │ Message     │─┼────────▶│  • Delivery reports             │   │
│  │ │ Queue       │ │         │  • USSD for feature phones      │   │
│  │ └─────────────┘ │         │  • Uganda shortcode: 20XXX      │   │
│  │                 │         │                                  │   │
│  │ ┌─────────────┐ │ Webhook │                                  │   │
│  │ │ Delivery    │◀┼─────────│  • Status callbacks             │   │
│  │ │ Tracker     │ │         │  • Incoming SMS                  │   │
│  │ └─────────────┘ │         │                                  │   │
│  └─────────────────┘         └─────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 13.2 SMS Templates

```yaml
# SMS Templates (max 160 characters)

disease_alert:
  template: "[Alee] ALERT: {disease} detected in {location}. Check your plants. Reply HELP for tips."
  priority: high
  
irrigation_reminder:
  template: "[Alee] Water your {plot} today. Soil moisture is {moisture}%. Next rain: {rain_date}."
  priority: medium

fertilizer_advice:
  template: "[Alee] Apply {amount} {fertilizer} to {plot}. {nutrient} levels are low."
  priority: medium

harvest_reminder:
  template: "[Alee] Your {plot} is ready for harvest! Est. yield: {yield}kg. Best price today: UGX {price}/bunch."
  priority: low

weekly_summary:
  template: "[Alee] Week summary: {diagnoses} scans, {alerts} alerts. Farm health: {score}/10. Reply REPORT for details."
  priority: low
```

### 13.3 USSD Menu Structure (Feature Phones)

```
*384*XXX#

Main Menu:
1. Check farm status
2. Report disease
3. Get advice
4. Weather forecast
5. Contact support

[1] Check farm status
   > "Your farm: 4 acres, 1600 plants
      Soil: Moisture 45%, pH 6.2
      Last scan: Healthy
      Press 0 to go back"

[2] Report disease
   > "Describe symptoms:
      1. Yellow leaves
      2. Brown spots
      3. Wilting
      4. Other"
   
   > [User selects 2]
   > "Photo required. SMS 'PHOTO' to 20XXX
      then send picture via WhatsApp"

[3] Get advice
   > "Today's advice:
      - Water south plot (moisture 32%)
      - Check for weevils
      Press 0 to go back"
```

---

## 14. Deployment Architecture

### 14.1 GCP Deployment Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                 GOOGLE CLOUD PLATFORM (GCP)                          │
│                        Region: europe-west1                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                     CLOUD CDN + LOAD BALANCER                │    │
│  └─────────────────────────────┬───────────────────────────────┘    │
│                                │                                     │
│  ┌─────────────────────────────┴───────────────────────────────┐    │
│  │                      FIREBASE HOSTING                        │    │
│  │                   (Admin Dashboard PWA)                      │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                       CLOUD RUN                              │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │    │
│  │  │auth-service │ │farm-service │ │ ml-service  │            │    │
│  │  │  (2 inst)   │ │  (2 inst)   │ │  (2 inst)   │            │    │
│  │  └─────────────┘ └─────────────┘ └─────────────┘            │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │    │
│  │  │ iot-service │ │alert-service│ │analytics-svc│            │    │
│  │  │  (2 inst)   │ │  (2 inst)   │ │  (2 inst)   │            │    │
│  │  └─────────────┘ └─────────────┘ └─────────────┘            │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐     │
│  │ FIRESTORE   │  │  BIGQUERY   │  │    CLOUD STORAGE        │     │
│  │ (Primary DB)│  │ (Analytics) │  │ • ML Models             │     │
│  │             │  │             │  │ • Disease Images        │     │
│  └─────────────┘  └─────────────┘  │ • User Uploads          │     │
│                                    └─────────────────────────┘     │
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐     │
│  │  VERTEX AI  │  │ CLOUD IOT   │  │    CLOUD PUB/SUB        │     │
│  │ (ML Serving)│  │   CORE      │  │ • IoT events            │     │
│  │             │  │             │  │ • Alert queue           │     │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘     │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    SECRET MANAGER                            │    │
│  │  • API keys (Africa's Talking, Weather, etc.)               │    │
│  │  • Database credentials                                      │    │
│  │  • Service account keys                                      │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 14.2 CI/CD Pipeline

```yaml
# Cloud Build configuration (cloudbuild.yaml)

steps:
  # 1. Run tests
  - name: 'node:20'
    entrypoint: 'npm'
    args: ['test']
    dir: 'backend'

  # 2. Build Docker images
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/auth-service:$COMMIT_SHA', './services/auth']

  # 3. Push to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/auth-service:$COMMIT_SHA']

  # 4. Deploy to Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'auth-service'
      - '--image=gcr.io/$PROJECT_ID/auth-service:$COMMIT_SHA'
      - '--region=europe-west1'
      - '--platform=managed'

  # 5. Deploy Flutter app (Firebase App Distribution)
  - name: 'cirrusci/flutter:stable'
    entrypoint: 'bash'
    args:
      - '-c'
      - |
        cd mobile
        flutter build apk --release
        firebase appdistribution:distribute build/app/outputs/apk/release/app-release.apk \
          --app $FIREBASE_APP_ID \
          --groups "beta-testers"

timeout: '1800s'
```

---

## 15. Scalability Strategy

### 15.1 Growth Projections

| Phase | Timeline | Users | Farms | Sensors | Daily API Calls |
|-------|----------|-------|-------|---------|-----------------|
| Pilot | Month 1-3 | 100 | 50 | 50 | 5,000 |
| MVP | Month 4-6 | 1,000 | 500 | 200 | 50,000 |
| Growth | Month 7-12 | 10,000 | 5,000 | 1,000 | 500,000 |
| Scale | Year 2 | 100,000 | 50,000 | 5,000 | 5,000,000 |

### 15.2 Scalability Measures

```
┌─────────────────────────────────────────────────────────────────────┐
│                   SCALABILITY ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  AUTO-SCALING                                                        │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Cloud Run: 0-100 instances per service                        │  │
│  │ Scale trigger: CPU > 70% or requests > 100/instance           │  │
│  │ Cold start: ~2 seconds (mitigated with min instances=1)       │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  DATABASE SCALING                                                    │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Firestore: Auto-scales to millions of reads/writes            │  │
│  │ Sharding: By district/region for hot collections              │  │
│  │ BigQuery: Partitioned by date for analytics tables            │  │
│  │ Redis: Clustered mode for session management                  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ML INFERENCE SCALING                                                │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Primary: On-device (TFLite) - infinite horizontal scale       │  │
│  │ Fallback: Vertex AI endpoints (auto-scaling)                  │  │
│  │ Batch: Cloud Functions for non-real-time analysis             │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  IOT SCALING                                                         │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ LoRaWAN gateways: 1 per 50 km² coverage area                  │  │
│  │ Cloud IoT Core: Millions of devices supported                 │  │
│  │ Pub/Sub: Handles burst traffic from sensors                   │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  GEOGRAPHIC EXPANSION                                                │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Phase 1: Central Uganda (single region)                       │  │
│  │ Phase 2: Multi-region (add africa-south1)                     │  │
│  │ Phase 3: Global CDN for static assets                         │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 16. Development Roadmap

### 16.1 Phase 1: MVP (Months 1-3)

| Sprint | Duration | Deliverables |
|--------|----------|--------------|
| Sprint 1 | Week 1-2 | Project setup, CI/CD, basic Flutter app structure |
| Sprint 2 | Week 3-4 | User auth, farm registration, database schema |
| Sprint 3 | Week 5-6 | ML model training, TFLite conversion |
| Sprint 4 | Week 7-8 | Camera integration, offline disease detection |
| Sprint 5 | Week 9-10 | SMS integration, basic alerts |
| Sprint 6 | Week 11-12 | Beta testing with 50 farmers in Kassanda |

**MVP Features:**
- ✅ Disease detection (offline-capable)
- ✅ Farm registration
- ✅ Basic SMS alerts
- ✅ Treatment recommendations

### 16.2 Phase 2: Smart Farming (Months 4-6)

| Sprint | Duration | Deliverables |
|--------|----------|--------------|
| Sprint 7 | Week 13-14 | IoT sensor integration (hardware setup) |
| Sprint 8 | Week 15-16 | Sensor data pipeline, real-time dashboard |
| Sprint 9 | Week 17-18 | Weather API integration, forecast display |
| Sprint 10 | Week 19-20 | Advisory engine, personalised SMS tips |
| Sprint 11 | Week 21-22 | Satellite imagery integration (NDVI) |
| Sprint 12 | Week 23-24 | Expanded beta (500 farmers) |

**Phase 2 Features:**
- ✅ Soil sensor integration
- ✅ Weather forecasts
- ✅ Personalised SMS advisories
- ✅ Basic yield predictions

### 16.3 Phase 3: Scale & Monetize (Months 7-12)

| Sprint | Duration | Deliverables |
|--------|----------|--------------|
| Sprint 13-14 | Week 25-28 | Cooperative dashboard, bulk reporting |
| Sprint 15-16 | Week 29-32 | Payment integration (subscription model) |
| Sprint 17-18 | Week 33-36 | Advanced analytics, yield optimization |
| Sprint 19-20 | Week 37-40 | USSD for feature phones |
| Sprint 21-24 | Week 41-48 | Regional expansion, partnerships |

---

## 17. Cost Estimates

### 17.1 Monthly Cloud Costs (Production)

| Service | Pilot (100 users) | MVP (1,000 users) | Scale (10,000 users) |
|---------|-------------------|-------------------|----------------------|
| Cloud Run | $20 | $100 | $500 |
| Firestore | $10 | $50 | $200 |
| Cloud Storage | $5 | $20 | $100 |
| BigQuery | $5 | $25 | $100 |
| Vertex AI | $50 | $100 | $300 |
| Cloud IoT Core | $10 | $50 | $200 |
| SMS (Africa's Talking) | $20 | $200 | $2,000 |
| Maps API | $0 | $50 | $200 |
| **Total/month** | **$120** | **$595** | **$3,600** |

*Note: Google for Startups provides up to $350,000 in Cloud credits*

### 17.2 Hardware Costs (IoT Sensors)

| Component | Unit Cost (UGX) | Pilot (50 units) | Scale (1,000 units) |
|-----------|-----------------|------------------|---------------------|
| Sensor Node | 205,000 | 10,250,000 | 205,000,000 |
| LoRaWAN Gateway | 1,500,000 | 3,000,000 | 30,000,000 |
| Installation | 50,000 | 2,500,000 | 50,000,000 |
| **Total** | | **15,750,000** (~$4,000) | **285,000,000** (~$75,000) |

### 17.3 Team Costs (First Year)

| Role | Monthly (UGX) | Annual (UGX) | Annual (USD) |
|------|---------------|--------------|--------------|
| CTO (Raymond Wayesu) | 8,000,000 | 96,000,000 | $25,000 |
| Backend Developer | 5,000,000 | 60,000,000 | $16,000 |
| Mobile Developer | 5,000,000 | 60,000,000 | $16,000 |
| ML Engineer (part-time) | 3,000,000 | 36,000,000 | $10,000 |
| Field Agent (x2) | 2,000,000 | 48,000,000 | $13,000 |
| **Total** | **23,000,000** | **300,000,000** | **$80,000** |

---

## 18. Team Structure

### 18.1 Organization Chart

```
┌─────────────────────────────────────────────────────────────────────┐
│                       ALEE TEAM                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                    ┌─────────────────────┐                          │
│                    │    Paul Mubiri      │                          │
│                    │    CEO / Founder    │                          │
│                    │  (Farm Operations)  │                          │
│                    └──────────┬──────────┘                          │
│                               │                                      │
│           ┌───────────────────┼───────────────────┐                 │
│           │                   │                   │                 │
│  ┌────────┴────────┐ ┌────────┴────────┐ ┌────────┴────────┐       │
│  │ Raymond Wayesu  │ │   Operations    │ │    Finance      │       │
│  │      CTO        │ │     Lead        │ │  (Part-time)    │       │
│  │                 │ │   (To hire)     │ │                 │       │
│  └────────┬────────┘ └─────────────────┘ └─────────────────┘       │
│           │                                                          │
│  ┌────────┴─────────────────────────────────┐                       │
│  │                                          │                       │
│  │  ┌──────────────┐  ┌──────────────┐     │                       │
│  │  │   Backend    │  │    Mobile    │     │                       │
│  │  │  Developer   │  │  Developer   │     │                       │
│  │  │  (To hire)   │  │  (To hire)   │     │                       │
│  │  └──────────────┘  └──────────────┘     │                       │
│  │                                          │                       │
│  │  ┌──────────────┐  ┌──────────────┐     │                       │
│  │  │ ML Engineer  │  │ Field Agents │     │                       │
│  │  │ (Part-time)  │  │    (x2)      │     │                       │
│  │  └──────────────┘  └──────────────┘     │                       │
│  │                                          │                       │
│  └──────────────────────────────────────────┘                       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 18.2 Key Responsibilities

| Role | Responsibilities |
|------|------------------|
| **CEO (Paul Mubiri)** | Business strategy, farmer relationships, partnerships, fundraising |
| **CTO (Raymond Wayesu)** | Technical architecture, team leadership, ML strategy, Google accelerator liaison |
| **Backend Developer** | API development, database management, IoT integration |
| **Mobile Developer** | Flutter app development, offline functionality, UI/UX |
| **ML Engineer** | Model training, optimization, continuous improvement |
| **Field Agents** | Farmer training, sensor installation, feedback collection |

---

## Appendices

### Appendix A: Disease Reference

| Disease | Symptoms | Spread | Treatment |
|---------|----------|--------|-----------|
| Black Sigatoka | Yellow/brown leaf spots, streaks | Wind, rain | Fungicides, resistant varieties |
| BXW | Yellowing, premature ripening, bacterial ooze | Tools, insects | Remove infected plants, tool sterilization |
| Fusarium Wilt | Yellowing from older leaves, splitting | Soil, water | No cure - remove and burn |
| Bunchy Top | Stunted growth, narrow leaves | Aphids | Remove infected plants, control aphids |

### Appendix B: API Rate Limits

| Endpoint | Rate Limit | Burst |
|----------|------------|-------|
| /diagnose | 10/min | 20 |
| /farms/* | 60/min | 100 |
| /sensors/data | 100/min | 200 |
| /alerts/sms | 5/min | 10 |

### Appendix C: Glossary

| Term | Definition |
|------|------------|
| BXW | Banana Xanthomonas Wilt - bacterial disease |
| NDVI | Normalized Difference Vegetation Index - satellite crop health measure |
| TFLite | TensorFlow Lite - mobile ML framework |
| LoRaWAN | Long Range Wide Area Network - IoT protocol |
| USSD | Unstructured Supplementary Service Data - feature phone protocol |

---

**Document Version History**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | March 2026 | Raymond Wayesu | Initial architecture document |

---

*This document is confidential and intended for Alee internal use and Google for Startups Accelerator application.*
