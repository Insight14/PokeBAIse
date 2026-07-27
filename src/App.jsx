import React from 'react';
import { InventoryProvider, useInventory } from './context/InventoryContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { DeckRecommendations } from './components/DeckRecommendations.jsx';
import { CollectionChecklist } from './components/CollectionChecklist.jsx';
import { SubstitutionMatrix } from './components/SubstitutionMatrix.jsx';
import { CustomDeckBuilder } from './components/CustomDeckBuilder.jsx';
import { DeckDetailModal } from './components/DeckDetailModal.jsx';
import { Footer } from './components/Footer.jsx';
import './App.css';

function MainAppContent() {
  const { activeTab } = useInventory();

  return (
    <div className="app-shell">
      <Navbar />

      <main className="main-content">
        {activeTab === 'recommendations' && <DeckRecommendations />}
        {activeTab === 'checklist' && <CollectionChecklist />}
        {activeTab === 'matrix' && <SubstitutionMatrix />}
        {activeTab === 'sandbox' && <CustomDeckBuilder />}
      </main>

      <DeckDetailModal />

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <InventoryProvider>
      <MainAppContent />
    </InventoryProvider>
  );
}
