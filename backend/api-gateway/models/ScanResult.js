const mongoose = require('mongoose');

const scanResultSchema = new mongoose.Schema({
  scanType: { // e.g., 'url', 'cloud', 'ai'
    type: String,
    required: true,
  },
  input: { // The URL or filename that was scanned
    type: String,
    required: true,
  },
  result: { // The full JSON result from the Python service
    type: Object,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ScanResult', scanResultSchema);