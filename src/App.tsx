import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { Dashboard } from '@/pages/Dashboard'

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header />
          
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<div>Projets - En développement</div>} />
              <Route path="/audit" element={<div>Audit SEO - En développement</div>} />
              <Route path="/performance" element={<div>Performance - En développement</div>} />
              <Route path="/competitors" element={<div>Concurrence - En développement</div>} />
              <Route path="/reports" element={<div>Rapports - En développement</div>} />
              <Route path="/team" element={<div>Équipe - En développement</div>} />
              <Route path="/settings" element={<div>Paramètres - En développement</div>} />
            </Routes>
          </main>
        </div>
      </div>
      
      <Toaster />
    </Router>
  )
}

export default App