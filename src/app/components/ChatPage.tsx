"use client";

import { useState, useEffect } from "react";
import { db, auth } from "../../firebase"; 
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { Send, User, Bot, Paperclip } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";

// Type definition
type Message = {
  id: string | number;
  sender: "user" | "doctor" | "ai";
  text: string;
  timestamp?: any;
};

export default function ChatPage({ onBack }: { onBack: () => void }) {
  const [doctorInput, setDoctorInput] = useState("");
  const [aiInput, setAiInput] = useState("");
  const [doctorMessages, setDoctorMessages] = useState<Message[]>([]);
  const [aiMessages, setAiMessages] = useState<Message[]>([
    { id: 1, sender: "ai", text: "Hi 👋 I’m your AI health assistant." },
  ]);

  // --- BACKEND CHAT LOGIC (Realtime) ---
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "chats", user.uid, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      
      if (msgs.length > 0) {
        setDoctorMessages(msgs);
      } else {
        // Default message if DB is empty
        setDoctorMessages([{ id: 'def', sender: 'doctor', text: 'Hello, I’m your doctor. How can I help you?' }]);
      }
    });

    return () => unsubscribe();
  }, []);

  const sendDoctorMessage = async () => {
    if (!doctorInput.trim()) return;
    const user = auth.currentUser;
    if (!user) { alert("Please login first"); return; }

    const chatRef = collection(db, "chats", user.uid, "messages");
    const textToSend = doctorInput;
    setDoctorInput(""); 

    try {
      await addDoc(chatRef, {
        sender: "user",
        text: textToSend,
        timestamp: serverTimestamp(),
      });

      // Simulated Doctor Response
      setTimeout(async () => {
        await addDoc(chatRef, {
          sender: "doctor",
          text: "I have received your query regarding your pregnancy vitals. I'm reviewing them now.",
          timestamp: serverTimestamp(),
        });
      }, 2000);
    } catch (e) {
      console.error("Error sending message:", e);
    }
  };

  const sendAiMessage = () => {
    if (!aiInput.trim()) return;
    setAiMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text: aiInput },
      { id: Date.now() + 1, sender: "ai", text: "Thanks for sharing. I'm analyzing your maternity data." },
    ]);
    setAiInput("");
  };

  const handleDoctorPDF = async (file: File) => {
    const user = auth.currentUser;
    if (!user) return;
    await addDoc(collection(db, "chats", user.uid, "messages"), {
      sender: "user",
      text: `📄 Document: ${file.name} (Uploaded)`,
      timestamp: serverTimestamp(),
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-8">
      <Button variant="ghost" onClick={onBack} className="text-blue-600">Back</Button>

      {/* Doctor Chat */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <User className="text-blue-600" /> Doctor Chat
        </h2>
        <div className="h-64 overflow-y-auto space-y-3 mb-3 p-2 border rounded-lg bg-slate-50">
          {doctorMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`px-4 py-2 rounded-lg max-w-xs ${msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <label className="cursor-pointer"><Paperclip /><input type="file" hidden onChange={(e) => e.target.files && handleDoctorPDF(e.target.files[0])} /></label>
          <Textarea placeholder="Message doctor..." value={doctorInput} onChange={(e) => setDoctorInput(e.target.value)} />
          <Button onClick={sendDoctorMessage}><Send /></Button>
        </div>
      </div>

      {/* AI Chat */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-3 flex items-center gap-2"><Bot className="text-green-600" /> AI Health Chat</h2>
        <div className="h-64 overflow-y-auto space-y-3 mb-3 p-2 border rounded-lg bg-slate-50">
          {aiMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`px-4 py-2 rounded-lg max-w-xs ${msg.sender === "user" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-800"}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <Textarea placeholder="Ask AI..." value={aiInput} onChange={(e) => setAiInput(e.target.value)} />
          <Button onClick={sendAiMessage}><Send /></Button>
        </div>
      </div>
    </div>
  );
}