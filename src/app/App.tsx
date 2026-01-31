import { useState } from "react";
import { LandingPage } from "@/app/components/LandingPage";
import { LoginPage } from "@/app/components/LoginPage";
import { HealthInputPage } from "@/app/components/HealthInputPage";
import { DashboardPage } from "@/app/components/DashboardPage";
import { ChatPage } from "@/app/components/ChatPage";

type PageType = "landing" | "login" | "health-input" | "dashboard" | "chat";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("landing");

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return (
          <LandingPage
            onGetStarted={() => setCurrentPage("login")}
            onLogin={() => setCurrentPage("login")}
          />
        );
      case "login":
        return (
          <LoginPage
            onBack={() => setCurrentPage("landing")}
            onLogin={() => setCurrentPage("health-input")}
          />
        );
      case "health-input":
        return (
          <HealthInputPage
            onBack={() => setCurrentPage("login")}
            onSubmit={() => setCurrentPage("dashboard")}
          />
        );
      case "dashboard":
        return (
          <DashboardPage
            onBack={() => setCurrentPage("health-input")}
          />
        );
      case "chat":
        return (
          <ChatPage
            onBack={() => setCurrentPage("dashboard")}
          />
        );
      default:
        return (
          <LandingPage
            onGetStarted={() => setCurrentPage("login")}
            onLogin={() => setCurrentPage("login")}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {renderPage()}
      
      {/* Floating Navigation for logged-in users */}
      {(currentPage === "health-input" || currentPage === "dashboard" || currentPage === "chat") && (
        <>
          {/* Disclaimer Banner */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-2 px-4 text-center">
            <p className="text-xs sm:text-sm">
              ⓘ <strong>Medical Disclaimer:</strong> This is not a substitute for professional medical diagnosis. Always consult with a qualified healthcare provider.
            </p>
          </div>
          
          <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-2xl">
              <NavButton
                active={currentPage === "health-input"}
                onClick={() => setCurrentPage("health-input")}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
                label="Input"
              />
              <NavButton
                active={currentPage === "dashboard"}
                onClick={() => setCurrentPage("dashboard")}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                }
                label="Dashboard"
              />
              <NavButton
                active={currentPage === "chat"}
                onClick={() => setCurrentPage("chat")}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                }
                label="Chat"
              />
            </div>
          </nav>
        </>
      )}
    </div>
  );
}

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function NavButton({ active, onClick, icon, label }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
        active
          ? "bg-gradient-to-r from-[#1E88E5] to-[#26A69A] text-white shadow-lg shadow-blue-500/30"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span className={`text-sm ${active ? "font-medium" : ""}`}>{label}</span>
    </button>
  );
}