import { useState, useEffect, useRef } from "react";
import "./App.css";

const DOCTORS = [
  { id:1, name:"Dr. Priya Sharma", specialty:"Dermatologist", clinic:"SkinCare Clinic", location:"Connaught Place", rating:4.9, reviews:312, fee:800, exp:12, slots:["10:00 AM","11:30 AM","2:00 PM","4:30 PM"], av:"PS", clr:"#0d3326", ac:"#00c87a", verified:true, next:"Today", punctuality:96, queue:3, mode:["clinic","video"] },
  { id:2, name:"Dr. Arjun Mehta", specialty:"Dentist", clinic:"BrightSmile Dental", location:"Lajpat Nagar", rating:4.7, reviews:189, fee:600, exp:8, slots:["9:00 AM","12:00 PM","3:00 PM","5:30 PM"], av:"AM", clr:"#0d1f38", ac:"#4d9de0", verified:true, next:"Today", punctuality:88, queue:7, mode:["clinic"] },
  { id:3, name:"Dr. Kavitha Nair", specialty:"Cardiologist", clinic:"HeartCare Center", location:"Dwarka", rating:4.8, reviews:421, fee:1200, exp:18, slots:["11:00 AM","1:00 PM","3:30 PM"], av:"KN", clr:"#2d0f0f", ac:"#e05c5c", verified:true, next:"Tomorrow", punctuality:92, queue:1, mode:["clinic","video"] },
  { id:4, name:"Dr. Rahul Gupta", specialty:"Orthopedic", clinic:"BoneJoint Clinic", location:"Rohini", rating:4.6, reviews:267, fee:900, exp:14, slots:["10:30 AM","12:30 PM","4:00 PM"], av:"RG", clr:"#1f1038", ac:"#a78bfa", verified:false, next:"Today", punctuality:79, queue:5, mode:["clinic"] },
  { id:5, name:"Dr. Sunita Rao", specialty:"Pediatrician", clinic:"KidsCare Hospital", location:"Janakpuri", rating:4.9, reviews:534, fee:700, exp:16, slots:["9:30 AM","11:00 AM","2:30 PM","5:00 PM"], av:"SR", clr:"#2d1a00", ac:"#f0b429", verified:true, next:"Today", punctuality:95, queue:11, mode:["clinic","video"] },
  { id:6, name:"Dr. Vikram Singh", specialty:"Neurologist", clinic:"NeuroMind Clinic", location:"Saket", rating:4.7, reviews:198, fee:1500, exp:22, slots:["10:00 AM","2:00 PM","4:00 PM"], av:"VS", clr:"#0a2218", ac:"#34d399", verified:true, next:"Tomorrow", punctuality:91, queue:2, mode:["clinic","video"] },
];

const RECORDS = [
  { id:1, type:"Prescription", title:"Acne Treatment Plan", doctor:"Dr. Priya Sharma", date:"12 Mar 2025", icon:"💊", ac:"#00c87a", shared:false, sharedUntil:null, note:"Continue adapalene 3 more weeks. Avoid direct sun exposure." },
  { id:2, type:"Lab Report", title:"Complete Blood Count", doctor:"City Diagnostics", date:"28 Feb 2025", icon:"🧪", ac:"#4d9de0", shared:false, sharedUntil:null, note:null },
  { id:3, type:"X-Ray", title:"Chest X-Ray", doctor:"Dr. Vikram Singh", date:"15 Jan 2025", icon:"🩻", ac:"#e05c5c", shared:false, sharedUntil:null, note:"Lungs clear. Follow-up in 6 months." },
  { id:4, type:"Vaccination", title:"COVID-19 Booster", doctor:"Health Ministry", date:"03 Dec 2024", icon:"💉", ac:"#f0b429", shared:false, sharedUntil:null, note:null },
];

const FAMILY = [
  { name:"Aditya Kumar", rel:"You", age:28, blood:"B+", av:"AK", score:82 },
  { name:"Meera Kumar", rel:"Wife", age:26, blood:"O+", av:"MK", score:91 },
  { name:"Raj Kumar", rel:"Father", age:58, blood:"A+", av:"RK", score:67 },
  { name:"Sunita Kumar", rel:"Mother", age:54, blood:"B-", av:"SK", score:74 },
];

const VITALS = [
  { label:"Heart Rate", value:"72", unit:"bpm", icon:"❤️", trend:"Stable", history:[68,70,74,72,71,73,72] },
  { label:"Blood Pressure", value:"118/78", unit:"mmHg", icon:"🩺", trend:"Good", history:[120,118,122,119,117,118,118] },
  { label:"Blood Sugar", value:"94", unit:"mg/dL", icon:"🩸", trend:"Good", history:[98,95,92,96,93,94,94] },
  { label:"SpO₂", value:"99", unit:"%", icon:"🫁", trend:"Excellent", history:[98,99,99,98,99,99,99] },
];

const SYMPTOMS = {
  "headache":    { specialist:"Neurologist",        urgency:"medium", advice:"Could be tension headache, migraine or dehydration. Monitor 24hrs. See doctor if it persists or worsens." },
  "chest pain":  { specialist:"Cardiologist",        urgency:"high",   advice:"Seek immediate medical attention. Chest pain can indicate a cardiac event. Call emergency services." },
  "skin rash":   { specialist:"Dermatologist",       urgency:"low",    advice:"Likely allergic reaction or eczema. Avoid irritants. Consult if spreading or accompanied by fever." },
  "toothache":   { specialist:"Dentist",             urgency:"medium", advice:"May be cavity or infection. Avoid hot/cold. Use pain relief temporarily and book an appointment soon." },
  "fever":       { specialist:"General Physician",   urgency:"medium", advice:"Stay hydrated. Monitor temperature. See doctor if above 103°F or fever lasts 3+ days." },
  "back pain":   { specialist:"Orthopedic",          urgency:"low",    advice:"Rest and apply heat/ice. Could be muscle strain. See doctor if pain radiates down legs." },
  "cough":       { specialist:"Pulmonologist",       urgency:"low",    advice:"Stay hydrated. Likely viral. See doctor if producing blood or lasting 3+ weeks." },
};

const MEDICINES = {
  "dolo 650":    [{ ph:"Apollo Pharmacy", price:32, dist:"0.4 km",     inStock:true }, { ph:"MedPlus",       price:28, dist:"1.2 km",     inStock:true }, { ph:"NetMeds (Online)", price:22, dist:"Delivery 2hrs", inStock:true }],
  "paracetamol": [{ ph:"Apollo Pharmacy", price:18, dist:"0.4 km",     inStock:true }, { ph:"1mg (Online)",  price:12, dist:"Delivery 4hrs", inStock:true }],
};

const C = { bg:"#060d0a", surf:"#0c1812", card:"#111f18", card2:"#162920", border:"#1e3228", primary:"#00c87a", gold:"#f0b429", text:"#dff2ea", muted:"#5a7a6a", dim:"#8aac9a" };

