import { motion } from "motion/react";
import { 
  TrendingUp, 
  AlertTriangle, 
  Trophy, 
  Heart,
  Activity,
  Brain,
  Pill,
  FileText,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Crown,
  Lock
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";

interface DashboardPageProps {
  onBack: () => void;
}

export function DashboardPage({ onBack }: DashboardPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-teal-50/30 pb-32 pt-12">
      {/* Enhanced Header with Status */}
      <div className="sticky top-12 z-40 backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={onBack}
                  className="text-[#1E88E5] hover:text-[#1565C0] text-sm font-medium"
                >
                  ← Back
                </button>
                <div className="h-4 w-px bg-gray-300" />
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 border border-green-300">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-medium text-green-700">AI Active</span>
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">Health Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Last updated: Today, 2:30 PM</p>
            </div>
            <div className="flex items-center gap-3">
              <motion.div
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="text-xs text-purple-600">Health Score</div>
                    <div className="text-lg font-bold text-purple-700">82/100</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* AI Analysis Summary Card */}
        <motion.div
          className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-teal-500 text-white shadow-xl relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                <h2 className="text-xl font-bold">AI Health Analysis</h2>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                ⓘ Not a medical diagnosis
              </span>
            </div>
            <p className="text-white/90 mb-4 text-lg leading-relaxed">
              Based on your current metrics, your health is <span className="font-bold">moderately stable</span>. 
              We've detected <span className="font-bold">elevated blood pressure</span> that requires attention.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/20 backdrop-blur-sm">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Blood Sugar: Normal</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/30 backdrop-blur-sm border border-yellow-300/30">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">BP: Needs Monitoring</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/20 backdrop-blur-sm">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">BMI: Healthy</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Health Risk Meter - Enhanced */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="p-8 rounded-2xl bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-lg">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Overall Health Risk</h2>
                <p className="text-gray-600">AI-powered risk assessment based on 6-month prediction</p>
              </div>
              <div className="p-4 rounded-xl bg-yellow-100">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            
            <div className="relative mb-6">
              <div className="flex justify-between mb-3 text-sm">
                <span className="font-medium text-green-600">● Low Risk</span>
                <span className="font-medium text-yellow-600">● Medium Risk</span>
                <span className="font-medium text-red-600">● High Risk</span>
              </div>
              <div className="relative h-6 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 overflow-hidden shadow-inner">
                <motion.div
                  className="absolute top-0 bottom-0 w-2 bg-white shadow-xl rounded-full"
                  initial={{ left: "0%" }}
                  animate={{ left: "45%" }}
                  transition={{ duration: 1.5, delay: 0.5, type: "spring" }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg bg-white shadow-lg border border-gray-200">
                    <span className="text-sm font-bold text-yellow-600">45%</span>
                  </div>
                </motion.div>
              </div>
            </div>
            
            <motion.div
              className="p-5 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2 }}
            >
              <div className="flex gap-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-yellow-900 mb-2">Medium Risk Detected - Action Recommended</p>
                  <p className="text-sm text-yellow-800 mb-3">
                    Your blood pressure (128/84 mmHg) is in the elevated range. Consider lifestyle modifications to prevent progression to hypertension.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-200 text-yellow-800">Monitor Daily</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-200 text-yellow-800">Reduce Salt Intake</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-200 text-yellow-800">Exercise 30min/day</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* 6-Month Prediction Chart */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-6 sm:p-8 rounded-2xl bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-lg h-full">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-[#1E88E5]" />
                    6-Month Health Prediction
                  </h2>
                  <p className="text-sm text-gray-600">AI-powered trend analysis with 98% accuracy</p>
                </div>
                <select className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm font-medium">
                  <option>Blood Sugar</option>
                  <option>Blood Pressure</option>
                  <option>BMI</option>
                  <option>Overall Health</option>
                </select>
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
                    <YAxis stroke="#6B7280" fontSize={12} label={{ value: 'mg/dL', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "rgba(255, 255, 255, 0.98)", 
                        borderRadius: "12px",
                        border: "1px solid #E5E7EB",
                        padding: "12px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#1E88E5" 
                      strokeWidth={3}
                      fill="url(#colorHealth)"
                      name="Current Trend"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="predicted" 
                      stroke="#26A69A" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      fill="url(#colorPrediction)"
                      name="AI Prediction"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-[#1E88E5]" />
                  <span className="text-sm text-gray-600">Current Trend</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-[#26A69A] border-dashed" />
                  <span className="text-sm text-gray-600">AI Prediction</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-600">Healthy Range: 80-120 mg/dL</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Health Stats Cards */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {healthStats.map((stat, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border-2 border-gray-200/50 shadow-lg hover:shadow-xl transition-all group"
                whileHover={{ y: -2, scale: 1.02 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${stat.statusColor}`}>
                    {stat.status}
                  </span>
                </div>
                <h3 className="text-sm text-gray-600 mb-2">{stat.label}</h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <span className="text-sm text-gray-500">{stat.unit}</span>
                </div>
                {stat.trend && (
                  <div className="mt-3 flex items-center gap-1 text-sm">
                    <TrendingUp className={`w-4 h-4 ${stat.trend === 'up' ? 'text-red-500' : 'text-green-500'}`} />
                    <span className={stat.trend === 'up' ? 'text-red-600' : 'text-green-600'}>
                      {stat.trendValue}
                    </span>
                    <span className="text-gray-500">vs last week</span>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Health Improvement Challenge - Enhanced */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            
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
                    <span className="font-bold">76% Complete</span>
                  </div>
                  <div className="relative h-4 rounded-full bg-white/20 overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-white to-yellow-200 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "76%" }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    />
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-3 gap-4 mt-6">
                  {achievements.map((achievement, index) => (
                    <motion.div 
                      key={index} 
                      className="p-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-center hover:bg-white/20 transition-all"
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <div className="text-3xl mb-2">{achievement.icon}</div>
                      <div className="text-sm font-medium">{achievement.label}</div>
                      <div className="text-xs text-white/70 mt-1">{achievement.desc}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Personalized Health Guidance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Personalized Health Guidance</h2>
              <p className="text-gray-600 mt-1">AI-curated recommendations based on your profile</p>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {diseaseGuidance.map((guide, index) => (
              <motion.div
                key={index}
                className={`group relative p-6 rounded-2xl bg-white/90 backdrop-blur-xl border-2 shadow-lg hover:shadow-xl transition-all ${
                  guide.premium 
                    ? "border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50" 
                    : "border-gray-200/50 hover:border-[#1E88E5]/50"
                }`}
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                {guide.premium && (
                  <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Crown className="w-3 h-3" />
                    PREMIUM
                  </div>
                )}
                
                <div className={`w-14 h-14 rounded-xl ${guide.bgColor} flex items-center justify-center mb-4 ${guide.premium ? 'shadow-lg' : ''}`}>
                  {guide.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{guide.title}</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{guide.description}</p>
                
                {guide.premium ? (
                  <Button 
                    variant="outline" 
                    className="w-full justify-between border-2 border-purple-300 text-purple-700 hover:bg-purple-100 group-hover:translate-x-1 transition-transform"
                  >
                    <span className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Upgrade to Access
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between text-[#1E88E5] hover:text-[#1565C0] hover:bg-blue-50 group-hover:translate-x-1 transition-transform"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const healthPredictionData = [
  { month: "Jan", value: 110, predicted: null },
  { month: "Feb", value: 115, predicted: null },
  { month: "Mar", value: 108, predicted: null },
  { month: "Apr", value: 120, predicted: 118 },
  { month: "May", value: null, predicted: 116 },
  { month: "Jun", value: null, predicted: 112 }
];

const healthStats = [
  {
    icon: <Activity className="w-6 h-6 text-[#1E88E5]" />,
    label: "Blood Sugar",
    value: "108",
    unit: "mg/dL",
    status: "Normal",
    statusColor: "bg-green-100 text-green-700 border border-green-300",
    bgColor: "bg-blue-100",
    trend: "down",
    trendValue: "↓ 5%"
  },
  {
    icon: <Heart className="w-6 h-6 text-red-500" />,
    label: "Blood Pressure",
    value: "128/84",
    unit: "mmHg",
    status: "Elevated",
    statusColor: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    bgColor: "bg-red-100",
    trend: "up",
    trendValue: "↑ 3%"
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-[#26A69A]" />,
    label: "BMI",
    value: "24.2",
    unit: "kg/m²",
    status: "Healthy",
    statusColor: "bg-green-100 text-green-700 border border-green-300",
    bgColor: "bg-teal-100",
    trend: "down",
    trendValue: "↓ 2%"
  }
];

const achievements = [
  { icon: "🏃", label: "7 Day Streak", desc: "Logged daily" },
  { icon: "💪", label: "Health Hero", desc: "Goals achieved" },
  { icon: "⭐", label: "Rising Star", desc: "Top 10% users" }
];

const diseaseGuidance = [
  {
    icon: <Brain className="w-6 h-6 text-purple-600" />,
    title: "Diabetes Prevention",
    description: "Monitor your blood sugar levels and follow recommended dietary guidelines for optimal health",
    bgColor: "bg-purple-100",
    premium: false
  },
  {
    icon: <Heart className="w-6 h-6 text-red-600" />,
    title: "Heart Health",
    description: "Keep your blood pressure in check with regular exercise and stress management techniques",
    bgColor: "bg-red-100",
    premium: false
  },
  {
    icon: <Activity className="w-6 h-6 text-blue-600" />,
    title: "Weight Management",
    description: "Maintain a healthy BMI through balanced nutrition and consistent physical activity",
    bgColor: "bg-blue-100",
    premium: false
  },
  {
    icon: <Pill className="w-6 h-6 text-green-600" />,
    title: "Medication Reminder",
    description: "Stay on track with your prescribed medications and supplements with smart reminders",
    bgColor: "bg-green-100",
    premium: true
  },
  {
    icon: <FileText className="w-6 h-6 text-orange-600" />,
    title: "Lab Reports Analysis",
    description: "AI-powered analysis of your lab reports with detailed insights and recommendations",
    bgColor: "bg-orange-100",
    premium: true
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-teal-600" />,
    title: "Lifestyle Coaching",
    description: "Personalized 1-on-1 coaching sessions with certified health experts",
    bgColor: "bg-teal-100",
    premium: true
  }
];