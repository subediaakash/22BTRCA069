import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ShortenPage from './pages/Shorten'
import StatsPage from './pages/Stats'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ShortenPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
