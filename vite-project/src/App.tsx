import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Editor from './pages/Editor'
import Clientversion from './pages/Clientversion'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/client-editor" element={<Clientversion />} />
      </Routes>
    </BrowserRouter>
  )
}
