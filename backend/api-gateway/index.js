require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');
const mongoose = require('mongoose');
const ScanResult = require('./models/ScanResult');

// Reads the MongoDB connection string from the server's environment variables
const MONGO_URI = process.env.MONGO_URI; 
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connection successful'))
  .catch(err => console.error('🔥 MongoDB connection error:', err));

const app = express();
const server = http.createServer(app);
// Allows any frontend to connect. For production, you'd restrict this to your Vercel URL.
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } }); 

// Render provides a PORT environment variable. Use it, or default to 3001 for local.
const port = process.env.PORT || 3001;
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => { console.log('✅ A user connected via WebSocket'); });

// --- API Routes using Environment Variables ---
app.post('/api/scan/url', async (req, res) => {
  const { url } = req.body;
  try {
    // Reads the Python service URL from the environment
    const pythonResponse = await axios.post(`${process.env.THREATEYE_SERVICE_URL}/scan`, { url });
    const newScan = new ScanResult({ scanType: 'url', input: url, result: pythonResponse.data });
    await newScan.save();
    io.emit('newScanResult', newScan);
    res.json(pythonResponse.data);
  } catch (error) { res.status(500).json({ error: 'ThreatEye service is unavailable' }); }
});

app.post('/api/scan/cloud-config', upload.single('configFile'), async (req, res) => {
  const form = new FormData();
  form.append('configFile', fs.createReadStream(req.file.path), req.file.originalname);
  try {
    const pythonResponse = await axios.post(`${process.env.GUARD_SERVICE_URL}/scan-cloud-config`, form, { headers: { ...form.getHeaders() } });
    const newScan = new ScanResult({ scanType: 'cloud', input: req.file.originalname, result: pythonResponse.data });
    await newScan.save();
    io.emit('newScanResult', newScan);
    res.json(pythonResponse.data);
  } catch (error) { res.status(500).json({ error: 'Cloud analysis service is unavailable' }); }
  finally { fs.unlinkSync(req.file.path); }
});

app.post('/api/scan/ai-dataset', upload.single('datasetFile'), async (req, res) => {
  const form = new FormData();
  form.append('datasetFile', fs.createReadStream(req.file.path), req.file.originalname);
  try {
    const pythonResponse = await axios.post(`${process.env.GUARD_SERVICE_URL}/scan-ai-dataset`, form, { headers: { ...form.getHeaders() } });
    const newScan = new ScanResult({ scanType: 'ai', input: req.file.originalname, result: pythonResponse.data });
    await newScan.save();
    io.emit('newScanResult', newScan);
    res.json(pythonResponse.data);
  } catch (error) { res.status(500).json({ error: 'AI analysis service is unavailable' }); }
  finally { fs.unlinkSync(req.file.path); }
});

app.get('/api/scans', async (req, res) => {
    try {
        const scans = await ScanResult.find().sort({ timestamp: -1 }).limit(50);
        res.json(scans);
    } catch (error) { res.status(500).json({ error: 'Failed to fetch scan history.' }); }
});

server.listen(port, () => { console.log(`🚀 Node.js Backend API is running on port ${port}`); });