import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Heart, Gamepad2, Skull, ArrowRight, RefreshCcw, Activity, Award } from 'lucide-react';

// ==========================================
// 🧠 Mockup API (Logic เดิม)
// ==========================================
const callBackendsAPI = async (formData) => {
  try {
    const response = await fetch('http://localhost:5000/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!response.ok) throw new Error('Server error');
    return await response.json();

  } catch (error) {
    console.error("Connection Error:", error);
    // Simulate delay for realism
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    return {
      winner: "เชื่อมต่อ Server ไม่ได้",
      score: 0,
      courses: [{name: "กรุณารันไฟล์ server.py", match: 0}],
      runner_up: "-"
    };
  }
};

// ==========================================
// 🎨 Enhanced Mobile UI Component
// ==========================================
const App = () => {
  const [step, setStep] = useState('input'); 
  const [formData, setFormData] = useState({ like: '', skill: '', hobby: '', dream: '', hate: '' });
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStep('analyzing');
    const data = await callBackendsAPI(formData);
    setResult(data);
    setStep('result');
  };

  const resetApp = () => {
    setFormData({ like: '', skill: '', hobby: '', dream: '', hate: '' });
    setStep('input');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans overflow-hidden relative selection:bg-fuchsia-500/30">
      
      {/* --- Animated Background --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-20%] w-[300px] h-[300px] bg-purple-600/40 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-blue-600/30 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute top-[40%] left-[20%] w-[150px] h-[150px] bg-pink-500/20 rounded-full blur-[80px] animate-bounce duration-[10000ms]"></div>
      </div>

      <div className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col backdrop-blur-[2px]">
        
        {/* --- HEADER --- */}
        <div className="p-8 pb-4 text-center">
          <div className="relative inline-block group">
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative inline-flex p-3 rounded-2xl bg-gradient-to-tr from-violet-500 to-fuchsia-500 shadow-xl border border-white/20">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mt-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            AI Career Finder
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-medium">ค้นหาคณะที่ใช่ จากตัวตนของคุณ</p>
        </div>

        {/* --- CONTENT --- */}
        <div className="flex-1 px-6 pb-6">
          
          {/* STATE 1: INPUT FORM */}
          {step === 'input' && (
            <form onSubmit={handleSubmit} className="space-y-5 animate-in slide-in-from-bottom-8 fade-in duration-700">
              <MobileInput icon={<Heart className="text-rose-400"/>} label="ความชอบ" value={formData.like} onChange={(e) => setFormData({...formData, like: e.target.value})} placeholder="เช่น วาดรูป, เขียนโค้ด" delay="0" />
              <MobileInput icon={<Zap className="text-amber-400"/>} label="ความถนัด" value={formData.skill} onChange={(e) => setFormData({...formData, skill: e.target.value})} placeholder="เช่น คณิต, อังกฤษ" delay="100" />
              <MobileInput icon={<Gamepad2 className="text-emerald-400"/>} label="งานอดิเรก" value={formData.hobby} onChange={(e) => setFormData({...formData, hobby: e.target.value})} placeholder="เช่น เล่นเกม, อ่านหนังสือ" delay="200" />
              <MobileInput icon={<Activity className="text-cyan-400"/>} label="อาชีพในฝัน" value={formData.dream} onChange={(e) => setFormData({...formData, dream: e.target.value})} placeholder="เช่น CEO, Developer" delay="300" />
              
              <div className="pt-2">
                <MobileInput icon={<Skull className="text-red-400"/>} label="สิ่งที่ไม่ชอบ" value={formData.hate} onChange={(e) => setFormData({...formData, hate: e.target.value})} placeholder="เช่น เกลียดเลข" isRisk delay="400" />
              </div>

              <button type="submit" className="group w-full mt-6 relative overflow-hidden rounded-2xl p-[1px] shadow-lg shadow-purple-500/20 active:scale-95 transition-all duration-300">
                <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-600 animate-[spin_4s_linear_infinite]"></span>
                <div className="relative bg-slate-900 group-hover:bg-slate-800 transition-colors rounded-2xl py-4 flex items-center justify-center gap-2">
                   <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">วิเคราะห์ผลด้วย AI</span>
                   <ArrowRight className="w-5 h-5 text-purple-300 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </form>
          )}

          {/* STATE 2: ANALYZING */}
          {step === 'analyzing' && (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-8 animate-in fade-in duration-500">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-t-4 border-l-4 border-fuchsia-500/50 animate-spin"></div>
                <div className="w-16 h-16 rounded-full border-b-4 border-r-4 border-blue-500/50 animate-spin absolute top-4 left-4 direction-reverse"></div>
                <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">🧠</div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-white">กำลังประมวลผล...</h3>
                <p className="text-slate-400 text-sm">AI กำลังตรวจสอบความเข้ากันได้<br/>กับฐานข้อมูล 300+ หลักสูตร</p>
              </div>
            </div>
          )}

          {/* STATE 3: RESULT */}
          {step === 'result' && result && (
            <div className="animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 pb-10 space-y-4">

              {/* Winner Card */}
              <div className="relative overflow-hidden rounded-3xl bg-slate-800/40 border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/20">
                {/* Glow Effect */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-500/20 blur-[60px] rounded-full"></div>
                
                <div className="p-8 text-center relative z-10">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                    <Award className="w-3 h-3" /> แนะนำอันดับ 1
                  </div>
                  
                  <h2 className="text-3xl font-black mb-2 text-white drop-shadow-lg">{result.winner}</h2>
                  <p className="text-slate-400 text-sm mb-8">นี่คือเส้นทางที่ AI คิดว่า "ใช่" สำหรับคุณ</p>

                  {/* Evidence List */}
                  <div className="bg-slate-900/50 rounded-2xl p-5 text-left border border-white/5 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      <Activity className="w-3 h-3" /> วิชาที่แมตช์กัน
                    </div>
                    {result.courses.map((course, idx) => (
                      <div key={idx} className="flex items-center gap-3 group">
                        <div className="w-2 h-2 rounded-full bg-fuchsia-500 ring-4 ring-fuchsia-500/20 group-hover:ring-fuchsia-500/40 transition-all"></div>
                        <span className="text-slate-200 text-sm font-medium">{course.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Runner Up */}
              <div className="rounded-2xl bg-white/5 border border-white/5 p-5 flex items-center justify-between hover:bg-white/10 transition-colors">
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wide mb-1">รองชนะเลิศอันดับ 2</div>
                  <div className="font-bold text-lg text-slate-200">{result.runner_up}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl grayscale opacity-50">🥈</div>
              </div>

              <button onClick={resetApp} className="w-full py-4 rounded-2xl font-semibold text-slate-300 hover:text-white hover:bg-white/5 active:bg-white/10 transition-all flex items-center justify-center gap-2 group">
                <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" /> 
                ลองใหม่อีกครั้ง
              </button>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 text-center">
            <p className="text-[10px] text-slate-600 font-medium tracking-wide">
                POWERED BY PYTHON SCIKIT-LEARN & REACT
            </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 💅 Enhanced Input Component
// ==========================================
const MobileInput = ({ icon, label, value, onChange, placeholder, isRisk, delay }) => {
    // Style สำหรับ animate ตอนโหลด
    const style = { animationDelay: `${delay}ms`, animationFillMode: 'both' };
    
    return (
      <div className={`relative group animate-in slide-in-from-bottom-2 fade-in duration-500`} style={style}>
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isRisk ? 'text-red-400 group-focus-within:text-red-500' : 'text-slate-400 group-focus-within:text-fuchsia-400'}`}>
          {icon}
        </div>
        <input
          type="text"
          value={value}
          onChange={onChange}
          className={`
            w-full bg-slate-800/50 backdrop-blur-sm border 
            ${isRisk 
                ? 'border-red-500/20 focus:border-red-500 focus:ring-red-500/20' 
                : 'border-white/10 focus:border-fuchsia-500 focus:ring-fuchsia-500/20'
            }
            rounded-2xl py-4 pl-12 pr-4 
            text-white placeholder-slate-600 
            outline-none focus:ring-4 transition-all duration-300
            hover:bg-slate-800/80 focus:bg-slate-900
          `}
          placeholder={placeholder}
        />
        <label className={`
            absolute -top-2 left-4 px-2 text-[10px] font-bold tracking-wide rounded-md transition-colors
            ${isRisk ? 'bg-slate-900 text-red-400' : 'bg-slate-900 text-slate-500 group-focus-within:text-fuchsia-400'}
        `}>
            {label}
        </label>
      </div>
    );
};

export default App;