import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth, db } from "../../firebase";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Heart, Mail, Lock, User, Globe, CreditCard, ArrowLeft, Briefcase } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Switch } from "@/app/components/ui/switch";
import { doc, setDoc } from "firebase/firestore";

interface LoginPageProps {
  onBack: () => void;
  onLogin: () => void;
}

export function LoginPage({ onBack, onLogin }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("English");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    age: "",
    phone: "",
    abhaId: "",
    role: "patient" 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const email = formData.email.trim();

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        await signInWithEmailAndPassword(auth, email, formData.password);
        onLogin();
      } else {
        // --- SIGNUP LOGIC (Atomic Sync) ---
        const userCredential = await createUserWithEmailAndPassword(auth, email, formData.password);
        const user = userCredential.user;

        // Writing to Firestore using the Auth UID
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: formData.name.trim(),
          email: email,
          age: formData.age || "N/A",
          phone: formData.phone || "N/A",
          abhaId: formData.abhaId || "N/A",
          role: formData.role,
          createdAt: new Date().toISOString()
        });

        onLogin();
      }
    } catch (error: any) {
      console.error("Backend Error:", error.code);
      // Let Firebase handle the "xyz" or bad email errors naturally
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email.includes("@")) {
      alert("Pehle email enter karein.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, formData.email);
      alert("Reset link sent!");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-teal-50/30 flex items-center justify-center p-4">
      {/* Back Button - EXACT ORIGINAL */}
      <motion.button
        onClick={onBack}
        className="fixed top-6 left-6 p-3 rounded-xl bg-white/80 backdrop-blur-lg border border-gray-200/50 hover:bg-white hover:shadow-lg transition-all z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="w-5 h-5 text-gray-700" />
      </motion.button>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Branding Section - EXACT ORIGINAL */}
        <motion.div
          className="hidden lg:block"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E88E5] to-[#26A69A] flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-[#1E88E5] to-[#26A69A] bg-clip-text text-transparent">
              HealthBridge 3.0
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            Your Health,<br />
            <span className="bg-gradient-to-r from-[#1E88E5] to-[#26A69A] bg-clip-text text-transparent">Our Priority</span>
          </h1>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="p-4 rounded-2xl bg-white/80 border border-gray-200/50 shadow-sm"
                whileHover={{ y: -5 }}
              >
                <div className="text-2xl font-bold text-[#1E88E5] mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Form Section - EXACT ORIGINAL */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="p-8 sm:p-10 rounded-3xl bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-2xl">
            <div className="flex items-center justify-between mb-6 p-3 rounded-xl bg-gray-50">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Globe className="w-4 h-4" /> Language
              </div>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-sm font-medium text-[#1E88E5] outline-none cursor-pointer"
              >
                <option>English</option>
                <option>हिंदी</option>
              </select>
            </div>

            <div className="flex gap-2 mb-8 p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                  isLogin ? "bg-white text-[#1E88E5] shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                  !isLogin ? "bg-white text-[#1E88E5] shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div className="space-y-2">
                      <Label className="text-gray-700">Account Type</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="w-full pl-11 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-[#1E88E5]/20 transition-all text-gray-700"
                        >
                          <option value="patient">Patient / Normal User</option>
                          <option value="doctor">Doctor / Intern</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="pl-11 py-6 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-all"
                          required={!isLogin}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label className="text-gray-700">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-11 py-6 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-11 py-6 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-700">Age</Label>
                      <Input
                        type="number"
                        placeholder="Age"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="py-6 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700">Phone</Label>
                      <Input
                        type="tel"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="py-6 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">ABHA ID (Optional)</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        placeholder="XX-XXXX-XXXX-XXXX"
                        value={formData.abhaId}
                        onChange={(e) => setFormData({ ...formData, abhaId: e.target.value })}
                        className="pl-11 py-6 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <Switch className="data-[state=checked]:bg-[#1E88E5]" />
                    <span className="text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
                  </label>
                  <button 
                    type="button" 
                    onClick={handleForgotPassword}
                    className="text-[#1E88E5] font-medium hover:text-[#1976D2] transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#1E88E5] to-[#26A69A] hover:from-[#1976D2] hover:to-[#00897B] text-white py-6 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? "Please wait..." : isLogin ? "Login to Dashboard" : "Create Account"}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const stats = [
  { value: "50K+", label: "Active Users" },
  { value: "98%", label: "Accuracy Rate" },
  { value: "24/7", label: "Medical Support" },
  { value: "500+", label: "Verified Doctors" },
];