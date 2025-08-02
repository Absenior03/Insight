const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

// Middleware to parse JSON bodies
app.use(express.json());

// --- Log Generation Logic ---

const logLevels = ['INFO', 'WARN', 'ERROR'];
const logMessages = [
  'User authentication successful',
  'Payment processed for order #',
  'Database connection established',
  'API rate limit exceeded for user',
  'Failed to write to disk: permission denied',
  'User data fetched from cache',
  'Invalid input received for endpoint /api/users',
  'Third-party API timeout',
  'Successfully processed batch job #',
  'Unhandled exception: NullPointerException'
];

// Function to generate a random log message
const generateLog = () => {
  const level = logLevels[Math.floor(Math.random() * logLevels.length)];
  let message = logMessages[Math.floor(Math.random() * logMessages.length)];
  
  if (message.includes('#')) {
    message += Math.floor(Math.random() * 10000);
  }
  
  const logObject = {
    level: level,
    message: message,
    timestamp: new Date().toISOString(),
    service: 'log-generator-service',
    traceId: `trace-${Math.random().toString(36).substring(2, 10)}`
  };

  // In a real GCP environment (like Cloud Run), console.log writes to Cloud Logging.
  // We stringify the object to make it a structured log payload.
  console.log(JSON.stringify({ severity: logObject.level, message: logObject }));
  return logObject;
};

// --- API Endpoints ---

app.get('/', (req, res) => {
  res.status(200).send('Log generator service is running. Check Cloud Logging for output.');
});

// Manual endpoint to trigger a single log generation
app.post('/api/generate-log', (req, res) => {
  try {
    const log = generateLog();
    res.status(201).json({ success: true, logGenerated: log });
  } catch (error) {
    console.error("Error in /api/generate-log:", error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


// --- Automatic Log Generation ---

// Generate a log every few seconds to simulate activity
const interval = Math.random() * (10000 - 4000) + 4000; // between 4-10 seconds
setInterval(generateLog, interval);

// --- Server Initialization ---

app.listen(port, () => {
  console.log(`Log generator service listening on port ${port}`);
  console.log('Generating initial log...');
  generateLog();
});