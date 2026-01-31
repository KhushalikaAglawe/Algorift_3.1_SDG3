import { motion, AnimatePresence } from "framer-motion"; // Note: Changed to 'framer-motion'
import { useState, useEffect, useRef } from "react";
import { 
  Send, Phone, Video, AlertCircle, Mic, Paperclip, CheckCheck,
  User, Bot, X, Shield, Crown, PhoneCall, Heart, Activity, Calendar, Clock
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";

// Types for Chatbot
interface Risk {
  type: 'HIGH' | 'MODERATE';
  title: string;
  description: string;
}

export function ChatPage({ onBack }: { onBack: () => void }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showSOS, setShowSOS] = useState(false);
  const [showConsent, setShowConsent] = useState(false);

  // --- CHATBOT LOGIC START ---
  const [userData, setUserData] = useState({
    weeksPregnant: null as number | null,
    age: null as number | null,
    bloodPressure: null as string | null,
    symptoms: [] as string[]
  });

  const assessRisk = (data: typeof userData) => {
    const risks: Risk[] = [];
    if (data.age && data.age > 35) {
      risks.push({ type: 'MODERATE', title: 'Advanced Age', description: 'Increased risk of gestational issues.' });
    }
    if (data.bloodPressure) {
      const [systolic] = data.bloodPressure.split('/').map(Number);
      if (systolic >= 140) risks.push({ type: 'HIGH', title: 'Hypertension', description: 'Potential preeclampsia risk.' });
    }
    return risks;
  };

  const extractData = (text: string) => {
    const updated = { ...userData };
    const weekMatch = text.match(/(\d+)\s*(weeks?|wk)/i);
    if (weekMatch) updated.weeksPregnant = parseInt(weekMatch[1]);

    const ageMatch = text.match(/(\d+)\s*(years?|yrs?)/i);
    if (ageMatch) updated.age = parseInt(ageMatch[1]);

    const bpMatch = text.match(/(\d+)\s*\/\s*(\d+)/);
    if (bpMatch) updated.bloodPressure = `${bpMatch[1]}/${bpMatch[2]}`;

    setUserData(updated);
    return updated;
  };

  // --- CHATBOT LOGIC END ---

  const sendMessage = () => {
    if (!message.trim()) return;

    const currentMsg = message;
    const userMsg = {
      id: messages.length + 1,
      sender: "user",
      text: currentMsg,
      time: "Just now",
      read: false
    };

    setMessages(prev => [...prev, userMsg]);
    setMessage("");

    // Process Chatbot Logic
    const updatedData = extractData(currentMsg);
    const risks = assessRisk(updatedData);

    setTimeout(() => {
      let botText = "I've updated your health profile. ";
      if (risks.length > 0) botText += `Warning: I detected ${risks.length} risk factors. Please check the SOS or Call Doctor button.`;
      
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: "intern",
        text: botText,
        time: "Just now",
        read: false
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-teal-50/30">
      {/* Header (As it was) */}
      <div className="sticky top-0 z-40 backdrop-blur-lg bg-white/80 border-b border-gray-200/50 p-4">
         <div className="flex justify-between items-center container mx-auto">
            <button onClick={onBack} className="text-[#1E88E5]">← Back</button>
            <div className="flex gap-2">
               <Button onClick={() => setShowSOS(true)} variant="destructive">SOS</Button>
               <Button onClick={() => setShowConsent(true)} className="bg-teal-600">Doctor Call</Button>
            </div>
         </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Main Chat (Column 1 & 2) */}
          <div className="lg:col-span-2 h-[80vh] bg-white rounded-3xl shadow-xl flex flex-col overflow-hidden">
             <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`p-4 rounded-2xl max-w-sm ${msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
             </div>
             <div className="p-4 border-t flex gap-2">
                <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type here..." rows={1} />
                <Button onClick={sendMessage}><Send /></Button>
             </div>
          </div>

          {/* Sidebar (Column 3) */}
          <div className="space-y-4">
            {/* LIVE HEALTH SUMMARY CARD */}
            <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-sm">
              <h3 className="font-bold flex items-center gap-2 mb-4">
                <Activity className="text-blue-600" /> Patient Summary
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-2xl">
                  <p className="text-xs text-gray-500">Gestation</p>
                  <p className="font-bold">{userData.weeksPregnant || '--'} Wks</p>
                </div>
                <div className="p-3 bg-teal-50 rounded-2xl">
                  <p className="text-xs text-gray-500">BP Status</p>
                  <p className="font-bold">{userData.bloodPressure || '--'}</p>
                </div>
              </div>
            </div>

            {/* Premium Card (As it was) */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-600 to-pink-500 text-white shadow-xl">
               <Crown className="mb-2" />
               <h3 className="font-bold">Premium Access</h3>
               <p className="text-xs opacity-80 mb-4">Unlock 24/7 specialist calls</p>
               <Button className="w-full bg-white text-purple-600">Upgrade Now</Button>
            </div>
          </div>

        </div>
      </div>
<AnimatePresence>
        {showVideoCall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50"
          >
            <div className="relative w-full h-full">
              {/* Doctor Video */}
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#1E88E5] to-[#26A69A] flex items-center justify-center mx-auto mb-4">
                    <User className="w-16 h-16" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Dr. Sarah Johnson</h3>
                  <p className="text-gray-400">Connecting...</p>
                </div>
              </div>

              {/* User Video (PIP) */}
              <div className="absolute top-6 right-6 w-48 h-36 rounded-2xl bg-gray-700 border-2 border-white/20 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              </div>

              {/* Controls */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
                <Button size="icon" className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-lg">
                  <Mic className="w-6 h-6 text-white" />
                </Button>
                <Button size="icon" className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-lg">
                  <Video className="w-6 h-6 text-white" />
                </Button>
                <Button 
                  size="icon" 
                  onClick={() => setShowVideoCall(false)}
                  className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700"
                >
                  <X className="w-6 h-6 text-white" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

const initialMessages = [
  { id: 1, sender: "intern", text: "Hello! Share your pregnancy week, age, or BP for a risk check.", time: "10:30 AM", read: true }
];