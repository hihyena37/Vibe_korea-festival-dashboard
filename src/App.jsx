import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Toast from './components/Toast'
import useFestivals from './hooks/useFestivals'
import Calendar from './pages/Calendar'
import Favorites from './pages/Favorites'
import FestivalDetail from './pages/FestivalDetail'
import Festivals from './pages/Festivals'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Region from './pages/Region'
import { getTodayYmd } from './utils/date'

function App() {
  const { festivals, loading, error, reload } = useFestivals()
  const [today] = useState(getTodayYmd)

  return (
    <>
      <Header />
      <main className="main">
        <Routes>
          <Route
            path="/"
            element={
              <Home festivals={festivals} loading={loading} error={error} onRetry={reload} today={today} />
            }
          />
          <Route
            path="/festivals"
            element={
              <Festivals festivals={festivals} loading={loading} error={error} onRetry={reload} today={today} />
            }
          />
          <Route
            path="/region/:regionId"
            element={
              <Region festivals={festivals} loading={loading} error={error} onRetry={reload} today={today} />
            }
          />
          <Route
            path="/calendar"
            element={
              <Calendar festivals={festivals} loading={loading} error={error} onRetry={reload} today={today} />
            }
          />
          <Route path="/festival/:contentId" element={<FestivalDetail today={today} />} />
          <Route path="/favorites" element={<Favorites festivals={festivals} today={today} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Toast />
    </>
  )
}

export default App
