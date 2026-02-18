import React, { useState } from 'react';
// ✅ เอา Sparkles ออกแล้ว เพื่อไม่ให้ Vercel แจ้ง Error ตอน Build
import { Zap, Heart, Gamepad2, Skull, ArrowRight, RefreshCcw, Activity, Award } from 'lucide-react';

// ==========================================
// 🧠 API Service
// ==========================================
const callBackendsAPI = async (formData) => {
  try {
    // -----------------------------------------------------
    // 🔗 ตอนนี้เชื่อมต่อกับ: RENDER Backend
    // -----------------------------------------------------
    const apiUrl = 'https://myfirstbackend-b55x.onrender.com/api/predict'; 
    
    const response = await fetch(apiUrl,  {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!response.ok) throw new Error('Server error');
    return await response.json();

  } catch (error) {
    console.error("Connection Error:", error);
    // รอเวลาหลอกๆ 1.5 วิ ให้ดูเหมือนประมวลผล (User Experience)
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    return {
      winner: "เกิดข้อผิดพลาด",
      score: 0,
      courses: [{name: "ไม่สามารถเชื่อมต่อ Server ได้", match: 0}],
      runner_up: "-"
    };
  }
};

// ==========================================
// 🎨 Main Component
// ==========================================
const App = () => {
  const [step, setStep] = useState('input'); 
  const [formData, setFormData] = useState({ like: '', skill: '', hobby: '', dream: '', hate: '' });
  const [result, setResult] = useState(null);

  // ⚠️ ตรวจสอบว่าไฟล์ public/download.png มีอยู่จริงนะครับ
  const logoUrl = process.env.PUBLIC_URL + "/download.png"; 

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
    <div className="min-h-screen bg-[#f0f9ff] text-slate-800 font-sans overflow-x-hidden relative selection:bg-blue-200">
      
      {/* --- Background Decor --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-5%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-200/40 rounded-full blur-[80px] md:blur-[120px]"></div>
        <div className="absolute bottom-[-5%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-sky-100/50 rounded-full blur-[80px] md:blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-xl mx-auto min-h-screen flex flex-col px-4 sm:px-6">
        
        {/* --- HEADER --- */}
        <div className="pt-12 pb-8 text-center">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-blue-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative w-28 h-28 md:w-36 md:h-36 flex items-center justify-center overflow-hidden mx-auto transition-transform hover:scale-105 duration-500">
              <img
                src={logoUrl} 
                alt="Logo" 
                className="w-full h-full object-contain drop-shadow-xl"
                onError={(e) => { e.target.style.display='none'; }} 
              />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Career <span className="text-blue-600">Finder</span>
          </h1>
          <p className="text-slate-500 text-sm md:text-base mt-2 font-medium">ค้นหาสาขาที่ใช่ จากตัวตนของคุณ</p>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="flex-1 w-full max-w-md mx-auto pb-10">
          
          {/* STEP 1: INPUT */}
          {step === 'input' && (
            <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <WhiteInput icon={<Heart className="w-5 h-5 text-rose-500"/>} label="ความชอบ" value={formData.like} onChange={(e) => setFormData({...formData, like: e.target.value})} placeholder="เช่น วาดรูป, เขียนโค้ด" delay="0" />
                <WhiteInput icon={<Zap className="w-5 h-5 text-amber-500"/>} label="ความถนัด" value={formData.skill} onChange={(e) => setFormData({...formData, skill: e.target.value})} placeholder="เช่น คณิต, อังกฤษ" delay="100" />
                <WhiteInput icon={<Gamepad2 className="w-5 h-5 text-emerald-500"/>} label="งานอดิเรก" value={formData.hobby} onChange={(e) => setFormData({...formData, hobby: e.target.value})} placeholder="เช่น เล่นเกม, อ่านหนังสือ" delay="200" />
                <WhiteInput icon={<Activity className="w-5 h-5 text-cyan-500"/>} label="อาชีพในฝัน" value={formData.dream} onChange={(e) => setFormData({...formData, dream: e.target.value})} placeholder="เช่น CEO, Developer" delay="300" />
                
                <div className="pt-2">
                    <WhiteInput icon={<Skull className="w-5 h-5 text-red-500"/>} label="สิ่งที่ไม่ชอบ" value={formData.hate} onChange={(e) => setFormData({...formData, hate: e.target.value})} placeholder="เช่น เกลียดเลข" isRisk delay="400" />
                </div>

                <button type="submit" className="group w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-4 flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-[0.97] font-bold text-lg">
                   <span>วิเคราะห์ผลการเรียนรู้</span>
                   <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </form>
          )}

          {/* STEP 2: ANALYZING */}
          {step === 'analyzing' && (
            <div className="flex flex-col items-center justify-center h-[40vh] space-y-6 animate-in fade-in">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-2xl animate-bounce">🧠</div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-800">กำลังประมวลผล...</h3>
                <p className="text-slate-500 text-sm">ระบบกำลังวิเคราะห์แผนกที่เหมาะสมที่สุด</p>
              </div>
            </div>
          )}

          {/* STEP 3: RESULT */}
          {step === 'result' && result && (
            <div className="animate-in zoom-in-95 duration-500 space-y-5">
              
              {/* Main Winner Card */}
              <div className="bg-white border-2 border-blue-100 rounded-[2.5rem] p-8 text-center shadow-xl shadow-blue-100/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
                
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-wider mb-4 border border-blue-100">
                  <Award className="w-4 h-4" /> สาขาที่แนะนำอันดับ 1
                </div>
                
                <h2 className="text-3xl font-black mb-2 text-slate-900 leading-tight">{result.winner}</h2>
                <p className="text-slate-500 text-sm mb-6 font-medium italic">"เส้นทางสู่ความสำเร็จที่ออกแบบมาเพื่อคุณ"</p>
                
                {/* Course List Logic */}
                <div className="bg-slate-50/80 rounded-2xl p-4 text-left border border-slate-100 space-y-2">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-2 pl-1">วิชาที่สอดคล้องกับคุณ:</p>
                    {result.courses && result.courses.map((course, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm text-slate-700 bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            {course.name}
                        </div>
                    ))}
                </div>
              </div>

              {/* Runner Up */}
              {result.runner_up !== "-" && (
                  <div className="bg-white/60 border border-white rounded-2xl p-4 flex items-center justify-between shadow-sm">
                    <div>
                        <div className="text-xs text-slate-400 font-bold uppercase">อันดับ 2</div>
                        <div className="font-bold text-slate-700">{result.runner_up}</div>
                    </div>
                    <div className="text-2xl opacity-50 grayscale">🥈</div>
                  </div>
              )}

              <button onClick={resetApp} className="w-full py-4 text-slate-400 hover:text-blue-600 font-bold transition-all flex items-center justify-center gap-2 group">
                <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" /> 
                เริ่มใหม่อีกครั้ง
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 🧩 UI Component: Input
// ==========================================
const WhiteInput = ({ icon, label, value, onChange, placeholder, isRisk, delay }) => (
  <div className="relative group animate-in slide-in-from-bottom-2 fade-in" style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}>
    <label className={`absolute -top-2.5 left-4 px-2 py-0.5 text-[11px] font-bold rounded-lg z-10 bg-white border shadow-sm transition-colors duration-300 ${isRisk ? 'text-red-500 border-red-100 group-focus-within:border-red-200' : 'text-blue-600 border-blue-100 group-focus-within:border-blue-200'}`}>
      {label}
    </label>
    <div className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 transition-colors duration-300 ${isRisk ? 'text-red-300 group-focus-within:text-red-500' : 'text-slate-300 group-focus-within:text-blue-500'}`}>
      {icon}
    </div>
    <input
      type="text"
      value={value}
      onChange={onChange}
      className={`w-full bg-white border-2 ${isRisk ? 'border-red-50 focus:border-red-400 focus:ring-4 focus:ring-red-500/10' : 'border-blue-50/50 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10'} rounded-2xl py-4 pl-12 pr-4 text-slate-800 placeholder-slate-300 outline-none transition-all shadow-sm font-medium`}
      placeholder={placeholder}
    />
  </div>
);

export default App;