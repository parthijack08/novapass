import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { Dashboard } from './pages/Dashboard';
import { Editor } from './pages/Editor';
import { PrintGenerator } from './pages/PrintGenerator';
import { Settings } from './pages/Settings';
import { LegalHub } from './pages/LegalHub';
import { useImageEditor } from './hooks/useImageEditor';
import { PhotoSizePreset, AppSettings, RecentPhoto, Unit } from './types';
import { PHOTO_SIZE_PRESETS } from './utils/presets';
import { convertDimension } from './utils/dimensionConverter';

// Save defaults in localStorage keys
const SETTINGS_LS_KEY = 'passport_pro_app_settings';
const RECENTS_LS_KEY = 'passport_pro_recent_photos';

const defaultAppSettings: AppSettings = {
  defaultSizeId: 'us',
  defaultBackgroundId: '#FFFFFF',
  defaultLayoutCols: 2,
  defaultLayoutRows: 4,
  defaultFileFormat: 'png',
  theme: 'light',
  watermarkText: 'PASSPORT PRO STUDIO',
  watermarkOn: false,
  printMargins: 10,
  sheetNumberingOn: false,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [legalSubTab, setLegalSubTab] = useState<'about' | 'contact' | 'terms' | 'privacy' | 'disclaimer'>('about');

  const handleLegalNavigate = (subTab: 'about' | 'contact' | 'terms' | 'privacy' | 'disclaimer') => {
    setLegalSubTab(subTab);
    setActiveTab('legal');
  };

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);

  // Load defaults from local storage if existing
  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_LS_KEY);
      return saved ? { ...defaultAppSettings, ...JSON.parse(saved) } : defaultAppSettings;
    } catch {
      return defaultAppSettings;
    }
  });

  // Selected preset parameters state
  const [selectedSize, setSelectedSize] = useState<PhotoSizePreset>(() => {
    const val = appSettings.defaultSizeId;
    return PHOTO_SIZE_PRESETS.find((p) => p.id === val) || PHOTO_SIZE_PRESETS[0];
  });

  // Custom Sizing numeric state
  const [customSize, setCustomSize] = useState<{ width: number; height: number; unit: Unit }>({
    width: 35,
    height: 45,
    unit: 'mm',
  });

  // Historic created items list
  const [recentPhotos, setRecentPhotos] = useState<RecentPhoto[]>(() => {
    try {
      const saved = localStorage.getItem(RECENTS_LS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Initialize custom Image Editor hook
  const editorState = useImageEditor();

  // Color Theme selector class modifications on HTML5 body root
  useEffect(() => {
    const root = document.documentElement;
    const updateTheme = (themeVal: 'light' | 'dark' | 'system') => {
      if (themeVal === 'dark') {
        root.classList.add('dark');
      } else if (themeVal === 'light') {
        root.classList.remove('dark');
      } else {
        // Evaluate media query
        const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (darkQuery.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    updateTheme(appSettings.theme);

    // If system layout changes and system option is toggled, update classes
    const mediaHandler = () => {
      if (appSettings.theme === 'system') {
        updateTheme('system');
      }
    };
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    query.addEventListener('change', mediaHandler);
    return () => query.removeEventListener('change', mediaHandler);
  }, [appSettings.theme]);

  // Handle active preset sizing updates
  const handleSizeChange = (preset: PhotoSizePreset) => {
    setSelectedSize(preset);
  };

  // Upload image handler
  const handleImageUploaded = (src: string) => {
    setImageSrc(src);
    setPhotoBase64(null); // Clear previous compiled builds
    editorState.resetAll(); // Clear transform states
    setActiveTab('editor'); // Instantly transit to lab workspace
  };

  const handleClearImage = () => {
    setImageSrc(null);
    setPhotoBase64(null);
    editorState.resetAll();
    setActiveTab('dashboard');
  };

  // Sync settings and histories to local storage
  const handleSaveSettings = (settings: AppSettings) => {
    setAppSettings(settings);
    try {
      localStorage.setItem(SETTINGS_LS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to sync settings:', e);
    }
  };

  const handleResetDefaults = () => {
    setAppSettings(defaultAppSettings);
    setSelectedSize(PHOTO_SIZE_PRESETS[0]);
    try {
      localStorage.setItem(SETTINGS_LS_KEY, JSON.stringify(defaultAppSettings));
    } catch (e) {
      console.error('Failed to reset settings:', e);
    }
  };

  const handleAddRecentPhoto = (photo: RecentPhoto) => {
    setRecentPhotos((prev) => {
      const next = [photo, ...prev].slice(0, 8); // Keep max 8 items
      try {
        localStorage.setItem(RECENTS_LS_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save recents list:', e);
      }
      return next;
    });
  };

  const handleClearRecentPhoto = (id: string) => {
    setRecentPhotos((prev) => {
      const next = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(RECENTS_LS_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to clear recent item:', e);
      }
      return next;
    });
  };

  const handleRestoreRecentPhoto = (photo: RecentPhoto, targetTab: 'editor' | 'print') => {
    setImageSrc(photo.thumbnail);
    setPhotoBase64(photo.thumbnail);
    
    const matchedPreset = PHOTO_SIZE_PRESETS.find(
      (p) => p.name === photo.sizeName || `${p.width}x${p.height} ${p.unit}` === photo.sizeDims
    );
    if (matchedPreset) {
      setSelectedSize(matchedPreset);
    }
    
    setActiveTab(targetTab);
  };

  return (
    <div className="flex min-h-screen flex-col bg-app-bg/40 transition-colors duration-200 dark:bg-zinc-950 font-sans">
      {/* Top Header Row */}
      <Header 
        currentTab={activeTab} 
        theme={appSettings.theme}
        setTheme={(t) => handleSaveSettings({ ...appSettings, theme: t })}
        onNavigate={setActiveTab}
      />

      {/* Main split worktable layout */}
      <div className="flex flex-1 overflow-hidden" id="main-studio-workspace">
        {/* Left Sidebar Menu */}
        <Sidebar 
          currentTab={activeTab} 
          onNavigate={setActiveTab} 
          imageLoaded={!!imageSrc}
        />

        {/* Dynamic page content container */}
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6" id="main-canvas-scroller">
          {activeTab === 'dashboard' && (
            <Dashboard
              imageSrc={imageSrc}
              onImageUploaded={handleImageUploaded}
              onClearImage={handleClearImage}
              selectedSize={selectedSize}
              onSizeSelect={handleSizeChange}
              onNavigate={setActiveTab}
              recentPhotos={recentPhotos}
              onClearRecentPhoto={handleClearRecentPhoto}
              onRestoreRecentPhoto={handleRestoreRecentPhoto}
            />
          )}

          {activeTab === 'editor' && imageSrc && (
            <Editor
              imageSrc={imageSrc}
              sizePreset={selectedSize}
              onSizeChange={handleSizeChange}
              customSize={customSize}
              onCustomSizeChange={setCustomSize}
              editorState={editorState}
              setPhotoBase64={setPhotoBase64}
              onNavigate={setActiveTab}
              addRecentPhoto={handleAddRecentPhoto}
            />
          )}

          {activeTab === 'print' && imageSrc && (
            <PrintGenerator
              photoBase64={photoBase64}
              sizePreset={selectedSize}
              appSettings={appSettings}
            />
          )}

          {activeTab === 'settings' && (
            <Settings
              appSettings={appSettings}
              onSaveSettings={handleSaveSettings}
              onResetDefaults={handleResetDefaults}
              onSizeChange={handleSizeChange}
            />
          )}

          {activeTab === 'legal' && (
            <LegalHub key={legalSubTab} initialSubTab={legalSubTab} />
          )}
        </main>
      </div>

      {/* Footer bar */}
      <Footer onLegalNavigate={handleLegalNavigate} />
    </div>
  );
}
