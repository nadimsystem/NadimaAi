
import React, { useState, useCallback, useRef } from 'react';
import type { Screen } from './types';
import { editImageWithGemini } from './services/geminiService';
import { ChevronLeftIcon, DownloadIcon, RedoIcon, SparklesIcon, UploadIcon } from './components/icons';

// UTILITY
const dataUrlToFile = async (dataUrl: string, fileName: string): Promise<File> => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], fileName, { type: blob.type });
};

// HEADER COMPONENT
const Header: React.FC = () => (
    <header className="text-center p-6 border-b border-gray-100">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Nadima AI
        </h1>
        <p className="mt-4 text-sm md:text-base text-gray-500 max-w-sm mx-auto">
            Edit foto sesuai imajinasi
        </p>
        <p className="mt-0 text-sm md:text-base text-gray-500 max-w-sm mx-auto">
            tanpa mengubah wajah asli kamu.
        </p>
    </header>
);

// HOME SCREEN COMPONENT
interface HomeScreenProps {
  onImageSelect: (file: File) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onImageSelect, setIsLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setIsLoading(true);
      onImageSelect(file);
    }
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <div 
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="w-full max-w-sm bg-white rounded-4xl shadow-soft p-8 text-center cursor-pointer hover:shadow-soft-highlight hover:-translate-y-1 transition-all duration-300 ease-in-out group"
      >
        <div className="flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-gray-200 transition-colors">
                 <UploadIcon className="w-10 h-10 text-gray-500" />
            </div>
            <p className="text-xl font-bold text-gray-800">Pilih sebuah foto</p>
            <p className="text-sm text-gray-500 mt-2">atau seret dan lepas di sini</p>
        </div>
      </div>
    </div>
  );
};


// EDIT SCREEN COMPONENT
interface EditScreenProps {
    imagePreviewUrl: string;
    onGenerate: (prompt: string) => void;
    onBack: () => void;
}

const EditScreen: React.FC<EditScreenProps> = ({ imagePreviewUrl, onGenerate, onBack }) => {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim()) {
            onGenerate(prompt);
        }
    };

    const suggestions = [
      "Di puncak gunung",
      "Ngopi di cafe",
      "Filter retro",
      "Latar studio putih",
      "Pakai kacamata hitam",
      "Rambut jadi biru",
      "Suasana senja",
      "Gaya cyberpunk",
      "Lukisan cat air",
      "Menjadi astronot",
      "Di taman bunga",
      "Hujan rintik-rintik",
    ];

    const handleSuggestionClick = (suggestion: string) => {
      setPrompt(prev => prev ? `${prev}, ${suggestion.toLowerCase()}` : suggestion);
    };
    
    return (
        <div className="p-4 flex flex-col h-full">
            <button onClick={onBack} className="absolute top-4 left-4 p-2 rounded-full bg-white/50 backdrop-blur-sm shadow-soft-highlight z-10">
                <ChevronLeftIcon className="w-6 h-6 text-gray-700"/>
            </button>
            <div className="flex-shrink-0 mb-4 rounded-4xl overflow-hidden shadow-soft">
                <img src={imagePreviewUrl} alt="Preview" className="w-full h-auto object-cover" />
            </div>

            <div className="flex-shrink-0 mb-4">
              <h2 className="text-sm font-semibold text-gray-500 px-1 mb-2">Rekomendasi Prompt:</h2>
              <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(s)}
                    className="flex-shrink-0 bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200 whitespace-nowrap"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
                <div className="relative flex-grow">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Tulis instruksi edit di sini..."
                        className="w-full h-full p-4 text-base text-gray-700 bg-gray-50 border-2 border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        rows={3}
                    />
                </div>
                <button
                    type="submit"
                    disabled={!prompt.trim()}
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:bg-blue-600 active:scale-95 disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed transform transition-all duration-200 ease-in-out"
                >
                    <SparklesIcon className="w-6 h-6" />
                    Generate Imajinasi Anda
                </button>
            </form>
            <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
        </div>
    );
};

