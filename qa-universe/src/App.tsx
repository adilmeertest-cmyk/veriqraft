import { useMemo, useState } from "react";

type Section = "overview" | "lab" | "academy" | "knowledge" | "career" | "challenges" | "resources" | "community" | "ai" | "admin";
const nav: { id: Section; label: string; icon: string; group: string }[] = [
  { id:"overview", label:"Overview", icon:"⌂", group:"WORKSPACE" },
  { id:"lab", label:"QA Lab", icon:"⌘", group:"WORKSPACE" },
  { id:"academy", label:"QA Academy", icon:"▤", group:"LEARN" },
  { id:"knowledge", label:"Knowledge Hub", icon:"◈", group:"LEARN" },
  { id:"career", label:"Career Journey", icon:"↗", group:"GROW" },
  { id:"challenges", label:"QA Challenges", icon:"✳", group:"GROW" },
  { id:"resources", label:"Resource Center", icon:"▧", group:"GROW" },
  { id:"community", label:"Community", icon:"◎", group:"CONNECT" },
  { id:"ai", label:"AI QA Studio", icon:"✧", group:"CONNECT" },
  { id:"admin", label:"Control Center", icon:"⚙", group:"SYSTEM" }
];
const lessons = [
  { title:"QA foundations", level:"Beginner", time:"25 min", desc:"Quality assurance, quality control, verification, validation and the tester mindset.", tags:["Manual QA","Foundation"] },
  { title:"SDLC & STLC", level:"Beginner", time:"30 min", desc:"Understand software delivery phases and the testing lifecycle from planning to closure.", tags:["Process","STLC"] },
  { title:"Test design techniques", level:"Beginner", time:"40 min", desc:"Equivalence partitioning, boundary values, decision tables and state transitions.", tags:["Test design","Practice"] },
  { title:"Bug reporting & lifecycle", level:"Beginner", time:"25 min", desc:"Write reproducible defects, set severity and priority, and follow a defect to closure.", tags:["Defects","Reporting"] },
  { title:"API testing with Postman", level:"Intermediate", time:"45 min", desc:"Validate methods, status codes, headers, payloads, schema and negative scenarios.", tags:["API","Postman"] },
  { title:"SQL for QA engineers", level:"Beginner", time:"50 min", desc:"Use SELECT, WHERE, JOIN and aggregates to validate application data.", tags:["SQL","Database"] },
  { title:"Playwright automation", level:"Starter", time:"60 min", desc:"Create stable browser tests with accessible locators, assertions and traces.", tags:["Automation","Playwright"] },
  { title:"Performance testing basics", level:"Intermediate", time:"35 min", desc:"Understand load, stress, spike and endurance testing with measurable outcomes.", tags:["JMeter","Performance"] }
];
const knowledge = [
  ["Severity vs Priority","Severity describes impact; priority describes urgency to fix. A blocker may be high in both, while a minor typo can be low severity but high priority before a release."],
  ["Smoke vs Sanity testing","Smoke testing checks whether a build is stable enough for deeper testing. Sanity testing is a focused check that a specific change or fix behaves as expected."],
  ["Retesting vs Regression","Retesting verifies that a reported defect is fixed. Regression testing checks that the change has not broken existing functionality."],
  ["Positive vs Negative testing","Positive testing checks valid inputs and expected flows. Negative testing checks invalid, unexpected or boundary inputs and safe error handling."],
  ["HTTP status quick guide","200 OK · 201 Created · 204 No Content · 400 Bad Request · 401 Unauthorized · 403 Forbidden · 404 Not Found · 409 Conflict · 422 Unprocessable Content · 500 Server Error."],
  ["What makes a strong bug report?","A concise title, environment, reliable reproduction steps, actual result, expected result, evidence and relevant request/response details."]
];
const challenges = [
  { title:"Find the boundary", type:"Test design", points:30, desc:"An age field accepts 18–60. Identify the boundary values you would test." },
  { title:"Read the response", type:"API testing", points:40, desc:"A POST request returns 201 but the created record has a null email. What else should QA validate?" },
  { title:"Spot the missing case", type:"Scenario design", points:35, desc:"A password reset flow is tested only with a registered email. Add two important negative scenarios." }
];
const resources = ["Bug report template","Test case sheet","Test execution tracker","Test plan outline","API testing checklist","Regression checklist","UAT sign-off checklist","Interview preparation tracker"];
const starterCase = { title:"", precondition:"", steps:"", expected:"", priority:"Medium" };

