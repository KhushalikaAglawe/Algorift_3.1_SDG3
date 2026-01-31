"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion"; 

import { 
  Heart, 
  Activity, 
  Droplet, 
  Weight, 
  Calendar,
  FileText,
  ArrowRight,
  Baby 
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";

const LOCAL_KEY = "userHealth";

interface HealthInputPageProps {
  onSubmit: () => void;
  onBack: () => void;
}

interface HealthData {
  sugar: string;
  systolic: string;
  diastolic: string;
  bmi: string;
  weight: string;
  height: string;
  symptoms: string;
  week: string; 
  kicks: string; 
}

export function HealthInputPage({ onSubmit, onBack }: HealthInputPageProps) {
  const [activeBodyPart, setActiveBodyPart] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [healthData, setHealthData] = useState<HealthData>({
    sugar: "", systolic: "", diastolic: "", bmi: "", weight: "", height: "", symptoms: "", week: "", kicks: ""
  });

  const calculateStreak = (lastDateString: string | undefined, currentStreak: number) => {
    if (!lastDateString) return 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastDate = new Date(lastDateString);
    lastDate.setHours(0, 0, 0, 0);
    const diffInTime = today.getTime() - lastDate.getTime();
    const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
    if (diffInDays === 1) return currentStreak + 1;
    if (diffInDays === 0) return currentStreak;
    return 1;
  };

  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setHealthData({
        sugar: parsed.bloodSugar?.toString() || "",
        systolic: parsed.bpSystolic?.toString() || "",
        diastolic: parsed.bpDiastolic?.toString() || "",
        bmi: parsed.bmi?.toString() || "",
        weight: parsed.weight?.toString() || "",
        height: parsed.height?.toString() || "",
        week: parsed.pregnancyWeek?.toString() || "", 
        kicks: parsed.fetalKicks?.toString() || "", 
        symptoms: parsed.symptoms || ""
      });
    }
  }, []);

  const updateHealthData = (updatedData: HealthData) => {
    if (updatedData.weight && updatedData.height) {
      const w = parseFloat(updatedData.weight);
      const h = parseFloat(updatedData.height) / 100;
      if (h > 0) {
        updatedData.bmi = (w / (h * h)).toFixed(1);
      }
    }
    setHealthData(updatedData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      let newStreak = 1;
      let lastLogDate = new Date().toISOString();

      if (user) {
        const docRef = doc(db, "healthData", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const existingData = docSnap.data();
          newStreak = calculateStreak(existingData.lastLogDate, existingData.streakCount || 0);
        }

        const finalData = {
          bloodSugar: Number(healthData.sugar),
          bpSystolic: Number(healthData.systolic),
          bpDiastolic: Number(healthData.diastolic),
          bmi: Number(healthData.bmi),
          weight: Number(healthData.weight),
          height: Number(healthData.height),
          pregnancyWeek: Number(healthData.week), 
          fetalKicks: Number(healthData.kicks), 
          symptoms: healthData.symptoms,
          bodyPart: activeBodyPart,
          score: 82,
          streakCount: newStreak,
          lastLogDate: lastLogDate,
          lastUpdated: lastLogDate
        };

        localStorage.setItem(LOCAL_KEY, JSON.stringify(finalData));
        await setDoc(docRef, { ...finalData, updatedAt: serverTimestamp() });
      }
      setLoading(false);
      onSubmit();
    } catch (error: any) {
      console.error("Error saving data: ", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-teal-50/30 py-8 px-4 sm:px-6 lg:px-8 pb-32 pt-20">
      <div className="container mx-auto max-w-7xl">
        <motion.div className="mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={onBack} className="text-[#1E88E5] hover:text-[#1565C0] mb-4 flex items-center gap-2 text-sm font-medium">
            ← Back
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">Maternity Input Dashboard</h1>
              <p className="text-gray-600">Enter pregnancy metrics for AI-powered analysis</p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-white/80 backdrop-blur-lg border border-gray-200 shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Journey Status</div>
              <div className="text-2xl font-bold text-[#1E88E5]">Active</div>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {['Vitals', 'Body Map', 'Symptoms', 'Growth'].map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  index === 0 ? 'bg-[#1E88E5] text-white shadow-lg shadow-blue-500/30' : 'bg-gray-100 text-gray-600'
                }`}>
                  {index + 1}. {step}
                </div>
                {index < 3 && <div className="w-8 h-0.5 bg-gray-300" />}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="p-6 sm:p-8 rounded-2xl bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-lg">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-[#1E88E5]" /> Pregnancy Vitals
                </h2>

                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="week" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-500" /> Pregnancy Week
                      </Label>
                      <Input id="week" type="number" placeholder="12" value={healthData.week} onChange={(e) => updateHealthData({ ...healthData, week: e.target.value })} className="mt-2 py-6 rounded-xl bg-gray-50 border-gray-200 focus:border-[#1E88E5]" />
                    </div>
                    <div>
                      <Label htmlFor="kicks" className="flex items-center gap-2">
                        <Baby className="w-4 h-4 text-blue-500" /> Daily Kicks
                      </Label>
                      <Input id="kicks" type="number" placeholder="10" value={healthData.kicks} onChange={(e) => updateHealthData({ ...healthData, kicks: e.target.value })} className="mt-2 py-6 rounded-xl bg-gray-50 border-gray-200 focus:border-[#1E88E5]" />
                    </div>
                  </div>

                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4 text-red-500" /> Blood Pressure (mmHg)
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Input type="number" placeholder="Sys" value={healthData.systolic} onChange={(e) => updateHealthData({ ...healthData, systolic: e.target.value })} className="py-6 rounded-xl bg-gray-50 border-gray-200 focus:border-[#1E88E5]" />
                      <Input type="number" placeholder="Dia" value={healthData.diastolic} onChange={(e) => updateHealthData({ ...healthData, diastolic: e.target.value })} className="py-6 rounded-xl bg-gray-50 border-gray-200 focus:border-[#1E88E5]" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="weight" className="flex items-center gap-2">
                        <Weight className="w-4 h-4 text-purple-500" /> Weight (kg)
                      </Label>
                      <Input id="weight" type="number" placeholder="70" value={healthData.weight} onChange={(e) => updateHealthData({ ...healthData, weight: e.target.value })} className="mt-2 py-6 rounded-xl bg-gray-50 border-gray-200 focus:border-[#1E88E5]" />
                    </div>
                    <div>
                      <Label htmlFor="sugar" className="flex items-center gap-2">
                        <Droplet className="w-4 h-4 text-[#26A69A]" /> Sugar (mg/dL)
                      </Label>
                      <Input id="sugar" type="number" placeholder="100" value={healthData.sugar} onChange={(e) => updateHealthData({ ...healthData, sugar: e.target.value })} className="mt-2 py-6 rounded-xl bg-gray-50 border-gray-200 focus:border-[#1E88E5]" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="height">Height (cm) - for BMI</Label>
                    <Input id="height" type="number" placeholder="170" value={healthData.height} onChange={(e) => updateHealthData({ ...healthData, height: e.target.value })} className="mt-2 py-6 rounded-xl bg-gray-50 border-gray-200 focus:border-[#1E88E5]" />
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-lg">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-[#26A69A]" /> Symptoms & Notes
                </h2>
                <Textarea placeholder="Morning sickness, fatigue, or any discomfort..." value={healthData.symptoms} onChange={(e) => updateHealthData({ ...healthData, symptoms: e.target.value })} className="min-h-32 rounded-xl bg-gray-50 border-gray-200 focus:border-[#1E88E5] resize-none" />
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#1E88E5] to-[#26A69A] hover:opacity-90 text-white py-6 rounded-xl shadow-lg flex items-center justify-center gap-2">
                {loading ? "Analyzing Journey..." : "Update Maternity Log"} <ArrowRight className="w-5 h-5" />
              </Button>
            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="sticky top-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-lg">
              <h2 className="text-xl font-bold mb-6">Interactive Body Map</h2>
              <div className="relative w-full max-w-sm mx-auto aspect-[3/4]">
                <svg viewBox="0 0 200 350" className="w-full h-full">
                  <BodyPart d="M100,15c-12,0-22,10-22,22s10,22,22,22s22-10,22-22S112,15,100,15z" active={activeBodyPart === "head"} onClick={() => setActiveBodyPart("head")} fill="#1E88E5" />
                  <BodyPart d="M72,70h56l8,50l-10,15H74l-10-15L72,70z" active={activeBodyPart === "chest"} onClick={() => setActiveBodyPart("chest")} fill="#42A5F5" />
                  <BodyPart d="M74,135h52l-5,55H79L74,135z" active={activeBodyPart === "abdomen"} onClick={() => setActiveBodyPart("abdomen")} fill="#4DB6AC" />
                  <BodyPart d="M70,72L55,75l-15,65l12,5l15-55L70,72z" active={activeBodyPart === "leftArm"} onClick={() => setActiveBodyPart("leftArm")} fill="#66BB6A" />
                  <BodyPart d="M130,72l15,3l15,65l-12,5l-15-55L130,72z" active={activeBodyPart === "rightArm"} onClick={() => setActiveBodyPart("rightArm")} fill="#66BB6A" />
                  <BodyPart d="M79,192l18,0l-5,110l-15,0L79,192z" active={activeBodyPart === "leftLeg"} onClick={() => setActiveBodyPart("leftLeg")} fill="#FFA726" />
                  <BodyPart d="M103,192l18,0l3,110l-15,0L103,192z" active={activeBodyPart === "rightLeg"} onClick={() => setActiveBodyPart("rightLeg")} fill="#FFA726" />
                </svg>
              </div>
              {activeBodyPart && (
                <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200 text-sm font-medium text-blue-700 capitalize text-center">
                  Tracking Discomfort: {activeBodyPart.replace(/([A-Z])/g, ' $1')}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function BodyPart({ d, active, onClick, fill }: any) {
  return (
    <motion.path
      d={d}
      fill={active ? fill : `${fill}40`}
      stroke={active ? fill : "#E0E0E0"}
      strokeWidth="2"
      className="cursor-pointer transition-all duration-300"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
    />
  );
}