// RESULT SCREEN COMPONENT
interface ResultScreenProps {
  resultImage: string;
  onContinueEditing: () => void;
  onEditAgain: () => void;
  onStartOver: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ resultImage, onContinueEditing, onEditAgain, onStartOver }) => {

    const handleSave = () => {
        const link = document.createElement('a');
        link.href = resultImage;
        link.download = `nadima-ai-edit-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-4 flex flex-col h-full">
             <button onClick={onStartOver} className="absolute top-4 left-4 p-2 rounded-full bg-white/50 backdrop-blur-sm shadow-soft-highlight z-10">
                <ChevronLeftIcon className="w-6 h-6 text-gray-700"/>
            </button>
            <div className="flex-shrink-0 rounded-4xl overflow-hidden shadow-soft mb-4">
                <img src={resultImage} alt="Hasil Edit" className="w-full h-auto object-cover" />
            </div>
             <p className="text-center text-sm text-gray-500 mb-4">Identitas dipertahankan. Gaya diterapkan sukses.</p>
            <div className="flex-grow flex flex-col justify-end gap-3">
                 <button
                    onClick={onContinueEditing}
                    className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:bg-blue-600 active:scale-95 transform transition-all duration-200 ease-in-out"
                >
                    <SparklesIcon className="w-5 h-5" />
                    Lanjutkan Foto Ini
                </button>
                <button
                    onClick={handleSave}
                    className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white font-bold py-4 px-6 rounded-2xl hover:bg-gray-900 active:scale-95 transform transition-all duration-200 ease-in-out"
                >
                    <DownloadIcon className="w-5 h-5" />
                    Simpan ke Galeri
                </button>
                <button
                    onClick={onEditAgain}
                    className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-800 font-bold py-4 px-6 rounded-2xl hover:bg-gray-200 active:scale-95 transform transition-all duration-200 ease-in-out"
                >
                    <RedoIcon className="w-5 h-5" />
                    Coba Prompt Baru
                </button>
            </div>
        </div>
    );
};

// LOADING OVERLAY COMPONENT
const LoadingOverlay: React.FC<{ message: string }> = ({ message }) => (
    <div className="absolute inset-0 bg-white/70 backdrop-blur-md flex flex-col items-center justify-center z-50">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-semibold text-gray-700">{message}</p>
    </div>
);

// MAIN APP COMPONENT
const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('HOME');
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string>('');
  const [editedImage, setEditedImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    setMainImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setMainImagePreview(previewUrl);
    setCurrentScreen('EDIT');
    setIsLoading(false);
  };

  const handleGenerate = useCallback(async (prompt: string) => {
    if (!mainImageFile) {
      setError('No main image selected.');
      return;
    }
    setIsLoading(true);
    setLoadingMessage('Nadima sedang berkreasi...');
    setError(null);

    try {
      const result = await editImageWithGemini(mainImageFile, prompt);
      setEditedImage(result);
      setCurrentScreen('RESULT');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [mainImageFile]);
  
  const handleContinueEditing = useCallback(async () => {
    if (!editedImage) return;
    setIsLoading(true);
    setLoadingMessage('Menyiapkan kanvas baru...');
    const file = await dataUrlToFile(editedImage, `nadima-ai-continued-${Date.now()}.png`);
    setMainImageFile(file);
    setMainImagePreview(editedImage);
    setCurrentScreen('EDIT');
    setIsLoading(false);
  }, [editedImage]);


  const handleEditAgain = () => {
    setEditedImage('');
    setCurrentScreen('EDIT');
  };

  const handleStartOver = () => {
    setMainImageFile(null);
    setMainImagePreview('');
    setEditedImage('');
    setError(null);
    setCurrentScreen('HOME');
  };
  
  return (
    <div style={{ fontSynthesis: 'none' }} className="font-sans antialiased bg-gray-100 text-gray-800 min-h-screen flex flex-col items-center">
      <div className="relative w-full max-w-md h-screen md:h-[844px] md:max-h-[90vh] md:my-8 bg-white md:rounded-4xl shadow-soft overflow-hidden flex flex-col">
        {isLoading && <LoadingOverlay message={loadingMessage} />}
        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg z-50 shadow-lg">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="absolute top-1 right-2 font-bold">&times;</button>
          </div>
        )}
        
        {currentScreen === 'HOME' && <Header />}
        
        <main className="flex-grow overflow-y-auto">
            {currentScreen === 'HOME' && (
                <HomeScreen onImageSelect={handleImageSelect} setIsLoading={setIsLoading} />
            )}
            {currentScreen === 'EDIT' && mainImagePreview && (
                <EditScreen imagePreviewUrl={mainImagePreview} onGenerate={handleGenerate} onBack={handleStartOver} />
            )}
            {currentScreen === 'RESULT' && editedImage && (
                <ResultScreen 
                    resultImage={editedImage} 
                    onContinueEditing={handleContinueEditing}
                    onEditAgain={handleEditAgain} 
                    onStartOver={handleStartOver} 
                />
            )}
        </main>
      </div>
    </div>
  );
};

export default App;
