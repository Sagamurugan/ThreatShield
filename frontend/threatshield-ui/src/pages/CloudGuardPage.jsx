// // import React, { useState } from 'react';
// // import axios from 'axios';
// // import Sidebar from '../components/Sidebar';
// // import './ContentPage.css';
// // import { FaFileUpload, FaSpinner } from 'react-icons/fa';

// // function CloudGuardPage() {
// //   const [selectedFile, setSelectedFile] = useState(null);
// //   const [scanResult, setScanResult] = useState(null);
// //   const [isLoading, setIsLoading] = useState(false);

// //   const handleFileChange = (event) => {
// //     setScanResult(null);
// //     setSelectedFile(event.target.files[0]);
// //   };

// //   const handleScan = async () => {
// //     if (!selectedFile) {
// //       alert("Please select a file to scan.");
// //       return;
// //     }
// //     setIsLoading(true);
// //     setScanResult(null);

// //     const formData = new FormData();
// //     formData.append('configFile', selectedFile);

// //     try {
// //       // API call to the Node.js backend on port 3001
// //       const response = await axios.post('http://localhost:3001/api/scan/cloud-config', formData);
// //       setScanResult(response.data);
// //     } catch (error) {
// //       console.error("Error scanning file:", error);
// //       alert("Failed to scan the file. Please ensure all backend services are running.");
// //     }
// //     setIsLoading(false);
// //   };

// //   return (
// //     <div className="dashboard-layout">
// //       <Sidebar />
// //       <div className="main-content">
// //         <header className="page-header">
// //           <h1>Cloud Guard</h1>
// //           <p>Scan your cloud infrastructure configuration files for vulnerabilities.</p>
// //         </header>
// //         <main className="content-card">
// //           <div className="file-uploader">
// //             <label htmlFor="file-upload" className="file-upload-label">
// //               <FaFileUpload />
// //               <span>{selectedFile ? selectedFile.name : 'Choose a configuration file...'}</span>
// //             </label>
// //             <input id="file-upload" type="file" onChange={handleFileChange} />
// //             <button className="scan-button" onClick={handleScan} disabled={isLoading || !selectedFile}>
// //               {isLoading ? <FaSpinner className="spinner" /> : 'Scan Now'}
// //             </button>
// //           </div>
// //           {scanResult && (
// //             <div className="results-container">
// //               <h3 className="results-title">Scan complete for: {scanResult.fileName}</h3>
// //               {scanResult.misconfigurations && scanResult.misconfigurations.length > 0 ? (
// //                 <ul className="results-list">
// //                   {scanResult.misconfigurations.map((item, index) => (
// //                     <li key={index} className={`result-item ${item.severity.toLowerCase()}`}>
// //                       <span className="severity-tag">{item.severity}</span>
// //                       <p className="message">{item.message} <span className="rule-id">({item.ruleId})</span></p>
// //                     </li>
// //                   ))}
// //                 </ul>
// //               ) : (
// //                 <p className="no-issues-found">✅ No misconfigurations found.</p>
// //               )}
// //             </div>
// //           )}
// //         </main>
// //       </div>
// //     </div>
// //   );
// // }

// // export default CloudGuardPage;


// import React, { useState } from 'react';
// import axios from 'axios';
// // ... other imports

// function CloudGuardPage() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [scanResult, setScanResult] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//   };

//   const handleScan = async () => {
//     if (!selectedFile) {
//       alert("Please select a file to scan.");
//       return;
//     }
//     setIsLoading(true);

//     const formData = new FormData();
//     formData.append('configFile', selectedFile); // 'configFile' is the key the backend will look for

//     try {
//       // This is a new API endpoint we will create
//       const response = await axios.post('http://localhost:3001/api/scan/config', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       setScanResult(response.data);
//     } catch (error) {
//       console.error("Error scanning file:", error);
//       setScanResult({ error: "File scan failed." });
//     }
//     setIsLoading(false);
//   };

//   return (
//     // Your JSX for the page
//     <div>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleScan} disabled={isLoading}>
//         {isLoading ? 'Scanning...' : 'Upload & Scan Config'}
//       </button>
//       {/* JSX to display the scanResult */}
//     </div>
//   );
// }

// export default CloudGuardPage;




import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import './ContentPage.css'; // Your existing CSS for layout
import { FaFileUpload, FaSpinner } from 'react-icons/fa';

// Sub-component to render the findings from the file scan
function ScanFinding({ finding }) {
    // Determine the CSS class based on the finding type (e.g., 'Error', 'Warning', 'Info')
    const findingClass = finding.type.toLowerCase().replace(' ', '-');

    return (
        <li className={`result-item ${findingClass}`}>
            <span className="severity-tag">{finding.type}</span>
            <p className="message">{finding.message} {finding.line && `(Line: ${finding.line})`}</p>
        </li>
    );
}

// Main page component
function CloudGuardPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('No file selected');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleScan = async () => {
    if (!selectedFile) {
      alert("Please select a file to scan.");
      return;
    }
    setIsLoading(true);
    setScanResult(null);

    const formData = new FormData();
    formData.append('configFile', selectedFile);

    try {
      const response = await axios.post('http://localhost:3001/api/scan/cloud-config', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setScanResult(response.data);
    } catch (error) {
      console.error("Error scanning file:", error);
      setScanResult({ fileName: selectedFile.name, error: "Scan failed. Ensure backend is running." });
    }
    setIsLoading(false);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <header className="page-header">
          <h1>Cloud Guard</h1>
          <p>Scan configuration files (e.g., .conf, .yml, .json) for hardcoded secrets and vulnerabilities.</p>
        </header>

        <main className="content-card">
          <div className="file-scanner-input">
            <FaFileUpload className="input-icon" />
            {/* Custom styled file input */}
            <label htmlFor="file-upload" className="file-upload-label">
                Choose File
            </label>
            <input 
              id="file-upload"
              type="file" 
              onChange={handleFileChange}
              style={{ display: 'none' }} // Hide the default input
            />
            <span className="file-name-display">{fileName}</span>
            <button className="scan-button" onClick={handleScan} disabled={isLoading}>
              {isLoading ? <FaSpinner className="spinner" /> : 'Upload & Scan'}
            </button>
          </div>
          
          {scanResult && (
             <div className="results-container">
                <h3 className="results-title">Scan Results for: {scanResult.fileName}</h3>
                {scanResult.error ? (
                    <p className="error-message">{scanResult.error}</p>
                ) : (
                    <ul className="results-list">
                        {scanResult.findings.map((finding, index) => (
                            <ScanFinding key={index} finding={finding} />
                        ))}
                    </ul>
                )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default CloudGuardPage;