"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase"; 
import { doc, getDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "motion/react";
import { 
  TrendingUp, AlertTriangle, Trophy, Heart, Activity, Brain, Pill, 
  FileText, ArrowRight, Sparkles, CheckCircle, Crown, Lock, X 
} from "lucide-react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Button } from "@/app/components/ui/button";

const LOCAL_KEY = "userHealth";

interface DashboardPageProps {
  onBack: () => void;
}

export function DashboardPage({ onBack }: DashboardPageProps) {
  // --- AI DATA STATE (Intelligence yahan store hogi) ---
  const [aiData, setAiData] = useState({
    possibility: "Analyzing Vitals...",
    guidance: ["Predicting next steps...", "Analyzing symptoms...", "Checking history..."],
    specialist: "General Physician"
  });

  const isPremiumUnlocked = false; // Isse error chala jayega
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [medicines, setMedicines] = useState([{ id: 1, name: "Multi-Vitamin", time: "06:00" }]);
  const [showRoutine, setShowRoutine] = useState(false);
  const [activeRoutine, setActiveRoutine] = useState("");

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const saved = localStorage.getItem(LOCAL_KEY);
        let currentData = saved ? JSON.parse(saved) : null;

        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "healthData", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            currentData = docSnap.data();
            setHealthData(currentData);
            localStorage.setItem(LOCAL_KEY, JSON.stringify(currentData));
          }
        }
        
        // Data aate hi AI ko call karo
        if (currentData) getClinicalIntelligence(currentData);
        
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHealthData();
  }, []);

  // ... (Baaki saara code dynamicHealthStats wagera waisa hi rahega)

 useEffect(() => {
  const timer = setInterval(() => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    medicines.forEach((med) => {
      if (med.time === currentTime) {
        alert(`🚨 TIME FOR MEDICATION: Please take your ${med.name}`);
      }
    });
  }, 60000);

  return () => clearInterval(timer);
}, [medicines]);

  const data = healthData;
  
  // --- NEW CRITICAL LOGIC START ---
  const sugarVal = Number(data?.bloodSugar) || 0;
  const bpSys = Number(data?.bpSystolic) || 0;

  const isSugarEmergency = sugarVal > 0 && sugarVal < 70; 
  const isSugarHigh = sugarVal > 140;
  
  const isBPEmergency = bpSys > 0 && bpSys < 90; 
  const isBPHigh = bpSys > 130;

  const progressValue = (isSugarEmergency || isBPEmergency) ? 20 : 76;
  const currentStreak = data?.streakCount || 0;
  // --- NEW CRITICAL LOGIC END ---

