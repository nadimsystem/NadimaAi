
import React, { useState, useCallback, useRef } from 'react';
import type { Screen } from './types';
import { editImageWithGemini } from './services/geminiService';
import { 
    ChevronLeftIcon, DownloadIcon, RedoIcon, SparklesIcon, PersonIcon, PeopleIcon,
    ExtremeLongShotIcon, LongShotIcon, MediumLongShotIcon, MediumShotIcon,
    MediumCloseUpIcon, CloseUpIcon, ExtremeCloseUpIcon, HighAngleShotIcon,
    LowAngleShotIcon, BirdsEyeViewIcon, WormsEyeViewIcon
} from './components/icons';

// UTILITY
const dataUrlToFile = async (dataUrl: string, fileName: string): Promise<File> => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], fileName, { type: blob.type });
};

// HEADER COMPONENT
const Header: React.FC = () => (
    <header className="text-center p-6 mt-[25px] border-b border-gray-100">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Nadima Imagen
        </h1>
        <p className="mt-4 text-sm md:text-base text-gray-500 max-w-sm mx-auto">
            Edit foto sesuai imajinasi
        </p>
        <p className="mt-0 text-sm md:text-base text-gray-500 max-w-sm mx-auto">
            tanpa kehilangan detail apapun.
        </p>
    </header>
);

