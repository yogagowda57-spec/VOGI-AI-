import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import UploadSystem from "./components/UploadSystem";
import StudioWorkspace from "./components/StudioWorkspace";
import ThreeAvatar from "./components/ThreeAvatar";
import AIStylist from "./components/AIStylist";
import ARMirror from "./components/ARMirror";
import { UserSilhouette, ClothingItem } from "./types";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("landing");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // Core selections (Loaded with beautiful high-end default presets so the user can interact immediately)
  const [silhouette, setSilhouette] = useState<UserSilhouette | null>({
    id: "s1",
    label: "Front",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500"
  });
  
  const [clothingItem, setClothingItem] = useState<ClothingItem | null>({
    id: "c1",
    name: "Premium Cashmere Trench",
    category: "jacket",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500",
    color: "#8E755D",
    price: "$299",
    rating: 4.9,
    occasion: ["Winter", "Casual", "Office"]
  });

  // Local persistent tables
  const [history, setHistory] = useState<any[]>([
    {
      url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500",
      clothingName: "Premium Cashmere Trench",
      confidence: 96,
      background: "studio",
      timestamp: "10:24 AM"
    }
  ]);
  
  const [favorites, setFavorites] = useState<ClothingItem[]>([
    {
      id: "c3",
      name: "Silk Drapery Halter Gown",
      category: "dress",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
      color: "#EED9B3",
      price: "$420",
      rating: 5.0,
      occasion: ["Wedding", "Evening"]
    }
  ]);

  const [savedLooks, setSavedLooks] = useState<any[]>([]);

  // Smooth scroll configuration or background theme body sync
  useEffect(() => {
    const body = document.body;
    if (isDarkMode) {
      body.classList.add("bg-black");
      body.classList.remove("bg-neutral-50");
    } else {
      body.classList.add("bg-neutral-50");
      body.classList.remove("bg-black");
    }
  }, [isDarkMode]);

  const handleLoginSuccess = (loggedInUser: { name: string; email: string }) => {
    setUser({ ...loggedInUser, premium: true });
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleAddToHistory = (look: any) => {
    setHistory((prev) => [look, ...prev]);
  };

  const handleAddToFavorites = (item: ClothingItem) => {
    setFavorites((prev) => {
      const exists = prev.find(f => f.id === item.id);
      if (exists) {
        return prev.filter(f => f.id !== item.id);
      }
      return [item, ...prev];
    });
  };

  const handleSelectRecent = (look: any) => {
    // Locate the clothing preset
    setClothingItem({
      id: "look_" + Date.now(),
      name: look.clothingName,
      category: "shirt",
      image: look.url,
      color: "#4F46E5",
      price: "$120",
      rating: 5.0
    });
    setCurrentTab("tryon");
  };

  return (
    <div className={`min-h-screen pb-16 transition-colors duration-500 overflow-x-hidden ${
      isDarkMode ? "bg-black text-white" : "bg-neutral-50 text-neutral-900"
    }`}>
      {/* Sleek Floating Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={() => setIsDarkMode(!isDarkMode)}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Tab Render */}
      <main className="pt-6 relative z-10">
        {currentTab === "landing" && (
          <LandingPage
            setCurrentTab={setCurrentTab}
            isDarkMode={isDarkMode}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {currentTab === "dashboard" && (
          <Dashboard
            isDarkMode={isDarkMode}
            savedLooks={savedLooks}
            favorites={favorites}
            history={history}
            setCurrentTab={setCurrentTab}
            onSelectRecent={handleSelectRecent}
          />
        )}

        {currentTab === "tryon" && (
          <div className="space-y-6">
            {/* Input upload panel */}
            <UploadSystem
              isDarkMode={isDarkMode}
              onSetSilhouette={setSilhouette}
              onSetClothingItem={setClothingItem}
              currentSilhouette={silhouette}
              currentClothingItem={clothingItem}
            />

            {/* AI Studio processing canvas */}
            <StudioWorkspace
              isDarkMode={isDarkMode}
              silhouette={silhouette}
              clothingItem={clothingItem}
              onAddToHistory={handleAddToHistory}
              onAddToFavorites={handleAddToFavorites}
              favorites={favorites}
            />
          </div>
        )}

        {currentTab === "avatar" && (
          <ThreeAvatar
            isDarkMode={isDarkMode}
            userSilhouette={silhouette}
          />
        )}

        {currentTab === "stylist" && (
          <AIStylist
            isDarkMode={isDarkMode}
          />
        )}

        {currentTab === "armirror" && (
          <ARMirror
            isDarkMode={isDarkMode}
          />
        )}
      </main>

      {/* Global Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
