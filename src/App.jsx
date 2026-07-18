import { Routes, Route } from 'react-router-dom'
import { useSheetData } from './hooks/useSheetData'
import { HomePage } from './pages/HomePage'
import { ChatPage } from './pages/ChatPage'
import { GuidePage } from './pages/GuidePage'
import { ExpeditionsPage } from './pages/ExpeditionsPage'
import { TrekMapPage } from './pages/TrekMapPage'
import { TravelPlannerPage } from './pages/TravelPlannerPage'

export default function App() {
  const { treks, itineraries, loading, error, lastUpdated } = useSheetData()

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage treks={treks} loading={loading} />} />
        <Route path="/chat" element={<ChatPage treks={treks} itineraries={itineraries} loading={loading} />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/expeditions" element={<ExpeditionsPage treks={treks} loading={loading} />} />
        <Route path="/trek/:slug/map" element={<TrekMapPage treks={treks} />} />
        <Route path="/trek/:slug/travel" element={<TravelPlannerPage treks={treks} />} />
      </Routes>

      {/* Global sync indicator — only on home page */}
      {lastUpdated && window.location.hash !== '#/chat' && (
        <div className="fixed bottom-3 left-3 z-50 font-mono text-[9px] uppercase tracking-widest text-ink/30 pointer-events-none">
          Live · synced {lastUpdated.toLocaleTimeString()}
        </div>
      )}
      {error && (
        <div className="fixed bottom-3 left-3 z-50 font-mono text-[9px] uppercase tracking-widest text-red-400 pointer-events-none">
          Sheet error: {error}
        </div>
      )}
    </>
  )
}