export default function App() {
  const [section,setSection] = useState<Section>("overview");
  const [mobileOpen,setMobileOpen] = useState(false);
  const [tool,setTool] = useState("bug");
  const [bug,setBug] = useState({ title:"", environment:"Chrome / Windows", steps:"1. Open the page\n2. Enter valid details\n3. Click Save", actual:"", expected:"", severity:"Medium" });
  const [cases,setCases] = useState([{...starterCase}]);
  const [caseText,setCaseText] = useState("");
  const [rangeMin,setRangeMin] = useState("18");
  const [rangeMax,setRangeMax] = useState("60");
  const [json,setJson] = useState('{\n  "status": "success",\n  "data": { "id": 101, "email": "qa@example.com" }\n}');
  const [jsonOut,setJsonOut] = useState("");
  const [jsonError,setJsonError] = useState("");
  const [compareA,setCompareA] = useState('{"id":1,"status":"active"}');
  const [compareB,setCompareB] = useState('{"id":1,"status":"pending"}');
  const [compareOut,setCompareOut] = useState("");
  const [dataType,setDataType] = useState("email");
  const [dataCount,setDataCount] = useState(5);
  const [generated,setGenerated] = useState<string[]>([]);
  const [lessonFilter,setLessonFilter] = useState("All");
  const [query,setQuery] = useState("");
  const [challengeDone,setChallengeDone] = useState<string[]>([]);
  const [toast,setToast] = useState("");
  const [aiPrompt,setAiPrompt] = useState("Review these requirements and suggest positive, negative, boundary and permission test scenarios:");
  const [aiInput,setAiInput] = useState("");
  const [aiOutput,setAiOutput] = useState("");
  const [adminCode,setAdminCode] = useState("");
  const [adminMessage,setAdminMessage] = useState("");
  const [communityDraft,setCommunityDraft] = useState("");
  const [savedCases,setSavedCases] = useState<string[]>([]);
  const [careerChecks,setCareerChecks] = useState<string[]>([]);
  const [activeLesson,setActiveLesson] = useState<number|null>(null);

  const notify = (message:string) => { setToast(message); window.setTimeout(()=>setToast(""),2600); };
  const copy = async (value:string) => { try { await navigator.clipboard.writeText(value); notify("Copied to clipboard"); } catch { notify("Clipboard access is unavailable in this browser"); } };
  const makeBug = () => [
    "Title: " + bug.title,
    "Environment: " + bug.environment,
    "Severity: " + bug.severity,
    "",
    "Steps to Reproduce:",
    bug.steps,
    "",
    "Actual Result:",
    bug.actual,
    "",
    "Expected Result:",
    bug.expected
  ].join("\n");
  const addCase = () => setCases(v=>[...v,{...starterCase}]);
  const updateCase = (i:number,key:keyof typeof starterCase,value:string) => setCases(v=>v.map((c,n)=>n===i?{...c,[key]:value}:c));
  const buildCase = () => {
    const lines = caseText.split("\n").map(x=>x.trim()).filter(Boolean);
    if (!lines.length) { notify("Add a requirement or feature first"); return; }
    const words = lines.map((line,i)=>`TC-${String(i+1).padStart(3,"0")} | ${line} | Verify valid input, invalid input, empty value, boundary and permission behaviour | Expected: behaviour matches requirement and validation is clear.`);
    setCases(words.map(w=>({...starterCase,title:w.split("|")[1].trim(),steps:w.split("|")[2].trim(),expected:w.split("|")[3].trim()})));
    notify("Draft test cases generated — review against the actual requirement");
  };
  const doFormat = () => { try { setJsonOut(JSON.stringify(JSON.parse(json),null,2)); setJsonError(""); } catch(e) { setJsonError(e instanceof Error?e.message:"Invalid JSON"); setJsonOut(""); } };
  const doCompare = () => { try { const a=JSON.parse(compareA),b=JSON.parse(compareB); const keys=[...new Set([...Object.keys(a),...Object.keys(b)])]; setCompareOut(keys.map(k=>`${k}: ${JSON.stringify(a[k])===JSON.stringify(b[k])?"MATCH":`DIFFERENT → ${JSON.stringify(a[k])} / ${JSON.stringify(b[k])}`}`).join("\n")); } catch(e) { setCompareOut("Both inputs must be valid JSON. "+(e instanceof Error?e.message:"")); } };
  const makeData = () => {
    const rows=Array.from({length:Math.max(1,Math.min(50,dataCount))},(_,i)=>{
      if(dataType==="email") return `qa.user${i+1}@example.test`;
      if(dataType==="name") return ["Ayaan Khan","Sara Ahmed","Hassan Ali","Maya Noor","Zain Malik"][i%5];
      if(dataType==="phone") return "+92300"+String(1000000+i).padStart(7,"0");
      if(dataType==="number") return String(100+i*7);
      return `TEST-${String(i+1).padStart(4,"0")}`;
    });
    setGenerated(rows);
  };
  const bva = useMemo(()=>{
    const min=Number(rangeMin),max=Number(rangeMax);
    if(!Number.isFinite(min)||!Number.isFinite(max)||min>=max)return "Enter valid numbers where minimum is smaller than maximum.";
    return [min-1,min,min+1,max-1,max,max+1].join(", ");
  },[rangeMin,rangeMax]);
  const filteredLessons = lessons.filter(l=>(lessonFilter==="All"||l.level===lessonFilter)&&(l.title+" "+l.desc+" "+l.tags.join(" ")).toLowerCase().includes(query.toLowerCase()));
  const renderLab = () => <div className="workspace-grid">
    <div className="tool-list">
      {[["bug","Bug report builder"],["cases","Test case builder"],["bva","Boundary value helper"],["json","JSON formatter"],["compare","API response diff"],["data","Test data generator"]].map(([id,label])=><button key={id} className={tool===id?"tool-active":""} onClick={()=>setTool(id)}>{label}<span>↗</span></button>)}
    </div>
    <div className="tool-panel">
      {tool==="bug"&&<><div className="panel-heading"><div><span className="eyebrow">DEFECT DOCUMENTATION</span><h2>Bug report builder</h2><p>Turn your raw findings into a clear, reproducible report.</p></div><span className="tag">LOCAL TOOL</span></div>
        <div className="form-grid"><label>Bug title<input value={bug.title} onChange={e=>setBug({...bug,title:e.target.value})} placeholder="Short, specific issue title"/></label><label>Environment<input value={bug.environment} onChange={e=>setBug({...bug,environment:e.target.value})}/></label><label>Severity<select value={bug.severity} onChange={e=>setBug({...bug,severity:e.target.value})}>{["Critical","High","Medium","Low"].map(x=><option key={x}>{x}</option>)}</select></label><label className="wide">Steps to reproduce<textarea rows={4} value={bug.steps} onChange={e=>setBug({...bug,steps:e.target.value})}/></label><label>Actual result<textarea rows={3} value={bug.actual} onChange={e=>setBug({...bug,actual:e.target.value})} placeholder="What happened?"/></label><label>Expected result<textarea rows={3} value={bug.expected} onChange={e=>setBug({...bug,expected:e.target.value})} placeholder="What should happen?"/></label></div>
        <div className="button-row"><button className="btn-primary" onClick={()=>copy(makeBug())}>Copy report ↗</button><button className="btn-quiet" onClick={()=>setBug({title:"",environment:"Chrome / Windows",steps:"",actual:"",expected:"",severity:"Medium"})}>Clear</button></div><pre className="output">{makeBug()}</pre>
      </>}
      {tool==="cases"&&<><div className="panel-heading"><div><span className="eyebrow">TEST DESIGN</span><h2>Test case builder</h2><p>Start with a requirement or write your own structured cases.</p></div><span className="tag">LOCAL TOOL</span></div><label>Requirement / feature<textarea rows={3} value={caseText} onChange={e=>setCaseText(e.target.value)} placeholder="Example: User can reset password using a registered email."/></label><button className="btn-primary" onClick={buildCase}>Generate starter scenarios ↗</button><div className="case-list">{cases.map((c,i)=><div className="case-card" key={i}><div className="case-top"><b>TC-{String(i+1).padStart(3,"0")}</b><button onClick={()=>setCases(v=>v.filter((_,n)=>n!==i))}>Remove</button></div><label>Title<input value={c.title} onChange={e=>updateCase(i,"title",e.target.value)}/></label><label>Preconditions<input value={c.precondition} onChange={e=>updateCase(i,"precondition",e.target.value)}/></label><label>Steps<textarea rows={2} value={c.steps} onChange={e=>updateCase(i,"steps",e.target.value)}/></label><label>Expected result<textarea rows={2} value={c.expected} onChange={e=>updateCase(i,"expected",e.target.value)}/></label></div>)}</div><div className="button-row"><button className="btn-quiet" onClick={addCase}>+ Add test case</button><button className="btn-primary" onClick={()=>copy(cases.map((c,i)=>[`TC-${i+1}`,c.title,"Preconditions: "+c.precondition,"Steps: "+c.steps,"Expected: "+c.expected].join("\n")).join("\n\n"))}>Copy all cases</button></div></>}
      {tool==="bva"&&<><div className="panel-heading"><div><span className="eyebrow">TEST DESIGN TECHNIQUES</span><h2>Boundary value helper</h2><p>Generate values around a valid numeric range.</p></div><span className="tag">LOCAL TOOL</span></div><div className="form-grid"><label>Minimum accepted value<input type="number" value={rangeMin} onChange={e=>setRangeMin(e.target.value)}/></label><label>Maximum accepted value<input type="number" value={rangeMax} onChange={e=>setRangeMax(e.target.value)}/></label></div><div className="result-box"><span className="eyebrow">BOUNDARY VALUES</span><strong>{bva}</strong><p>Also consider valid and invalid equivalence partitions, empty input, data type and business rules.</p></div><div className="mini-note">For a range of 18–60, useful boundary checks include 17, 18, 19, 59, 60 and 61.</div></>}
      {tool==="json"&&<><div className="panel-heading"><div><span className="eyebrow">API TOOLKIT</span><h2>JSON formatter</h2><p>Validate and pretty-print JSON before inspecting an API response.</p></div><span className="tag">LOCAL TOOL</span></div><label>JSON input<textarea rows={10} className="mono" value={json} onChange={e=>setJson(e.target.value)}/></label><button className="btn-primary" onClick={doFormat}>Format & validate ↗</button>{jsonError&&<p className="error-text">{jsonError}</p>}{jsonOut&&<><pre className="output mono">{jsonOut}</pre><button className="btn-quiet" onClick={()=>copy(jsonOut)}>Copy formatted JSON</button></>}</>}
      {tool==="compare"&&<><div className="panel-heading"><div><span className="eyebrow">API TOOLKIT</span><h2>Response comparison</h2><p>Compare top-level JSON fields in two API responses.</p></div><span className="tag">LOCAL TOOL</span></div><div className="form-grid"><label>Response A<textarea rows={8} className="mono" value={compareA} onChange={e=>setCompareA(e.target.value)}/></label><label>Response B<textarea rows={8} className="mono" value={compareB} onChange={e=>setCompareB(e.target.value)}/></label></div><button className="btn-primary" onClick={doCompare}>Compare responses ↗</button>{compareOut&&<pre className="output mono">{compareOut}</pre>}</>}
      {tool==="data"&&<><div className="panel-heading"><div><span className="eyebrow">TEST DATA</span><h2>Synthetic data generator</h2><p>Create safe sample values. No real personal data is used.</p></div><span className="tag">LOCAL TOOL</span></div><div className="form-grid"><label>Data type<select value={dataType} onChange={e=>setDataType(e.target.value)}>{["email","name","phone","number","reference"].map(x=><option key={x}>{x}</option>)}</select></label><label>Number of records<input type="number" min="1" max="50" value={dataCount} onChange={e=>setDataCount(Number(e.target.value))}/></label></div><button className="btn-primary" onClick={makeData}>Generate sample data ↗</button>{generated.length>0&&<><pre className="output">{generated.join("\n")}</pre><button className="btn-quiet" onClick={()=>copy(generated.join("\n"))}>Copy data</button></>}</>}
    </div>
  </div>;
  const pageTitle:Record<Section,string>={overview:"Your quality workspace.",lab:"A practical place to test.",academy:"Learn the craft. Practise the skill.",knowledge:"A growing QA reference library.",career:"Build your QA career with intent.",challenges:"Sharpen your testing instincts.",resources:"Useful templates. Less setup.",community:"Learn with other quality minds.",ai:"AI-assisted QA, with human review.",admin:"Control Center"};
  return <div className="app-shell">
    <aside className={mobileOpen?"sidebar sidebar-open":"sidebar"}><a className="brand" href="#" onClick={e=>{e.preventDefault();setSection("overview")}}><span className="brand-mark">Q</span><span>QA <b>UNIVERSE</b><small>BY MUHAMMAD ADIL</small></span></a><div className="side-scroll">{["WORKSPACE","LEARN","GROW","CONNECT","SYSTEM"].map(group=><div className="nav-group" key={group}><small>{group}</small>{nav.filter(n=>n.group===group).map(n=><button key={n.id} className={section===n.id?"nav-item selected":"nav-item"} onClick={()=>{setSection(n.id);setMobileOpen(false)}}><span>{n.icon}</span>{n.label}{n.id==="admin"&&<i className="lock-dot"/>}</button>)}</div>)}</div><div className="sidebar-foot"><span className="status-dot"/> <span>Workspace preview</span><small>v1.0 FOUNDATION</small></div></aside>
    <main className="main-area"><header className="topbar"><button className="mobile-menu" onClick={()=>setMobileOpen(!mobileOpen)}>☰</button><div className="crumb">WORKSPACE <span>/</span> {section.toUpperCase()}</div><div className="top-actions"><span className="secure-label">INDEPENDENT APP</span><a href="https://m-adil-one.vercel.app" target="_blank" rel="noreferrer">Portfolio ↗</a></div></header>
      <div className="page-wrap"><div className="page-intro"><div><span className="eyebrow">QUALITY ENGINEERING / YOUR SPACE</span><h1>{pageTitle[section]}</h1><p>Learn, practise, document and improve — one step at a time.</p></div><div className="date-chip">✳ &nbsp; BUILD WITH QUALITY</div></div>
      {section==="overview"&&<><div className="hero-card"><div className="hero-card-copy"><span className="eyebrow">WELCOME TO YOUR QA WORKSPACE</span><h2>Think like a tester.<br/><em>Build like an engineer.</em></h2><p>A connected workspace for learning software testing, practising real QA tasks and building career-ready skills.</p><button className="btn-primary" onClick={()=>setSection("lab")}>Open QA Lab <span>↗</span></button></div><div className="hero-orbit"><div className="orbit-ring ring-one"/><div className="orbit-ring ring-two"/><div className="orbit-core">QA<span>✳</span></div><i className="orbit-node node-a"/><i className="orbit-node node-b"/><i className="orbit-node node-c"/></div></div>
        <div className="stat-grid"><div className="stat-card"><span>01 / PRACTISE</span><b>06</b><small>Interactive QA utilities</small></div><div className="stat-card"><span>02 / LEARN</span><b>08</b><small>Starter learning paths</small></div><div className="stat-card"><span>03 / GROW</span><b>03</b><small>Hands-on challenges</small></div><div className="stat-card"><span>04 / BUILD</span><b>∞</b><small>Room to improve</small></div></div>
        <div className="section-row"><div><span className="eyebrow">QUICK ACCESS</span><h2>Pick up where you want.</h2></div><button className="text-link" onClick={()=>setSection("lab")}>Explore all tools ↗</button></div><div className="feature-grid">{[{id:"lab",n:"01",t:"QA Lab",d:"Build bug reports, test cases, test data and validate JSON."},{id:"academy",n:"02",t:"QA Academy",d:"Learn manual, API, SQL and automation fundamentals."},{id:"knowledge",n:"03",t:"Knowledge Hub",d:"Quick explanations and practical QA references."},{id:"career",n:"04",t:"Career Journey",d:"Track your skills, habits and professional growth."}].map(x=><button className="feature-card" key={x.id} onClick={()=>setSection(x.id as Section)}><span>{x.n} / MODULE</span><b>{x.t} ↗</b><p>{x.d}</p></button>)}</div>
        <div className="callout-banner"><div><span className="eyebrow">A NOTE ON AI</span><h3>AI can help you think.<br/>Your judgement makes it QA.</h3><p>Review generated test ideas against the real requirements, data and business rules.</p></div><button className="btn-outline" onClick={()=>setSection("ai")}>Explore AI Studio ↗</button></div></>}
      {section==="lab"&&renderLab()}
      {section==="academy"&&<><div className="filter-bar"><div className="filter-pills">{["All","Beginner","Starter","Intermediate"].map(x=><button className={lessonFilter===x?"active":""} key={x} onClick={()=>setLessonFilter(x)}>{x}</button>)}</div><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search learning paths…"/></div><div className="lesson-grid">{filteredLessons.map((l,i)=><article className="lesson-tile" key={l.title}><div className="tile-top"><span>PATH / {String(i+1).padStart(2,"0")}</span><span>{l.time}</span></div><div className="tile-symbol">{["◉","⌘","⌗","◇","↗","▤","⟡","◌"][i%8]}</div><span className="eyebrow">{l.level.toUpperCase()}</span><h3>{l.title}</h3><p>{l.desc}</p><div className="tag-row">{l.tags.map(t=><span key={t}>{t}</span>)}</div><button className="text-link" onClick={()=>setActiveLesson(activeLesson===i?null:i)}>{activeLesson===i?"Close outline":"View learning outline"} ↗</button>{activeLesson===i&&<div className="outline"><b>Suggested practice</b><p>Read the concept, write one example from a real application, then create positive, negative and boundary scenarios. Mark your own progress after practice.</p></div>}</article>)}</div><p className="small-note">Learning paths are structured starter content. Connect the dedicated backend to add saved progress, quizzes, course publishing and certificates.</p></>}
      {section==="knowledge"&&<div className="knowledge-grid">{knowledge.map(([title,desc],i)=><article className="knowledge-card" key={title}><span>REFERENCE / 0{i+1}</span><h3>{title}</h3><p>{desc}</p><button className="text-link" onClick={()=>copy(title+"\n\n"+desc)}>Copy note ↗</button></article>)}</div>}
      {section==="career"&&<><div className="career-panel"><span className="eyebrow">A PRACTICAL LEARNING ROADMAP</span><h2>From manual confidence<br/>to engineering depth.</h2><p>Use this checklist to track your next learning steps. It is stored in this browser only until an account backend is connected.</p></div><div className="roadmap">{[["FOUNDATION","SDLC, STLC, test levels, test types and bug lifecycle"],["TEST DESIGN","Test cases, scenarios, BVA, equivalence partitioning and exploratory testing"],["API & DATA","Postman, HTTP methods, status codes, JSON and SQL validation"],["AUTOMATION","Playwright, TypeScript, locators, assertions, fixtures and traces"],["DELIVERY","Git, CI/CD, test reporting, risk-based testing and communication"]].map(([t,d],i)=><label className="roadmap-item" key={t}><input type="checkbox" checked={careerChecks.includes(t)} onChange={e=>setCareerChecks(v=>e.target.checked?[...v,t]:v.filter(x=>x!==t))}/><span className="road-index">0{i+1}</span><span><b>{t}</b><small>{d}</small></span><i>{careerChecks.includes(t)?"COMPLETED":"NEXT STEP"}</i></label>)}</div><div className="progress-strip"><span>{careerChecks.length} / 5 milestones completed</span><div><i style={{width:(careerChecks.length/5*100)+"%"}}/></div></div></>}
      {section==="challenges"&&<div className="challenge-grid">{challenges.map((c,i)=><article className="challenge-card" key={c.title}><div className="tile-top"><span>CHALLENGE / 0{i+1}</span><span>+{c.points} XP</span></div><span className="eyebrow">{c.type.toUpperCase()}</span><h3>{c.title}</h3><p>{c.desc}</p><button className={challengeDone.includes(c.title)?"btn-quiet":"btn-primary"} onClick={()=>setChallengeDone(v=>v.includes(c.title)?v.filter(x=>x!==c.title):[...v,c.title])}>{challengeDone.includes(c.title)?"Completed ✓":"Mark as attempted ↗"}</button></article>)}</div>}
      {section==="resources"&&<><div className="resource-grid">{resources.map((r,i)=><article className="resource-card" key={r}><span>RESOURCE / {String(i+1).padStart(2,"0")}</span><b>{r}</b><p>Starter outline ready to copy and adapt to your project.</p><button className="text-link" onClick={()=>copy(r+"\n\nProject:\nModule:\nEnvironment:\nScope:\n\nNotes:\n\nOwner:\nDate:")}>Copy starter ↗</button></article>)}</div><p className="small-note">These are editable starter outlines, not official client documents. Remove confidential project data before sharing.</p></>}
      {section==="community"&&<div className="empty-state"><div className="empty-icon">◎</div><span className="eyebrow">COMMUNITY / COMING ONLINE</span><h2>A place to share what you learn.</h2><p>Discussion threads, questions, peer feedback, voting and moderation need authenticated accounts and server-side controls. The community is not accepting public posts until those protections are configured.</p><label>Draft a question locally<textarea rows={4} value={communityDraft} onChange={e=>setCommunityDraft(e.target.value)} placeholder="What QA concept or problem are you working through?"/></label><button className="btn-quiet" onClick={()=>copy(communityDraft)} disabled={!communityDraft.trim()}>Copy my draft</button></div>}
      {section==="ai"&&<div className="ai-layout"><div className="ai-intro"><span className="eyebrow">ASSISTED ANALYSIS / HUMAN REVIEW</span><h2>Use AI as a second pair of eyes.</h2><p>Prepare a structured prompt for your approved AI provider. This preview does not send data to an AI service; no API key is configured.</p><div className="notice-card">Never paste client secrets, passwords, access tokens, personal data or confidential production information into unapproved AI tools.</div></div><div className="ai-form"><label>Choose a task<select onChange={e=>setAiPrompt(e.target.value)} value={aiPrompt}><option>Review these requirements and suggest positive, negative, boundary and permission test scenarios:</option><option>Review this bug report for clarity, reproducibility and missing evidence:</option><option>Review this API response against the stated business rules and list validation checks:</option><option>Create exploratory testing ideas for this feature, including risks and edge cases:</option><option>Explain this QA concept in beginner-friendly Roman Urdu and simple English:</option></select></label><label>Safe sample input<textarea rows={7} value={aiInput} onChange={e=>setAiInput(e.target.value)} placeholder="Paste a sanitized requirement or synthetic example…"/></label><button className="btn-primary" onClick={()=>setAiOutput(aiPrompt+"\n\n"+aiInput+"\n\nOutput format: 1) Assumptions 2) Test ideas 3) Negative cases 4) Boundary cases 5) Risks 6) Questions for the product owner. Review every suggestion against the source requirement.")}>Prepare review prompt ↗</button>{aiOutput&&<><pre className="output">{aiOutput}</pre><button className="btn-quiet" onClick={()=>copy(aiOutput)}>Copy prompt</button></>}</div></div>}
      {section==="admin"&&<div className="admin-lock"><div className="lock-emblem">⌑</div><span className="eyebrow">RESTRICTED / SERVER AUTH REQUIRED</span><h2>Control Center</h2><p>This area is reserved for the platform owner. It will only be enabled after dedicated Supabase Auth, verified admin roles, server-side authorization, Row Level Security and audit logging are configured.</p><div className="admin-checks"><span>✓ Separate app boundary</span><span>◷ Admin identity provider pending</span><span>◷ Database policies pending</span><span>◷ Audit log service pending</span></div><label>Admin setup reference<input value={adminCode} onChange={e=>setAdminCode(e.target.value)} placeholder="Not a password field — setup is not enabled"/></label><button className="btn-quiet" onClick={()=>setAdminMessage("Admin sign-in is intentionally disabled until server-side security is deployed.")}>Check access status</button>{adminMessage&&<p className="error-text">{adminMessage}</p>}<small>Do not use a client-side password or hard-coded secret to protect an admin dashboard.</small></div>}
      <footer className="workspace-footer"><span>QA UNIVERSE · BUILT FOR PRACTICE</span><span>PORTFOLIO IS A SEPARATE APPLICATION <a href="https://m-adil-one.vercel.app" target="_blank" rel="noreferrer">↗</a></span></footer>
      </div></main>{toast&&<div className="toast" role="status">{toast}</div>}
  </div>;
}