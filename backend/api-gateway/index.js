// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');
// const multer = require('multer');
// const FormData = require('form-data');
// const fs = require('fs');

// const app = express();
// const port = 3001;
// const upload = multer({ dest: 'uploads/' });

// app.use(cors());
// app.use(express.json());

// app.post('/api/scan/cloud-config', upload.single('configFile'), async (req, res) => {
//     if (!req.file) return res.status(400).json({ error: 'File is required' });
//     const form = new FormData();
//     form.append('configFile', fs.createReadStream(req.file.path), req.file.originalname);
//     try {
//         const pythonResponse = await axios.post('http://localhost:5002/scan-cloud-config', form, { headers: { ...form.getHeaders() } });
//         res.json(pythonResponse.data);
//     } catch (error) { res.status(500).json({ error: 'Cloud analysis service is unavailable' }); }
//     finally { fs.unlinkSync(req.file.path); }
// });

// app.post('/api/scan/url', async (req, res) => {
//   const { url } = req.body;
//   if (!url) {
//     return res.status(400).json({ error: 'URL is required' });
//   }
//   console.log(`[Node.js API] Received URL: ${url}. Forwarding to Python...`);

//   try {
//     // Forward request to the NEW Python ThreatEye service (running on port 5001)
// const pythonResponse = await axios.post('http://127.0.0.1:5001/scan', { url });
//     res.json(pythonResponse.data);
//   } catch (error) {
//     console.error('[Node.js API] Error contacting ThreatEye service:', error.message);
//     res.status(500).json({ error: 'ThreatEye service is unavailable' });
//   }
// });

// app.post('/api/scan/ai-dataset', upload.single('datasetFile'), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'File is required' });
//   }
//   console.log(`[Node.js API] Received dataset: ${req.file.originalname}. Forwarding...`);
//   const form = new FormData();
//   form.append('datasetFile', fs.createReadStream(req.file.path), req.file.originalname);
//   try {
//     const pythonResponse = await axios.post('http://localhost:5002/scan-ai-dataset', form, {
//       headers: { ...form.getHeaders() }
//     });
//     res.json(pythonResponse.data);
//   } catch (error) {
//     console.error('[Node.js API] Error contacting Guard service for AI scan:', error.message);
//     res.status(500).json({ error: 'AI analysis service is unavailable' });
//   } finally {
//     fs.unlinkSync(req.file.path);
//   }
// });
     
// app.listen(port, () => {
//   console.log(`🚀 Node.js Backend API is running on http://localhost:${port}`);
// });



/**
 * API Gateway for ThreatShield
 * This server acts as the main entry point for all frontend requests.
 * It routes requests to the appropriate backend Python microservices.
 */

// --- 1. DEPENDENCIES ---
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');

// --- 2. INITIALIZATION ---
const app = express();
const port = 3001;

// Configure multer to temporarily save uploaded files to an 'uploads/' directory.
// This is necessary to stream them to the backend services.
const upload = multer({ dest: 'uploads/' });

// --- 3. MIDDLEWARE ---
app.use(cors()); // Enable Cross-Origin Resource Sharing for the frontend
app.use(express.json()); // Enable parsing of JSON request bodies

// --- 4. API ROUTES ---

/**
 * Route for URL Scanning (ThreatEye Service)
 * Receives a URL in a JSON body and forwards it to the Python ML service.
 */
app.post('/api/scan/url', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Forward the request to the ml-threateye-service on port 5001
    const pythonResponse = await axios.post('http://127.0.0.1:5001/scan', { url });
    res.json(pythonResponse.data);
  } catch (error) {
    console.error('[Gateway] Error contacting ThreatEye service:', error.message);
    res.status(500).json({ error: 'URL analysis service is unavailable' });
  }
});

/**
 * Route for Cloud Config File Scanning (Guard Service)
 * Receives a file, saves it temporarily, streams it to the Python service, and then deletes the temporary file.
 */
app.post('/api/scan/cloud-config', upload.single('configFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Configuration file is required' });
  }

  // Create a new form data object to re-stream the file
  const form = new FormData();
  form.append('configFile', fs.createReadStream(req.file.path), req.file.originalname);

  try {
    // Forward the file to the ml-guard-service on port 5002
    const pythonResponse = await axios.post('http://localhost:5002/scan-cloud-config', form, {
      headers: { ...form.getHeaders() }
    });
    res.json(pythonResponse.data);
  } catch (error) {
    console.error('[Gateway] Error contacting Guard service for config scan:', error.message);
    res.status(500).json({ error: 'Cloud analysis service is unavailable' });
  } finally {
    // IMPORTANT: Clean up the temp file from the 'uploads/' directory
    fs.unlinkSync(req.file.path);
  }
});

/**
 * Route for AI Dataset File Scanning (Guard Service)
 * Similar to the config scan, but for .csv dataset files.
 */
app.post('/api/scan/ai-dataset', upload.single('datasetFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Dataset file is required' });
  }

  const form = new FormData();
  form.append('datasetFile', fs.createReadStream(req.file.path), req.file.originalname);

  try {
    // Forward the file to the ml-guard-service on port 5002
    const pythonResponse = await axios.post('http://localhost:5002/scan-ai-dataset', form, {
      headers: { ...form.getHeaders() }
    });
    res.json(pythonResponse.data);
  } catch (error) {
    console.error('[Gateway] Error contacting Guard service for AI scan:', error.message);
    res.status(500).json({ error: 'AI analysis service is unavailable' });
  } finally {
    // Clean up the temp file
    fs.unlinkSync(req.file.path);
  }
});

// --- 5. START SERVER ---
app.listen(port, () => {
  console.log(`🚀 Node.js API Gateway is running on http://localhost:${port}`);
});