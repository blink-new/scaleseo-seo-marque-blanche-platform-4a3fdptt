import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { Dashboard } from '@/pages/Dashboard'
import Projects from '@/pages/Projects'
import AuditSEO from '@/pages/AuditSEO'
import Performance from '@/pages/Performance'
import Reports from '@/pages/Reports'
import Competitive from '@/pages/Competitive'
import AgencySettings from '@/pages/AgencySettings'
import TeamManagement from '@/pages/TeamManagement'
import Automation from '@/pages/Automation'
import TestCenter from '@/pages/TestCenter'

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
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/audit" element={<AuditSEO />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/competitors" element={<Competitive />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/team" element={<TeamManagement />} />
              <Route path="/automation" element={<Automation />} />
              <Route path="/settings" element={<AgencySettings />} />
              <Route path="/test" element={<TestCenter />} />
            </Routes>
          </main>
        </div>
      </div>
      
      <Toaster />
    </Router>
  )
}

export default App