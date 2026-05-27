import { useState, useRef, useEffect } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const O = "#FF6B1A";
const BG = "#0C0C0C";
const CARD = "#141414";
const CARD2 = "#181818";
const BORDER = "#222";
const MUTED = "#555";
const MUTED2 = "#888";

const CATEGORIES = [
  { id: "badkamer", label: "Badkamer", icon: "🚿", saving: "€6.000+", desc: "Complete badkamerrenovatie of gedeeltelijk" },
  { id: "keuken", label: "Keuken", icon: "🍳", saving: "€4.200+", desc: "Nieuwbouw, renovatie of maatwerkkeuken" },
  { id: "toilet", label: "Toilet / WC", icon: "🚽", saving: "€500+", desc: "Nieuw toilet of volledige verbouwing" },
  { id: "zonnepanelen", label: "Zonnepanelen", icon: "☀️", saving: "€1.200+", desc: "Bespaar op je energierekening" },
  { id: "isolatie", label: "Isolatie", icon: "🏡", saving: "€900+/jr", desc: "Dak, vloer of spouwmuurisolatie" },
  { id: "uitbouw", label: "Uitbouw / Aanbouw", icon: "🏗️", saving: "€5.500+", desc: "Meer woonruimte realiseren" },
  { id: "dakkapel", label: "Dakkapel / Dakopbouw", icon: "🏠", saving: "€2.000+", desc: "Extra ruimte en licht op zolder" },
  { id: "stucwerk", label: "Stucwerk", icon: "🪣", saving: "€600+", desc: "Gladde muren en plafonds" },
  { id: "tegelwerk", label: "Tegelwerk", icon: "🔲", saving: "€750+", desc: "Vloer- en wandtegels" },
  { id: "schilderwerk", label: "Schilderwerk", icon: "🖌️", saving: "€400+", desc: "Binnen of buiten schilderen" },
  { id: "vloer", label: "Vloer leggen", icon: "📐", saving: "€800+", desc: "Laminaat, PVC, hout of tegels" },
  { id: "cv-ketel", label: "CV-ketel vervangen", icon: "🔥", saving: "€300+", desc: "Efficiënte nieuwe cv-ketel" },
  { id: "kozijnen", label: "Kozijnen vervangen", icon: "🪟", saving: "€1.500+", desc: "Kunststof of houten kozijnen" },
  { id: "warmtepomp", label: "Warmtepomp", icon: "♻️", saving: "€2.500+", desc: "Duurzaam en energiezuinig verwarmen" },
  { id: "airco", label: "Airconditioning", icon: "❄️", saving: "€600+", desc: "Koeling en verwarming in één" },
  { id: "alarm", label: "Alarm / Beveiliging", icon: "🔐", saving: "€400+", desc: "Inbraakbeveiliging voor jouw woning" },
  { id: "gevel", label: "Gevelrenovatie", icon: "🧱", saving: "€1.200+", desc: "Gevelreiniging of -renovatie" },
  { id: "asbest", label: "Asbestsanering", icon: "⚠️", saving: "€500+", desc: "Veilig en gecertificeerd verwijderen" },
  { id: "tuinaanleg", label: "Tuinaanleg", icon: "🌿", saving: "€1.000+", desc: "Bestrating, beplanting en meer" },
  { id: "sloopwerk", label: "Sloopwerk", icon: "🔨", saving: "€800+", desc: "Professioneel slopen en afvoeren" },
  { id: "elektra", label: "Elektrawerk", icon: "⚡", saving: "€500+", desc: "Groepenkast, bedrading, stopcontacten" },
  { id: "schutting", label: "Schutting / Hekwerk", icon: "🌳", saving: "€600+", desc: "Nieuwe schutting of hekwerk" },
  { id: "overkapping", label: "Overkapping / Carport", icon: "🏕️", saving: "€1.500+", desc: "Overdekte buitenruimte" },
  { id: "trap", label: "Traprenovatie", icon: "🪜", saving: "€400+", desc: "Trap bekleden of volledig vernieuwen" },
  { id: "zolder", label: "Zolderverbouwing", icon: "🏚️", saving: "€3.000+", desc: "Zolder omvormen tot woonruimte" },
  { id: "serre", label: "Serre / Veranda", icon: "🌞", saving: "€2.000+", desc: "Lichte aanbouw van glas" },
  { id: "waterverzachter", label: "Waterverzachter", icon: "💧", saving: "€300+", desc: "Kalk in water verminderen" },
  { id: "ramen-deuren", label: "Ramen & Deuren", icon: "🚪", saving: "€900+", desc: "Plaatsen of vervangen" },
  { id: "rolluiken", label: "Rolluiken / Zonwering", icon: "🌅", saving: "€500+", desc: "Buitenzonwering op maat" },
  { id: "schoorsteen", label: "Schoorsteenrenovatie", icon: "🏭", saving: "€400+", desc: "Renovatie of herstel van schoorsteen" },
];

