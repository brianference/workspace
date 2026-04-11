import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './tokens.css'
import { FeedPage } from './pages/FeedPage'
import { HistoryPage } from './pages/HistoryPage'
import { SettingsPage } from './pages/SettingsPage'

/**
 * Root component with client-side routing.
 * / -> Feed, /history -> History, /settings -> Settings
 */
function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--bg)',
        }}
      >
        <Routes>
          <Route path="/" element={<FeedPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
