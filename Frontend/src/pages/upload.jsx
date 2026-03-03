// import React, { useState } from 'react';
// import { 
//   UploadCloud, FileText, FileSpreadsheet, 
//   CheckCircle2, AlertCircle, Loader2, X 
// } from 'lucide-react';

// export default function UploadData() {
//   const [dragActive, setDragActive] = useState(false);
//   const [file, setFile] = useState(null);
//   const [uploadState, setUploadState] = useState('idle'); 
//   const [progress, setProgress] = useState(0);

//   const handleDrag = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       handleFile(e.dataTransfer.files[0]);
//     }
//   };

//   const handleChange = (e) => {
//     e.preventDefault();
//     if (e.target.files && e.target.files[0]) {
//       handleFile(e.target.files[0]);
//     }
//   };

//   const handleFile = (selectedFile) => {
//     setFile(selectedFile);
//     setUploadState('idle');
//     setProgress(0);
//   };

//   const clearFile = () => {
//     setFile(null);
//     setUploadState('idle');
//     setProgress(0);
//   };

//   const simulateUpload = () => {
//     setUploadState('uploading');
//     setProgress(0);
//     const interval = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 100) {
//           clearInterval(interval);
//           setUploadState('success');
//           return 100;
//         }
//         return prev + 5;
//       });
//     }, 100);
//   };

//   return (
//     // FIX 1: Choked down max-width from 4xl to 3xl for better horizontal balance
//     <div className="max-w-3xl mx-auto space-y-8">
      
//       <div>
//         <h1 className="text-2xl font-extrabold text-white tracking-tight">Data Ingestion</h1>
//         <p className="text-stone-400 mt-1">Upload raw bank statements to run them through the ML pipeline.</p>
//       </div>

//       <div className="bg-stone-900/50 backdrop-blur-md rounded-3xl border border-white/5 p-8 shadow-sm">
        
//         {!file ? (
//           <div 
//             // FIX 1: Changed h-80 to min-h-96 and added py-12 for more vertical breathing room
//             className={`group relative flex flex-col items-center justify-center w-full min-h-96 py-12 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
//               ${dragActive 
//                 ? 'border-indigo-500 bg-indigo-500/5 shadow-[inset_0_0_50px_rgba(79,70,229,0.05)]' 
//                 : 'border-stone-700 bg-stone-950/30 hover:border-stone-500 hover:bg-stone-900/60'
//               }`}
//             onDragEnter={handleDrag}
//             onDragLeave={handleDrag}
//             onDragOver={handleDrag}
//             onDrop={handleDrop}
//           >
//             <input 
//               type="file" 
//               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
//               onChange={handleChange}
//               accept=".csv, .pdf"
//             />
            
//             <div className="w-16 h-16 rounded-full bg-stone-800 border border-white/5 flex items-center justify-center mb-6 shadow-md group-hover:scale-110 group-hover:bg-stone-800/80 transition-all duration-300">
//               {/* FIX 2: Added subtle indigo accent to the default state */}
//               <UploadCloud size={28} className={dragActive ? "text-indigo-300" : "text-indigo-400/80"} />
//             </div>
            
//             <h3 className="text-lg font-bold text-white mb-2">
//               {dragActive ? "Drop file to upload" : "Click or drag file to this area"}
//             </h3>
//             <p className="text-sm text-stone-500 font-medium mb-8">
//               Support for a single or bulk upload. Strictly CSV or PDF files.
//             </p>
            
//             <div className="flex gap-4">
//               <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 border border-white/5 text-xs font-mono text-stone-300">
//                 <FileSpreadsheet size={14} className="text-teal-400" /> .CSV
//               </span>
//               <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 border border-white/5 text-xs font-mono text-stone-300">
//                 <FileText size={14} className="text-rose-400" /> .PDF
//               </span>
//             </div>
//           </div>
//         ) : (
          
//           <div className="bg-stone-950/50 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
//             {uploadState === 'uploading' && (
//               <div 
//                 className="absolute top-0 left-0 h-full bg-indigo-500/10 transition-all duration-300"
//                 style={{ width: `${progress}%` }}
//               ></div>
//             )}