const STEPS = [
  { id: "project", question: "Welk project wil je aanvragen?", subtitle: "Kies je project", type: "dropdown" },
  { id: "budget", question: "Wat is je budget?", subtitle: "Schatting is genoeg", multi: false, options: ["€0–€5.000","€5.000–€10.000","€10.000–€20.000","€20.000+"] },
  { id: "timing", question: "Wanneer wil je starten?", subtitle: "We houden rekening met jouw planning", multi: false, options: ["Zo snel mogelijk","Binnen 1–3 maanden","Binnen 3–6 maanden","Nog aan het oriënteren"] },
  { id: "contact", question: "Waar sturen we de offertes naartoe?", subtitle: "Gratis en vrijblijvend", type: "form" },
];

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home"); // home | category | partner | success
  const [activeCategory, setActiveCategory] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const formRef = useRef(null);

  function goCategory(cat) { setActiveCategory(cat); setPage("category"); window.scrollTo(0,0); }
  function goHome() { setPage("home"); window.scrollTo(0,0); }
  function goPartner() { setPage("partner"); window.scrollTo(0,0); }
  function scrollToForm() { formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>
      <style>{CSS}</style>

      {/* NAV */}
      <nav style={n.bar}>
        <div style={n.logo} onClick={goHome}>
          <span style={n.ob}>OB</span>
          <span style={n.name}>OFFERTE<span style={{color:O}}>BRIGADE</span></span>
        </div>
        <div style={n.links}>
          <span style={n.link} onClick={goHome}>Home</span>
          <span style={n.link} onClick={() => { goHome(); setTimeout(()=>{ document.getElementById("categories")?.scrollIntoView({behavior:"smooth"}); },100); }}>Categorieën</span>
          <span style={n.link} onClick={goPartner}>Partner worden</span>
          <button style={n.cta} onClick={() => { goHome(); setTimeout(scrollToForm, 100); }} className="ob-btn">Gratis offerte</button>
        </div>
      </nav>

      {page === "home" && <HomePage goCategory={goCategory} goPartner={goPartner} formRef={formRef} />}
      {page === "category" && <CategoryPage cat={activeCategory} goHome={goHome} />}
      {page === "partner" && <PartnerPage />}

      {/* FOOTER */}
      <footer style={f.wrap}>
        <div style={f.inner}>
          <div>
            <div style={f.logo}>OFFERTE<span style={{color:O}}>BRIGADE</span></div>
            <p style={f.tagline}>Gratis offertes vergelijken voor alle renovaties in Nederland</p>
          </div>
          <div style={f.cols}>
            <div>
              <p style={f.colHead}>Populair</p>
              {["Badkamer","Keuken","Zonnepanelen","Isolatie","Uitbouw"].map(l => (
                <p key={l} style={f.colLink} onClick={() => goCategory(CATEGORIES.find(c=>c.label===l))}>{l}</p>
              ))}
            </div>
            <div>
              <p style={f.colHead}>Platform</p>
              {[["Home",goHome],["Partner worden",goPartner]].map(([l,fn]) => (
                <p key={l} style={f.colLink} onClick={fn}>{l}</p>
              ))}
            </div>
          </div>
        </div>
        <div style={f.bottom}>
          <p>© 2026 OfferteBrigade.nl — Alle rechten voorbehouden</p>
          <p>KvK: 12345678 · info@offertebrigade.nl</p>
        </div>
      </footer>
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ goCategory, goPartner, formRef }) {
  return (
    <>
      {/* HERO */}
      <section style={h.wrap}>
        <div style={h.tags}>
          {["GRATIS","VRIJBLIJVEND","BINNEN 24 UUR"].map(t=><span key={t} style={h.tag}>{t}</span>)}
        </div>
        <h1 style={h.h1}>Vergelijk de<br/><span style={{color:O}}>scherpste</span><br/>offertes</h1>
        <p style={h.sub}>Één aanvraag. Meerdere offertes. Jij kiest de beste deal — altijd gratis en vrijblijvend.</p>
        <QuickSelect goCategory={goCategory} />
        <div style={h.stats}>
          {[["30+","Categorieën"],["24u","Reactietijd"],["100%","Vrijblijvend"],["3","Offertes gem."]].map(([n,l])=>(
            <div key={l} style={h.stat}><span style={h.sn}>{n}</span><span style={h.sl}>{l}</span></div>
          ))}
        </div>
      </section>

      {/* HOW */}
      <section style={hw.wrap}>
        <Eyebrow>HOE WERKT HET</Eyebrow>
        <SectionTitle>3 stappen naar jouw offerte</SectionTitle>
        <div style={hw.grid}>
          {[
            {n:"01",t:"Kies je project",b:"Selecteer de renovatie die je wilt laten uitvoeren."},
            {n:"02",t:"Wij regelen alles",b:"We koppelen jou aan gecheckte vakmensen in jouw regio."},
            {n:"03",t:"Vergelijk & kies",b:"Ontvang meerdere offertes en kies de beste deal."},
          ].map(i=>(
            <div key={i.n} style={hw.card} className="ob-card">
              <span style={hw.num}>{i.n}</span>
              <h3 style={hw.ct}>{i.t}</h3>
              <p style={hw.cb}>{i.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={cat.wrap} id="categories">
        <Eyebrow>ALLE CATEGORIEËN</Eyebrow>
        <SectionTitle>Voor elke renovatie</SectionTitle>
        <div style={cat.grid}>
          {CATEGORIES.map(c=>(
            <div key={c.id} style={cat.card} className="ob-card cat-card" onClick={()=>goCategory(c)}>
              <span style={cat.icon}>{c.icon}</span>
              <div>
                <p style={cat.label}>{c.label}</p>
                <p style={cat.desc}>{c.desc}</p>
              </div>
              <span style={cat.saving}>Bespaar {c.saving}</span>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST */}
      <section style={tr.wrap}>
        <div style={tr.inner}>
          <div style={tr.left}>
            <Eyebrow left>WAAROM OFFERTE BRIGADE</Eyebrow>
            <h2 style={tr.h2}>Geen gedoe.<br/>Gewoon de<br/><span style={{color:O}}>beste deal.</span></h2>
            <button style={tr.btn} onClick={()=>formRef.current?.scrollIntoView({behavior:"smooth"})} className="ob-btn">
              Start mijn aanvraag →
            </button>
          </div>
          <div style={tr.right}>
            {[
              ["✓","Gecheckte vakmensen","Alleen betrouwbare bedrijven in ons netwerk"],
              ["✓","Geen verborgen kosten","Onze service is volledig gratis voor consumenten"],
              ["✓","Jij bepaalt","Geen verplichting — jij kiest of je ingaat op een offerte"],
              ["✓","Snel resultaat","Binnen 24 uur meerdere offertes in je inbox"],
              ["✓","30+ categorieën","Van badkamer tot zonnepanelen — alles onder één dak"],
            ].map(([m,t,b])=>(
              <div key={t} style={tr.item}>
                <span style={tr.check}>{m}</span>
                <div><p style={tr.it}>{t}</p><p style={tr.ib}>{b}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONFIGURATOR */}
      <section ref={formRef} style={cf.wrap}>
        <Eyebrow>START HIER</Eyebrow>
        <SectionTitle>Vraag gratis offertes aan</SectionTitle>
        <Configurator />
      </section>

      {/* PARTNER CTA STRIP */}
      <section style={pc.wrap}>
        <div style={pc.inner}>
          <div>
            <p style={pc.label}>VOOR BEDRIJVEN</p>
            <h3 style={pc.h3}>Ben jij een vakman of renovatiebedrijf?</h3>
            <p style={pc.sub}>Ontvang gekwalificeerde leads van klanten in jouw regio.</p>
          </div>
          <button style={pc.btn} onClick={goPartner} className="ob-btn-outline">Partner worden →</button>
        </div>
      </section>
    </>
  );
}

// ─── QUICK SELECT ─────────────────────────────────────────────────────────────
function QuickSelect({ goCategory }) {
  const [val, setVal] = useState("");
  function handleGo() {
    const found = CATEGORIES.find(c => c.id === val);
    if (found) goCategory(found);
  }
  return (
    <div style={qs.wrap}>
      <select style={qs.select} value={val} onChange={e=>setVal(e.target.value)} className="ob-select">
        <option value="">— Selecteer je project —</option>
        {CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
      </select>
      <button style={{...qs.btn, opacity: val?1:0.4, cursor:val?"pointer":"not-allowed"}} onClick={handleGo} className="ob-btn">
        Vergelijk offertes →
      </button>
    </div>
  );
}

// ─── CATEGORY PAGE ────────────────────────────────────────────────────────────
function CategoryPage({ cat, goHome }) {
  if (!cat) return null;
  return (
    <div style={{maxWidth:800, margin:"0 auto", padding:"48px 24px"}}>
      <p style={{color:MUTED2, fontSize:13, marginBottom:16, cursor:"pointer"}} onClick={goHome}>← Terug naar home</p>
      <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:8}}>
        <span style={{fontSize:40}}>{cat.icon}</span>
        <div>
          <p style={{fontSize:11,color:O,letterSpacing:"3px",marginBottom:4}}>OFFERTE AANVRAGEN</p>
          <h1 style={{fontFamily:"'Bebas Neue',cursive",fontSize:42,letterSpacing:1}}>{cat.label}</h1>
        </div>
      </div>
      <p style={{fontSize:16,color:MUTED2,lineHeight:1.7,marginBottom:12}}>{cat.desc}</p>
      <div style={{display:"inline-block",background:"#1e1200",border:`1px solid ${O}`,padding:"6px 14px",borderRadius:2,marginBottom:40}}>
        <span style={{color:O,fontWeight:600,fontSize:14}}>Gemiddelde besparing: {cat.saving}</span>
      </div>

      <div style={{background:CARD,border:`1px solid ${BORDER}`,padding:"28px 24px",marginBottom:32}}>
        <h2 style={{fontFamily:"'Bebas Neue',cursive",fontSize:28,letterSpacing:1,marginBottom:16}}>Waarom offertes vergelijken voor {cat.label.toLowerCase()}?</h2>
        <p style={{color:MUTED2,lineHeight:1.7,marginBottom:12}}>
          De prijzen voor {cat.label.toLowerCase()} kunnen sterk variëren per aanbieder. Door meerdere offertes te vergelijken bespaar je gemiddeld {cat.saving} en kies jij de vakman die het beste bij jouw wensen en budget past.
        </p>
        <p style={{color:MUTED2,lineHeight:1.7}}>
          Via Offerte Brigade ontvang je binnen 24 uur offertes van gecheckte vakmensen in jouw regio. Volledig gratis en zonder verplichtingen.
        </p>
      </div>

      <h2 style={{fontFamily:"'Bebas Neue',cursive",fontSize:28,letterSpacing:1,marginBottom:24}}>Vraag nu je offertes aan</h2>
      <Configurator prefill={cat.label} />
    </div>
  );
}

// ─── PARTNER PAGE ─────────────────────────────────────────────────────────────
function PartnerPage() {
  const [form, setForm] = useState({bedrijf:"",naam:"",email:"",telefoon:"",categorie:"",regio:""});
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  function submit() {
    if (!form.bedrijf||!form.naam||!form.email||!form.telefoon) { setErr("Vul alle verplichte velden in."); return; }
    setErr(""); setSent(true);
  }

  return (
    <div style={{maxWidth:700, margin:"0 auto", padding:"56px 24px"}}>
      <p style={{fontSize:10,color:O,letterSpacing:"3px",marginBottom:8}}>VOOR BEDRIJVEN</p>
      <h1 style={{fontFamily:"'Bebas Neue',cursive",fontSize:48,letterSpacing:1,marginBottom:12}}>Partner worden</h1>
      <p style={{fontSize:16,color:MUTED2,lineHeight:1.7,marginBottom:40}}>
        Sluit je aan bij Offerte Brigade en ontvang direct gekwalificeerde leads van klanten in jouw regio. Jij betaalt alleen voor leads die écht bij jou passen.
      </p>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12,marginBottom:48}}>
        {[
          {icon:"📍",t:"Lokale leads",b:"Alleen klanten in jouw werkgebied"},
          {icon:"✅",t:"Gecheckte aanvragen",b:"Elke lead telefonisch geverifieerd"},
          {icon:"💰",t:"Betaal per lead",b:"Geen abonnement, geen risico"},
          {icon:"📈",t:"Schaalbaar",b:"Zet aan of uit wanneer jij wilt"},
        ].map(i=>(
          <div key={i.t} style={{background:CARD,border:`1px solid ${BORDER}`,padding:"20px 16px"}}>
            <span style={{fontSize:28,display:"block",marginBottom:10}}>{i.icon}</span>
            <p style={{fontWeight:600,fontSize:14,marginBottom:4}}>{i.t}</p>
            <p style={{fontSize:13,color:MUTED2}}>{i.b}</p>
          </div>
        ))}
      </div>

      {sent ? (
        <div style={{background:CARD,border:`1px solid ${BORDER}`,padding:"36px 28px",textAlign:"center"}} className="fade-in">
          <div style={{width:56,height:56,background:O,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:700,margin:"0 auto 16px"}}>✓</div>
          <h2 style={{fontFamily:"'Bebas Neue',cursive",fontSize:30,letterSpacing:1,marginBottom:8}}>Aanmelding ontvangen!</h2>
          <p style={{color:MUTED2,fontSize:15}}>We nemen binnen <span style={{color:O}}>1 werkdag</span> contact op met {form.naam} van {form.bedrijf}.</p>
        </div>
      ) : (
        <div style={{background:CARD,border:`1px solid ${BORDER}`,padding:"32px 28px"}}>
          <h2 style={{fontFamily:"'Bebas Neue',cursive",fontSize:26,letterSpacing:1,marginBottom:24}}>Aanmelden als partner</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            {[
              {k:"bedrijf",l:"Bedrijfsnaam *",p:"De Renovatie BV",t:"text"},
              {k:"naam",l:"Contactpersoon *",p:"Jan de Vries",t:"text"},
              {k:"email",l:"E-mailadres *",p:"jan@bedrijf.nl",t:"email"},
              {k:"telefoon",l:"Telefoonnummer *",p:"06 12 34 56 78",t:"tel"},
              {k:"categorie",l:"Vakgebied",p:"Badkamer, keuken...",t:"text"},
              {k:"regio",l:"Werkgebied / regio",p:"Zuid-Holland",t:"text"},
            ].map(fi=>(
              <div key={fi.k} style={{display:"flex",flexDirection:"column",gap:5}}>
                <label style={{fontSize:10,color:MUTED2,letterSpacing:"1.5px",textTransform:"uppercase"}}>{fi.l}</label>
                <input type={fi.t} placeholder={fi.p} value={form[fi.k]}
                  onChange={e=>setForm({...form,[fi.k]:e.target.value})}
                  style={{padding:"11px 13px",background:"#161616",border:`1px solid ${BORDER}`,color:"#fff",fontSize:14,fontFamily:"'DM Sans',sans-serif",width:"100%"}}
                  className="input-field" />
              </div>
            ))}
          </div>
          <div style={{marginTop:16,display:"flex",flexDirection:"column",gap:6}}>
            <label style={{fontSize:10,color:MUTED2,letterSpacing:"1.5px",textTransform:"uppercase"}}>Aanvullende informatie</label>
            <textarea placeholder="Vertel iets over je bedrijf en wat je zoekt..." rows={3}
              style={{padding:"11px 13px",background:"#161616",border:`1px solid ${BORDER}`,color:"#fff",fontSize:14,fontFamily:"'DM Sans',sans-serif",resize:"vertical"}}
              className="input-field" />
          </div>
          {err && <p style={{color:"#ff4d4d",fontSize:13,marginTop:8}}>{err}</p>}
          <button style={{marginTop:20,width:"100%",padding:"15px",background:O,color:"#fff",border:"none",fontFamily:"'Bebas Neue',cursive",fontSize:18,letterSpacing:2,cursor:"pointer"}}
            onClick={submit} className="ob-btn">
            AANMELDEN ALS PARTNER →
          </button>
          <p style={{fontSize:11,color:MUTED,textAlign:"center",marginTop:10}}>We nemen binnen 1 werkdag contact op</p>
        </div>
      )}
    </div>
  );
}

// ─── CONFIGURATOR ─────────────────────────────────────────────────────────────
function Configurator({ prefill }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(prefill ? { project: prefill } : {});
  const [form, setForm] = useState({naam:"",telefoon:"",email:"",postcode:""});
  const [submitted, setSubmitted] = useState(false);
  const [err, setErr] = useState("");
  const [visible, setVisible] = useState(true);

  const startStep = prefill ? 1 : 0;
  const effectiveStep = step + startStep;
  const current = STEPS[effectiveStep];
  const progress = ((effectiveStep) / STEPS.length) * 100;

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, [step]);

  function pick(val) {
    setAnswers({...answers, [current.id]: val});
    if (effectiveStep < STEPS.length - 1) setTimeout(() => setStep(s => s + 1), 280);
  }

  function submit() {
    if (!form.naam||!form.telefoon||!form.email) { setErr("Vul alle verplichte velden in."); return; }
    setErr(""); setSubmitted(true);
  }

  if (submitted) return (
    <div style={{...cf.card, textAlign:"center"}} className="fade-in">
      <div style={cf.badge}>✓</div>
      <h3 style={cf.st}>AANVRAAG ONTVANGEN!</h3>
      <p style={cf.ss}>We nemen binnen <span style={{color:O}}>24 uur</span> contact op met <strong>{form.naam}</strong>.</p>
      <div style={cf.sumBox}>
        {answers.project && <SRow k="Project" v={answers.project} />}
        {answers.budget && <SRow k="Budget" v={answers.budget} />}
        {answers.timing && <SRow k="Planning" v={answers.timing} />}
        {form.postcode && <SRow k="Postcode" v={form.postcode} last />}
      </div>
    </div>
  );

  return (
    <div style={{...cf.card, opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(10px)", transition:"opacity 0.3s,transform 0.3s"}}>
      <div style={cf.progWrap}>
        <div style={cf.progTrack}><div style={{...cf.progFill,width:`${progress}%`}} className="ob-progress"/></div>
        <span style={cf.progLbl}>{effectiveStep+1}/{STEPS.length}</span>
      </div>
      <p style={cf.stepTag}>STAP {effectiveStep+1}</p>
      <h3 style={cf.q}>{current.question}</h3>
      <p style={cf.sub2}>{current.subtitle}</p>

      {current.type === "dropdown" && (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <select style={cf.sel} onChange={e=>e.target.value&&pick(e.target.value)} defaultValue="" className="ob-select">
            <option value="">— Selecteer je project —</option>
            {CATEGORIES.map(c=><option key={c.id} value={c.label}>{c.label}</option>)}
          </select>
        </div>
      )}

      {current.options && (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {current.options.map((opt,i)=>(
            <button key={opt} onClick={()=>pick(opt)}
              style={{...cf.opt, animationDelay:`${i*55}ms`, ...(answers[current.id]===opt?cf.optA:{})}}
              className="opt-btn">
              <span style={{flex:1,fontWeight:500}}>{opt}</span>
              <span style={{color:O,opacity:answers[current.id]===opt?1:0,fontWeight:700,transition:"opacity 0.15s"}}>✓</span>
            </button>
          ))}
        </div>
      )}

      {current.type === "form" && (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {[
            {k:"naam",l:"Volledige naam *",p:"Jan de Vries",t:"text"},
            {k:"telefoon",l:"Telefoonnummer *",p:"06 12 34 56 78",t:"tel"},
            {k:"email",l:"E-mailadres *",p:"jan@email.nl",t:"email"},
            {k:"postcode",l:"Postcode",p:"2641 AB",t:"text"},
          ].map(fi=>(
            <div key={fi.k} style={{display:"flex",flexDirection:"column",gap:5}}>
              <label style={{fontSize:10,color:MUTED2,letterSpacing:"1.5px",textTransform:"uppercase"}}>{fi.l}</label>
              <input type={fi.t} placeholder={fi.p} value={form[fi.k]}
                onChange={e=>setForm({...form,[fi.k]:e.target.value})}
                style={cf.inp} className="input-field"/>
            </div>
          ))}
          {err && <p style={{color:"#ff4d4d",fontSize:13}}>{err}</p>}
          <button style={cf.subBtn} onClick={submit} className="ob-btn">STUUR MIJN AANVRAAG →</button>
          <p style={{fontSize:11,color:MUTED,textAlign:"center"}}>🔒 Je gegevens worden nooit gedeeld zonder toestemming</p>
        </div>
      )}
    </div>
  );
}

function SRow({k,v,last}) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",fontSize:14,paddingBottom:last?0:10,marginBottom:last?0:10,borderBottom:last?"none":`1px solid ${BORDER}`}}>
      <span style={{color:MUTED2,fontSize:11,letterSpacing:1,textTransform:"uppercase",paddingTop:2}}>{k}</span>
      <span style={{color:"#fff",fontWeight:500}}>{v}</span>
    </div>
  );
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function Eyebrow({children,left}) {
  return <p style={{fontSize:10,color:MUTED,letterSpacing:"3px",textAlign:left?"left":"center",marginBottom:10}}>— {children} —</p>;
}
function SectionTitle({children}) {
  return <h2 style={{fontFamily:"'Bebas Neue',cursive",fontSize:"clamp(30px,5vw,44px)",textAlign:"center",letterSpacing:1,marginBottom:36}}>{children}</h2>;
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const n = {
  bar:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 24px",borderBottom:`1px solid ${BORDER}`,position:"sticky",top:0,background:"rgba(12,12,12,0.96)",backdropFilter:"blur(8px)",zIndex:100},
  logo:{display:"flex",alignItems:"center",gap:10,cursor:"pointer"},
  ob:{background:O,color:"#fff",fontFamily:"'Bebas Neue',cursive",fontSize:14,padding:"4px 7px",letterSpacing:1},
  name:{fontFamily:"'Bebas Neue',cursive",fontSize:18,letterSpacing:2},
  links:{display:"flex",alignItems:"center",gap:24},
  link:{fontSize:13,color:MUTED2,cursor:"pointer",letterSpacing:"0.5px"},
  cta:{padding:"8px 16px",background:O,color:"#fff",border:"none",fontFamily:"'Bebas Neue',cursive",fontSize:14,letterSpacing:1.5,cursor:"pointer"},
};

const h = {
  wrap:{maxWidth:600,margin:"0 auto",padding:"64px 24px 48px",textAlign:"center"},
  tags:{display:"flex",justifyContent:"center",gap:8,marginBottom:24,flexWrap:"wrap"},
  tag:{fontSize:10,letterSpacing:"2px",color:O,border:`1px solid ${O}`,padding:"4px 10px"},
  h1:{fontFamily:"'Bebas Neue',cursive",fontSize:"clamp(56px,12vw,88px)",lineHeight:0.95,marginBottom:20,letterSpacing:1},
  sub:{fontSize:16,color:MUTED2,lineHeight:1.7,marginBottom:32,maxWidth:440,margin:"0 auto 32px"},
  stats:{display:"flex",justifyContent:"center",gap:28,borderTop:`1px solid ${BORDER}`,paddingTop:32,flexWrap:"wrap",marginTop:32},
  stat:{display:"flex",flexDirection:"column",alignItems:"center",gap:3},
  sn:{fontFamily:"'Bebas Neue',cursive",fontSize:34,color:"#fff",letterSpacing:1},
  sl:{fontSize:11,color:MUTED,letterSpacing:"1px"},
};

const qs = {
  wrap:{display:"flex",flexDirection:"column",gap:10,maxWidth:480,margin:"0 auto"},
  select:{padding:"13px 14px",background:CARD,border:`1px solid ${BORDER}`,color:"#fff",fontSize:15,fontFamily:"'DM Sans',sans-serif",width:"100%"},
  btn:{padding:"13px 20px",background:O,color:"#fff",border:"none",fontFamily:"'Bebas Neue',cursive",fontSize:16,letterSpacing:2,cursor:"pointer"},
};

const hw = {
  wrap:{maxWidth:900,margin:"0 auto",padding:"56px 24px"},
  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:14},
  card:{background:CARD,border:`1px solid ${BORDER}`,padding:"26px 22px",transition:"border-color 0.2s"},
  num:{fontFamily:"'Bebas Neue',cursive",fontSize:44,color:O,display:"block",marginBottom:10},
  ct:{fontSize:16,fontWeight:600,marginBottom:6},
  cb:{fontSize:14,color:MUTED2,lineHeight:1.6},
};

const cat = {
  wrap:{maxWidth:1000,margin:"0 auto",padding:"0 24px 64px"},
  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10},
  card:{background:CARD,border:`1px solid ${BORDER}`,padding:"16px 18px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",transition:"all 0.15s"},
  icon:{fontSize:24,flexShrink:0},
  label:{fontWeight:600,fontSize:14,marginBottom:2},
  desc:{fontSize:12,color:MUTED2},
  saving:{fontSize:11,color:O,fontWeight:600,flexShrink:0,textAlign:"right"},
};

const tr = {
  wrap:{background:"#0f0f0f",borderTop:`1px solid ${BORDER}`,borderBottom:`1px solid ${BORDER}`,padding:"64px 24px"},
  inner:{maxWidth:900,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,alignItems:"start"},
  left:{},
  right:{display:"flex",flexDirection:"column",gap:20},
  h2:{fontFamily:"'Bebas Neue',cursive",fontSize:"clamp(30px,5vw,50px)",lineHeight:1.05,letterSpacing:1,marginBottom:24},
  btn:{padding:"13px 24px",background:O,color:"#fff",border:"none",fontFamily:"'Bebas Neue',cursive",fontSize:16,letterSpacing:2,cursor:"pointer"},
  item:{display:"flex",gap:14,alignItems:"flex-start"},
  check:{color:O,fontSize:18,fontWeight:700,marginTop:2,flexShrink:0},
  it:{fontWeight:600,fontSize:14,marginBottom:2},
  ib:{fontSize:13,color:MUTED2,lineHeight:1.5},
};

const cf = {
  wrap:{maxWidth:520,margin:"0 auto",padding:"56px 24px"},
  card:{background:CARD,border:`1px solid ${BORDER}`,padding:"32px 28px`"},
  progWrap:{display:"flex",alignItems:"center",gap:12,marginBottom:22},
  progTrack:{flex:1,height:2,background:"#1f1f1f",overflow:"hidden"},
  progFill:{height:"100%",background:O},
  progLbl:{fontSize:11,color:MUTED,letterSpacing:1,flexShrink:0},
  stepTag:{fontSize:10,color:O,letterSpacing:"3px",marginBottom:6,fontWeight:600},
  q:{fontFamily:"'Bebas Neue',cursive",fontSize:28,letterSpacing:1,marginBottom:4},
  sub2:{fontSize:13,color:MUTED2,marginBottom:20},
  sel:{padding:"13px 14px",background:"#161616",border:`1px solid ${BORDER}`,color:"#fff",fontSize:15,fontFamily:"'DM Sans',sans-serif",width:"100%"},
  opt:{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",background:CARD2,border:`1px solid ${BORDER}`,color:"#bbb",fontSize:15,cursor:"pointer",textAlign:"left",transition:"all 0.15s"},
  optA:{background:"#1e1200",border:`1px solid ${O}`,color:"#fff"},
  inp:{padding:"12px 13px",background:"#161616",border:`1px solid ${BORDER}`,color:"#fff",fontSize:15,fontFamily:"'DM Sans',sans-serif",width:"100%"},
  subBtn:{padding:"15px",background:O,color:"#fff",border:"none",fontFamily:"'Bebas Neue',cursive",fontSize:18,letterSpacing:2,cursor:"pointer",width:"100%"},
  badge:{width:56,height:56,background:O,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:700,margin:"0 auto 16px"},
  st:{fontFamily:"'Bebas Neue',cursive",fontSize:30,letterSpacing:2,marginBottom:8},
  ss:{fontSize:15,color:"#999",lineHeight:1.6,marginBottom:20},
  sumBox:{background:CARD2,border:`1px solid ${BORDER}`,padding:"16px",textAlign:"left"},
};

const pc = {
  wrap:{background:O,padding:"40px 24px"},
  inner:{maxWidth:900,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",gap:24,flexWrap:"wrap"},
  label:{fontSize:10,letterSpacing:"2px",color:"rgba(255,255,255,0.7)",marginBottom:6},
  h3:{fontFamily:"'Bebas Neue',cursive",fontSize:28,letterSpacing:1,color:"#fff",marginBottom:4},
  sub:{fontSize:14,color:"rgba(255,255,255,0.8)"},
  btn:{padding:"12px 24px",background:"transparent",color:"#fff",border:"2px solid #fff",fontFamily:"'Bebas Neue',cursive",fontSize:16,letterSpacing:2,cursor:"pointer",flexShrink:0},
};

const f = {
  wrap:{borderTop:`1px solid ${BORDER}`,padding:"48px 24px 24px"},
  inner:{maxWidth:900,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr auto",gap:40,marginBottom:32,flexWrap:"wrap"},
  logo:{fontFamily:"'Bebas Neue',cursive",fontSize:22,letterSpacing:3,marginBottom:8},
  tagline:{fontSize:13,color:MUTED2,maxWidth:280},
  cols:{display:"flex",gap:40},
  colHead:{fontSize:10,color:MUTED,letterSpacing:"2px",marginBottom:10},
  colLink:{fontSize:13,color:MUTED2,marginBottom:6,cursor:"pointer"},
  bottom:{maxWidth:900,margin:"0 auto",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,paddingTop:20,borderTop:`1px solid ${BORDER}`,fontSize:11,color:MUTED},
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0C0C0C; }
  .ob-btn { transition: background 0.15s, transform 0.15s !important; }
  .ob-btn:hover { background: #ff8c42 !important; transform: translateY(-1px); }
  .ob-btn-outline:hover { background: rgba(255,255,255,0.1) !important; }
  .ob-btn-outline { transition: background 0.15s !important; }
  .ob-card:hover { border-color: ${O} !important; }
  .cat-card:hover { background: #1a1a1a !important; transform: translateX(3px); }
  .opt-btn { animation: slideUp 0.28s ease both; }
  .opt-btn:hover { border-color: ${O} !important; background: #1e1200 !important; color: #fff !important; }
  .input-field:focus { outline: none; border-color: ${O} !important; }
  .ob-select { appearance: none; cursor: pointer; }
  .ob-select:focus { outline: none; border-color: ${O} !important; }
  .ob-progress { transition: width 0.5s cubic-bezier(0.4,0,0.2,1); }
  .fade-in { animation: fadeIn 0.4s ease both; }
  @keyframes slideUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @media(max-width:640px){
    .tr-grid{grid-template-columns:1fr !important;}
    .f-inner{grid-template-columns:1fr !important;}
  }
`;
