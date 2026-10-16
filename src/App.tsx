import React, { useState } from 'react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { QuickActionModal } from './components/modals/QuickActionModal';
import { RecruitClientModal } from './components/modals/RecruitClientModal';
import { GemForgeModal } from './components/modals/GemForgeModal';
import { TrashCanModal } from './components/modals/TrashCanModal';
import { FloatingQuickActionButton } from './components/common/FloatingQuickActionButton';
import { ToastContainer } from './components/common/ToastContainer';

// Views
import { CommandCenterView } from './views/CommandCenterView';
import { ClientsView } from './views/ClientsView';
import { ClientHQView } from './views/ClientHQView';
import { ProjectsView } from './views/ProjectsView';
import { TasksView } from './views/TasksView';
import { LeadsView } from './views/LeadsView';
import { TreasuryView } from './views/TreasuryView';
import { InvoicesView } from './views/InvoicesView';
import { DocumentsView } from './views/DocumentsView';
import { HostingView } from './views/HostingView';
import { CommunicationsView } from './views/CommunicationsView';
import { CalendarView } from './views/CalendarView';
import { AnalyticsView } from './views/AnalyticsView';
import { SettingsView } from './views/SettingsView';

const DashboardContent: React.FC = () => {
  const { activeView } = useDashboard();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeView) {
      case 'command-center':
        return <CommandCenterView />;
      case 'clients':
        return <ClientsView />;
      case 'client-hq':
        return <ClientHQView />;
      case 'projects':
        return <ProjectsView />;
      case 'tasks':
        return <TasksView />;
      case 'leads':
        return <LeadsView />;
      case 'treasury':
        return <TreasuryView />;
      case 'invoices':
        return <InvoicesView />;
      case 'documents':
        return <DocumentsView />;
      case 'hosting':
        return <HostingView />;
      case 'communications':
        return <CommunicationsView />;
      case 'calendar':
        return <CalendarView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <CommandCenterView />;
    }
  };

  return (
    <div className="h-screen h-[100dvh] w-full max-w-full overflow-hidden bg-[#0B0F17] text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header 
        onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)} 
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <div className="flex-1 flex w-full max-w-[1920px] mx-auto min-w-0 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar 
          isMobileMenuOpen={isMobileMenuOpen}
          onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Workspace Viewport */}
        <main className="flex-1 h-full w-full min-w-0 overflow-y-auto p-3.5 sm:p-5 lg:p-7 xl:p-8 bg-[#0B0F17] relative">
          <div className="max-w-7xl mx-auto w-full min-w-0">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Floating Speed-Dial Button */}
      <FloatingQuickActionButton />

      {/* Modals & Overlays */}
      <GlobalSearchModal />
      <QuickActionModal />
      <RecruitClientModal />
      <GemForgeModal />
      <TrashCanModal />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}

export default App;
