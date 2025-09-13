const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');

const app = express();
const port = 3001;
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

app.post('/api/scan/cloud-config', upload.single('configFile'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'File is required' });
    const form = new FormData();
    form.append('configFile', fs.createReadStream(req.file.path), req.file.originalname);
    try {
        const pythonResponse = await axios.post('http://localhost:5002/scan-cloud-config', form, { headers: { ...form.getHeaders() } });
        res.json(pythonResponse.data);
    } catch (error) { res.status(500).json({ error: 'Cloud analysis service is unavailable' }); }
    finally { fs.unlinkSync(req.file.path); }
});

app.post('/api/scan/url', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  console.log(`[Node.js API] Received URL: ${url}. Forwarding to Python...`);

  try {
    // Forward request to the NEW Python ThreatEye service (running on port 5001)
    const pythonResponse = await axios.post('http://localhost:5001/scan', { url });
    res.json(pythonResponse.data);
  } catch (error) {
    console.error('[Node.js API] Error contacting ThreatEye service:', error.message);
    res.status(500).json({ error: 'ThreatEye service is unavailable' });
  }
});

app.post('/api/scan/ai-dataset', upload.single('datasetFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'File is required' });
  }
  console.log(`[Node.js API] Received dataset: ${req.file.originalname}. Forwarding...`);
  const form = new FormData();
  form.append('datasetFile', fs.createReadStream(req.file.path), req.file.originalname);
  try {
    const pythonResponse = await axios.post('http://localhost:5002/scan-ai-dataset', form, {
      headers: { ...form.getHeaders() }
    });
    res.json(pythonResponse.data);
  } catch (error) {
    console.error('[Node.js API] Error contacting Guard service for AI scan:', error.message);
    res.status(500).json({ error: 'AI analysis service is unavailable' });
  } finally {
    fs.unlinkSync(req.file.path);
  }
});

app.listen(port, () => {
  console.log(`🚀 Node.js Backend API is running on http://localhost:${port}`);
});