
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { DataDisplay } from './components/DataDisplay';
import { DatabaseView } from './components/DatabaseView';
import { Spinner } from './components/Spinner';
import { Alert } from './components/Alert';
import { extractSatBaraData } from './services/ollamaService'; // Updated import
import { getRecords, addRecord, clearRecords } from './services/localStorageService';
import { SatBaraData, AppView } from './types';
import { SatBaraIcon, DatabaseIcon, UploadIcon, SaveIcon, TrashIcon, LightBulbIcon } from './components/Icons';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.EXTRACTOR);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<SatBaraData | null>(null);
  const [databaseRecords, setDatabaseRecords] = useState<SatBaraData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfWarning, setPdfWarning] = useState<string | null>(null);
  // API Key state and related logic removed

  useEffect(() => {
    // Load records from local storage on initial mount
    setDatabaseRecords(getRecords());
  }, []);

  const handleFileChange = useCallback((file: File | null) => {
    setUploadedFile(file);
    setExtractedData(null); // Reset extracted data when new file is chosen
    setError(null); // Reset general error
    setPdfWarning(null); // Reset PDF warning

    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        setFilePreviewUrl(null); // No direct preview for PDFs this way
        setPdfWarning("Note: Extracting data from PDFs using the current AI model setup is experimental. The model may not interpret PDF format correctly, potentially leading to errors or poor extraction results (e.g., 'unknown format' errors).");
      } else {
        setFilePreviewUrl(null);
      }
    } else {
      setFilePreviewUrl(null);
    }
  }, []);

  const handleExtractData = async () => {
    if (!uploadedFile) {
      setError("Please upload a file first.");
      return;
    }
    // API Key check removed

    setIsLoading(true);
    setError(null);
    setPdfWarning(null); // Clear PDF warning before extraction attempt
    setExtractedData(null);

    try {
      // API Key no longer passed to the extraction function
      const data = await extractSatBaraData(uploadedFile); 
      setExtractedData(data);
    } catch (err) {
      console.error("Extraction error:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during data extraction.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToDatabase = () => {
    if (extractedData) {
      addRecord(extractedData);
      setDatabaseRecords(getRecords()); // Refresh records from storage
      setExtractedData(null); // Clear displayed data after saving
      setUploadedFile(null); // Clear uploaded file
      setFilePreviewUrl(null); // Clear preview
      setCurrentView(AppView.DATABASE); // Switch to database view
      setError(null);
      setPdfWarning(null);
    }
  };

  const handleClearDatabase = () => {
    if (window.confirm("Are you sure you want to clear all records from the database? This action cannot be undone.")) {
      clearRecords();
      setDatabaseRecords([]);
      setError(null);
    }
  };
  
  // handleApiKeyChange removed

  return (
    <div className="min-h-screen flex flex-col bg-slate-800 text-slate-100">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      
      {/* API Key input section removed */}

      <main className="flex-grow p-6 space-y-6">
        {error && <Alert message={error} type="error" onClose={() => setError(null)} />}
        {pdfWarning && <Alert message={pdfWarning} type="warning" onClose={() => setPdfWarning(null)} />}


        {currentView === AppView.EXTRACTOR && (
          <div className="space-y-6 p-6 bg-slate-700 shadow-xl rounded-lg">
            <div className="flex items-center space-x-3 text-2xl font-semibold text-sky-400">
              <UploadIcon className="w-8 h-8" />
              <span>Upload Sat Bara Document (PDF Recommended)</span>
            </div>
            <FileUpload onFileChange={handleFileChange} filePreviewUrl={filePreviewUrl} currentFile={uploadedFile}/>
            {uploadedFile && (
              <button
                onClick={handleExtractData}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Spinner small /> : <LightBulbIcon className="w-5 h-5 mr-2" />}
                Extract Data with AI
              </button>
            )}
            {isLoading && <div className="flex justify-center py-4"><Spinner /></div>}
            {extractedData && (
              <div className="mt-6 space-y-4">
                <DataDisplay data={extractedData} />
                <button
                  onClick={handleSaveToDatabase}
                  className="w-full flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 ease-in-out"
                >
                  <SaveIcon className="w-5 h-5 mr-2" />
                  Save to Database
                </button>
              </div>
            )}
          </div>
        )}

        {currentView === AppView.DATABASE && (
          <div className="space-y-6 p-6 bg-slate-700 shadow-xl rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-2xl font-semibold text-sky-400">
                <DatabaseIcon className="w-8 h-8" />
                <span>Stored Land Records</span>
              </div>
              {databaseRecords.length > 0 && (
                <button
                  onClick={handleClearDatabase}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 ease-in-out flex items-center"
                >
                  <TrashIcon className="w-5 h-5 mr-2" />
                  Clear All Records
                </button>
              )}
            </div>
            <DatabaseView records={databaseRecords} />
          </div>
        )}
      </main>
      <footer className="text-center p-4 text-sm text-slate-400 border-t border-slate-700">
        Sat Bara Data Extractor &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;
