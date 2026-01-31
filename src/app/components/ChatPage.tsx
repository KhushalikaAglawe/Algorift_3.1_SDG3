"use client";

import { useState } from "react";
import { Send, User, Bot, Paperclip } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";

type Message = {
  id: number;
  sender: "user" | "doctor" | "ai";
  text: string;
};

export default function ChatPage({ onBack }: { onBack: () => void }) {
  const [doctorInput, setDoctorInput] = useState("");
  const [aiInput, setAiInput] = useState("");

  const [doctorMessages, setDoctorMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "doctor",
      text: "Hello, I’m your doctor. How can I help you?",
    },
  ]);

  const [aiMessages, setAiMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      text: "Hi 👋 I’m your AI health assistant.",
    },
  ]);

  // 📄 Handle PDF Upload (Doctor)
  const handleDoctorPDF = (file: File) => {
    setDoctorMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "user",
        text: `📄 Uploaded PDF: ${file.name}`,
      },
      {
        id: Date.now() + 1,
        sender: "doctor",
        text: "I’ve received your document. I’ll review it.",
      },
    ]);
  };

  // 📄 Handle PDF Upload (AI)
  const handleAiPDF = (file: File) => {
    setAiMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "user",
        text: `📄 Uploaded PDF: ${file.name}`,
      },
      {
        id: Date.now() + 1,
        sender: "ai",
        text: "I’ve received the PDF. I can help analyze it.",
      },
    ]);
  };

  const sendDoctorMessage = () => {
    if (!doctorInput.trim()) return;

    setDoctorMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text: doctorInput },
      {
        id: Date.now() + 1,
        sender: "doctor",
        text: "I understand. Please monitor your symptoms.",
      },
    ]);

    setDoctorInput("");
  };

  const sendAiMessage = () => {
    if (!aiInput.trim()) return;

    setAiMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text: aiInput },
      {
        id: Date.now() + 1,
        sender: "ai",
        text: "Thanks for sharing. Stay healthy and monitor vitals.",
      },
    ]);

    setAiInput("");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-8">
      {/* Top Bar */}
      <Button variant="ghost" onClick={onBack} className="text-blue-600">
        Back
      </Button>

      {/* Doctor Chat */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <User className="text-blue-600" /> Doctor Chat
        </h2>

        <div className="h-64 overflow-y-auto space-y-3 mb-3">
          {doctorMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div className="px-4 py-2 rounded-lg max-w-xs bg-gray-100">
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 items-center">
          <label className="cursor-pointer">
            <Paperclip />
            <input
              type="file"
              accept="application/pdf"
              hidden
              onChange={(e) =>
                e.target.files && handleDoctorPDF(e.target.files[0])
              }
            />
          </label>

          <Textarea
            placeholder="Message doctor..."
            value={doctorInput}
            onChange={(e) => setDoctorInput(e.target.value)}
          />
          <Button onClick={sendDoctorMessage}>
            <Send />
          </Button>
        </div>
      </div>

      {/* AI Chat */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <Bot className="text-green-600" /> AI Health Chat
        </h2>

        <div className="h-64 overflow-y-auto space-y-3 mb-3">
          {aiMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div className="px-4 py-2 rounded-lg max-w-xs bg-gray-100">
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 items-center">
          <label className="cursor-pointer">
            <Paperclip />
            <input
              type="file"
              accept="application/pdf"
              hidden
              onChange={(e) =>
                e.target.files && handleAiPDF(e.target.files[0])
              }
            />
          </label>

          <Textarea
            placeholder="Ask AI..."
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
          />
          <Button onClick={sendAiMessage}>
            <Send />
          </Button>
        </div>
      </div>
    </div>
  );
}