// HOME SCREEN COMPONENT
interface HomeScreenProps {
  onImageSelect: (files: FileList) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onImageSelect }) => {
  const singleFileInputRef = useRef<HTMLInputElement>(null);
  const multipleFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onImageSelect(files);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 gap-4">
       <input
        type="file"
        ref={singleFileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
       <input
        type="file"
        ref={multipleFileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />
      <div 
        onClick={() => singleFileInputRef.current?.click()}
        className="w-full max-w-sm bg-white rounded-4xl shadow-soft p-8 text-center cursor-pointer hover:shadow-soft-highlight hover:-translate-y-1 transition-all duration-300 ease-in-out group"
      >
        <div className="flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-gray-200 transition-colors">
                 <PersonIcon className="w-10 h-10 text-gray-500" />
            </div>
            <p className="text-xl font-bold text-gray-800">Foto Tunggal</p>
            <p className="text-sm text-gray-500 mt-2">Edit satu foto</p>
        </div>
      </div>
       <div 
        onClick={() => multipleFileInputRef.current?.click()}
        className="w-full max-w-sm bg-white rounded-4xl shadow-soft p-8 text-center cursor-pointer hover:shadow-soft-highlight hover:-translate-y-1 transition-all duration-300 ease-in-out group"
      >
        <div className="flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-gray-200 transition-colors">
                 <PeopleIcon className="w-10 h-10 text-gray-500" />
            </div>
            <p className="text-xl font-bold text-gray-800">Beberapa Foto</p>
            <p className="text-sm text-gray-500 mt-2">Gabungkan beberapa foto</p>
        </div>
      </div>
    </div>
  );
};

const cameraAngles = [
    { name: 'Extreme Long Shot', icon: ExtremeLongShotIcon },
    { name: 'Long Shot', icon: LongShotIcon },
    { name: 'Medium Long Shot', icon: MediumLongShotIcon },
    { name: 'Medium Shot', icon: MediumShotIcon },
    { name: 'Medium Close Up', icon: MediumCloseUpIcon },
    { name: 'Close Up', icon: CloseUpIcon },
    { name: 'Extreme Close Up', icon: ExtremeCloseUpIcon },
    { name: 'High Angle', icon: HighAngleShotIcon },
    { name: 'Low Angle', icon: LowAngleShotIcon },
    { name: 'Bird\'s Eye View', icon: BirdsEyeViewIcon },
    { name: 'Worm\'s Eye View', icon: WormsEyeViewIcon },
];

// EDIT SCREEN COMPONENT
interface EditScreenProps {
    imagePreviewUrls: string[];
    onGenerate: (prompt: string) => void;
    onBack: () => void;
    preserveDetails: boolean;
    onPreserveDetailsChange: (value: boolean) => void;
}

const EditScreen: React.FC<EditScreenProps> = ({ imagePreviewUrls, onGenerate, onBack, preserveDetails, onPreserveDetailsChange }) => {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim()) {
            onGenerate(prompt);
        }
    };

    const suggestions = imagePreviewUrls.length > 1 
      ? [
          "Buat mereka berpelukan",
          "Gabungkan dua orang ini",
          "Letakkan orang pertama di latar belakang kedua",
          "Tukar wajah mereka",
          "Gaya foto keluarga",
          "Buat mereka berdiri berdampingan",
          "Suasana romantis"
        ]
      : [
          "Di puncak gunung",
          "Ngopi di cafe",
          "Filter retro",
          "Latar studio putih",
          "Pakai kacamata hitam",
          "Rambut jadi biru",
          "Suasana senja",
          "Gaya cyberpunk"
        ];

    const handleSuggestionClick = (suggestion: string) => {
      setPrompt(prev => prev ? `${prev}, ${suggestion.toLowerCase()}` : suggestion);
    };
    
    const handleAngleClick = (angleName: string) => {
        const angleText = `dengan angle kamera ${angleName.toLowerCase()}`;
        setPrompt(prev => {
            const cleanedPrev = prev.replace(/,?\s*dengan angle kamera [a-zA-Z\s']+/g, '');
            return cleanedPrev ? `${cleanedPrev}, ${angleText}` : angleText;
        });
    };

    return (
        <div className="p-4 flex flex-col h-full">
            <button onClick={onBack} className="absolute top-4 left-4 p-2 rounded-full bg-white/50 backdrop-blur-sm shadow-soft-highlight z-10">
                <ChevronLeftIcon className="w-6 h-6 text-gray-700"/>
            </button>
            <div className="flex-shrink-0 mb-4 rounded-4xl overflow-hidden shadow-soft">
                {imagePreviewUrls.length === 1 ? (
                    <img src={imagePreviewUrls[0]} alt="Preview" className="w-full h-auto object-cover" />
                ) : (
                    <div className="flex gap-2 overflow-x-auto p-2 bg-gray-100">
                        {imagePreviewUrls.map((url, index) => (
                            <img key={index} src={url} alt={`Preview ${index + 1}`} className="h-48 rounded-2xl object-cover" />
                        ))}
                    </div>
                )}
            </div>

            <div className="flex-shrink-0 mb-2">
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

            <div className="flex-shrink-0 mb-4">
              <h2 className="text-sm font-semibold text-gray-500 px-1 mb-2">Pilih Angle Kamera:</h2>
              <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                {cameraAngles.map(({ name, icon: Icon }) => (
                  <button
                    key={name}
                    onClick={() => handleAngleClick(name)}
                    className="flex-shrink-0 flex flex-col items-center justify-center gap-1 w-20 h-20 bg-gray-100 text-gray-700 text-xs font-medium p-2 rounded-2xl hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200 text-center"
                    title={name}
                  >
                    <Icon className="w-8 h-8"/>
                    <span>{name}</span>
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
                
                <div className="flex items-center justify-between py-3 px-2 mt-2">
                    <div className="flex flex-col">
                        <label htmlFor="preserve-details-toggle" className="text-sm font-medium text-gray-700 cursor-pointer">
                            Pertahankan semua detail
                        </label>
                         <span className="text-xs text-gray-500">Jika nonaktif, AI boleh sedikit berkreasi.</span>
                    </div>
                    <label htmlFor="preserve-details-toggle" className="inline-flex relative items-center cursor-pointer">
                        <input
                            type="checkbox"
                            id="preserve-details-toggle"
                            className="sr-only peer"
                            checked={preserveDetails}
                            onChange={(e) => onPreserveDetailsChange(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={!prompt.trim()}
                    className="mt-2 w-full flex items-center justify-center gap-2 bg-blue-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:bg-blue-600 active:scale-95 disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed transform transition-all duration-200 ease-in-out"
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
            
            <div className="flex-grow flex flex-col justify-end gap-3 mt-auto">
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
            <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
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
  const [mainImageFiles, setMainImageFiles] = useState<File[]>([]);
  const [mainImagePreviews, setMainImagePreviews] = useState<string[]>([]);
  const [editedImage, setEditedImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [preserveDetails, setPreserveDetails] = useState<boolean>(true);

  const handleImageSelect = (files: FileList) => {
    const fileArray = Array.from(files);
    setMainImageFiles(fileArray);
    const previewUrls = fileArray.map(file => URL.createObjectURL(file));
    setMainImagePreviews(previewUrls);
    setCurrentScreen('EDIT');
    setIsLoading(false);
  };

  const handleGenerate = useCallback(async (prompt: string) => {
    if (mainImageFiles.length === 0) {
      setError('No main image selected.');
      return;
    }
    setIsLoading(true);
    setLoadingMessage('Nadima sedang berkreasi...');
    setError(null);
    
    // Go to edit screen to show loading overlay over it
    // but don't change screen if already on 'RESULT' and re-generating
    if (currentScreen !== 'RESULT') {
        setCurrentScreen('EDIT');
    }


    let finalPrompt = prompt;
    if (preserveDetails) {
        finalPrompt += ", pertahankan semua detail asli dari orang dan latar belakang. Hanya ubah sesuai instruksi.";
    } else {
        finalPrompt += ", kamu boleh sedikit berkreasi.";
    }

    try {
      const result = await editImageWithGemini(mainImageFiles, finalPrompt);
      setEditedImage(result);
      setCurrentScreen('RESULT');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      // Stay on the current screen if error
      if (currentScreen !== 'RESULT') {
        setCurrentScreen('EDIT');
      }
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [mainImageFiles, preserveDetails, currentScreen]);
  
  const handleContinueEditing = useCallback(async () => {
    if (!editedImage) return;
    setIsLoading(true);
    setLoadingMessage('Menyiapkan kanvas baru...');
    const file = await dataUrlToFile(editedImage, `nadima-ai-continued-${Date.now()}.png`);
    setMainImageFiles([file]);
    setMainImagePreviews([editedImage]);
    setCurrentScreen('EDIT');
    setIsLoading(false);
  }, [editedImage]);


  const handleEditAgain = () => {
    setEditedImage('');
    setCurrentScreen('EDIT');
  };

  const handleStartOver = () => {
    // Revoke previous object URLs to prevent memory leaks
    mainImagePreviews.forEach(url => URL.revokeObjectURL(url));
    
    setMainImageFiles([]);
    setMainImagePreviews([]);
    setEditedImage('');
    setError(null);
    setCurrentScreen('HOME');
  };

  return (
    <div style={{ fontSynthesis: 'none' }} className="font-sans antialiased bg-gray-100 text-gray-800 min-h-screen flex flex-col items-center">
      <div className="relative w-full max-w-md h-screen md:h-[844px] md:max-h-[90vh] md:my-8 bg-white md:rounded-4xl shadow-soft overflow-hidden flex flex-col">
        {isLoading && <LoadingOverlay message={loadingMessage} />}
        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg z-50 shadow-lg w-11/12">
            <p className="text-sm">{error}</p>
            <button onClick={() => setError(null)} className="absolute top-0 right-2 font-bold text-lg">&times;</button>
          </div>
        )}
        
        {currentScreen === 'HOME' && <Header />}
        
        <main className="flex-grow overflow-y-auto">
            {currentScreen === 'HOME' && (
                <HomeScreen onImageSelect={handleImageSelect} />
            )}
            {currentScreen === 'EDIT' && mainImagePreviews.length > 0 && (
                <EditScreen 
                  imagePreviewUrls={mainImagePreviews} 
                  onGenerate={handleGenerate} 
                  onBack={handleStartOver}
                  preserveDetails={preserveDetails}
                  onPreserveDetailsChange={setPreserveDetails}
                />
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
