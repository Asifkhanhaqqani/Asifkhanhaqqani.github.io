import { useState, useEffect, useRef } from "react";

// ════════════════════════════════════════════════════════════════
// 6 BREAKPOINTS
//  xs   : < 375     (Mobile S   – tiny phones)
//  sm   : 375–639   (Mobile L   – standard phones)
//  md   : 640–767   (Tablet P   – portrait tablets)
//  lg   : 768–1023  (Tablet L   – landscape tablets)
//  xl   : 1024–1279 (Laptop     – small laptops)
//  2xl  : ≥ 1280    (Desktop    – wide screens)
// ════════════════════════════════════════════════════════════════
function useBreakpoint() {
  const get = (w) =>
    w < 375 ? "xs" : w < 640 ? "sm" : w < 768 ? "md" : w < 1024 ? "lg" : w < 1280 ? "xl" : "2xl";
  const [bp, setBp] = useState(() => get(typeof window !== "undefined" ? window.innerWidth : 1280));
  useEffect(() => {
    const h = () => setBp(get(window.innerWidth));
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return bp;
}

const isMobile  = (bp) => bp === "xs" || bp === "sm";
const isTablet  = (bp) => bp === "md" || bp === "lg";
const isDesktop = (bp) => bp === "xl" || bp === "2xl";

// ════════════════════════════════════════════════════════════════
// MOCK DATA
// ════════════════════════════════════════════════════════════════
const MOCK = {
  employees: [
    { id:33912, name:"David A. Boudreaux",  rank:"Capt", platoon:"A", station:"Station 11", machine:"E118", email:"boudreaux@fire.com", status:"Inactive" },
    { id:45798, name:"Jess A. Soldani",     rank:"FF",   platoon:"A", station:"Station 12", machine:"E118", email:"soldani@fire.com",   status:"Active"   },
    { id:50291, name:"Sean T. Dimak Jr.",   rank:"FF",   platoon:"A", station:"Station 11", machine:"E118", email:"dimak@fire.com",     status:"Active"   },
    { id:39474, name:"Jay D. Parr",         rank:"LT",   platoon:"A", station:"Station 11", machine:"E118", email:"parr@fire.com",      status:"Active"   },
    { id:44462, name:"Jonathan C. Ruffin",  rank:"OP",   platoon:"A", station:"Station 11", machine:"E118", email:"ruffin@fire.com",    status:"Active"   },
    { id:35793, name:"Thomas L. Schultz",   rank:"Capt", platoon:"B", station:"Station 11", machine:"E118", email:"schultz@fire.com",   status:"Active"   },
    { id:4694,  name:"Gary G. Gegenheimer", rank:"Capt", platoon:"A", station:"Station 13", machine:"E138", email:"gegen@fire.com",     status:"Active"   },
    { id:4409,  name:"Marcus R. Ellis",     rank:"LT",   platoon:"B", station:"Station 12", machine:"E128", email:"ellis@fire.com",     status:"Active"   },
    { id:4595,  name:"Denise K. Brown",     rank:"FF",   platoon:"C", station:"Station 16", machine:"E168", email:"brown@fire.com",     status:"Active"   },
  ],
  leaveRecords: [
    { id:1, empId:45798, empName:"Jess A. Soldani",    type:"AL",   leaveDate:"2025-10-04", endDate:"2025-10-04", startTime:"07:00", endTime:"08:30", station:"St.12", platoon:"A", status:"Approved"  },
    { id:2, empId:35793, empName:"Thomas L. Schultz",  type:"AL",   leaveDate:"2026-01-12", endDate:"2026-01-12", startTime:"05:00", endTime:"08:30", station:"St.11", platoon:"B", status:"Approved"  },
    { id:3, empId:39474, empName:"Jay D. Parr",        type:"FODI", leaveDate:"2026-01-15", endDate:"2026-01-15", startTime:"09:00", endTime:"12:00", station:"St.11", platoon:"A", status:"Waitlist"  },
    { id:4, empId:44462, empName:"Jonathan C. Ruffin", type:"VO",   leaveDate:"2026-01-18", endDate:"2026-01-18", startTime:"07:00", endTime:"15:00", station:"St.11", platoon:"A", status:"Waitlist"  },
    { id:5, empId:50291, empName:"Sean T. Dimak Jr.",  type:"SL",   leaveDate:"2026-01-20", endDate:"2026-01-21", startTime:"07:00", endTime:"07:00", station:"St.11", platoon:"A", status:"Cancelled" },
    { id:6, empId:4694,  empName:"Gary G. Gegenheimer",type:"SL",   leaveDate:"2026-01-07", endDate:"2026-01-07", startTime:"07:00", endTime:"07:00", station:"St.13", platoon:"A", status:"Approved"  },
  ],
  payroll: [
    { platoon:"B", station:"St.11", rank:"Capt", empName:"T. Schultz", worked:17.0, actingPos:"—",      actingHrs:0,   leaveType:"AL", leaveHrs:3.5, date:"Jan 12" },
    { platoon:"B", station:"St.11", rank:"Capt", empName:"T. Schultz", worked:0.0,  actingPos:"—",      actingHrs:0,   leaveType:"AL", leaveHrs:1.5, date:"Jan 12" },
    { platoon:"A", station:"St.12", rank:"FF",   empName:"J. Soldani", worked:22.5, actingPos:"ACT-DC", actingHrs:1.5, leaveType:"AL", leaveHrs:1.5, date:"Oct 4"  },
    { platoon:"A", station:"St.11", rank:"FF",   empName:"S. Dimak",   worked:24.0, actingPos:"—",      actingHrs:0,   leaveType:"—",  leaveHrs:0,   date:"Oct 4"  },
    { platoon:"A", station:"St.11", rank:"LT",   empName:"J. Parr",    worked:24.0, actingPos:"—",      actingHrs:0,   leaveType:"—",  leaveHrs:0,   date:"Oct 4"  },
    { platoon:"A", station:"St.11", rank:"OP",   empName:"J. Ruffin",  worked:24.0, actingPos:"—",      actingHrs:0,   leaveType:"—",  leaveHrs:0,   date:"Oct 4"  },
  ],
  workforce: [
    { name:"Station 11", machine:"E118", assigned:8, onDuty:6, det:1, mwa:0, ot:1 },
    { name:"Station 12", machine:"E128", assigned:8, onDuty:7, det:0, mwa:1, ot:0 },
    { name:"Station 13", machine:"E138", assigned:8, onDuty:8, det:0, mwa:0, ot:2 },
    { name:"Station 16", machine:"E168", assigned:6, onDuty:4, det:2, mwa:0, ot:0 },
    { name:"Station 17", machine:"L177", assigned:7, onDuty:5, det:1, mwa:1, ot:1 },
    { name:"Station 20", machine:"E208", assigned:7, onDuty:3, det:2, mwa:0, ot:0 },
  ],
  detRecords: [
    { empName:"Jess A. Soldani",     fromStation:"St.11 / E118", toStation:"St.11 / E118", newRank:"Cap",  date:"Jan 7", id:"1234"     },
    { empName:"Gary G. Gegenheimer", fromStation:"St.13 / E138", toStation:"St.17 / L177", newRank:"Capt", date:"Jan 7", id:"215e33cc" },
    { empName:"Marcus R. Ellis",     fromStation:"St.12 / E128", toStation:"St.15 / S159", newRank:"LT",   date:"Jan 7", id:"b5137ef4" },
    { empName:"Denise K. Brown",     fromStation:"St.16 / E168", toStation:"St.20 / E208", newRank:"FF",   date:"Jan 7", id:"377f5956" },
  ],
  timesheets: [
    { dateIn:"Dec 29", dateOut:"Dec 30", timeIn:"7:00 AM",  timeOut:"7:00 AM",  leaveStart:"",     leaveEnd:"",     leaveIn:"",        leaveOut:"",         hours:24.0, type:"" },
    { dateIn:"",       dateOut:"",       timeIn:"",          timeOut:"",          leaveStart:"Jan 4",leaveEnd:"Jan 4",leaveIn:"7:00 AM", leaveOut:"10:00 AM", hours:3.0,  type:"SL" },
    { dateIn:"Jan 4",  dateOut:"Jan 5",  timeIn:"10:00 AM", timeOut:"7:00 AM",  leaveStart:"",     leaveEnd:"",     leaveIn:"",        leaveOut:"",         hours:21.0, type:"" },
    { dateIn:"Jan 7",  dateOut:"Jan 8",  timeIn:"7:00 AM",  timeOut:"7:00 AM",  leaveStart:"",     leaveEnd:"",     leaveIn:"",        leaveOut:"",         hours:24.0, type:"" },
    { dateIn:"Jan 10", dateOut:"Jan 11", timeIn:"7:00 AM",  timeOut:"7:00 AM",  leaveStart:"",     leaveEnd:"",     leaveIn:"",        leaveOut:"",         hours:24.0, type:"" },
  ],
};

const API_BASE = "";
async function fetchData(ep, mock) {
  if (!API_BASE) return mock;
  try {
    const r = await fetch(`${API_BASE}${ep}`, { headers:{"Content-Type":"application/json"} });
    if (!r.ok) throw new Error();
    return await r.json();
  } catch { return mock; }
}

// ════════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════════
const initials = (n="") => n.split(" ").filter(Boolean).map(w=>w[0]).slice(0,2).join("").toUpperCase();
const staffPct = (s) => Math.round((s.onDuty / s.assigned) * 100);
const fmtDate  = (s) => { try { return new Date(s).toLocaleDateString("en-US",{month:"short",day:"numeric"}); } catch { return s; } };

// ════════════════════════════════════════════════════════════════
// THEMES
// ════════════════════════════════════════════════════════════════
const LIGHT = {
  bg:"#F4F3EF",    surface:"#FFFFFF", sidebar:"#FFFFFF", card:"#FFFFFF",
  border:"rgba(0,0,0,0.08)", text:"#17171A", muted:"#6B6B65", hint:"#9B9B93",
  accent:"#1B4FD8", accentBg:"#EEF2FF", accentTx:"#1B4FD8",
  success:"#15803D", successBg:"#DCFCE7",
  warn:"#B45309",    warnBg:"#FEF3C7",
  danger:"#B91C1C",  dangerBg:"#FEE2E2",
  metric:"#ECEAE4",  input:"#F4F3EF",
  navActive:"#EEF2FF", navActiveTx:"#1B4FD8",
  shadow:"0 1px 4px rgba(0,0,0,0.07)", bottomBar:"#FFFFFF",
};
const DARK = {
  bg:"#0E1019",    surface:"#181B26", sidebar:"#131620", card:"#181B26",
  border:"rgba(255,255,255,0.07)", text:"#E6E6E0", muted:"#9B9B93", hint:"#5A5A55",
  accent:"#6B8EFF", accentBg:"#1B2240", accentTx:"#6B8EFF",
  success:"#4ADE80", successBg:"#052E16",
  warn:"#FCD34D",    warnBg:"#2D1B00",
  danger:"#F87171",  dangerBg:"#2D0808",
  metric:"#1E2134",  input:"#1E2134",
  navActive:"#1B2240", navActiveTx:"#6B8EFF",
  shadow:"0 1px 4px rgba(0,0,0,0.4)", bottomBar:"#131620",
};

// ════════════════════════════════════════════════════════════════
// GLOBAL CSS  (injected once)
// ════════════════════════════════════════════════════════════════
const CSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body,#root{height:100%;width:100%}
  body{font-family:'DM Sans','Trebuchet MS',sans-serif;-webkit-font-smoothing:antialiased}
  ::-webkit-scrollbar{width:4px;height:4px}
  ::-webkit-scrollbar-thumb{background:rgba(128,128,128,0.22);border-radius:4px}
  ::-webkit-scrollbar-track{background:transparent}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

  /* ── SIDEBAR COLLAPSE TRANSITION ── */
  .crm-sb{transition:width .22s cubic-bezier(.4,0,.2,1),transform .22s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;overflow:hidden;flex-shrink:0}
  .crm-sb .lbl{transition:opacity .18s,max-width .22s;overflow:hidden;white-space:nowrap}
  .crm-sb.full  .lbl{opacity:1;max-width:180px}
  .crm-sb.icons .lbl{opacity:0;max-width:0;pointer-events:none}
  .crm-sb.icons .sec-hdr{opacity:0;pointer-events:none}
  .crm-sb.icons .footer-txt{display:none}
  .crm-sb.icons .badge{display:none}

  /* ── PAGE ANIMATION ── */
  .crm-page{animation:slideIn .18s ease}

  /* ── SCROLL TABLE ── */
  .tbl-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}
  .tbl-scroll table{border-collapse:collapse;width:100%}

  /* ── BOTTOM NAV ── */
  .btm-nav{display:none;position:fixed;bottom:0;left:0;right:0;z-index:60;border-top:0.5px solid transparent}

  /* ── BREAKPOINT RULES ── */

  /* xs + sm  →  mobile  */
  @media(max-width:639px){
    .btm-nav{display:flex}
    .hide-mobile{display:none!important}
    .g2{grid-template-columns:1fr!important}
    .g3{grid-template-columns:1fr!important}
    .g4{grid-template-columns:repeat(2,1fr)!important}
    .g6{grid-template-columns:repeat(2,1fr)!important}
    .crm-content{padding:12px!important;padding-bottom:76px!important}
    .tbl-scroll table{min-width:380px}
    .crm-topbar{padding:9px 12px!important}
  }

  /* xs only  →  extra-tiny adjustments  */
  @media(max-width:374px){
    .g4{grid-template-columns:1fr!important}
    .metric-val{font-size:20px!important}
    .crm-content{padding:10px!important;padding-bottom:74px!important}
  }

  /* md  →  tablet portrait  */
  @media(min-width:640px) and (max-width:767px){
    .g4{grid-template-columns:repeat(2,1fr)!important}
    .g6{grid-template-columns:repeat(2,1fr)!important}
    .g3{grid-template-columns:repeat(2,1fr)!important}
    .hide-md{display:none!important}
    .crm-content{padding:14px!important}
    .tbl-scroll table{min-width:460px}
  }

  /* lg  →  tablet landscape  */
  @media(min-width:768px) and (max-width:1023px){
    .g4{grid-template-columns:repeat(2,1fr)!important}
    .g6{grid-template-columns:repeat(3,1fr)!important}
    .hide-lg-down{display:none!important}
    .tbl-scroll table{min-width:500px}
  }

  /* xl  →  laptop  */
  @media(min-width:1024px) and (max-width:1279px){
    .hide-xl-only{display:none!important}
  }

  /* 2xl  →  wide desktop  */
  @media(min-width:1280px){
    .tbl-scroll table{min-width:unset}
  }

  /* hamburger: only show below 1024px (xs,sm,md,lg) */
  @media(min-width:1024px){
    .crm-hamburger{display:none!important}
    .btm-nav{display:none!important}
  }

  /* touch targets */
  @media(max-width:639px){
    button,select,input{min-height:40px}
    .btm-item{min-height:unset}
    .nav-row{min-height:44px!important}
  }

  /* row hover */
  .data-row:hover td{filter:brightness(0.97)}
`;

function useGlobalCSS() {
  useEffect(() => {
    if (document.getElementById("crm-css")) return;
    const s = document.createElement("style");
    s.id = "crm-css"; s.textContent = CSS;
    document.head.appendChild(s);
  }, []);
}

// ════════════════════════════════════════════════════════════════
// ICONS
// ════════════════════════════════════════════════════════════════
const IC = {
  grid:  "M1 1h6v6H1zM9 1h6v6H9zM1 9h6v6H1zM9 9h6v6H9z",
  people:"M6 7a3 3 0 100-6 3 3 0 000 6zm-5 8a5 5 0 019.6-2M13 7a2 2 0 100-4 2 2 0 000 4m2 7a4 4 0 00-6.7-2.9",
  cal:   "M2 4h12v10H2zM2 3h12M5 2v2M11 2v2M5 8h2M9 8h2M5 11h2",
  dollar:"M8 2v12M5 5h4.5a2 2 0 010 4H6a2 2 0 000 4H11",
  clock: "M8 2a6 6 0 100 12A6 6 0 008 2zM8 5v3l2 2",
  cog:   "M8 10a2 2 0 100-4 2 2 0 000 4zM8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.42 1.42M11.53 11.53l1.42 1.42M3.05 12.95l1.42-1.42M11.53 4.47l1.42-1.42",
  bag:   "M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M1 5h14v9H1zm4 3h6",
  moon:  "M12 3a6 6 0 00-6 9 6 6 0 009-6 4 4 0 01-3 3z",
  sun:   "M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.42 1.42M11.53 11.53l1.42 1.42M3.05 12.95l1.42-1.42M11.53 4.47l1.42-1.42M8 5a3 3 0 100 6 3 3 0 000-6z",
  menu:  "M2 4h12M2 8h12M2 12h12",
  search:"M7 13A6 6 0 107 1a6 6 0 000 12zm4-1l3 3",
  fire:  "M8 14s-5-3.5-5-7a5 5 0 0110 0c0 3.5-5 7-5 7z",
  plus:  "M8 2v12M2 8h12",
  chev:  "M6 3l5 5-5 5",
};
const Ico = ({ k, size=16, color }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{flexShrink:0}}>
    <path d={IC[k]} stroke={color||"currentColor"} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ════════════════════════════════════════════════════════════════
// NAV
// ════════════════════════════════════════════════════════════════
const NAV = [
  { id:"dashboard",  label:"Dashboard",    icon:"grid",   section:"Overview"   },
  { id:"employees",  label:"Employees",    icon:"people", section:"Personnel"  },
  { id:"workforce",  label:"Workforce",    icon:"bag",    section:"Personnel"  },
  { id:"leave",      label:"Leave",        icon:"cal",    section:"Operations", badge:true },
  { id:"payroll",    label:"Payroll",      icon:"dollar", section:"Operations" },
  { id:"timesheets", label:"Timesheets",   icon:"clock",  section:"Operations" },
  { id:"settings",   label:"Settings",     icon:"cog",    section:"Config"     },
];
const BTM = ["dashboard","employees","leave","payroll","settings"];

// ════════════════════════════════════════════════════════════════
// ATOMS
// ════════════════════════════════════════════════════════════════
function Pill({ label, color, t }) {
  const bg = {green:t.successBg,amber:t.warnBg,red:t.dangerBg,blue:t.accentBg}[color] ?? t.metric;
  const tx = {green:t.success,  amber:t.warn,  red:t.danger,  blue:t.accent  }[color] ?? t.muted;
  return <span style={{display:"inline-block",padding:"2px 8px",borderRadius:10,fontSize:11,fontWeight:600,whiteSpace:"nowrap",background:bg,color:tx}}>{label}</span>;
}

function SPill({ status, t }) {
  const c = status==="Active"||status==="Approved"?"green":status==="Waitlist"?"amber":status==="Cancelled"||status==="Inactive"?"red":"gray";
  return <Pill label={status} color={c} t={t}/>;
}

function Av({ name, idx=0, size=28, t }) {
  const BG = [t.accentBg,"#E1F5EE","#FAEEDA","#FBEAF0","#EAF3DE"];
  const TX = [t.accent,  "#0F6E56","#854F0B","#993556","#3B6D11"];
  const i  = (idx||0) % 5;
  return (
    <div style={{width:size,height:size,borderRadius:"50%",background:BG[i],color:TX[i],
      display:"inline-flex",alignItems:"center",justifyContent:"center",
      fontSize:size<32?10:12,fontWeight:700,flexShrink:0,userSelect:"none"}}>
      {initials(name)}
    </div>
  );
}

function Card({ children, t, style={} }) {
  return (
    <div style={{background:t.card,border:`0.5px solid ${t.border}`,borderRadius:12,
      padding:16,boxShadow:t.shadow,...style}}>
      {children}
    </div>
  );
}

function MetricCard({ label, value, sub, subColor, t, bp }) {
  const isXs = bp === "xs";
  return (
    <div style={{background:t.metric,borderRadius:10,padding: isXs ? "10px 12px" : "14px 16px"}}>
      <div style={{fontSize:10,color:t.muted,marginBottom:5,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.04em"}}>{label}</div>
      <div className="metric-val" style={{fontSize: isXs ? 22 : 26,fontWeight:700,letterSpacing:"-0.03em",lineHeight:1}}>{value}</div>
      {sub && <div style={{fontSize:11,color:subColor||t.hint,marginTop:5}}>{sub}</div>}
    </div>
  );
}

function Progress({ pct, t }) {
  const c = pct>=90?t.success:pct>=65?t.accent:pct>=40?t.warn:t.danger;
  return (
    <div style={{height:5,background:t.metric,borderRadius:3,overflow:"hidden"}}>
      <div style={{height:"100%",borderRadius:3,background:c,width:`${pct}%`,transition:"width .4s"}}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// RESPONSIVE TABLE
// Automatically picks columns based on bp
// ════════════════════════════════════════════════════════════════
function RTable({ cols, rows, t }) {
  // cols = [{ label, key, render?, hide }]  hide = array of bp names to hide on
  // rows = array of data objects
  const th = { textAlign:"left",padding:"7px 10px",color:t.hint,fontWeight:500,
    borderBottom:`0.5px solid ${t.border}`,fontSize:11,whiteSpace:"nowrap" };
  const td = { padding:"9px 10px",borderBottom:`0.5px solid ${t.border}`,
    color:t.text,fontSize:12,verticalAlign:"middle" };
  return (
    <div className="tbl-scroll">
      <table>
        <thead>
          <tr>
            {cols.map((c,i) => (
              <th key={i} style={th} className={c.hide?.join(" ")}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row,ri) => (
            <tr key={ri} className="data-row" style={{background:row._bg||"transparent"}}>
              {cols.map((c,ci) => (
                <td key={ci} style={td} className={c.hide?.join(" ")}>
                  {c.render ? c.render(row) : row[c.key] ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// MOBILE CARD LIST  (replaces tables on xs/sm)
// ════════════════════════════════════════════════════════════════
function MobileList({ items, renderItem, t }) {
  return (
    <div>
      {items.map((item,i) => (
        <div key={i} style={{borderBottom:i<items.length-1?`0.5px solid ${t.border}`:"none",padding:"11px 0"}}>
          {renderItem(item, i)}
        </div>
      ))}
    </div>
  );
}

// shared input / button / select styles
const mkInp = (t) => ({ padding:"7px 12px",border:`0.5px solid ${t.border}`,borderRadius:8,
  fontSize:12,background:t.input,color:t.text,fontFamily:"inherit",outline:"none",width:"100%" });
const mkSel = (t) => ({ ...mkInp(t),cursor:"pointer",width:"auto" });
const mkBtn = (t,primary) => ({ padding:"7px 14px",fontSize:12,borderRadius:8,cursor:"pointer",
  fontWeight:600,fontFamily:"inherit",border:primary?"none":`0.5px solid ${t.border}`,
  background:primary?t.accent:"transparent",color:primary?"#FFF":t.muted,transition:"opacity .15s",
  whiteSpace:"nowrap" });

// ════════════════════════════════════════════════════════════════
// DASHBOARD
// ════════════════════════════════════════════════════════════════
function Dashboard({ data, t, bp }) {
  const pending = data.leave.filter(l=>l.status==="Waitlist").length;
  const mobile  = isMobile(bp);
  const acts = [
    { c:t.success, text:"Payroll generated — Jan 12, B Platoon",  time:"Today 8:02 AM"      },
    { c:t.accent,  text:"Leave approved: Jess Soldani (SL)",       time:"Today 7:45 AM"      },
    { c:t.warn,    text:"DET: Station 12 → Station 17",            time:"Yesterday 5:30 PM"  },
    { c:t.accent,  text:"3 employees transferred to Database",     time:"Yesterday 7:12 AM"  },
    { c:t.muted,   text:"Timesheet exported — Emp #45798",         time:"Jan 6 4:00 PM"      },
  ];
  return (
    <div className="crm-page">
      {/* Metrics */}
      <div className="g4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
        <MetricCard label="Employees" value={data.employees.length} sub="↑ 3 this month" subColor={t.success} t={t} bp={bp}/>
        <MetricCard label="On Duty" value="84" sub="10 stations" t={t} bp={bp}/>
        <MetricCard label="Pending Leave" value={pending} sub="awaiting approval" subColor={t.danger} t={t} bp={bp}/>
        <MetricCard label="Pay Period" value="Jan 12" sub="2026 — B Platoon" t={t} bp={bp}/>
      </div>

      {/* Two cards */}
      <div className="g2" style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:16,marginBottom:16}}>
        <Card t={t}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:14}}>Recent leave requests</div>
          {mobile ? (
            <MobileList t={t} items={data.leave.slice(0,4)} renderItem={(l,i)=>(
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <Av name={l.empName} idx={i} t={t}/>
                  <div>
                    <div style={{fontSize:12,fontWeight:500}}>{l.empName.split(" ").slice(0,2).join(" ")}</div>
                    <div style={{fontSize:11,color:t.hint}}>{l.type} · {fmtDate(l.leaveDate)}</div>
                  </div>
                </div>
                <SPill status={l.status} t={t}/>
              </div>
            )}/>
          ) : (
            <RTable t={t}
              cols={[
                { label:"Employee", render:r=><div style={{display:"flex",alignItems:"center",gap:8}}><Av name={r.empName} idx={data.leave.indexOf(r)} t={t}/>{r.empName.split(" ").slice(0,2).join(" ")}</div> },
                { label:"Type",   key:"type",                    hide:["hide-md"] },
                { label:"Date",   render:r=>fmtDate(r.leaveDate) },
                { label:"Status", render:r=><SPill status={r.status} t={t}/> },
              ]}
              rows={data.leave.slice(0,5)}
            />
          )}
        </Card>

        <Card t={t}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:14}}>Activity log</div>
          {acts.slice(0, mobile ? 4 : 5).map((a,i)=>(
            <div key={i} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:i<acts.length-2?`0.5px solid ${t.border}`:"none"}}>
              <div style={{width:8,height:8,borderRadius:"50%",marginTop:5,flexShrink:0,background:a.c}}/>
              <div>
                <div style={{fontSize:12,lineHeight:1.5}}>{a.text}</div>
                <div style={{fontSize:11,color:t.hint,marginTop:2}}>{a.time}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Platoon table – hidden on xs */}
      {bp !== "xs" && (
        <Card t={t}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:14}}>On-duty summary by platoon</div>
          <RTable t={t}
            cols={[
              { label:"Platoon",  render:r=><Pill label={r.p} color={r.c} t={t}/> },
              { label:"Stations", render:r=>`Station ${r.st}` },
              { label:"Machines", key:"mc", hide:["hide-mobile","hide-md"] },
              { label:"On Duty",  key:"duty", render:r=><strong>{r.duty}</strong> },
              { label:"On Leave", key:"lv", hide:["hide-mobile"] },
              { label:"DET",      key:"det", hide:["hide-mobile"] },
              { label:"MWA",      key:"mwa", hide:["hide-mobile","hide-md"] },
              { label:"OT",       key:"ot",  hide:["hide-mobile","hide-md"] },
            ]}
            rows={[
              {p:"A",st:"11–13",mc:"E118/E128/E138",duty:28,lv:3,det:2,mwa:1,ot:4,c:"blue"},
              {p:"B",st:"14–16",mc:"E148/E158/E168",duty:31,lv:2,det:1,mwa:0,ot:3,c:"gray"},
              {p:"C",st:"17–20",mc:"L177/S159/E208",duty:25,lv:4,det:3,mwa:2,ot:2,c:"green"},
            ]}
          />
        </Card>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// EMPLOYEES
// ════════════════════════════════════════════════════════════════
function Employees({ data, t, bp }) {
  const [search, setSearch] = useState("");
  const [platF,  setPlatF]  = useState("All");
  const [rankF,  setRankF]  = useState("All");
  const mobile = isMobile(bp);
  const filtered = data.employees.filter(e=>
    (platF==="All"||e.platoon===platF) &&
    (rankF==="All"||e.rank===rankF) &&
    (e.name.toLowerCase().includes(search.toLowerCase())||String(e.id).includes(search))
  );
  const active = data.employees.filter(e=>e.status==="Active").length;
  return (
    <div className="crm-page">
      <div className="g4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
        <MetricCard label="Active" value={active} t={t} bp={bp}/>
        <MetricCard label="Inactive" value={data.employees.length-active} t={t} bp={bp}/>
        <MetricCard label="Captains" value={data.employees.filter(e=>e.rank==="Capt").length} t={t} bp={bp}/>
        <MetricCard label="Firefighters" value={data.employees.filter(e=>e.rank==="FF").length} t={t} bp={bp}/>
      </div>
      <Card t={t}>
        {/* Toolbar */}
        <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:10,marginBottom:14}}>
          <span style={{fontSize:13,fontWeight:600}}>Roster ({filtered.length})</span>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",flex:1,justifyContent:"flex-end"}}>
            <input style={{...mkInp(t),width:mobile?160:190}} placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)}/>
            <select style={mkSel(t)} value={platF} onChange={e=>setPlatF(e.target.value)}>
              <option>All</option><option>A</option><option>B</option><option>C</option>
            </select>
            <select style={mkSel(t)} value={rankF} onChange={e=>setRankF(e.target.value)}>
              <option>All</option><option>Capt</option><option>LT</option><option>FF</option><option>OP</option>
            </select>
          </div>
        </div>

        {mobile ? (
          <MobileList t={t} items={filtered} renderItem={(e,i)=>(
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <Av name={e.name} idx={i} size={36} t={t}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.name}</div>
                <div style={{fontSize:11,color:t.muted,marginTop:2}}><Pill label={e.rank} color="blue" t={t}/> <span style={{marginLeft:4}}>{e.station} · Pl.{e.platoon}</span></div>
                <div style={{fontSize:11,color:t.accent,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.email}</div>
              </div>
              <SPill status={e.status} t={t}/>
            </div>
          )}/>
        ) : (
          <RTable t={t}
            cols={[
              { label:"Name",    render:(e,_,i)=><div style={{display:"flex",alignItems:"center",gap:8}}><Av name={e.name} idx={_} t={t}/>{e.name}</div> },
              { label:"Emp No",  key:"id" },
              { label:"Rank",    render:r=><Pill label={r.rank} color="blue" t={t}/> },
              { label:"Platoon", key:"platoon" },
              { label:"Station", key:"station" },
              { label:"Machine", key:"machine", hide:["hide-md","hide-mobile"] },
              { label:"Email",   render:r=><span style={{color:t.accent,fontSize:12}}>{r.email}</span>, hide:["hide-md","hide-mobile","hide-lg-down"] },
              { label:"Status",  render:r=><SPill status={r.status} t={t}/> },
            ]}
            rows={filtered.map((e,i)=>({...e,_i:i}))}
          />
        )}
        {filtered.length===0 && <div style={{textAlign:"center",color:t.hint,padding:"24px 0",fontSize:13}}>No employees found</div>}
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// WORKFORCE
// ════════════════════════════════════════════════════════════════
function Workforce({ data, t, bp }) {
  const mobile = isMobile(bp);
  const isXs   = bp === "xs";
  const gridCols = isXs ? "1fr" : mobile ? "repeat(2,1fr)" : bp==="md" ? "repeat(2,1fr)" : "repeat(3,1fr)";
  return (
    <div className="crm-page">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:8}}>
        <div style={{fontSize:13,color:t.muted}}>
          <strong style={{color:t.text}}>Jan 7, 2026</strong> · Platoon <strong style={{color:t.text}}>A</strong>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button style={mkBtn(t)}>← Prev</button>
          <button style={mkBtn(t)}>Next →</button>
        </div>
      </div>

      {/* Station cards */}
      <div style={{display:"grid",gridTemplateColumns:gridCols,gap:12,marginBottom:16}}>
        {data.workforce.map(st=>{
          const pct = staffPct(st);
          const pColor = pct>=90?t.success:pct>=65?t.accent:pct>=40?t.warn:t.danger;
          return (
            <Card key={st.name} t={t} style={{padding:14}}>
              <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>
                {st.name} <span style={{color:t.muted,fontWeight:400,fontSize:11}}>— {st.machine}</span>
              </div>
              {[["Assigned",st.assigned],["On Duty",st.onDuty],["DET",st.det],["MWA",st.mwa],["OT",st.ot]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"3px 0",color:t.muted}}>
                  <span>{l}</span><span style={{color:t.text,fontWeight:600}}>{v}</span>
                </div>
              ))}
              <div style={{marginTop:10}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:t.hint,marginBottom:4}}>
                  <span>Staffing</span><span style={{fontWeight:700,color:pColor}}>{pct}%</span>
                </div>
                <Progress pct={pct} t={t}/>
              </div>
            </Card>
          );
        })}
      </div>

      {/* DET table */}
      <Card t={t}>
        <div style={{fontSize:13,fontWeight:600,marginBottom:14}}>DET assignments — Jan 7</div>
        {mobile ? (
          <MobileList t={t} items={data.detRecords} renderItem={(d,i)=>(
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <Av name={d.empName} idx={i} t={t}/>
                <div>
                  <div style={{fontSize:12,fontWeight:500}}>{d.empName.split(" ").slice(0,2).join(" ")}</div>
                  <div style={{fontSize:11,color:t.hint}}>{d.fromStation} → {d.toStation}</div>
                </div>
              </div>
              <Pill label={d.newRank} color="blue" t={t}/>
            </div>
          )}/>
        ) : (
          <RTable t={t}
            cols={[
              { label:"Employee", render:(d,_,i)=><div style={{display:"flex",alignItems:"center",gap:8}}><Av name={d.empName} idx={i} t={t}/>{d.empName}</div> },
              { label:"From",     key:"fromStation", hide:["hide-md"] },
              { label:"To",       key:"toStation" },
              { label:"New Rank", render:r=><Pill label={r.newRank} color="blue" t={t}/> },
              { label:"Date",     key:"date",  hide:["hide-mobile","hide-md"] },
              { label:"ID",       render:r=><code style={{fontSize:11,color:t.hint}}>{r.id}</code>, hide:["hide-mobile","hide-md"] },
            ]}
            rows={data.detRecords.map((d,i)=>({...d,_i:i}))}
          />
        )}
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// LEAVE
// ════════════════════════════════════════════════════════════════
function Leave({ data, t, bp }) {
  const [statusF, setStatusF] = useState("All");
  const [typeF,   setTypeF]   = useState("All");
  const mobile = isMobile(bp);
  const filtered = data.leave.filter(l=>(statusF==="All"||l.status===statusF)&&(typeF==="All"||l.type===typeF));
  const counts = {Approved:0,Waitlist:0,Cancelled:0};
  data.leave.forEach(l=>{if(counts[l.status]!==undefined)counts[l.status]++;});
  return (
    <div className="crm-page">
      <div className="g4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
        {[["Approved",counts.Approved,t.success],["Waitlist",counts.Waitlist,t.warn],["Cancelled",counts.Cancelled,t.danger],["Total",data.leave.length,t.text]].map(([l,v,c])=>(
          <div key={l} style={{background:t.metric,borderRadius:10,padding:"12px 14px",textAlign:"center"}}>
            <div style={{fontSize:bp==="xs"?18:22,fontWeight:700,color:c}}>{v}</div>
            <div style={{fontSize:11,color:t.muted,marginTop:4}}>{l}</div>
          </div>
        ))}
      </div>
      <Card t={t}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
          <span style={{fontSize:13,fontWeight:600}}>Leave records ({filtered.length})</span>
          <div style={{display:"flex",gap:8}}>
            <select style={mkSel(t)} value={statusF} onChange={e=>setStatusF(e.target.value)}>
              <option>All</option><option>Approved</option><option>Waitlist</option><option>Cancelled</option>
            </select>
            <select style={mkSel(t)} value={typeF} onChange={e=>setTypeF(e.target.value)}>
              <option>All</option><option>SL</option><option>AL</option><option>FODI</option><option>VO</option>
            </select>
          </div>
        </div>
        {mobile ? (
          <MobileList t={t} items={filtered} renderItem={(l,i)=>(
            <div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <Av name={l.empName} idx={i} t={t}/>
                  <div>
                    <div style={{fontSize:13,fontWeight:500}}>{l.empName.split(" ").slice(0,2).join(" ")}</div>
                    <div style={{fontSize:11,color:t.hint}}>{fmtDate(l.leaveDate)} · {l.startTime}–{l.endTime}</div>
                  </div>
                </div>
                <SPill status={l.status} t={t}/>
              </div>
              <div style={{display:"flex",gap:6,paddingLeft:36}}>
                <Pill label={l.type} color="blue" t={t}/>
                <span style={{fontSize:11,color:t.muted}}>{l.station} · Pl.{l.platoon}</span>
              </div>
            </div>
          )}/>
        ) : (
          <RTable t={t}
            cols={[
              { label:"Employee",   render:(l,_,i)=><div style={{display:"flex",alignItems:"center",gap:8}}><Av name={l.empName} idx={i} t={t}/>{l.empName.split(" ").slice(0,2).join(" ")}</div> },
              { label:"Type",       render:r=><Pill label={r.type} color="blue" t={t}/> },
              { label:"Leave Date", render:r=>fmtDate(r.leaveDate) },
              { label:"End Date",   render:r=>fmtDate(r.endDate), hide:["hide-md"] },
              { label:"Start",      key:"startTime" },
              { label:"End",        key:"endTime" },
              { label:"Station",    key:"station", hide:["hide-md"] },
              { label:"Platoon",    key:"platoon",  hide:["hide-mobile","hide-md","hide-lg-down"] },
              { label:"Status",     render:r=><SPill status={r.status} t={t}/> },
            ]}
            rows={filtered}
          />
        )}
        {filtered.length===0 && <div style={{textAlign:"center",color:t.hint,padding:"24px 0",fontSize:13}}>No records found</div>}
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// PAYROLL
// ════════════════════════════════════════════════════════════════
function Payroll({ data, t, bp }) {
  const mobile = isMobile(bp);
  const totalW = data.payroll.reduce((a,r)=>a+r.worked,0).toFixed(1);
  const totalL = data.payroll.reduce((a,r)=>a+r.leaveHrs,0).toFixed(1);
  const totalA = data.payroll.reduce((a,r)=>a+r.actingHrs,0).toFixed(1);
  return (
    <div className="crm-page">
      <div className="g6" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
        {[["Pay Period","Jan 12, 2026","B Platoon"],["Worked Hrs",`${totalW} hrs`,"this period"],["Leave Deducted",`${totalL} hrs`,"employees"],["Acting Hrs",`${totalA} hrs`,"upgrades"],["OT Hours","112 hrs","approved"],["Records",data.payroll.length,"rows"]].map(([l,v,s])=>(
          <Card key={l} t={t} style={{padding:"13px 15px"}}>
            <div style={{fontSize:10,color:t.muted,marginBottom:5,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.04em"}}>{l}</div>
            <div style={{fontSize:mobile?17:20,fontWeight:700,letterSpacing:"-0.02em"}}>{v}</div>
            <div style={{fontSize:11,color:t.hint,marginTop:3}}>{s}</div>
          </Card>
        ))}
      </div>
      <Card t={t}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
          <span style={{fontSize:13,fontWeight:600}}>Payroll detail — Jan 12, 2026</span>
          <button style={mkBtn(t,true)}>Export PDF</button>
        </div>
        {mobile ? (
          <MobileList t={t} items={data.payroll} renderItem={(r,i)=>(
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <div style={{fontSize:12,fontWeight:600}}>{r.empName}</div>
                <div style={{fontSize:11,color:t.muted,marginTop:2}}>{r.station} · <Pill label={r.rank} color="blue" t={t}/> · {r.date}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:13,fontWeight:700}}>{r.worked.toFixed(1)} hrs</div>
                {r.leaveHrs>0 && <div style={{fontSize:11,color:t.warn,marginTop:2}}>−{r.leaveHrs.toFixed(1)} leave</div>}
              </div>
            </div>
          )}/>
        ) : (
          <RTable t={t}
            cols={[
              { label:"Platoon",   render:r=><Pill label={r.platoon} color={r.platoon==="A"?"blue":"gray"} t={t}/> },
              { label:"Station",   key:"station", hide:["hide-md"] },
              { label:"Rank",      render:r=><Pill label={r.rank} color="blue" t={t}/> },
              { label:"Employee",  key:"empName" },
              { label:"Worked",    render:r=><strong>{r.worked.toFixed(1)}</strong> },
              { label:"Acting Pos",key:"actingPos", hide:["hide-md"] },
              { label:"Act.Hrs",   render:r=>r.actingHrs>0?r.actingHrs.toFixed(1):"—", hide:["hide-mobile","hide-md","hide-lg-down"] },
              { label:"Leave",     render:r=>r.leaveType!=="—"?<Pill label={r.leaveType} color="amber" t={t}/>:"—" },
              { label:"Lv.Hrs",    render:r=>r.leaveHrs>0?r.leaveHrs.toFixed(1):"—", hide:["hide-mobile","hide-md"] },
              { label:"Date",      key:"date", hide:["hide-mobile"] },
            ]}
            rows={data.payroll}
          />
        )}
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// TIMESHEETS
// ════════════════════════════════════════════════════════════════
function Timesheets({ data, t, bp }) {
  const [empId, setEmpId] = useState("45798");
  const mobile  = isMobile(bp);
  const workHrs  = data.timesheets.filter(r=>!r.type).reduce((a,r)=>a+r.hours,0).toFixed(2);
  const leaveHrs = data.timesheets.filter(r=>r.type).reduce((a,r)=>a+r.hours,0).toFixed(2);
  return (
    <div className="crm-page">
      <div className="g4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
        <MetricCard label="Period End" value="Jan 11" sub="14-day window" t={t} bp={bp}/>
        <MetricCard label="Work Hrs" value={workHrs} t={t} bp={bp}/>
        <MetricCard label="Leave Hrs" value={leaveHrs} t={t} bp={bp}/>
        <MetricCard label="Employee" value={`#${empId}`} sub="Jess A. Soldani" t={t} bp={bp}/>
      </div>
      <Card t={t}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
          <span style={{fontSize:13,fontWeight:600}}>14-day timesheet</span>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <input style={{...mkInp(t),width:mobile?"100%":130}} placeholder="Employee ID" value={empId} onChange={e=>setEmpId(e.target.value)}/>
            <button style={mkBtn(t,true)}>Generate PDF</button>
          </div>
        </div>
        {mobile ? (
          <MobileList t={t} items={data.timesheets} renderItem={(r,i)=>{
            const isLeave = !!r.type;
            return isLeave ? (
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingLeft:8,borderLeft:`3px solid ${t.success}`}}>
                <div>
                  <div style={{fontSize:12,fontWeight:500,color:t.success}}>Leave: {r.leaveStart}</div>
                  <div style={{fontSize:11,color:t.hint}}>{r.leaveIn} – {r.leaveOut}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:13,fontWeight:700}}>{r.hours.toFixed(2)} hrs</div>
                  <Pill label={r.type} color="green" t={t}/>
                </div>
              </div>
            ) : (
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div>
                  <div style={{fontSize:12,fontWeight:500}}>{r.dateIn} → {r.dateOut}</div>
                  <div style={{fontSize:11,color:t.hint}}>{r.timeIn} – {r.timeOut}</div>
                </div>
                <span style={{fontSize:14,fontWeight:700}}>{r.hours.toFixed(2)} hrs</span>
              </div>
            );
          }}/>
        ) : (
          <RTable t={t}
            cols={[
              { label:"Date In",     key:"dateIn" },
              { label:"Date Out",    key:"dateOut" },
              { label:"Time In",     key:"timeIn" },
              { label:"Time Out",    key:"timeOut" },
              { label:"Leave Start", key:"leaveStart", hide:["hide-mobile","hide-md"] },
              { label:"Leave End",   key:"leaveEnd",   hide:["hide-mobile","hide-md"] },
              { label:"Leave In",    key:"leaveIn",    hide:["hide-mobile","hide-md"] },
              { label:"Leave Out",   key:"leaveOut",   hide:["hide-mobile","hide-md"] },
              { label:"Hours",       render:r=><strong>{r.hours.toFixed(2)}</strong> },
              { label:"Type",        render:r=>r.type?<Pill label={r.type} color="green" t={t}/>:"" },
            ]}
            rows={data.timesheets.map(r=>({
              ...r,
              _bg: r.type ? (t===DARK?"rgba(5,46,22,0.25)":"rgba(220,252,231,0.35)") : undefined
            }))}
          />
        )}
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// SETTINGS
// ════════════════════════════════════════════════════════════════
function Settings({ t, bp }) {
  const [apiBase, setApiBase] = useState("");
  const [sheetId, setSheetId] = useState("");
  const [token,   setToken]   = useState("");
  const [saved,   setSaved]   = useState(false);
  const save = ()=>{ setSaved(true); setTimeout(()=>setSaved(false),2000); };
  const gridCols = isMobile(bp) ? "1fr" : "repeat(2,minmax(0,1fr))";
  return (
    <div className="crm-page" style={{display:"grid",gridTemplateColumns:gridCols,gap:16}}>
      <Card t={t}>
        <div style={{fontSize:13,fontWeight:600,marginBottom:16}}>API configuration</div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {[["Backend API URL","https://your-backend.com/api",apiBase,setApiBase,"text"],
            ["Google Sheet ID","1G3PFoAUELiKiDI…",sheetId,setSheetId,"text"],
            ["Auth Token / API Key","••••••••••••",token,setToken,"password"]
          ].map(([lbl,ph,val,set,type])=>(
            <div key={lbl}>
              <div style={{fontSize:11,color:t.muted,marginBottom:5,fontWeight:500}}>{lbl}</div>
              <input type={type} style={mkInp(t)} placeholder={ph} value={val} onChange={e=>set(e.target.value)}/>
            </div>
          ))}
          <button onClick={save} style={{...mkBtn(t,true),marginTop:4}}>{saved?"✓ Saved!":"Save & Connect"}</button>
        </div>
      </Card>
      <Card t={t}>
        <div style={{fontSize:13,fontWeight:600,marginBottom:16}}>Notifications</div>
        {[["Leave approval alerts","Active"],["Payroll generation","Active"],["Timesheet auto-email","Active"],["Low staffing warnings","Waitlist"]].map(([lbl,s])=>(
          <div key={lbl} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:`0.5px solid ${t.border}`}}>
            <span style={{fontSize:13}}>{lbl}</span>
            <SPill status={s} t={t}/>
          </div>
        ))}
        <div style={{marginTop:16,padding:12,background:t.metric,borderRadius:8}}>
          <div style={{fontSize:11,fontWeight:600,color:t.muted,marginBottom:6,letterSpacing:"0.04em",textTransform:"uppercase"}}>API Guide</div>
          <div style={{fontSize:12,color:t.text,lineHeight:1.6}}>See <code style={{background:t.border,padding:"1px 5px",borderRadius:4,fontSize:11}}>API_GUIDE.md</code> for connecting Google Sheets, Apps Script, or Supabase.</div>
        </div>
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// SIDEBAR WIDTH by breakpoint
// ════════════════════════════════════════════════════════════════
function sidebarWidth(bp, open) {
  if (isMobile(bp)) return 240;          // always 240 when drawer opens
  if (!open) return 58;                  // collapsed icon-only
  if (bp === "md") return 200;
  if (bp === "lg") return 210;
  if (bp === "xl") return 220;
  return 240;                            // 2xl
}