const s = {
  page:  { background:C.bg, minHeight:"100vh", maxWidth:1200, width:"100%", margin:"0 auto", fontFamily:"'DM Sans','Segoe UI',sans-serif", color:C.text, position:"relative", overflowX:"hidden" },
  card:  { background:C.card,  borderRadius:20, border:`1px solid ${C.border}` },
  card2: { background:C.card2, borderRadius:20, border:`1px solid ${C.border}` },
  h1:    { fontFamily:"'Syne',sans-serif", fontWeight:900, color:"#fff" },
  lbl:   { fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:C.muted },
  btn:   { background:`linear-gradient(135deg,#00a864,#00c87a)`, color:"#000", border:"none", borderRadius:14, padding:"15px 24px", fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:"inherit", width:"100%", letterSpacing:0.3, transition:"all 0.2s" },
  btnO:  { background:"transparent", color:C.primary, border:`1.5px solid ${C.primary}`, borderRadius:14, padding:"13px 24px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit", width:"100%", transition:"all 0.15s" },
  pill:  (a) => ({ background:a?C.primary:C.card2, color:a?"#000":C.dim, border:`1px solid ${a?C.primary:C.border}`, borderRadius:100, padding:"7px 16px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap", transition:"all 0.15s", flexShrink:0 }),
  inp:   { background:C.card2, border:`1.5px solid ${C.border}`, borderRadius:12, padding:"12px 16px", fontSize:14, color:C.text, outline:"none", fontFamily:"inherit", width:"100%" },
};