const getDetailedAnalysis = () => {
    if (!data) return "Please enter your vitals to monitor your pregnancy journey.";
    let analysis = [];
    const weeks = Number(data?.weeksPregnant) || 0;
    if (sugarVal > 0 && sugarVal < 70) {
      analysis.push("🚨 EMERGENCY: Low sugar detected. Have a fruit juice immediately.");
    } else if (isSugarHigh) {
      analysis.push("⚠️ GESTATIONAL SUGAR: Your levels are above 95. Focus on protein-rich snacks.");
    } else {
      analysis.push("✅ Blood sugar is stable for baby's growth.");
    }
    if (bpSys > 0 && bpSys < 90) {
      analysis.push("🚨 EMERGENCY: Critically low BP. Lie on your left side and call your doctor.");
    } else if (isBPHigh) {
      analysis.push("⚠️ BP ALERT: High BP detected. This could be a Preeclampsia sign; please rest.");
    } else {
      analysis.push("✅ Blood pressure is optimal for placental flow.");
    }
    if (weeks > 0) {
      analysis.push(`✨ Update: You are in Week ${weeks}. Ensure you feel baby movements regularly.`);
    }
    return analysis.join(" ");
  };


  const getClinicalIntelligence = async (data: any) => {
    try {
      const response = await fetch('/api/medical-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sugar: data.bloodSugar,
          bp: `${data.bpSystolic}/${data.bpDiastolic}`,
          symptoms: data.symptoms || "None reported",
          age: data.age || 25,
          weeksPregnant: data.weeksPregnant || 0, // 👈 Added this
          isMaternity: true // 👈 Added this
        })
      });
      const result = await response.json();
      setAiData({
        possibility: result.prediction,
        guidance: result.steps,
        specialist: result.specialist || "Obstetrician/Gynecologist" // Defaulting to OB-GYN
      });
    } catch (err) {
      console.error("AI Logic failed");
    }
  };

  const getPredictiveLogic = () => {
    if (!data) return { p: "No Data", g: ["Waiting..."], s: "General Physician" };

    if (isSugarEmergency) {
      return {
        p: "🚨 HYPOGLYCEMIC SHOCK RISK",
        g: ["Eat 15g sugar/honey immediately", "Lie down with feet elevated", "Call ambulance if dizzy"],
        s: "ER ENDOCRINOLOGIST"
      };
    }

    if (isBPEmergency) {
      return {
        p: "🚨 HYPOTENSIVE CRISIS",
        g: ["Drink 500ml ORS/Salt water", "Do not stand up suddenly", "Check heart rate"],
        s: "CARDIOLOGIST"
      };
    }

    return {
      p: aiData.possibility,
      g: aiData.guidance,
      s: aiData.specialist
    };
  };

  const finalAnalysis = getPredictiveLogic();

  const dynamicAchievements = [
    { icon: "🏃", label: `${currentStreak} Day Streak`, desc: currentStreak >= 7 ? "Champion Status!" : "Logged daily" },
    { icon: "💪", label: "Health Hero", desc: "Goals achieved" },
    { icon: "⭐", label: "Rising Star", desc: "Top 10% users" }
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E88E5]"></div>
    </div>
  );

  const getActionAdvice = () => {
    if (!data) return "Keep tracking your vitals daily for a healthy pregnancy.";
    
    const sugar = Number(data.bloodSugar);
    const bps = Number(data.bpSystolic);
    const bpd = Number(data.bpDiastolic);

    // 1. Absolute Emergency Cases (Maternity Critical)
    if ((sugar > 0 && sugar < 60) || bps > 170 || bps < 80) {
      return "🚨 EMERGENCY: Immediate hospital visit required. Contact your Obstetrician NOW.";
    }

    // 2. High Risk Preeclampsia / Gestational Diabetes
    if (bps >= 140 || bpd >= 90) {
      return "⚠️ RISK: High BP detected. Rest on your left side, avoid salt, and book an urgent OB-GYN consult.";
    }
    
    if (sugar > 95) {
      return "⚠️ DIET ALERT: Sugar levels are high for pregnancy. Switch to high-protein, zero-sugar meals.";
    }

    // 3. Normal / Stable
    return "✨ Everything looks great! Maintain hydration and don't miss your prenatal vitamins.";
  };

  const dynamicHealthStats = [
    {
      icon: <Activity className="w-6 h-6 text-[#1E88E5]" />,
      label: "Blood Sugar",
      value: data?.bloodSugar || "0",
      unit: "mg/dL",
      status: isSugarEmergency ? "CRITICAL LOW" : isSugarHigh ? "High" : "Normal",
      statusColor: (isSugarEmergency || isSugarHigh) 
        ? "bg-red-600 text-white border-red-800 animate-pulse" 
        : "bg-green-100 text-green-700 border-green-300",
      bgColor: "bg-blue-100",
      trend: isSugarEmergency ? "down" : "up",
      trendValue: "Live" // Added this to fix your previous error
    },
    {
      icon: <Heart className="w-6 h-6 text-red-500" />,
      label: "Blood Pressure",
      value: data ? `${data.bpSystolic}/${data.bpDiastolic}` : "0/0",
      unit: "mmHg",
      status: isBPEmergency ? "LOW RISK" : isBPHigh ? "Elevated" : "Normal",
      statusColor: (isBPEmergency || isBPHigh)
        ? "bg-red-600 text-white border-red-800 animate-bounce" 
        : "bg-green-100 text-green-700 border-green-300",
      bgColor: "bg-red-100",
      trend: isBPEmergency ? "down" : "stable",
      trendValue: "Live" // Added this to fix your previous error
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-[#26A69A]" />,
      label: "BMI",
      value: data?.bmi || "0",
      unit: "kg/m²",
      status: Number(data?.bmi) > 25 ? "High" : "Healthy",
      statusColor: Number(data?.bmi) > 25 ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700 border border-green-300",
      bgColor: "bg-teal-100",
      trend: "stable",
      trendValue: "Live" // Added this to fix your previous error
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-teal-50/30 pb-32 pt-12">
  <div className="sticky top-12 z-40 backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-sm">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <button onClick={onBack} className="text-[#1E88E5] hover:text-[#1565C0] text-sm font-medium">← Back</button>
            <div className="h-4 w-px bg-gray-300" />
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 border border-green-300">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-green-700">AI Active</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Health Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {data?.lastUpdated ? new Date(data.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Today, 2:30 PM"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <motion.div className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300" whileHover={{ scale: 1.05 }}>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-purple-600" />
              <div>
                <div className="text-xs text-purple-600">Health Score</div>
                <div className="text-lg font-bold text-purple-700">
                  {(Number(data?.bloodSugar) < 70 && Number(data?.bloodSugar) > 0) || (Number(data?.bpSystolic) < 90 && Number(data?.bpSystolic) > 0) ? "42" : (data?.score || 82)}/100
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  </div>
      
 <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
  <motion.div 
    className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-teal-500 text-white shadow-xl relative overflow-hidden" 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }}
  >
    {/* Background Pattern */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
    
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-blue-100" />
          <h2 className="text-xl font-bold tracking-tight">AI Health Analysis</h2>
        </div>
        <span className="text-[10px] sm:text-xs px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/10">
          ⓘ Not a medical diagnosis
        </span>
      </div>
      
      <div className="bg-white/10 p-4 rounded-xl border border-white/10 mb-6 backdrop-blur-md">
        <p className="text-white/90 text-base sm:text-lg leading-relaxed">
          <span className="font-bold border-b border-white/30 block mb-2 w-fit text-sm uppercase tracking-wider">AI Insights:</span>
          {getDetailedAnalysis()}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Sugar Tag - Optimized with Low Sugar Alert */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-sm border ${
          (Number(data?.bloodSugar) < 70 && Number(data?.bloodSugar) > 0) ? 'bg-orange-500/40 border-orange-200' : 'bg-white/20 border-white/10'
        }`}>
          {Number(data?.bloodSugar) < 70 && Number(data?.bloodSugar) > 0 ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          <span className="text-sm font-medium">
            Sugar: {Number(data?.bloodSugar) < 70 && Number(data?.bloodSugar) > 0 ? "Low" : isSugarHigh ? "Elevated" : "Normal"}
          </span>
        </div>

        {/* BP Tag - Highlighting Critical Low (8/67) */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-sm border transition-all ${
          ((Number(data?.bpSystolic) < 90 && Number(data?.bpSystolic) > 0) || isBPHigh) ? 'bg-red-500/50 border-red-200 shadow-lg animate-pulse' : 'bg-white/20 border-white/10'
        }`}>
          {((Number(data?.bpSystolic) < 90 && Number(data?.bpSystolic) > 0) || isBPHigh) ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          <span className="text-sm font-bold tracking-wide">
            BP: {Number(data?.bpSystolic) < 90 && Number(data?.bpSystolic) > 0 ? "CRITICAL LOW" : isBPHigh ? "Elevated" : "Normal"} 
            {data?.bpSystolic ? ` (${data.bpSystolic}/${data.bpDiastolic})` : ''}
          </span>
        </div>

        {/* BMI Tag */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/10">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">
            BMI: {Number(data?.bmi) < 18.5 ? "Low" : Number(data?.bmi) > 25 ? "High" : "Normal"}
          </span>
        </div>
      </div>
    </div>
  </motion.div>
</div>

  <motion.div 
  className="mb-8" 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ delay: 0.1 }}
>
  <div className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-xl">
    <div className="flex items-start justify-between mb-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Overall Health Risk</h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">AI-powered risk assessment based on 6-month prediction</p>
      </div>
      {/* Icon color changes based on risk */}
      <div className={`p-3 sm:p-4 rounded-2xl transition-colors ${
        (isSugarEmergency || isBPEmergency || isSugarHigh || isBPHigh) ? 'bg-red-100' : 'bg-yellow-100'
      }`}>
        <AlertTriangle className={`w-6 h-6 sm:w-8 sm:h-8 ${
          (isSugarEmergency || isBPEmergency || isSugarHigh || isBPHigh) ? 'text-red-600' : 'text-yellow-600'
        }`} />
      </div>
    </div>
    
    <div className="relative mb-10 pt-6"> {/* Added pt-6 for tooltip space */}
      <div className="flex justify-between mb-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
        <span className="text-green-600">● Low Risk</span>
        <span className="text-yellow-600">● Medium Risk</span>
        <span className="text-red-600">● High Risk</span>
      </div>
      
      <div className="relative h-4 sm:h-6 rounded-full bg-gradient-to-r from-green-500 via-yellow-400 to-red-600 overflow-visible shadow-inner">
        {/* Dynamic Risk Pointer */}
        <motion.div 
          className="absolute top-0 bottom-0 w-1.5 sm:w-2 bg-white shadow-[0_0_15px_rgba(0,0,0,0.3)] rounded-full z-10" 
          initial={{ left: "0%" }} 
          animate={{ 
            left: `${(isSugarEmergency || isBPEmergency || isSugarHigh || isBPHigh) ? 92 : (Number(data?.bmi) < 18.5 ? 45 : 20)}%` 
          }} 
          transition={{ duration: 1.5, delay: 0.5, type: "spring", bounce: 0.5 }}
        >
          {/* Tooltip Label */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-slate-900 shadow-2xl border border-white/20">
            <span className={`text-[10px] sm:text-xs font-black whitespace-nowrap ${
              (isSugarEmergency || isBPEmergency) ? "text-red-400" : "text-yellow-400"
            }`}>
              {(isSugarEmergency || isBPEmergency) ? "⚠️ CRITICAL" : (isSugarHigh || isBPHigh ? "HIGH RISK" : (Number(data?.bmi) < 18.5 ? "MEDIUM" : "OPTIMAL"))}
            </span>
            {/* Tooltip arrow */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
          </div>
        </motion.div>
      </div>
    </div>

    {/* Quick Context Footer */}
    <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full animate-ping ${ (isSugarEmergency || isBPEmergency) ? "bg-red-500" : "bg-green-500" }`} />
      <p className="text-[11px] sm:text-xs font-bold text-slate-600 uppercase tracking-tighter">
        Status: {(isSugarEmergency || isBPEmergency) ? "Immediate Intervention Required" : "Stable - Continue Monitoring"}
      </p>
    </div>
  </div>
</motion.div>

   <motion.div 
  className="p-5 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200" 
  initial={{ opacity: 0, scale: 0.95 }} 
  animate={{ opacity: 1, scale: 1 }} 
  transition={{ delay: 2 }}
>
  <div className="flex gap-4">
    <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
    <div>
      {/* Dynamic Status Heading */}
      <p className="font-bold text-yellow-900 mb-2">
        {isSugarHigh || isBPHigh 
          ? "High Risk Detected - Immediate Action Needed" 
          : (Number(data?.bmi) < 18.5 && Number(data?.bmi) > 0 
              ? "Attention Required" 
              : "Health is Stable")}
      </p>

      <p className="text-sm text-yellow-800 mb-3 leading-relaxed">
        {isSugarHigh && `• Critical: Blood Sugar (${data?.bloodSugar} mg/dL) is dangerously high. `}
        {isBPHigh && `• Alert: Blood Pressure (${data?.bpSystolic}/${data?.bpDiastolic}) is elevated. `}
        {Number(data?.bmi) < 18.5 && Number(data?.bmi) > 0 && `• Notice: BMI (${data?.bmi}) indicates underweight status. `}
        
        {/* All Normal Case */}
        {!isSugarHigh && !isBPHigh && (Number(data?.bmi) >= 18.5 || !data?.bmi) && 
          "Your vitals are within the normal range. Keep it up!"}
        
        <span className="block mt-2 font-bold italic text-orange-900 underline decoration-orange-300">
          AI Recommendation: {getActionAdvice() || "Continue regular monitoring."}
        </span>
      </p>

      <div className="flex flex-wrap gap-2">
        <span className="text-xs px-2 py-1 rounded-full bg-yellow-200 text-yellow-800 font-medium">Monitor Daily</span>
        {isSugarHigh && (
          <span className="text-xs px-2 py-1 rounded-full bg-red-200 text-red-800 font-bold animate-pulse">
            Reduce Sugar Intake
          </span>
        )}
        {isBPHigh && (
          <span className="text-xs px-2 py-1 rounded-full bg-red-200 text-red-800 font-bold">
            Reduce Salt Intake
          </span>
        )}
        {Number(data?.bmi) < 18.5 && Number(data?.bmi) > 0 && (
          <span className="text-xs px-2 py-1 rounded-full bg-blue-200 text-blue-800 font-bold">
            Protein Rich Diet
          </span>
        )}
      </div>
    </div>
  </div>
</motion.div>


       <div className="grid lg:grid-cols-3 gap-6 mb-8">
  <motion.div className="lg:col-span-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
    <div className="p-6 sm:p-8 rounded-2xl bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-lg h-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#1E88E5]" />
            6-Month Health Prediction
          </h2>
          <p className="text-sm text-gray-600">AI-powered trend analysis</p>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={healthPredictionData}>
            <defs>
              <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1E88E5" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#1E88E5" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#26A69A" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#26A69A" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
            <YAxis stroke="#6B7280" fontSize={12} />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#1E88E5" strokeWidth={3} fill="url(#colorHealth)" />
            <Area type="monotone" dataKey="predicted" stroke="#26A69A" strokeWidth={2} strokeDasharray="5 5" fill="url(#colorPrediction)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  </motion.div>
 


        <motion.div className="space-y-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
  {dynamicHealthStats.map((stat, index) => (
    <motion.div key={index} className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border-2 border-gray-200/50 shadow-lg hover:shadow-xl transition-all group" whileHover={{ y: -2, scale: 1.02 }}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform`}>{stat.icon}</div>
        <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${stat.statusColor}`}>{stat.status}</span>
      </div>
      <h3 className="text-sm text-gray-600 mb-2">{stat.label}</h3>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold">{stat.value}</p>
        <span className="text-sm text-gray-500">{stat.unit}</span>
      </div>
      <div className="mt-3 flex items-center gap-1 text-sm">
        <TrendingUp className={`w-4 h-4 ${stat.trend === 'up' ? 'text-red-500' : 'text-green-500'}`} />
        <span className={stat.trend === 'up' ? 'text-red-600' : 'text-green-600'}>{stat.trendValue}</span>
        <span className="text-gray-500">vs last week</span>
      </div>
    </motion.div>
  ))}
</motion.div>
</div> {/* Closing grid container */}

<motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
  <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 text-white shadow-2xl relative overflow-hidden">
    <div className="relative z-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Trophy className="w-7 h-7" />
            Health Improvement Challenge
          </h2>
          <p className="text-white/90">Keep crushing your health goals! 🎯</p>
        </div>
        <div className="text-center px-6 py-3 rounded-xl bg-white/20 backdrop-blur-lg border border-white/30">
          <div className="text-3xl font-bold">760</div>
          <div className="text-sm text-white/80">Health Points</div>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Weekly Goal Progress</span>
            <span className="font-bold">{progressValue}% Complete</span>
          </div>
          <div className="relative h-4 rounded-full bg-white/20 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-white to-yellow-200 rounded-full" 
              initial={{ width: 0 }} 
              animate={{ width: `${progressValue}%` }} 
              transition={{ duration: 1.5 }} 
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mt-6">
          {dynamicAchievements.map((achievement, index) => (
            <div key={index} className="p-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-center">
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <div className="text-sm font-medium">{achievement.label}</div>
              <div className="text-xs text-white/70 mt-1">{achievement.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</motion.div>

<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {diseaseGuidance.map((guide, index) => (
    <motion.div 
      key={index} 
      className={`group relative p-6 rounded-2xl bg-white/90 backdrop-blur-xl border-2 shadow-lg transition-all ${guide.premium ? "border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50" : "border-gray-200/50"}`} 
      whileHover={{ y: -5 }}
    >
      {/* RESTORED PREMIUM TAG */}
      {guide.premium && (
        <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-lg z-10">
          <Crown className="w-3 h-3" />
          PREMIUM
        </div>
      )}

      <div className={`w-14 h-14 rounded-xl ${guide.bgColor} flex items-center justify-center mb-4 shadow-sm`}>
        {guide.icon}
      </div>
      
      <h3 className="text-lg font-bold mb-2">{guide.title}</h3>
      <p className="text-sm text-gray-600 mb-6">{guide.description}</p>
      
     <Button 
  variant={guide.premium ? "outline" : "default"} 
  className={`w-full justify-between border-2 transition-all ${
    guide.premium 
      ? "border-purple-300 text-purple-700 hover:bg-purple-100" 
      : "bg-gray-200 hover:bg-gray-70 text-gray border-transparent"
  }`}
  onClick={() => {
    setActiveRoutine(guide.title);
    setShowRoutine(true);
  }}
>
  <span className="flex items-center gap-2">
    {guide.premium && <Lock className="w-3 h-3" />}
    {guide.premium ? "Upgrade Access" : "View Routine"}
  </span>
  <ArrowRight className="w-4 h-4" />
</Button>
    </motion.div>
  ))}
</div>

       {/* --- SMART MODAL START --- */}
        {showRoutine && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border"
            >
              {/* Dynamic Header based on Factor */}
              <div className={`p-6 text-white flex justify-between items-center ${
                activeRoutine === "Heart Health" ? "bg-red-600" : 
                activeRoutine === "Weight Management" ? "bg-blue-600" : "bg-purple-600"
              }`}>
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  <h2 className="text-xl font-bold">{activeRoutine}</h2>
                </div>
                <button onClick={() => setShowRoutine(false)} className="text-3xl">&times;</button>
              </div>
              
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto text-left">
                
                {/* DIABETES FACTORS */}
                {activeRoutine === "Diabetes Prevention" && DIABETIC_ROUTINE.map((item, idx) => (
                  <div key={idx} className="p-3 bg-purple-50 rounded-xl border border-purple-100 flex gap-4">
                    <span className="font-bold text-purple-600 text-xs mt-1">{item.time}</span>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{item.task}</p>
                      <p className="text-xs text-gray-500 italic">Factor: Blood Sugar Stability</p>
                    </div>
                  </div>
                ))}

                {/* HEART & BP FACTORS */}
                {activeRoutine === "Heart Health" && HEART_ROUTINE.map((item, idx) => (
                  <div key={idx} className="p-3 bg-red-50 rounded-xl border border-red-100 flex gap-4">
                    <span className="font-bold text-red-600 text-xs mt-1">{item.time}</span>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{item.task}</p>
                      <p className="text-xs text-gray-500 italic">Factor: Blood Pressure Control</p>
                    </div>
                  </div>
                ))}

                {/* WEIGHT & BMI FACTORS */}
                {activeRoutine === "Weight Management" && (
                  <>
                    <div className="mb-2 p-2 bg-blue-100 rounded-lg text-blue-800 text-[10px] font-bold text-center uppercase">
                      BMI Factor: {Number(data?.bmi) < 18.5 ? "Underweight Analysis" : "Overweight Analysis"}
                    </div>
                    {(Number(data?.bmi) < 18.5 ? WEIGHT_GAIN_ROUTINE : WEIGHT_LOSS_ROUTINE).map((item, idx) => (
                      <div key={idx} className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex gap-4">
                        <span className="font-bold text-blue-600 text-xs mt-1">{item.time}</span>
                        <div><p className="font-bold text-gray-800 text-sm">{item.task}</p></div>
                      </div>
                    ))}
                  </>
                )}

              {/* PREMIUM BACKEND CONTENT FOR LAST 3 BOXES */}
               {activeRoutine === "Medication Reminder" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border-2 border-green-200 rounded-2xl">
                      <p className="text-sm font-bold text-green-800 mb-3 flex items-center gap-2">
                        <Pill className="w-4 h-4 text-[#1E88E5]" /> Active Reminders
                      </p>
                      <div className="space-y-3">
                        {medicines.map((med) => (
                          <div key={med.id} className="flex gap-2 items-center bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                            <div className="flex-1">
                              <input 
                                value={med.name} 
                                onChange={(e) => setMedicines(medicines.map(m => m.id === med.id ? {...m, name: e.target.value} : m))}
                                placeholder="Medicine Name"
                                className="w-full text-xs font-bold outline-none text-black bg-transparent"
                              />
                              <input 
                                type="time" 
                                value={med.time} 
                                onChange={(e) => setMedicines(medicines.map(m => m.id === med.id ? {...m, time: e.target.value} : m))}
                                className="text-[10px] text-gray-500 outline-none mt-1 bg-transparent"
                              />
                            </div>
                            {medicines.length > 1 && (
                              <button onClick={() => setMedicines(medicines.filter(m => m.id !== med.id))} className="text-red-400 p-1 hover:bg-red-50 rounded">
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button onClick={() => setMedicines([...medicines, { id: Date.now(), name: "New Medicine", time: "08:00" }])} className="w-full py-2 bg-white border border-[#1E88E5] text-[#1E88E5] text-[10px] font-bold rounded-lg">+ ADD ANOTHER MEDICINE</button>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeRoutine === "Lab Reports Analysis" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl text-center">
                      <FileText className="w-10 h-10 text-orange-400 mx-auto mb-2" />
                      <p className="font-bold text-orange-900">AI Marker Scanning</p>
                    </div>
                    {LAB_ANALYSIS_FACTORS.map((item, i) => <RoutineItem key={i} item={item} color="orange" factor="Lab Insight" />)}
                  </div>
                )}

                {activeRoutine === "Lifestyle Coaching" && (
                  <div className="space-y-4">
                    <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-center">
                      <Sparkles className="w-10 h-10 text-teal-400 mx-auto mb-2" />
                      <p className="font-bold text-teal-900">AI Life Coach</p>
                    </div>
                    {COACHING_FACTORS.map((item, i) => <RoutineItem key={i} item={item} color="teal" factor="Longevity Factor" />)}
                  </div>
                )}
              </div>

              <div className="p-6 border-t bg-gray-50 flex gap-3">
                <Button 
                  onClick={() => setShowRoutine(false)} 
                  className="w-full bg-gray-900 text-white h-14 rounded-2xl font-bold"
                >
                  {diseaseGuidance.find(g => g.title === activeRoutine)?.premium && !isPremiumUnlocked ? "Unlock Full Access" : "Got it!"}
                </Button>
              </div>
           </motion.div>
          </div>
        )}
      </div> 
    
  ); 
};
       

const healthPredictionData = [
  { month: "Jan", value: 110, predicted: null }, { month: "Feb", value: 115, predicted: null }, { month: "Mar", value: 108, predicted: null },
  { month: "Apr", value: 120, predicted: 118 }, { month: "May", value: null, predicted: 116 }, { month: "Jun", value: null, predicted: 112 }
];

const diseaseGuidance = [
  { icon: <Brain className="w-6 h-6 text-purple-600" />, title: "Diabetes Prevention", description: "Monitor blood sugar levels and follow recommended guidelines.", bgColor: "bg-purple-100", premium: false },
  { icon: <Heart className="w-6 h-6 text-red-600" />, title: "Heart Health", description: "Keep blood pressure in check with exercise and stress management.", bgColor: "bg-red-100", premium: false },
  { icon: <Activity className="w-6 h-6 text-blue-600" />, title: "Weight Management", description: "Maintain a healthy BMI through balanced nutrition.", bgColor: "bg-blue-100", premium: false },
  { icon: <Pill className="w-6 h-6 text-green-600" />, title: "Medication Reminder", description: "Stay on track with smart reminders.", bgColor: "bg-green-100", premium: true },
  { icon: <FileText className="w-6 h-6 text-orange-600" />, title: "Lab Reports Analysis", description: "AI-powered analysis of your reports.", bgColor: "bg-orange-100", premium: true },
  { icon: <TrendingUp className="w-6 h-6 text-teal-600" />, title: "Lifestyle Coaching", description: "Personalized coaching with experts.", bgColor: "bg-teal-100", premium: true }
];

const DIABETIC_ROUTINE = [
  { time: "07:00 AM", task: "Warm water & Fenugreek seeds", tip: "Helps stabilize sugar levels." },
  { time: "08:30 AM", task: "High-Fiber Breakfast", tip: "Oatmeal or Moong Dal Chilla." },
  { time: "11:00 AM", task: "Mid-day Snack", tip: "One Apple or 10-12 Almonds." },
  { time: "01:30 PM", task: "Balanced Lunch", tip: "Include Curd and green vegetables." },
  { time: "05:00 PM", task: "Physical Activity", tip: "30-min brisk walk or light yoga." },
  { time: "08:00 PM", task: "Early Light Dinner", tip: "Maintain 2 hours gap before sleep." }
];
const HEART_ROUTINE = [
  { time: "06:30 AM", task: "Yoga & Pranayam", tip: "Reduces Blood Pressure stress." },
  { time: "09:00 AM", task: "Low Sodium Breakfast", tip: "Essential for BP management." },
  { time: "06:00 PM", task: "30-min Brisk Walk", tip: "Improves heart circulation." }
];

const WEIGHT_LOSS_ROUTINE = [
  { time: "07:00 AM", task: "Fasted Cardio", tip: "Targeting fat oxidation." },
  { time: "01:00 PM", task: "Protein & Fiber Lunch", tip: "Maintains satiety." },
  { time: "07:30 PM", task: "Early Dinner", tip: "Boosts metabolic rest." }
];

const WEIGHT_GAIN_ROUTINE = [
  { time: "08:00 AM", task: "Calorie Dense Smoothie", tip: "Banana, Oats, and Nuts." },
  { time: "02:00 PM", task: "Complex Carb Meal", tip: "Brown rice with Paneer/Chicken." },
  { time: "09:00 PM", task: "Bedtime Protein", tip: "Aids muscle growth." }
];

const MEDICATION_ROUTINE = [
  { time: "Daily", task: "Take medication as per AI schedule" },
  { time: "06:00 AM", task: "Default Morning Dose" }
];

const LAB_ANALYSIS_FACTORS = [
  { time: "Quarterly", task: "Check HbA1c levels" },
  { time: "Monthly", task: "Review Lipid Profile" }
];

const COACHING_FACTORS = [
  { time: "Weekly", task: "Stress management session" },
  { time: "Daily", task: "10-minute meditation" }
];

function RoutineItem({ item, color, factor }: any) {
  const colors: any = { 
    green: 'text-green-600 bg-green-50 border-green-100', 
    orange: 'text-orange-600 bg-orange-50 border-orange-100', 
    teal: 'text-teal-600 bg-teal-50 border-teal-100' 
  };
  return (
    <div className={`p-4 rounded-2xl border ${colors[color]} flex gap-4 items-start mb-3`}>
      <span className="font-bold text-xs mt-1 min-w-[60px]">{item.time || "Factor"}</span>
      <div>
        <p className="font-bold text-gray-800 text-sm">{item.task}</p>
        <p className="text-[10px] text-gray-500 italic mt-1 font-medium">Factor: {factor}</p>
      </div>
    </div>
  );
}