// ════════════════════════════════════════════════════════════════
// ROOT APP
// ════════════════════════════════════════════════════════════════
export default function FirefighterCRM() {
  const [dark,     setDark]     = useState(false);
  const [page,     setPage]     = useState("dashboard");
  const [data,     setData]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [sideOpen, setSideOpen] = useState(true);
  const [drawer,   setDrawer]   = useState(false);   // mobile drawer
  const bp = useBreakpoint();
  const t  = dark ? DARK : LIGHT;

  useGlobalCSS();

  // auto-configure sidebar per breakpoint
  useEffect(() => {
    if (isMobile(bp)) { setSideOpen(false); setDrawer(false); }
    else if (bp === "md") setSideOpen(false);
    else setSideOpen(true);
  }, [bp]);

  // load data
  useEffect(() => {
    (async () => {
      const [employees,leave,payroll,workforce,det,timesheets] = await Promise.all([
        fetchData("/employees",  MOCK.employees),
        fetchData("/leave",      MOCK.leaveRecords),
        fetchData("/payroll",    MOCK.payroll),
        fetchData("/workforce",  MOCK.workforce),
        fetchData("/det",        MOCK.detRecords),
        fetchData("/timesheets", MOCK.timesheets),
      ]);
      setData({employees,leave,payroll,workforce,det,timesheets});
      setLoading(false);
    })();
  }, []);

  const pending  = data?.leave.filter(l=>l.status==="Waitlist").length ?? 4;
  const sections = [...new Set(NAV.map(n=>n.section))];
  const mobile   = isMobile(bp);
  const sbWidth  = sidebarWidth(bp, sideOpen);

  const navigate = (id) => { setPage(id); setDrawer(false); };
  const toggleSide = () => mobile ? setDrawer(v=>!v) : setSideOpen(v=>!v);

  // Sidebar open class
  const sbClass = `crm-sb ${(mobile ? false : sideOpen) ? "full" : "icons"}`;

  // Sidebar positioning
  const sbStyle = {
    background: t.sidebar,
    borderRight: `0.5px solid ${t.border}`,
    width: sbWidth,
    zIndex: 50,
    ...(mobile ? {
      position:"fixed", top:0, left:0, height:"100%",
      transform: drawer ? "translateX(0)" : "translateX(-100%)",
      transition: "transform .22s cubic-bezier(.4,0,.2,1)",
      boxShadow: drawer ? "4px 0 24px rgba(0,0,0,0.18)" : "none",
    } : {
      position: "relative",
    })
  };

  const topbarPad = mobile ? "9px 12px" : bp==="md"||bp==="lg" ? "10px 16px" : "11px 22px";

  return (
    <div style={{display:"flex",height:"100vh",background:t.bg,color:t.text,
      fontFamily:"'DM Sans','Trebuchet MS',sans-serif",overflow:"hidden"}}>

      {/* ── OVERLAY (mobile) ── */}
      {mobile && drawer && (
        <div onClick={()=>setDrawer(false)} style={{position:"fixed",inset:0,
          background:"rgba(0,0,0,0.5)",zIndex:40,backdropFilter:"blur(2px)"}}/>
      )}

      {/* ── SIDEBAR ── */}
      <div className={sbClass} style={sbStyle}>

        {/* Logo */}
        <div style={{padding:"16px 12px 14px",borderBottom:`0.5px solid ${t.border}`,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:30,height:30,borderRadius:8,background:t.accent,display:"flex",
              alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Ico k="fire" size={14} color="#FFF"/>
            </div>
            <div className="lbl" style={{minWidth:0}}>
              <div style={{fontSize:9,fontWeight:600,letterSpacing:"0.1em",color:t.hint,textTransform:"uppercase"}}>JPFD</div>
              <div style={{fontSize:14,fontWeight:700,color:t.text,letterSpacing:"-0.02em",lineHeight:1.15,whiteSpace:"nowrap"}}>FireOps CRM</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{flex:1,padding:"8px 6px",overflowY:"auto"}}>
          {sections.map(sec=>(
            <div key={sec}>
              <div className="sec-hdr lbl" style={{fontSize:9,fontWeight:600,letterSpacing:"0.08em",
                color:t.hint,textTransform:"uppercase",padding:"10px 8px 3px",transition:"opacity .18s"}}>
                {sec}
              </div>
              {NAV.filter(n=>n.section===sec).map(n=>{
                const active = page===n.id;
                return (
                  <div key={n.id} className="nav-row" onClick={()=>navigate(n.id)} style={{
                    display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:8,
                    cursor:"pointer",fontSize:13,fontWeight:active?600:400,
                    color:active?t.navActiveTx:t.muted, background:active?t.navActive:"transparent",
                    transition:"all .15s",marginBottom:2,minHeight:36
                  }}>
                    <Ico k={n.icon}/>
                    <span className="lbl">{n.label}</span>
                    {n.badge && pending>0 && (
                      <span className="badge lbl" style={{marginLeft:"auto",background:t.dangerBg,
                        color:t.danger,fontSize:10,padding:"1px 7px",borderRadius:10,fontWeight:700}}>
                        {pending}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{padding:"10px",borderTop:`0.5px solid ${t.border}`,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <Av name="Admin" idx={0} size={30} t={t}/>
            <div className="footer-txt lbl" style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:600,whiteSpace:"nowrap"}}>Admin</div>
              <div style={{fontSize:11,color:t.hint,whiteSpace:"nowrap"}}>Supervisor</div>
            </div>
            <button onClick={()=>setDark(d=>!d)} title="Toggle theme" style={{
              ...mkBtn(t), padding:"5px", borderRadius:"50%", width:28, height:28,
              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0
            }}>
              <Ico k={dark?"sun":"moon"} size={13}/>
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>

        {/* Topbar */}
        <div style={{background:t.surface,borderBottom:`0.5px solid ${t.border}`,
          padding:topbarPad,display:"flex",alignItems:"center",
          justifyContent:"space-between",flexShrink:0,gap:10}}>

          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {/* Hamburger — hidden on xl/2xl */}
            <button className="crm-hamburger" onClick={toggleSide} style={{
              ...mkBtn(t), padding:"5px", borderRadius:8, width:34, height:34,
              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0
            }}>
              <Ico k="menu" size={16}/>
            </button>
            <div style={{fontSize:mobile?15:17,fontWeight:700,letterSpacing:"-0.02em",whiteSpace:"nowrap"}}>
              {NAV.find(n=>n.id===page)?.label ?? page}
            </div>
          </div>

          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {/* Search — hidden on mobile */}
            <div className="hide-mobile" style={{position:"relative",display:"flex",alignItems:"center"}}>
              <div style={{position:"absolute",left:10,color:t.hint,pointerEvents:"none"}}><Ico k="search" size={13}/></div>
              <input style={{...mkInp(t),paddingLeft:30,width: bp==="md"?160:bp==="lg"?180:210}} placeholder="Search…"/>
            </div>
            {/* New Record — hidden on xs+sm */}
            <button className="hide-mobile" style={mkBtn(t,true)}>
              <span style={{display:"flex",alignItems:"center",gap:5}}><Ico k="plus" size={12} color="#FFF"/> New Record</span>
            </button>
            {/* Theme toggle — shown on mobile (sidebar toggle is hidden there) */}
            {mobile && (
              <button onClick={()=>setDark(d=>!d)} style={{
                ...mkBtn(t), padding:"5px", borderRadius:"50%", width:34, height:34,
                display:"flex", alignItems:"center", justifyContent:"center"
              }}>
                <Ico k={dark?"sun":"moon"} size={14}/>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="crm-content" style={{flex:1,overflowY:"auto",padding:mobile?12:bp==="md"?14:20}}>
          {loading ? (
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",
              justifyContent:"center",height:200,gap:14,color:t.muted}}>
              <div style={{width:32,height:32,border:`2.5px solid ${t.border}`,borderTopColor:t.accent,
                borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>
              <span style={{fontSize:13}}>Loading data…</span>
            </div>
          ) : (
            <>
              {page==="dashboard"  && <Dashboard  data={data} t={t} bp={bp}/>}
              {page==="employees"  && <Employees  data={data} t={t} bp={bp}/>}
              {page==="workforce"  && <Workforce  data={data} t={t} bp={bp}/>}
              {page==="leave"      && <Leave       data={data} t={t} bp={bp}/>}
              {page==="payroll"    && <Payroll     data={data} t={t} bp={bp}/>}
              {page==="timesheets" && <Timesheets  data={data} t={t} bp={bp}/>}
              {page==="settings"   && <Settings    t={t} bp={bp}/>}
            </>
          )}
        </div>
      </div>

      {/* ── BOTTOM NAV (xs + sm only) ── */}
      <div className="btm-nav" style={{background:t.bottomBar,borderTopColor:t.border}}>
        {BTM.map(id=>{
          const n = NAV.find(x=>x.id===id);
          const active = page===id;
          return (
            <button key={id} className="btm-item" onClick={()=>navigate(id)} style={{
              flex:1,display:"flex",flexDirection:"column",alignItems:"center",
              justifyContent:"center",gap:3,cursor:"pointer",border:"none",
              background:"transparent",color:active?t.accent:t.hint,
              fontFamily:"inherit",padding:"7px 4px",position:"relative",
            }}>
              {id==="leave" && pending>0 && (
                <div style={{position:"absolute",top:6,right:"calc(50% - 14px)",width:7,height:7,
                  borderRadius:"50%",background:t.danger}}/>
              )}
              <Ico k={n.icon} size={bp==="xs"?18:21} color={active?t.accent:t.hint}/>
              <span style={{fontSize:9,fontWeight:600,letterSpacing:"0.02em",whiteSpace:"nowrap"}}>{n.label}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
}