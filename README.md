**Insight: A Serverless Log Analytics Platform**
=
Insight is a full-stack, real-time log analytics platform built on Google Cloud Platform. It demonstrates a complete, event-driven data pipeline that ingests, processes, and visualizes application logs, simulating professional monitoring tools like Datadog or Splunk.

<br>

✨ **Features**
=

  **- Real-Time Log Ingestion:** Captures logs from a running application instantly.

  **- Serverless Processing:** Uses a scalable, event-driven function to parse and enrich log data.

  **- Live Dashboard:** A dynamic frontend built with React that visualizes key health metrics and streams logs as they are processed.

  **- Cloud-Native Architecture:** Entirely built and deployed on modern, serverless GCP services.

  **- Scalable by Design:** The architecture is designed to handle a high volume of log data, scaling automatically with demand.

<br>

🏗️ **Architecture**
=

The platform uses a decoupled, event-driven architecture to ensure scalability and resilience.

  **- Log Generation:** A Node.js service (insight-log-generator) running on Cloud Run continuously generates sample logs, simulating a real application.

  **- Log Ingestion:** Cloud Logging automatically captures all standard output from the Cloud Run service. A Log Sink is configured to filter these logs and forward them to a Pub/Sub topic.

  **- Real-time Processing:** A Cloud Function (Python) is subscribed to the Pub/Sub topic. It triggers instantly for each new log message, parses it, and stores the structured result in Firestore.

  **- Live Dashboard:** A React single-page application, hosted on Firebase Hosting, subscribes to the Firestore collection in real-time, visualizing the processed logs and key metrics.

<br>

🛠️ **Tech Stack**
=

  **- Frontend:** React , Tailwind CSS , Chart.js

  **- Backend & Pipeline:** Node.js , Express , Python

  **- Google Cloud:** Cloud Run, Pub/Sub, Cloud Functions, Firestore, Firebase Hosting

  **- Tools:** Docker , Git

<br>

📸 **Project Showcase**
=

The data pipeline in action, from raw log generation to final visualization.
<br>

**1. Log Generation (Cloud Run)**

The backend service generates structured logs, which are captured by Cloud Logging.

<img width="1193" height="675" alt="Screenshot 2025-08-02 at 09 26 35" src="https://github.com/user-attachments/assets/6abc3256-9f40-4040-9ee9-f21ade2b1ccf" />

<br>

**2. Processing (Cloud Function)**

The Cloud Function is triggered by each log, processes it, and confirms successful storage in Firestore.

<img width="1193" height="678" alt="Screenshot 2025-08-01 at 20 07 23" src="https://github.com/user-attachments/assets/1ce66cb6-154c-4645-81f6-5f3fb1abdb30" />

<br>

**3. Data Storage (Firestore)**

The processed, structured data is stored in a processed-logs collection in Firestore.

<img width="1199" height="733" alt="Screenshot 2025-08-02 at 09 27 59" src="https://github.com/user-attachments/assets/09d4c4bf-66c5-4655-80fe-3b4be1173bf8" />

<br>

**4. Visualization (React Frontend)**

The frontend dashboard reads from Firestore in real-time to display metrics and a live log stream.

<img width="1445" height="755" alt="Screenshot 2025-08-02 at 09 19 44" src="https://github.com/user-attachments/assets/ad6d3901-cd9a-443e-acac-067422141a52" />

<img width="1444" height="761" alt="Screenshot 2025-08-02 at 09 22 45" src="https://github.com/user-attachments/assets/67c66e1f-e537-4e95-8513-df72295169bb" />

<br>
<br>

🚀 **Setup and Deployment**

This project contains three main components in separate directories: backend (log-generator), processing, and frontend (dashboard).
A complete, step-by-step guide to deploy this entire application on Google Cloud Platform was created during the development process.
