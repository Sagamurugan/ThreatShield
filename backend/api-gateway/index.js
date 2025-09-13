const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');
const mongoose = require('mongoose'); // 1. Import mongoose
const ScanResult = require('./models/ScanResult'); // 2. Import the model

// --- 3. CONNECT TO MONGODB ATLAS ---
// Replace <password> with your actual password
const MONGO_URI = 'mongodb://Sagamurugan:Saga%402006@ac-o50p15k-shard-00-00.iwsgnxn.mongodb.net:27017,ac-o50p15k-shard-00-01.iwsgnxn.mongodb.net:27017,ac-o50p15k-shard-00-02.iwsgnxn.mongodb.net:27017/?ssl=true&replicaSet=atlas-wg6y5n-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connection successful'))
  .catch(err => console.error('🔥 MongoDB connection error:', err));
// ------------------------------------

const app = express();
const port = 3001;
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// --- 4. UPDATE YOUR ROUTES TO SAVE DATA ---

// ThreatEye URL Scan
app.post('/api/scan/url', async (req, res) => {
  const { url } = req.body;
  if (!url) { return res.status(400).json({ error: 'URL is required' }); }
  try {
    const pythonResponse = await axios.post('http://localhost:5001/scan', { url });

    // Save to DB
    const newScan = new ScanResult({ scanType: 'url', input: url, result: pythonResponse.data });
    await newScan.save();
    console.log('📝 URL scan result saved to DB.');

    res.json(pythonResponse.data);
  } catch (error) {
    res.status(500).json({ error: 'ThreatEye service is unavailable' });
  }
});

// Cloud Guard Scan
app.post('/api/scan/cloud-config', upload.single('configFile'), async (req, res) => {
  if (!req.file) { return res.status(400).json({ error: 'File is required' }); }
  const form = new FormData();
  form.append('configFile', fs.createReadStream(req.file.path), req.file.originalname);
  try {
    const pythonResponse = await axios.post('http://localhost:5002/scan-cloud-config', form, { headers: { ...form.getHeaders() } });

    // Save to DB
    const newScan = new ScanResult({ scanType: 'cloud', input: req.file.originalname, result: pythonResponse.data });
    await newScan.save();
    console.log('📝 Cloud scan result saved to DB.');

    res.json(pythonResponse.data);
  } catch (error) { res.status(500).json({ error: 'Cloud analysis service is unavailable' }); }
  finally { fs.unlinkSync(req.file.path); }
});

// AI Guard Scan
app.post('/api/scan/ai-dataset', upload.single('datasetFile'), async (req, res) => {
  if (!req.file) { return res.status(400).json({ error: 'File is required' }); }
  const form = new FormData();
  form.append('datasetFile', fs.createReadStream(req.file.path), req.file.originalname);
  try {
    const pythonResponse = await axios.post('http://localhost:5002/scan-ai-dataset', form, { headers: { ...form.getHeaders() } });

    // Save to DB
    const newScan = new ScanResult({ scanType: 'ai', input: req.file.originalname, result: pythonResponse.data });
    await newScan.save();
    console.log('📝 AI scan result saved to DB.');

    res.json(pythonResponse.data);
  } catch (error) { res.status(500).json({ error: 'AI analysis service is unavailable' }); }
  finally { fs.unlinkSync(req.file.path); }
});

app.listen(port, () => {
  console.log(`🚀 Node.js Backend API is running on http://localhost:${port}`);
});