//             <div className="flex items-center gap-5 relative z-10">
//               <div className="w-14 h-14 rounded-xl bg-stone-800 border border-white/10 flex items-center justify-center shrink-0 shadow-sm">
//                 <FileSpreadsheet size={24} className="text-indigo-400" />
//               </div>
              
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center justify-between mb-1">
//                   <h4 className="text-sm font-bold text-white truncate pr-4">{file.name}</h4>
//                   {uploadState === 'success' && <CheckCircle2 size={18} className="text-teal-400 shrink-0" />}
//                   {uploadState === 'error' && <AlertCircle size={18} className="text-rose-400 shrink-0" />}
//                   {uploadState === 'idle' && (
//                     <button onClick={clearFile} className="p-1 rounded-md text-stone-500 hover:text-white hover:bg-stone-800 transition-colors">
//                       <X size={16} />
//                     </button>
//                   )}
//                 </div>
                
//                 <p className="text-xs text-stone-500 font-mono">
//                   {(file.size / 1024 / 1024).toFixed(2)} MB 
//                   {uploadState === 'uploading' && <span className="text-indigo-400 ml-2">• Uploading {progress}%</span>}
//                   {uploadState === 'success' && <span className="text-teal-400 ml-2">• Pipeline Complete</span>}
//                 </p>

//                 {uploadState === 'uploading' && (
//                   <div className="w-full h-1.5 bg-stone-800 rounded-full mt-3 overflow-hidden border border-white/5">
//                     <div 
//                       className="h-full bg-linear-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-200"
//                       style={{ width: `${progress}%` }}
//                     ></div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="mt-6 flex gap-3 relative z-10">
//               {uploadState === 'idle' && (
//                 <button 
//                   onClick={simulateUpload}
//                   className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)] border border-indigo-500"
//                 >
//                   Run ML Pipeline
//                 </button>
//               )}
//               {uploadState === 'uploading' && (
//                 <button disabled className="px-5 py-2.5 rounded-xl bg-indigo-600/50 text-white/50 text-sm font-bold flex items-center gap-2 cursor-not-allowed">
//                   <Loader2 size={16} className="animate-spin" />
//                   Processing...
//                 </button>
//               )}
//               {uploadState === 'success' && (
//                 <button className="px-5 py-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 text-sm font-bold hover:bg-teal-500/20 transition-colors">
//                   View Analysis Results
//                 </button>
//               )}
//               {uploadState !== 'uploading' && (
//                 <button 
//                   onClick={clearFile}
//                   className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-sm font-medium border border-white/5 transition-colors"
//                 >
//                   Cancel
//                 </button>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* FIX 3: Adjusted line height, text color, and padding for better dark-mode readability */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-stone-900/30 border border-white/5 rounded-2xl p-6">
//           <h4 className="text-sm font-bold text-white mb-2">Data Privacy & Security</h4>
//           <p className="text-sm text-stone-400 leading-loose pr-4">
//             All uploaded statements are processed entirely in memory. Raw data is instantly tokenized and anonymized before entering the Prophet and Isolation Forest models. No PII is permanently stored.
//           </p>
//         </div>
//         <div className="bg-stone-900/30 border border-white/5 rounded-2xl p-6">
//           <h4 className="text-sm font-bold text-white mb-2">Supported Schema</h4>
//           <p className="text-sm text-stone-400 leading-loose pr-4 mb-4">
//             For CSV uploads, ensure your data contains at least a Date, Description, and Amount column. The ML engine will auto-map standard bank export formats.
//           </p>
//           <button className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
//             Download sample template &rarr;
//           </button>
//         </div>
//       </div>

//     </div>
//   );
//


import React, { useState } from 'react';
import { 
  UploadCloud, FileText, FileSpreadsheet, 
  CheckCircle2, AlertCircle, Loader2, X 
} from 'lucide-react';