function CSS() {
  return <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Syne:wght@700;800;900&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    ::-webkit-scrollbar{width:2px}::-webkit-scrollbar-thumb{background:#1e3228;border-radius:10px}
    input::placeholder,textarea::placeholder{color:#3a5a4a}
    textarea{resize:none}
    .ai{animation:fadeUp .35s cubic-bezier(.16,1,.3,1)}
    @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
    .live{animation:pulse 1.5s infinite}
  `}</style>;
}

function Nav({ tab, setTab }) {
  const items = [
    { id:"home",    icon:"🏠", label:"Home"    },
    { id:"doctors", icon:"🩺", label:"Doctors" },
    { id:"ai",      icon:"🤖", label:"AI Hub"  },
    { id:"vault",   icon:"🔐", label:"Vault"   },
    { id:"profile", icon:"👤", label:"Profile" },
  ];
  return (
    <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:1200, background:C.surf, borderTop:`1px solid ${C.border}`, display:"flex", justifyContent:"space-around", padding:"10px 0 16px", zIndex:100 }}>
      {items.map(n => (
        <div key={n.id} onClick={() => setTab(n.id)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, cursor:"pointer", padding:"5px 12px", borderRadius:12, background:tab===n.id?"#00c87a15":"transparent" }}>
          <span style={{ fontSize:20 }}>{n.icon}</span>
          <span style={{ fontSize:9, fontWeight:800, letterSpacing:.5, color:tab===n.id?C.primary:"#4a6a5a" }}>{n.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Arogya() {
  const [tab, setTab]           = useState("home");
  const [screen, setScreen]     = useState(null);
  const [selDoc, setSelDoc]     = useState(null);
  const [selSlot, setSelSlot]   = useState(null);
  const [selMode, setSelMode]   = useState("clinic");
  const [booked, setBooked]     = useState(false);
  const [specFilter, setSpec]   = useState("All");
  const [search, setSearch]     = useState("");
  const [vaultPin, setVaultPin] = useState("");
  const [vaultOpen, setVaultOpen] = useState(false);
  const [pinErr, setPinErr]     = useState(false);
  const [records, setRecords]   = useState(RECORDS);
  const [showNote, setShowNote] = useState(null);
  const [showQR, setShowQR]     = useState(false);
  const [symInput, setSymInput] = useState("");
  const [symRes, setSymRes]     = useState(null);
  const [medInput, setMedInput] = useState("");
  const [medRes, setMedRes]     = useState(null);
  const [famIdx, setFamIdx]     = useState(0);
  const [qTimer, setQTimer]     = useState(null);
  const [activeV, setActiveV]   = useState(0);
  const [soDoc, setSoDoc]       = useState(null);
  const pinRefs = [useRef(),useRef(),useRef(),useRef()];

  useEffect(() => {
    if (qTimer > 0) { const t = setTimeout(() => setQTimer(v => v - 1), 4000); return () => clearTimeout(t); }
  }, [qTimer]);

  const filtered = DOCTORS.filter(d =>
    (specFilter === "All" || d.specialty === specFilter) &&
    (d.name.toLowerCase().includes(search.toLowerCase()) ||
     d.specialty.toLowerCase().includes(search.toLowerCase()) ||
     d.location.toLowerCase().includes(search.toLowerCase()))
  );

  const score = FAMILY[famIdx].score;
  const scoreClr = score >= 85 ? C.primary : score >= 70 ? C.gold : "#e05c5c";

  const pinDigit = (i, val) => {
    const arr = vaultPin.split(""); arr[i] = val;
    const p = arr.join("").slice(0,4); setVaultPin(p);
    if (val && i < 3) pinRefs[i+1].current?.focus();
  };

  const unlockVault = () => {
    if (vaultPin === "1234") { setVaultOpen(true); setPinErr(false); }
    else { setPinErr(true); setVaultPin(""); pinRefs[0].current?.focus(); }
  };

  const toggleShare = (id, hrs) => setRecords(r => r.map(rec => rec.id===id ? { ...rec, shared:!rec.shared, sharedUntil:!rec.shared?`${hrs}h`:null } : rec));
  const checkSym  = () => { const k = Object.keys(SYMPTOMS).find(k => symInput.toLowerCase().includes(k)); setSymRes(k ? SYMPTOMS[k] : { specialist:"General Physician", urgency:"low", advice:"Symptoms unclear. Please describe more specifically or consult a General Physician." }); };
  const checkMed  = () => { const k = Object.keys(MEDICINES).find(k => medInput.toLowerCase().includes(k)); setMedRes(k ? MEDICINES[k] : [{ ph:"Apollo Pharmacy", price:45, dist:"0.4 km", inStock:true }, { ph:"MedPlus", price:38, dist:"1.2 km", inStock:false }]); };
  const urgClr    = u => u==="high"?"#e05c5c":u==="medium"?C.gold:C.primary;
  const urgBg     = u => u==="high"?"#2d0f0f":u==="medium"?"#2a1a00":"#0d3326";

  const goDoc = (doc) => { setSelDoc(doc); setSelSlot(null); setBooked(false); setScreen("booking"); };
  const goBack = () => setScreen(null);

  // ══ SCREENS ══════════════════════════════════════════════════════════════

  if (screen === "booking" && selDoc) return (
    <div style={s.page}><CSS />
      <div style={{ background:`linear-gradient(160deg,${C.surf} 0%,${selDoc.clr} 100%)`, padding:"52px 20px 24px" }}>
        <div onClick={() => { setScreen(null); setBooked(false); }} style={{ color:C.dim, fontSize:13, fontWeight:700, cursor:"pointer", marginBottom:14 }}>← Back</div>
        <div style={{ display:"flex", gap:16, alignItems:"center" }}>
          <div style={{ width:72, height:72, borderRadius:22, background:selDoc.clr, border:`2px solid ${selDoc.ac}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, fontWeight:900, color:selDoc.ac }}>{selDoc.av}</div>
          <div>
            <div style={{ ...s.h1, fontSize:20 }}>{selDoc.name} {selDoc.verified&&"✅"}</div>
            <div style={{ color:selDoc.ac, fontWeight:700, fontSize:13 }}>{selDoc.specialty}</div>
            <div style={{ color:C.dim, fontSize:12 }}>{selDoc.clinic} · {selDoc.location}</div>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginTop:18 }}>
          {[{l:"Experience",v:`${selDoc.exp} yrs`},{l:"Rating",v:`⭐ ${selDoc.rating}`},{l:"On-Time",v:`${selDoc.punctuality}%`}].map((it,i) => (
            <div key={i} style={{ ...s.card2, padding:"10px 8px", textAlign:"center" }}>
              <div style={{ fontWeight:800, fontSize:15, color:"#fff" }}>{it.v}</div>
              <div style={{ fontSize:10, color:C.muted, marginTop:3 }}>{it.l}</div>
            </div>
          ))}
        </div>
      </div>

      {!booked ? (
        <div style={{ padding:"18px 18px 100px", overflowY:"auto", maxHeight:"calc(100vh - 230px)" }}>
          {/* Live Queue */}
          <div style={{ ...s.card, padding:16, marginBottom:14, borderColor:selDoc.ac+"44" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <div style={{ ...s.lbl }}>Live Queue Tracker</div>
              <span className="live" style={{ background:"#0d3326", color:C.primary, fontSize:11, fontWeight:800, padding:"3px 10px", borderRadius:6 }}>● LIVE</span>
            </div>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:10 }}>
              {Array.from({length:Math.min(selDoc.queue+5,16)},(_,i) => (
                <div key={i} style={{ width:30, height:30, borderRadius:8, background:i<selDoc.queue?selDoc.ac+"33":i===selDoc.queue?selDoc.ac:C.card2, border:`1px solid ${i<=selDoc.queue?selDoc.ac:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:800, color:i===selDoc.queue?"#000":i<selDoc.queue?selDoc.ac:C.muted }}>
                  {i===selDoc.queue?"YOU":i+1}
                </div>
              ))}
            </div>
            <div style={{ color:C.dim, fontSize:13 }}>You're <strong style={{ color:"#fff" }}>#{selDoc.queue+1}</strong> in queue · Est. wait: <strong style={{ color:selDoc.ac }}>{selDoc.queue*8} mins</strong></div>
          </div>

          {/* Mode */}
          <div style={{ ...s.card, padding:16, marginBottom:14 }}>
            <div style={{ ...s.lbl, marginBottom:10 }}>Consultation Mode</div>
            <div style={{ display:"flex", gap:10 }}>
              {selDoc.mode.map(m => (
                <button key={m} onClick={() => setSelMode(m)} style={{ ...s.pill(selMode===m), flex:1, padding:"12px 8px", textAlign:"center" }}>
                  {m==="clinic"?"🏥 In-Clinic":"📹 Video Call"}
                </button>
              ))}
            </div>
          </div>

          {/* Slots */}
          <div style={{ ...s.card, padding:16, marginBottom:14 }}>
            <div style={{ ...s.lbl, marginBottom:4 }}>Available Slots</div>
            <div style={{ color:C.muted, fontSize:12, marginBottom:12 }}>📅 Monday, 13 April 2026</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {selDoc.slots.map(sl => (
                <button key={sl} onClick={() => setSelSlot(sl)} style={{ border:`2px solid ${selSlot===sl?selDoc.ac:C.border}`, background:selSlot===sl?selDoc.ac+"22":"transparent", color:selSlot===sl?selDoc.ac:C.dim, borderRadius:10, padding:"9px 14px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"all .15s" }}>{sl}</button>
              ))}
            </div>
          </div>

          {/* Second Opinion */}
          <div style={{ ...s.card, padding:16, marginBottom:14, borderColor:C.gold+"44" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontWeight:700, color:"#fff", fontSize:14 }}>🔍 Want a Second Opinion?</div>
                <div style={{ color:C.muted, fontSize:12, marginTop:3 }}>Book another specialist instantly</div>
              </div>
              <button onClick={() => { setSoDoc(selDoc); setScreen("second-opinion"); }} style={{ background:C.gold+"22", color:C.gold, border:`1px solid ${C.gold}44`, borderRadius:10, padding:"8px 12px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Explore</button>
            </div>
          </div>

          {/* Fee */}
          <div style={{ ...s.card2, padding:16, marginBottom:18 }}>
            {[["Consultation Fee",`₹${selDoc.fee}`],["Platform Fee","FREE ✓"],["GST","Included"]].map(([k,v],i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ color:C.dim, fontSize:13 }}>{k}</span>
                <span style={{ fontWeight:700, color:v==="FREE ✓"?C.primary:"#fff", fontSize:13 }}>{v}</span>
              </div>
            ))}
            <div style={{ borderTop:`1px dashed ${C.border}`, marginTop:8, paddingTop:10, display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontWeight:800, color:"#fff" }}>Total</span>
              <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:22, color:C.primary }}>₹{selDoc.fee}</span>
            </div>
          </div>

          <button style={{ ...s.btn, opacity:selSlot?1:.4, cursor:selSlot?"pointer":"not-allowed" }} onClick={() => { if(selSlot){ setBooked(true); setQTimer(selDoc.queue*8); } }}>
            {selSlot?`✓ Confirm · ${selMode==="video"?"Video":"Clinic"} · ${selSlot}`:"Select a Slot to Continue"}
          </button>
        </div>
      ) : (
        <div style={{ padding:"40px 20px 0", textAlign:"center", overflowY:"auto", maxHeight:"calc(100vh - 230px)" }}>
          <div style={{ width:90, height:90, borderRadius:"50%", background:"radial-gradient(circle,#00c87a44,#00c87a11)", border:`2px solid ${C.primary}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:44, margin:"0 auto 20px" }}>✅</div>
          <div style={{ ...s.h1, fontSize:28 }}>Confirmed!</div>
          <div style={{ color:C.dim, fontSize:14, marginTop:8, lineHeight:1.8 }}>
            <strong style={{ color:"#fff" }}>{selDoc.name}</strong><br />
            {selSlot} · Today · {selMode==="video"?"📹 Video Call":"🏥 In-Clinic"}
          </div>
          <div style={{ ...s.card2, padding:20, margin:"22px 0 0", textAlign:"left" }}>
            {[["Doctor",selDoc.name],["Token",`#${selDoc.queue+1}`],["Time",`${selSlot}, Today`],["Mode",selMode==="video"?"Video Consult":"In-Clinic"],["Amount",`₹${selDoc.fee}`]].map(([k,v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                <span style={{ color:C.dim, fontSize:13 }}>{k}</span>
                <span style={{ fontWeight:700, color:k==="Amount"?C.primary:"#fff", fontSize:13 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ ...s.card, padding:14, margin:"14px 0", borderColor:C.primary+"44" }}>
            <div style={{ ...s.lbl, marginBottom:6 }}>🔴 Live Wait</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:36, fontWeight:900, color:C.primary }}>{qTimer} <span style={{ fontSize:14, color:C.muted }}>mins</span></div>
            <div style={{ color:C.muted, fontSize:12, marginTop:4 }}>Updating in real time</div>
          </div>
          <button style={s.btn} onClick={() => { setScreen(null); setBooked(false); }}>Done</button>
          <div style={{ height:20 }} />
        </div>
      )}
      <Nav tab={tab} setTab={(t) => { setScreen(null); setTab(t); }} />
    </div>
  );

  if (screen === "second-opinion") {
    const others = DOCTORS.filter(d => d.specialty === soDoc?.specialty && d.id !== soDoc?.id);
    return (
      <div style={s.page}><CSS />
        <div style={{ padding:"52px 20px 20px", background:C.surf, borderBottom:`1px solid ${C.border}` }}>
          <div onClick={() => setScreen("booking")} style={{ color:C.dim, fontSize:13, fontWeight:700, cursor:"pointer", marginBottom:10 }}>← Back</div>
          <div style={{ ...s.h1, fontSize:22 }}>Second Opinion</div>
          <div style={{ color:C.muted, fontSize:13, marginTop:4 }}>Other {soDoc?.specialty}s available</div>
        </div>
        <div style={{ padding:"16px 18px 100px" }}>
          {others.length ? others.map(doc => (
            <div key={doc.id} style={{ ...s.card, padding:18, marginBottom:12, cursor:"pointer" }} onClick={() => goDoc(doc)}>
              <div style={{ display:"flex", gap:14, alignItems:"center" }}>
                <div style={{ width:54, height:54, borderRadius:16, background:doc.clr, border:`1px solid ${doc.ac}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:900, color:doc.ac }}>{doc.av}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, color:"#fff" }}>{doc.name}</div>
                  <div style={{ color:C.muted, fontSize:12 }}>{doc.clinic}</div>
                  <div style={{ display:"flex", gap:10, marginTop:6 }}>
                    <span style={{ color:"#f59e0b", fontWeight:700, fontSize:12 }}>⭐ {doc.rating}</span>
                    <span style={{ color:C.primary, fontWeight:700, fontSize:13 }}>₹{doc.fee}</span>
                  </div>
                </div>
                <div style={{ background:doc.next==="Today"?"#0d3326":"#2a1a00", color:doc.next==="Today"?C.primary:C.gold, padding:"5px 10px", borderRadius:8, fontSize:11, fontWeight:700 }}>{doc.next}</div>
              </div>
            </div>
          )) : <div style={{ color:C.muted, textAlign:"center", marginTop:60, fontSize:15 }}>No other {soDoc?.specialty}s found nearby.</div>}
        </div>
        <Nav tab={tab} setTab={(t) => { setScreen(null); setTab(t); }} />
      </div>
    );
  }

  if (screen === "ai-symptom") return (
    <div style={s.page}><CSS />
      <div style={{ background:`linear-gradient(160deg,${C.surf},#0d1f1a)`, padding:"52px 20px 22px" }}>
        <div onClick={goBack} style={{ color:C.dim, fontSize:13, fontWeight:700, cursor:"pointer", marginBottom:12 }}>← Back</div>
        <div style={{ ...s.h1, fontSize:24 }}>🤖 AI Symptom Checker</div>
        <div style={{ color:C.muted, fontSize:13, marginTop:6 }}>Describe what you're feeling. Our AI finds the right specialist.</div>
      </div>
      <div style={{ padding:"18px 18px 100px" }}>
        <div style={{ ...s.card2, padding:16, marginBottom:14 }}>
          <textarea value={symInput} onChange={e=>setSymInput(e.target.value)} placeholder="e.g. I have a headache with dizziness since morning..." style={{ ...s.inp, background:"transparent", border:"none", height:90, fontSize:14 }} />
          <div style={{ display:"flex", gap:8, marginTop:10, flexWrap:"wrap" }}>
            {["headache","fever","chest pain","skin rash","toothache","back pain"].map(sy => (
              <button key={sy} onClick={() => setSymInput(sy)} style={{ ...s.pill(symInput===sy), padding:"5px 12px", fontSize:11 }}>{sy}</button>
            ))}
          </div>
        </div>
        <button style={{ ...s.btn, opacity:symInput?1:.4 }} onClick={checkSym} disabled={!symInput}>Analyse Symptoms →</button>
        {symRes && (
          <div style={{ marginTop:20 }} className="ai">
            <div style={{ background:urgBg(symRes.urgency), borderRadius:20, padding:20, border:`1px solid ${urgClr(symRes.urgency)}44` }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
                <div style={{ ...s.h1, fontSize:16 }}>AI Analysis</div>
                <span style={{ background:urgClr(symRes.urgency)+"33", color:urgClr(symRes.urgency), fontSize:11, fontWeight:800, padding:"4px 10px", borderRadius:8, textTransform:"uppercase" }}>{symRes.urgency} urgency</span>
              </div>
              <div style={{ color:C.dim, fontSize:14, lineHeight:1.7, marginBottom:16 }}>{symRes.advice}</div>
              <div style={{ background:C.card, borderRadius:12, padding:12, display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:24 }}>🩺</span>
                <div>
                  <div style={{ fontSize:11, color:C.muted, fontWeight:700 }}>RECOMMENDED SPECIALIST</div>
                  <div style={{ fontWeight:800, color:"#fff", fontSize:15 }}>{symRes.specialist}</div>
                </div>
              </div>
            </div>
            <button style={{ ...s.btn, marginTop:14 }} onClick={() => { setSpec(symRes.specialist); setScreen(null); setTab("doctors"); }}>
              Find {symRes.specialist}s Near Me →
            </button>
          </div>
        )}
      </div>
      <Nav tab={tab} setTab={(t)=>{ setScreen(null); setTab(t); }} />
    </div>
  );

  if (screen === "ai-medicine") return (
    <div style={s.page}><CSS />
      <div style={{ background:`linear-gradient(160deg,${C.surf},#1a1505)`, padding:"52px 20px 22px" }}>
        <div onClick={goBack} style={{ color:C.dim, fontSize:13, fontWeight:700, cursor:"pointer", marginBottom:12 }}>← Back</div>
        <div style={{ ...s.h1, fontSize:24 }}>💊 Medicine Price Finder</div>
        <div style={{ color:C.muted, fontSize:13, marginTop:6 }}>Compare prices across every pharmacy near you.</div>
      </div>
      <div style={{ padding:"18px 18px 100px" }}>
        <div style={{ ...s.card2, padding:16, marginBottom:14, display:"flex", gap:10, alignItems:"center" }}>
          <span style={{ fontSize:18 }}>🔍</span>
          <input value={medInput} onChange={e=>setMedInput(e.target.value)} placeholder="Search medicine (e.g. Dolo 650)..." style={{ ...s.inp, background:"transparent", border:"none", flex:1 }} />
        </div>
        <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
          {["Dolo 650","Paracetamol","Azithromycin"].map(m => (
            <button key={m} onClick={() => setMedInput(m)} style={{ ...s.pill(medInput===m), fontSize:11 }}>{m}</button>
          ))}
        </div>
        <button style={{ ...s.btn, opacity:medInput?1:.4 }} onClick={checkMed} disabled={!medInput}>Compare Prices →</button>
        {medRes && (
          <div style={{ marginTop:20 }} className="ai">
            <div style={{ ...s.lbl, marginBottom:10 }}>Results for "{medInput}"</div>
            {medRes.map((r,i) => (
              <div key={i} style={{ ...s.card, padding:18, marginBottom:10, borderColor:i===0?C.primary+"44":C.border }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    {i===0 && <div style={{ fontSize:10, color:C.primary, fontWeight:800, marginBottom:4 }}>✓ BEST PRICE</div>}
                    <div style={{ fontWeight:700, color:"#fff", fontSize:14 }}>{r.ph}</div>
                    <div style={{ color:C.muted, fontSize:12 }}>📍 {r.dist}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:24, color:i===0?C.primary:"#fff" }}>₹{r.price}</div>
                    <div style={{ fontSize:11, color:r.inStock?C.primary:"#e05c5c", fontWeight:700 }}>{r.inStock?"In Stock":"Out of Stock"}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Nav tab={tab} setTab={(t)=>{ setScreen(null); setTab(t); }} />
    </div>
  );

  if (screen === "tracker") return (
    <div style={s.page}><CSS />
      <div style={{ padding:"52px 20px 20px", background:C.surf, borderBottom:`1px solid ${C.border}` }}>
        <div onClick={goBack} style={{ color:C.dim, fontSize:13, fontWeight:700, cursor:"pointer", marginBottom:12 }}>← Back</div>
        <div style={{ ...s.h1, fontSize:24 }}>📊 Health Tracker</div>
        <div style={{ color:C.muted, fontSize:13, marginTop:4 }}>Monitor vitals. Spot trends. Stay ahead.</div>
      </div>
      <div style={{ padding:"18px 18px 100px", overflowY:"auto", maxHeight:"calc(100vh - 180px)" }}>
        <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:10, scrollbarWidth:"none", marginBottom:16 }}>
          {VITALS.map((v,i) => <button key={i} onClick={() => setActiveV(i)} style={{ ...s.pill(activeV===i) }}>{v.icon} {v.label}</button>)}
        </div>
        <div style={{ ...s.card2, padding:22, marginBottom:16, borderColor:C.primary+"44" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
            <div>
              <div style={{ ...s.lbl, marginBottom:6 }}>{VITALS[activeV].icon} {VITALS[activeV].label}</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:46, fontWeight:900, color:C.primary, lineHeight:1 }}>{VITALS[activeV].value}</div>
              <div style={{ color:C.muted, fontSize:13, marginTop:6 }}>{VITALS[activeV].unit}</div>
            </div>
            <div style={{ background:"#0d3326", color:C.primary, padding:"6px 12px", borderRadius:10, fontSize:12, fontWeight:800 }}>✓ {VITALS[activeV].trend}</div>
          </div>
          <div style={{ ...s.lbl, marginBottom:10 }}>7-Day Trend</div>
          <div style={{ display:"flex", gap:6, alignItems:"flex-end", height:64 }}>
            {VITALS[activeV].history.map((v,i) => {
              const mx = Math.max(...VITALS[activeV].history), mn = Math.min(...VITALS[activeV].history);
              const pct = mx===mn ? 50 : ((v-mn)/(mx-mn))*45+18;
              return (
                <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                  <div style={{ width:"100%", height:pct, borderRadius:6, background:i===6?C.primary:C.primary+"44" }} />
                  <div style={{ fontSize:9, color:C.muted }}>D{i+1}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ ...s.lbl, marginBottom:10 }}>All Vitals</div>
        <div className="resp-grid resp-grid-2-to-4-vitals" style={{ display:"grid", gap:10 }}>
          {VITALS.map((v,i) => (
            <div key={i} onClick={() => setActiveV(i)} style={{ ...s.card, padding:18, cursor:"pointer", borderColor:activeV===i?C.primary+"44":C.border }}>
              <div style={{ fontSize:24, marginBottom:8 }}>{v.icon}</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:20, color:activeV===i?C.primary:"#fff" }}>{v.value}</div>
              <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{v.label}</div>
            </div>
          ))}
        </div>
        <button style={{ ...s.btn, marginTop:20 }}>+ Log New Reading</button>
      </div>
      <Nav tab={tab} setTab={(t)=>{ setScreen(null); setTab(t); }} />
    </div>
  );

  // ══ MAIN TAB VIEWS ═══════════════════════════════════════════════════════
  return (
    <div style={s.page}><CSS />

      {/* ── HOME ── */}
      {tab==="home" && (
        <div className="ai">
          <div style={{ background:`linear-gradient(160deg,#050e08 0%,#0a1f14 60%,#0d3326 100%)`, padding:"52px 20px 24px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
              <div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:34, fontWeight:900, letterSpacing:-1.5, color:"#fff", lineHeight:1 }}>
                  Arogya
                  <span style={{ fontSize:11, color:C.primary, marginLeft:8, fontWeight:700, letterSpacing:2 }}>HEALTH</span>
                </div>
                <div style={{ color:C.muted, fontSize:13, marginTop:8 }}>Good Morning, Aditya 👋</div>
                <div style={{ color:C.muted, fontSize:12, marginTop:2 }}>📍 New Delhi, India</div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8, alignItems:"flex-end" }}>
                <div style={{ width:42, height:42, borderRadius:"50%", background:C.card, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, cursor:"pointer" }}>🔔</div>
                <div style={{ background:"#0d3326", border:`1px solid ${C.primary}44`, borderRadius:10, padding:"4px 10px", display:"flex", alignItems:"center", gap:5 }}>
                  <span className="live" style={{ fontSize:8, color:C.primary }}>●</span>
                  <span style={{ fontSize:10, color:C.dim }}>All systems normal</span>
                </div>
              </div>
            </div>
            <div style={{ background:C.card2, borderRadius:14, padding:"11px 16px", display:"flex", alignItems:"center", gap:10, border:`1px solid ${C.border}` }}>
              <span>🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search doctors, clinics, symptoms..." style={{ background:"transparent", border:"none", outline:"none", color:C.text, fontSize:14, flex:1 }} />
            </div>
          </div>

          <div style={{ padding:"18px 18px 90px", overflowY:"auto", maxHeight:"calc(100vh - 220px)" }}>
            {/* Family Switcher */}
            <div style={{ display:"flex", gap:10, marginBottom:16, overflowX:"auto", scrollbarWidth:"none" }}>
              {FAMILY.map((f,i) => (
                <div key={i} onClick={() => setFamIdx(i)} style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:5, cursor:"pointer" }}>
                  <div style={{ width:46, height:46, borderRadius:"50%", background:famIdx===i?C.primary:C.card2, border:`2px solid ${famIdx===i?C.primary:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:famIdx===i?"#000":C.dim, transition:"all .15s" }}>{f.av}</div>
                  <div style={{ fontSize:10, color:famIdx===i?C.primary:C.muted, fontWeight:700 }}>{f.rel}</div>
                </div>
              ))}
              <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:5, cursor:"pointer" }}>
                <div style={{ width:46, height:46, borderRadius:"50%", background:C.card2, border:`2px dashed ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, color:C.muted }}>+</div>
                <div style={{ fontSize:10, color:C.muted, fontWeight:700 }}>Add</div>
              </div>
            </div>

            {/* Health Score */}
            <div style={{ background:`linear-gradient(135deg,${C.surf},#0d2e1e)`, borderRadius:22, padding:22, marginBottom:16, border:`1px solid ${scoreClr}33`, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", right:-20, top:-20, width:130, height:130, borderRadius:"50%", background:scoreClr+"07" }} />
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ ...s.lbl, marginBottom:6 }}>Health Score — {FAMILY[famIdx].name}</div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:56, fontWeight:900, color:scoreClr, lineHeight:1 }}>{score}</div>
                  <div style={{ color:C.muted, fontSize:12, marginTop:6 }}>{score>=85?"🟢 Excellent — Keep it up!":score>=70?"🟡 Good — Minor concerns":"🔴 Needs Attention"}</div>
                </div>
                <div style={{ width:80, height:80, position:"relative", flexShrink:0 }}>
                  <svg width={80} height={80} viewBox="0 0 80 80">
                    <circle cx={40} cy={40} r={32} fill="none" stroke={C.border} strokeWidth={8}/>
                    <circle cx={40} cy={40} r={32} fill="none" stroke={scoreClr} strokeWidth={8} strokeLinecap="round"
                      strokeDasharray={`${(score/100)*201} 201`} transform="rotate(-90 40 40)" style={{ transition:"stroke-dasharray 1s ease" }}/>
                  </svg>
                  <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:900, color:scoreClr }}>{score}%</div>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8, marginTop:16 }}>
                {["Diet","Sleep","Exercise","Checkups"].map((lb,i) => {
                  const vals=[85,70,60,90];
                  return (
                    <div key={i} style={{ background:C.card, borderRadius:10, padding:"8px 6px", textAlign:"center" }}>
                      <div style={{ fontSize:9, color:C.muted, fontWeight:700, marginBottom:4 }}>{lb}</div>
                      <div style={{ fontWeight:900, color:vals[i]>=80?C.primary:vals[i]>=65?C.gold:"#e05c5c", fontSize:14 }}>{vals[i]}%</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Next Appointment */}
            <div style={{ background:`linear-gradient(135deg,#0a1f14,#0d3326)`, borderRadius:20, padding:18, marginBottom:16, border:`1px solid ${C.primary}33` }}>
              <div style={{ ...s.lbl, marginBottom:10 }}>📅 Next Appointment</div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ ...s.h1, fontSize:18 }}>Dr. Priya Sharma</div>
                  <div style={{ color:C.dim, fontSize:13, marginTop:2 }}>Dermatologist · SkinCare Clinic</div>
                  <div style={{ display:"flex", gap:8, marginTop:10, flexWrap:"wrap" }}>
                    <span style={{ background:C.primary+"22", color:C.primary, padding:"5px 10px", borderRadius:8, fontSize:11, fontWeight:700 }}>⏰ Today, 11:30 AM</span>
                    <span style={{ background:C.card, color:C.dim, padding:"5px 10px", borderRadius:8, fontSize:11, fontWeight:700 }}>🎟 Token #14</span>
                    <span style={{ background:"#0a1f38", color:"#4d9de0", padding:"5px 10px", borderRadius:8, fontSize:11, fontWeight:700 }}>📹 Video</span>
                  </div>
                </div>
                <div style={{ width:52, height:52, borderRadius:16, background:"#0d3326", border:`1px solid ${C.primary}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:900, color:C.primary, flexShrink:0 }}>PS</div>
              </div>
            </div>

            {/* AI Quick Actions */}
            <div style={{ ...s.lbl, marginBottom:10 }}>⚡ AI Quick Actions</div>
            <div className="resp-grid resp-grid-2-to-4" style={{ display:"grid", gap:10, marginBottom:16 }}>
              {[
                { icon:"🤒", title:"Symptom Checker", sub:"AI → right doctor", bg:"#0d2e1e", ac:C.primary, action:()=>setScreen("ai-symptom") },
                { icon:"💊", title:"Medicine Prices", sub:"Best deals nearby", bg:"#2a1a00", ac:C.gold, action:()=>setScreen("ai-medicine") },
                { icon:"📊", title:"Health Tracker", sub:"Vitals & trends", bg:"#0a1520", ac:"#4d9de0", action:()=>setScreen("tracker") },
                { icon:"🔐", title:"Health Vault", sub:"Your secure records", bg:"#1a0a2e", ac:"#a78bfa", action:()=>setTab("vault") },
              ].map((it,i) => (
                <div key={i} onClick={it.action} style={{ background:it.bg, borderRadius:18, padding:18, cursor:"pointer", border:`1px solid ${it.ac}22` }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>{it.icon}</div>
                  <div style={{ fontWeight:800, color:"#fff", fontSize:14 }}>{it.title}</div>
                  <div style={{ fontSize:11, color:it.ac, marginTop:3, fontWeight:600 }}>{it.sub}</div>
                </div>
              ))}
            </div>

            {/* Specialties */}
            <div style={{ ...s.lbl, marginBottom:10 }}>Find by Specialty</div>
            <div className="resp-grid resp-grid-4-to-8" style={{ display:"grid", gap:8, marginBottom:16 }}>
              {[{n:"Skin",i:"🧴",sp:"Dermatologist"},{n:"Dental",i:"🦷",sp:"Dentist"},{n:"Heart",i:"❤️",sp:"Cardiologist"},{n:"Bones",i:"🦴",sp:"Orthopedic"},{n:"Child",i:"👶",sp:"Pediatrician"},{n:"Brain",i:"🧠",sp:"Neurologist"},{n:"Eyes",i:"👁️",sp:null},{n:"All",i:"➕",sp:"All"}].map((sp,i) => (
                <div key={i} onClick={() => { if(sp.sp){ setSpec(sp.sp==="All"?"All":sp.sp); setTab("doctors"); } }} style={{ ...s.card, padding:"12px 6px", textAlign:"center", cursor:"pointer" }}>
                  <div style={{ fontSize:20, marginBottom:5 }}>{sp.i}</div>
                  <div style={{ fontSize:10, fontWeight:700, color:C.dim }}>{sp.n}</div>
                </div>
              ))}
            </div>

            {/* Top Doctors */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <div style={{ ...s.lbl }}>Top Doctors Near You</div>
              <span onClick={() => setTab("doctors")} style={{ color:C.primary, fontSize:12, fontWeight:700, cursor:"pointer" }}>See all →</span>
            </div>
            {DOCTORS.slice(0,3).map(doc => (
              <div key={doc.id} style={{ ...s.card, padding:16, marginBottom:10, cursor:"pointer", display:"flex", gap:14, alignItems:"center" }} onClick={() => goDoc(doc)}>
                <div style={{ width:52, height:52, borderRadius:16, background:doc.clr, border:`1px solid ${doc.ac}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:900, color:doc.ac, flexShrink:0 }}>{doc.av}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, color:"#fff", fontSize:14 }}>{doc.name} {doc.verified&&"✅"}</div>
                  <div style={{ color:C.muted, fontSize:12 }}>{doc.specialty} · {doc.exp}y exp</div>
                  <div style={{ display:"flex", gap:10, marginTop:5 }}>
                    <span style={{ fontSize:12, color:"#f59e0b", fontWeight:700 }}>⭐ {doc.rating}</span>
                    <span style={{ color:C.primary, fontWeight:700, fontSize:12 }}>₹{doc.fee}</span>
                    <span style={{ color:C.muted, fontSize:11 }}>Queue: {doc.queue}</span>
                  </div>
                </div>
                <div style={{ background:doc.next==="Today"?"#0d3326":"#2a1a00", color:doc.next==="Today"?C.primary:C.gold, padding:"4px 10px", borderRadius:8, fontSize:10, fontWeight:800, whiteSpace:"nowrap" }}>{doc.next}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── DOCTORS ── */}
      {tab==="doctors" && (
        <div className="ai">
          <div style={{ padding:"52px 20px 18px", background:C.surf, borderBottom:`1px solid ${C.border}` }}>
            <div style={{ ...s.h1, fontSize:26, marginBottom:14 }}>Find Doctors</div>
            <div style={{ background:C.card2, borderRadius:14, padding:"11px 16px", display:"flex", alignItems:"center", gap:10, border:`1px solid ${C.border}`, marginBottom:14 }}>
              <span>🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Name, specialty, location..." style={{ background:"transparent", border:"none", outline:"none", color:C.text, fontSize:14, flex:1 }} />
            </div>
            <div style={{ display:"flex", gap:8, overflowX:"auto", scrollbarWidth:"none", paddingBottom:4 }}>
              {["All","Dermatologist","Dentist","Cardiologist","Orthopedic","Pediatrician","Neurologist"].map(sp => (
                <button key={sp} onClick={() => setSpec(sp)} style={{ ...s.pill(specFilter===sp), fontSize:11 }}>{sp}</button>
              ))}
            </div>
          </div>
          <div style={{ padding:"14px 18px 90px", overflowY:"auto", maxHeight:"calc(100vh - 200px)" }}>
            <div style={{ color:C.muted, fontSize:13, marginBottom:14 }}>{filtered.length} doctors found</div>
            <div className="resp-grid-1-to-2">
            {filtered.map(doc => (
              <div key={doc.id} style={{ ...s.card, padding:18, marginBottom:12, cursor:"pointer" }} onClick={() => goDoc(doc)}>
                <div style={{ display:"flex", gap:14 }}>
                  <div style={{ width:60, height:60, borderRadius:18, background:doc.clr, border:`1px solid ${doc.ac}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, fontWeight:900, color:doc.ac, flexShrink:0 }}>{doc.av}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                      <div>
                        <div style={{ fontWeight:700, fontSize:15, color:"#fff" }}>{doc.name} {doc.verified&&"✅"}</div>
                        <div style={{ fontSize:13, color:doc.ac, fontWeight:600 }}>{doc.specialty}</div>
                        <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>📍 {doc.location}</div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:18, color:"#fff" }}>₹{doc.fee}</div>
                        <div style={{ fontSize:10, color:C.muted }}>per visit</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:10, flexWrap:"wrap" }}>
                      <span style={{ fontSize:12, color:"#f59e0b", fontWeight:700 }}>⭐ {doc.rating}</span>
                      <span style={{ fontSize:11, color:C.muted }}>({doc.reviews})</span>
                      <span style={{ fontSize:11, color:"#4d9de0", fontWeight:700 }}>⏱ {doc.punctuality}% on-time</span>
                      <div style={{ marginLeft:"auto", background:doc.next==="Today"?"#0d3326":"#2a1a00", color:doc.next==="Today"?C.primary:C.gold, padding:"3px 10px", borderRadius:8, fontSize:10, fontWeight:800 }}>{doc.next}</div>
                    </div>
                    <div style={{ display:"flex", gap:6, marginTop:8 }}>
                      {doc.mode.includes("video") && <span style={{ background:"#0a1f38", color:"#4d9de0", fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:6 }}>📹 Video</span>}
                      <span style={{ background:"#0a1f14", color:C.primary, fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:6 }}>Queue: {doc.queue}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      )}

      {/* ── AI HUB ── */}
      {tab==="ai" && (
        <div className="ai">
          <div style={{ padding:"52px 20px 22px", background:`linear-gradient(160deg,${C.surf},#0d1a0d)` }}>
            <div style={{ ...s.h1, fontSize:28, marginBottom:4 }}>AI Health Hub 🤖</div>
            <div style={{ color:C.muted, fontSize:13 }}>Your intelligent health companion — powered by Arogya AI</div>
          </div>
          <div style={{ padding:"18px 18px 90px", overflowY:"auto", maxHeight:"calc(100vh - 175px)" }}>
            {[
              { icon:"🤒", title:"Symptom Checker", desc:"Describe your symptoms and our AI pinpoints the right specialist with urgency level.", bg:"#0d2e1e", ac:C.primary, action:()=>setScreen("ai-symptom") },
              { icon:"💊", title:"Medicine Price Finder", desc:"Compare prices for any medicine across Apollo, MedPlus, 1mg and more.", bg:"#2a1a00", ac:C.gold, action:()=>setScreen("ai-medicine") },
              { icon:"📊", title:"Vitals & Health Tracker", desc:"Log BP, blood sugar, heart rate daily and visualise 7-day trends.", bg:"#0a1520", ac:"#4d9de0", action:()=>setScreen("tracker") },
              { icon:"📋", title:"Smart Health Summary", desc:"AI generates a 1-page health brief from your vault to share with any new doctor instantly.", bg:"#1a0a2e", ac:"#a78bfa", action:()=>{} },
              { icon:"🔔", title:"Follow-up Reminders", desc:"AI learns your treatment cycle and nudges you before conditions worsen.", bg:"#0d2000", ac:"#4ade80", action:()=>{} },
              { icon:"🛡️", title:"Insurance Coverage Check", desc:"Know upfront if a doctor or treatment is covered under your policy.", bg:"#200d0d", ac:"#e05c5c", action:()=>{} },
            ].map((it,i) => (
              <div key={i} onClick={it.action} style={{ background:it.bg, borderRadius:20, padding:20, marginBottom:12, cursor:"pointer", border:`1px solid ${it.ac}22`, display:"flex", gap:16, alignItems:"center" }}>
                <div style={{ fontSize:38, flexShrink:0 }}>{it.icon}</div>
                <div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:"#fff", fontSize:16 }}>{it.title}</div>
                  <div style={{ fontSize:12, color:it.ac, marginTop:5, lineHeight:1.6 }}>{it.desc}</div>
                </div>
                <div style={{ marginLeft:"auto", fontSize:18, color:it.ac, flexShrink:0 }}>›</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── VAULT ── */}
      {tab==="vault" && (
        <div className="ai">
          <div style={{ padding:"52px 20px 22px", background:`linear-gradient(160deg,${C.surf},#0d0a2e)`, borderBottom:`1px solid ${C.border}` }}>
            <div style={{ ...s.h1, fontSize:26, marginBottom:4 }}>Health Vault 🔐</div>
            <div style={{ color:C.muted, fontSize:13 }}>Zero-knowledge encrypted · Only you hold the key</div>
          </div>
          <div style={{ padding:"18px 18px 90px", overflowY:"auto", maxHeight:"calc(100vh - 175px)" }}>
            {!vaultOpen ? (
              <div style={{ ...s.card2, padding:36, textAlign:"center", marginTop:10 }}>
                <div style={{ width:80, height:80, borderRadius:"50%", background:"radial-gradient(circle,#a78bfa22,#a78bfa08)", border:"1.5px solid #a78bfa44", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, margin:"0 auto 20px" }}>🔒</div>
                <div style={{ ...s.h1, fontSize:20, marginBottom:8 }}>Vault Locked</div>
                <div style={{ color:C.muted, fontSize:13, marginBottom:26, lineHeight:1.7 }}>Enter your 4-digit PIN to access<br />your encrypted medical records.<br /><strong style={{ color:"#a78bfa" }}>Demo PIN: 1234</strong></div>
                <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:8 }}>
                  {[0,1,2,3].map(i => (
                    <input key={i} ref={pinRefs[i]} type="password" maxLength={1} value={vaultPin[i]||""}
                      onChange={e => pinDigit(i, e.target.value.slice(-1))}
                      onKeyDown={e => { if(e.key==="Backspace"&&!vaultPin[i]&&i>0) pinRefs[i-1].current?.focus(); }}
                      style={{ width:56, height:64, border:`2px solid ${pinErr?"#e05c5c":vaultPin[i]?"#a78bfa":C.border}`, borderRadius:16, background:C.card, color:"#a78bfa", textAlign:"center", fontSize:26, fontWeight:900, outline:"none", fontFamily:"inherit" }} />
                  ))}
                </div>
                {pinErr && <div style={{ color:"#e05c5c", fontSize:13, fontWeight:700, marginBottom:14 }}>❌ Incorrect PIN — Try again</div>}
                <button style={{ ...s.btn, background:"linear-gradient(135deg,#6d28d9,#a78bfa)", color:"#fff", marginTop:8 }} onClick={unlockVault} disabled={vaultPin.length<4}>Unlock Vault</button>
              </div>
            ) : (
              <div>
                <div style={{ background:"linear-gradient(135deg,#1a0a2e,#2d1060)", borderRadius:16, padding:16, display:"flex", alignItems:"center", gap:12, marginBottom:18, border:"1px solid #a78bfa44" }}>
                  <span style={{ fontSize:22 }}>🔓</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:800, color:"#fff" }}>Vault Unlocked</div>
                    <div style={{ fontSize:12, color:"#a78bfa" }}>Auto-locks in 5 min · End-to-end encrypted</div>
                  </div>
                  <button onClick={() => { setVaultOpen(false); setVaultPin(""); }} style={{ background:"#a78bfa22", color:"#a78bfa", border:"1px solid #a78bfa44", borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Lock</button>
                </div>

                {/* Emergency QR */}
                <div onClick={() => setShowQR(!showQR)} style={{ ...s.card, padding:16, marginBottom:14, cursor:"pointer", borderColor:"#e05c5c44", background:"#2d0f0f" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontWeight:800, color:"#fff", fontSize:14 }}>🆘 Emergency QR Code</div>
                      <div style={{ color:"#e05c5c", fontSize:12, marginTop:3 }}>For first responders — no PIN needed</div>
                    </div>
                    <span style={{ color:"#e05c5c", fontSize:18 }}>{showQR?"▲":"▼"}</span>
                  </div>
                  {showQR && (
                    <div style={{ marginTop:16, textAlign:"center" }}>
                      <div style={{ background:"#fff", borderRadius:14, padding:16, display:"inline-block", marginBottom:14 }}>
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(8,11px)", gap:2 }}>
                          {Array.from({length:64},(_,i)=>(
                            <div key={i} style={{ width:11, height:11, borderRadius:2, background:[0,1,8,9,56,57,63,62,7,48,16,6,42,21,35,28].includes(i%64)?`#000`:Math.random()>.45?"#000":"#fff" }} />
                          ))}
                        </div>
                      </div>
                      <div style={{ background:C.card, borderRadius:12, padding:12, textAlign:"left" }}>
                        <div style={{ color:"#e05c5c", fontWeight:800, fontSize:12, marginBottom:8 }}>⚠️ Emergency Info (Public)</div>
                        {[["Name","Aditya Kumar"],["Blood","B+ (Important)"],["Allergies","Penicillin ⚠️"],["Emergency","Meera: +91 98765 43210"]].map(([k,v])=>(
                          <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                            <span style={{ color:C.muted, fontSize:12 }}>{k}</span>
                            <span style={{ color:"#fff", fontWeight:700, fontSize:12 }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Records */}
                <div style={{ ...s.lbl, marginBottom:12 }}>Your Records ({records.length})</div>
                {records.map(rec => (
                  <div key={rec.id} style={{ ...s.card, padding:18, marginBottom:12, borderColor:rec.shared?C.gold+"44":C.border }}>
                    <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                      <div style={{ width:50, height:50, borderRadius:14, background:rec.ac+"22", border:`1px solid ${rec.ac}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{rec.icon}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, color:"#fff", fontSize:14 }}>{rec.title}</div>
                        <div style={{ color:C.muted, fontSize:12, marginTop:2 }}>{rec.doctor} · {rec.date}</div>
                        <span style={{ background:rec.ac+"22", color:rec.ac, fontSize:10, fontWeight:800, padding:"3px 8px", borderRadius:6, marginTop:6, display:"inline-block" }}>{rec.type}</span>
                        {rec.note && (
                          <div>
                            <div onClick={() => setShowNote(showNote===rec.id?null:rec.id)} style={{ fontSize:11, color:"#4d9de0", fontWeight:700, marginTop:8, cursor:"pointer" }}>
                              📝 Doctor Note {showNote===rec.id?"▲":"▼"}
                            </div>
                            {showNote===rec.id && (
                              <div style={{ background:"#0a1f38", borderRadius:8, padding:10, marginTop:6, fontSize:12, color:C.dim, lineHeight:1.6 }}>{rec.note}</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {!rec.shared ? (
                      <div style={{ marginTop:14, display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                        <span style={{ ...s.lbl, flex:1 }}>Grant Access:</span>
                        {[2,6,24].map(h => (
                          <button key={h} onClick={() => toggleShare(rec.id,h)} style={{ background:C.card2, color:C.primary, border:`1px solid ${C.primary}44`, borderRadius:8, padding:"7px 12px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>{h}h</button>
                        ))}
                      </div>
                    ) : (
                      <div style={{ marginTop:12, background:"#2a1a00", borderRadius:10, padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center", border:"1px solid #f0b42944" }}>
                        <div>
                          <div style={{ color:C.gold, fontSize:12, fontWeight:800 }}>🔓 Shared · {rec.sharedUntil} remaining</div>
                          <div style={{ color:C.muted, fontSize:11 }}>Doctor can view & annotate</div>
                        </div>
                        <button onClick={() => toggleShare(rec.id,0)} style={{ background:"#e05c5c22", color:"#e05c5c", border:"1px solid #e05c5c44", borderRadius:8, padding:"5px 10px", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Revoke</button>
                      </div>
                    )}
                  </div>
                ))}

                <button style={{ ...s.btn, background:"linear-gradient(135deg,#6d28d9,#a78bfa)", color:"#fff", marginTop:4 }}>+ Upload New Record</button>
                <div style={{ height:16 }} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PROFILE ── */}
      {tab==="profile" && (
        <div className="ai">
          <div style={{ padding:"52px 20px 22px", background:`linear-gradient(160deg,${C.surf},#0a0a1f)` }}>
            <div style={{ ...s.h1, fontSize:26, marginBottom:4 }}>My Profile</div>
          </div>
          <div style={{ padding:"18px 18px 90px", overflowY:"auto", maxHeight:"calc(100vh - 175px)" }}>
            <div style={{ ...s.card2, padding:22, marginBottom:16, display:"flex", gap:16, alignItems:"center" }}>
              <div style={{ width:70, height:70, borderRadius:"50%", background:`linear-gradient(135deg,#0d3326,#1a7a52)`, border:`2px solid ${C.primary}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:900, color:C.primary, flexShrink:0 }}>AK</div>
              <div>
                <div style={{ ...s.h1, fontSize:20 }}>Aditya Kumar</div>
                <div style={{ color:C.muted, fontSize:13 }}>aditya@email.com</div>
                <div style={{ color:C.muted, fontSize:13 }}>+91 98765 43210</div>
                <div style={{ display:"flex", gap:8, marginTop:8, flexWrap:"wrap" }}>
                  <span style={{ background:"#0d3326", color:C.primary, fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:6 }}>B+ Blood</span>
                  <span style={{ background:"#2d0f0f", color:"#e05c5c", fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:6 }}>Penicillin Allergy</span>
                </div>
              </div>
            </div>

            <div style={{ ...s.lbl, marginBottom:10 }}>👨‍👩‍👧‍👦 Family Health Hub</div>
            {FAMILY.map((f,i) => (
              <div key={i} style={{ ...s.card, padding:16, marginBottom:10, display:"flex", gap:14, alignItems:"center" }}>
                <div style={{ width:48, height:48, borderRadius:"50%", background:C.card2, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:C.dim }}>{f.av}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, color:"#fff" }}>{f.name}</div>
                  <div style={{ color:C.muted, fontSize:12 }}>{f.rel} · Age {f.age} · {f.blood}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:22, color:f.score>=85?C.primary:f.score>=70?C.gold:"#e05c5c" }}>{f.score}</div>
                  <div style={{ fontSize:10, color:C.muted }}>score</div>
                </div>
              </div>
            ))}

            <button style={{ ...s.btnO, marginBottom:16 }}>+ Add Family Member</button>

            <div style={{ ...s.lbl, marginBottom:10 }}>Quick Health Info</div>
            {[["🩸","Blood Group","B+"],["📏","Height","5'10\""],["⚖️","Weight","72 kg"],["🎂","Age","28 years"],["💊","Allergies","Penicillin"]].map(([ic,lb,v],i) => (
              <div key={i} style={{ ...s.card, padding:"14px 18px", marginBottom:8, display:"flex", alignItems:"center", gap:14 }}>
                <span style={{ fontSize:20 }}>{ic}</span>
                <span style={{ flex:1, color:C.dim, fontSize:14 }}>{lb}</span>
                <span style={{ fontWeight:700, color:"#fff", fontSize:14 }}>{v}</span>
              </div>
            ))}

            <div style={{ ...s.lbl, marginBottom:10, marginTop:16 }}>Settings</div>
            {["Notifications & Reminders","Insurance Details","Linked Devices","Privacy & Security","About Arogya","Logout"].map((it,i) => (
              <div key={i} style={{ ...s.card, padding:16, marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}>
                <span style={{ color:it==="Logout"?"#e05c5c":C.dim, fontSize:14 }}>{it}</span>
                <span style={{ color:C.muted }}>›</span>
              </div>
            ))}
            <div style={{ height:16 }} />
          </div>
        </div>
      )}

      <Nav tab={tab} setTab={setTab} />
    </div>
  );
}
