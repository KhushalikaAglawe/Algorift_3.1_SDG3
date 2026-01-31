import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { 
  Send, 
  Phone, 
  Video, 
  AlertCircle,
  Mic,
  Paperclip,
  CheckCheck,
  User,
  Bot,
  X,
  Shield,
  Crown,
  PhoneCall
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";

interface ChatPageProps {
  onBack: () => void;
}

export function ChatPage({ onBack }: ChatPageProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showSOS, setShowSOS] = useState(false);
  const [showConsent, setShowConsent] = useState(false);

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        sender: "user",
        text: message,
        time: "Just now",
        read: false
      }]);
      setMessage("");
      
      // Simulate response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: "intern",
          text: "I've reviewed your message. Based on your symptoms, I recommend monitoring your condition. Would you like to schedule a video consultation with a doctor?",
          time: "Just now",
          read: false
        }]);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-teal-50/30">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-lg bg-white/80 border-b border-gray-200/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="text-[#1E88E5] hover:text-[#1565C0]"
              >
                ← Back
              </button>
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 border-2 border-[#26A69A]">
                  <AvatarFallback className="bg-gradient-to-br from-[#1E88E5] to-[#26A69A] text-white">
                    MI
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-bold">Medical Intern</h2>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm text-gray-600">Online</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowSOS(true)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-6 rounded-xl shadow-lg shadow-red-500/30"
              >
                <AlertCircle className="w-5 h-5 sm:mr-2" />
                <span className="hidden sm:inline">SOS</span>
              </Button>
              <Button
                onClick={() => setShowConsent(true)}
                className="bg-gradient-to-r from-[#1E88E5] to-[#26A69A] hover:opacity-90 text-white px-4 sm:px-6 rounded-xl"
              >
                <Video className="w-5 h-5 sm:mr-2" />
                <span className="hidden sm:inline">Doctor Call</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Chat */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-lg overflow-hidden flex flex-col h-[calc(100vh-200px)]">
                {/* Messages */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarFallback className={msg.sender === "user" 
                          ? "bg-[#1E88E5] text-white" 
                          : "bg-[#26A69A] text-white"}>
                          {msg.sender === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`flex-1 max-w-md ${msg.sender === "user" ? "items-end" : "items-start"} flex flex-col`}>
                        <div className={`px-4 py-3 rounded-2xl ${
                          msg.sender === "user" 
                            ? "bg-gradient-to-r from-[#1E88E5] to-[#26A69A] text-white rounded-tr-none" 
                            : "bg-gray-100 text-gray-900 rounded-tl-none"
                        }`}>
                          <p className="text-sm">{msg.text}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1 px-2">
                          <span className="text-xs text-gray-500">{msg.time}</span>
                          {msg.sender === "user" && (
                            <CheckCheck className="w-3 h-3 text-[#26A69A]" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-200/50 bg-white/50">
                  <div className="flex items-end gap-3">
                    <Button size="icon" variant="ghost" className="rounded-xl hover:bg-gray-100 flex-shrink-0">
                      <Paperclip className="w-5 h-5 text-gray-600" />
                    </Button>
                    <Textarea
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                      className="min-h-12 max-h-32 resize-none rounded-xl bg-gray-50 border-gray-200 focus:border-[#1E88E5]"
                      rows={1}
                    />
                    <Button size="icon" variant="ghost" className="rounded-xl hover:bg-gray-100 flex-shrink-0">
                      <Mic className="w-5 h-5 text-gray-600" />
                    </Button>
                    <Button 
                      onClick={sendMessage}
                      className="bg-gradient-to-r from-[#1E88E5] to-[#26A69A] hover:opacity-90 text-white rounded-xl px-6 flex-shrink-0"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Premium Features */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative p-6 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 text-white shadow-2xl overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <div className="flex items-start gap-3 mb-4">
                    <Crown className="w-8 h-8 flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">Upgrade to Premium</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-400 text-purple-900 font-bold">SAVE 30%</span>
                      </div>
                      <p className="text-sm text-white/90">Unlock doctor video consultations & 24/7 support</p>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>24/7 Doctor availability</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Priority response time (&lt;5min)</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Unlimited video consultations</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Advanced AI health insights</span>
                    </li>
                  </ul>
                  <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm mb-4 text-center">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-3xl font-bold">$29</span>
                      <span className="text-sm text-white/70">/month</span>
                    </div>
                    <p className="text-xs text-white/70 mt-1">First month free trial</p>
                  </div>
                  <Button className="w-full bg-white text-purple-600 hover:bg-gray-100 font-bold shadow-lg">
                    Start Free Trial →
                  </Button>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-lg"
              >
                <h3 className="font-bold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start border-[#1E88E5] text-[#1E88E5] hover:bg-blue-50">
                    <Phone className="w-4 h-4 mr-2" />
                    Request Call Back
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-[#26A69A] text-[#26A69A] hover:bg-teal-50">
                    <Paperclip className="w-4 h-4 mr-2" />
                    Share Reports
                  </Button>
                </div>
              </motion.div>

              {/* Support Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-2xl bg-blue-50 border border-blue-200"
              >
                <h3 className="font-bold mb-2 text-[#1E88E5]">Need Urgent Help?</h3>
                <p className="text-sm text-gray-600 mb-3">
                  For medical emergencies, use the SOS button or call emergency services
                </p>
                <p className="text-sm font-medium text-[#1E88E5]">Emergency: 911</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* SOS Modal */}
      <AnimatePresence>
        {showSOS && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSOS(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-10 h-10 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Emergency SOS</h2>
                <p className="text-gray-600 mb-6">
                  This will immediately alert our medical team and emergency contacts. 
                  Use only for genuine medical emergencies.
                </p>
                <div className="space-y-3">
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-6 rounded-xl">
                    <PhoneCall className="w-5 h-5 mr-2" />
                    Activate Emergency SOS
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowSOS(false)}
                    className="w-full py-6 rounded-xl"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Consent Modal */}
      <AnimatePresence>
        {showConsent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowConsent(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-[#1E88E5]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Consent for Video Consultation</h2>
                  <p className="text-sm text-gray-600">
                    Please review and agree to the following before proceeding
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" defaultChecked />
                  <p className="text-sm text-gray-700">
                    I consent to share my health records and medical history with the consulting doctor
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" defaultChecked />
                  <p className="text-sm text-gray-700">
                    I understand that this is a telemedicine consultation and may have limitations
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" defaultChecked />
                  <p className="text-sm text-gray-700">
                    I agree to the privacy policy and terms of service
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" defaultChecked />
                  <p className="text-sm text-gray-700">
                    I authorize recording of this consultation for medical records (optional)
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={() => {
                    setShowConsent(false);
                    setShowVideoCall(true);
                  }}
                  className="w-full bg-gradient-to-r from-[#1E88E5] to-[#26A69A] hover:opacity-90 text-white py-6 rounded-xl"
                >
                  <Video className="w-5 h-5 mr-2" />
                  I Agree - Start Video Call
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowConsent(false)}
                  className="w-full py-6 rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Call Modal */}
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
  {
    id: 1,
    sender: "intern",
    text: "Hello! I'm your medical intern assistant. How can I help you today?",
    time: "10:30 AM",
    read: true
  },
  {
    id: 2,
    sender: "user",
    text: "Hi, I've been experiencing some mild headaches for the past few days.",
    time: "10:32 AM",
    read: true
  },
  {
    id: 3,
    sender: "intern",
    text: "I understand. Can you tell me more about the headaches? When do they typically occur and how severe are they on a scale of 1-10?",
    time: "10:33 AM",
    read: true
  },
  {
    id: 4,
    sender: "user",
    text: "They usually happen in the afternoon, around 3-4 PM. I'd say they're about a 5 or 6 out of 10. Not severe but uncomfortable.",
    time: "10:35 AM",
    read: true
  }
];