export default function UploadData() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadState, setUploadState] = useState('idle');
  const [progress, setProgress] = useState(0);


  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    setFile(selectedFile);
    setUploadState('idle');
    setProgress(0);
  };

  const clearFile = () => {
    setFile(null);
    setUploadState('idle');
    setProgress(0);
  };

  const simulateUpload = () => {
    setUploadState('uploading');
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadState('success');
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header Info */}
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Data Ingestion</h1>
        <p className="text-stone-400 mt-1">Upload raw bank statements to run them through the ML pipeline.</p>
      </div>

      {/* Main Upload Area */}
      <div className="bg-stone-900/50 backdrop-blur-md rounded-3xl border border-white/5 p-8 shadow-sm">
        
        {/* The Dropzone */}
        {!file ? (
          <div 
            className={`relative flex flex-col items-center justify-center w-full h-80 rounded-2xl border-2 border-dashed transition-all duration-300
              ${dragActive 
                ? 'border-indigo-500 bg-indigo-500/5 shadow-[inset_0_0_50px_rgba(79,70,229,0.05)]' 
                : 'border-stone-700 bg-stone-950/30 hover:border-stone-500 hover:bg-stone-900/60'
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {/* Hidden Input */}
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              onChange={handleChange}
              accept=".csv, .pdf"
            />
            
            <div className="w-16 h-16 rounded-full bg-stone-800 border border-white/5 flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
              <UploadCloud size={28} className={dragActive ? "text-indigo-400" : "text-stone-400"} />
            </div>
            
            <h3 className="text-lg font-bold text-white mb-2">
              {dragActive ? "Drop file to upload" : "Click or drag file to this area"}
            </h3>
            <p className="text-sm text-stone-500 font-medium mb-6">
              Support for a single or bulk upload. Strictly CSV or PDF files.
            </p>
            
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 border border-white/5 text-xs font-mono text-stone-300">
                <FileSpreadsheet size={14} className="text-emerald-400" /> .CSV
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 border border-white/5 text-xs font-mono text-stone-300">
                <FileText size={14} className="text-rose-400" /> .PDF
              </span>
            </div>
          </div>
        ) : (
          
          /* Selected File State */
          <div className="bg-stone-950/50 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            
            {/* Background progress bar during upload */}
            {uploadState === 'uploading' && (
              <div 
                className="absolute top-0 left-0 h-full bg-indigo-500/10 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            )}

            <div className="flex items-center gap-5 relative z-10">
              
              {/* File Icon */}
              <div className="w-14 h-14 rounded-xl bg-stone-800 border border-white/10 flex items-center justify-center shrink-0 shadow-sm">
                <FileSpreadsheet size={24} className="text-indigo-400" />
              </div>
              
              {/* File Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-white truncate pr-4">{file.name}</h4>
                  
                  {uploadState === 'success' && <CheckCircle2 size={18} className="text-teal-400 shrink-0" />}
                  {uploadState === 'error' && <AlertCircle size={18} className="text-rose-400 shrink-0" />}
                  {uploadState === 'idle' && (
                    <button onClick={clearFile} className="p-1 rounded-md text-stone-500 hover:text-white hover:bg-stone-800 transition-colors">
                      <X size={16} />
                    </button>
                  )}
                </div>
                
                <p className="text-xs text-stone-500 font-mono">
                  {(file.size / 1024 / 1024).toFixed(2)} MB 
                  {uploadState === 'uploading' && <span className="text-indigo-400 ml-2">• Uploading {progress}%</span>}
                  {uploadState === 'success' && <span className="text-teal-400 ml-2">• Pipeline Complete</span>}
                </p>

                {/* Micro Progress Bar */}
                {uploadState === 'uploading' && (
                  <div className="w-full h-1.5 bg-stone-800 rounded-full mt-3 overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-linear-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3 relative z-10">
              {uploadState === 'idle' && (
                <button 
                  onClick={simulateUpload}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)] border border-indigo-500"
                >
                  Run ML Pipeline
                </button>
              )}

              {uploadState === 'uploading' && (
                <button disabled className="px-5 py-2.5 rounded-xl bg-indigo-600/50 text-white/50 text-sm font-bold flex items-center gap-2 cursor-not-allowed">
                  <Loader2 size={16} className="animate-spin" />
                  Processing...
                </button>
              )}

              {uploadState === 'success' && (
                <button className="px-5 py-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 text-sm font-bold hover:bg-teal-500/20 transition-colors">
                  View Analysis Results
                </button>
              )}

              {uploadState !== 'uploading' && (
                <button 
                  onClick={clearFile}
                  className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-sm font-medium border border-white/5 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
            
          </div>
        )}
      </div>

      {/* Secondary Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-stone-900/30 border border-white/5 rounded-2xl p-6">
          <h4 className="text-sm font-bold text-white mb-2">Data Privacy & Security</h4>
          <p className="text-xs text-stone-500 leading-relaxed">
            All uploaded statements are processed entirely in memory. Raw data is instantly tokenized and anonymized before entering the Prophet and Isolation Forest models. No PII is permanently stored.
          </p>
        </div>
        <div className="bg-stone-900/30 border border-white/5 rounded-2xl p-6">
          <h4 className="text-sm font-bold text-white mb-2">Supported Schema</h4>
          <p className="text-xs text-stone-500 leading-relaxed mb-3">
            For CSV uploads, ensure your data contains at least a Date, Description, and Amount column. The ML engine will auto-map standard bank export formats.
          </p>
          <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
            Download sample template &rarr;
          </button>
        </div>
      </div>

    </div>
  );
}