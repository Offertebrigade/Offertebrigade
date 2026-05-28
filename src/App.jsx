import { useState, useRef, useEffect } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const O = "#C8440A";      // Terracotta oranje — warm, pakkend accent
const BG = "#F5F0E8";     // Crème achtergrond
const CARD = "#EDE7DA";   // Warm gebroken wit voor kaarten
const CARD2 = "#E4DDD0";  // Iets donkerder kaart
const BORDER = "#D4C9B5"; // Warme beige rand
const MUTED = "#9C8E7E";  // Warm grijs voor subtekst
const MUTED2 = "#6B5E50"; // Donker warm grijs
const DARK = "#2C1F14";   // Donkerbruin voor tekst

const ICONS = {
  badkamer: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="32" height="32"><path d="M3 10h18v4a6 6 0 01-6 6H9a6 6 0 01-6-6v-4z"/><path d="M7 10V6a2 2 0 012-2h2"/><path d="M5 20v2M19 20v2"/></svg>,
  keuken: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="32" height="32"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M2 9h20M9 9v12"/><circle cx="6" cy="6" r="1"/><circle cx="12" cy="6" r="1"/></svg>,
  toilet: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="32" height="32"><path d="M6 3h12v4H6zM4 7h16v2a8 8 0 01-16 0V7z"/><path d="M10 19v2M14 19v2"/></svg>,
  uitbouw: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="32" height="32"><path d="M3 21h18M3 10l9-7 9 7"/><path d="M9 21V12h6v9"/></svg>,
  schilderwerk: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="32" height="32"><path d="M2 6h20v4H2zM4 10v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><path d="M12 10v10M8 10v10M16 10v10"/></svg>,
  vloer: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="32" height="32"><rect x="2" y="4" width="9" height="8" rx="1"/><rect x="13" y="4" width="9" height="8" rx="1"/><rect x="2" y="14" width="9" height="6" rx="1"/><rect x="13" y="14" width="9" height="6" rx="1"/></svg>,
  elektra: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="32" height="32"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  sloopwerk: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="32" height="32"><path d="M15 12l-8.5 8.5a2.12 2.12 0 01-3-3L12 9"/><path d="M17.64 15L22 10.64"/><path d="M20.91 11.7l-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 00-3.94-1.64H9l.92.82A6.18 6.18 0 0112 8.4v1.56l2 2h2.47l2.26 1.91"/></svg>,
  stucwerk: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="32" height="32"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>,
  tegelwerk: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="32" height="32"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
};

const CATEGORIES = [
  { id: "badkamer", label: "Badkamer", saving: "€6.000+", desc: "Complete badkamerrenovatie of gedeeltelijk" },
  { id: "keuken", label: "Keuken", saving: "€4.200+", desc: "Nieuwbouw, renovatie of maatwerkkeuken" },
  { id: "toilet", label: "Toilet / WC", saving: "€500+", desc: "Nieuw toilet of volledige verbouwing" },
  { id: "uitbouw", label: "Uitbouw / Aanbouw", saving: "€5.500+", desc: "Meer woonruimte realiseren" },
  { id: "schilderwerk", label: "Schilderwerk", saving: "€400+", desc: "Binnen of buiten schilderen" },
  { id: "vloer", label: "Vloer leggen", saving: "€800+", desc: "Laminaat, PVC, hout of tegels" },
  { id: "elektra", label: "Elektrawerk", saving: "€500+", desc: "Groepenkast, bedrading, stopcontacten" },
  { id: "sloopwerk", label: "Sloopwerk", saving: "€800+", desc: "Professioneel slopen en afvoeren" },
  { id: "stucwerk", label: "Stucwerk", saving: "€600+", desc: "Gladde muren en plafonds" },
  { id: "tegelwerk", label: "Tegelwerk", saving: "€750+", desc: "Vloer- en wandtegels" },
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
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: DARK }}>
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
            <p style={f.tagline}>Ontvang de scherpste offerte voor jouw renovatie in Nederland</p>
          </div>
          <div style={f.cols}>
            <div>
              <p style={f.colHead}>Populair</p>
              {["Badkamer","Keuken","Uitbouw","Schilderwerk","Tegelwerk"].map(l => (
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
          <p>info@offertebrigade.nl</p>
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
        <h1 style={h.h1}>Ontvang de<br/><span style={{color:O}}>scherpste</span><br/>offerte</h1>
        <p style={h.slogan}>START MET SLIM VERGELIJKEN.<br/>STOP MET TEVEEL BETALEN.</p>
        <p style={h.sub}>Stuur ons jouw klus. Wij gaan voor jou op zoek naar de beste prijs — gratis en zonder verplichtingen.</p>
        <QuickSelect goCategory={goCategory} />
        <div style={h.stats}>
          {[["30+","Categorieën"],["3 dagen","Reactietijd"],["100%","Vrijblijvend"],["3","Offertes gem."]].map(([n,l])=>(
            <div key={l} style={h.stat}><span style={h.sn}>{n}</span><span style={h.sl}>{l}</span></div>
          ))}
        </div>
      </section>

      {/* SLOGAN BANNER */}
      <section style={sl.wrap}>
        <div style={sl.inner}>
          <p style={sl.line1}>START MET SLIM VERGELIJKEN.</p>
          <p style={sl.line2}>STOP MET TEVEEL BETALEN.</p>
        </div>
      </section>

      {/* HOW */}
      <section style={hw.wrap}>
        <Eyebrow>HOE WERKT HET</Eyebrow>
        <SectionTitle>3 stappen naar jouw offerte</SectionTitle>
        <div style={hw.grid}>
          {[
            {n:"01",t:"Stuur je klus in",b:"Vertel ons wat je wilt laten renoveren en wat je budget is."},
            {n:"02",t:"Wij zoeken de scherpste prijs",b:"Wij gaan namens jou op zoek naar de beste vakman tegen de laagste prijs."},
            {n:"03",t:"Jij ontvangt de beste offerte",b:"Je ontvangt direct de scherpste offerte — zonder gedoe, zonder verplichtingen."},
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
              <div style={cat.iconWrap}>
                <span style={{color:O}}>{ICONS[c.id]}</span>
              </div>
              <div style={cat.cardBody}>
                <p style={cat.label}>{c.label}</p>
                <p style={cat.desc}>{c.desc}</p>
                <span style={cat.saving}>Bespaar {c.saving} →</span>
              </div>
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
              ["✓","Wij doen het werk","Jij stuurt je klus in — wij zoeken de scherpste prijs voor jou"],
              ["✓","Geen verborgen kosten","Onze service is volledig gratis voor jou als klant"],
              ["✓","Geen verplichtingen","Jij beslist of je ingaat op de offerte die wij voor je vinden"],
              ["✓","Snel resultaat","Binnen 3 werkdagen de scherpste offerte in je inbox"],
              ["✓","30+ categorieën","Van badkamer tot zonnepanelen — wij regelen het voor jou"],
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
          Via Offerte Brigade ontvang je binnen 3 werkdagen offertes van gecheckte vakmensen in jouw regio. Volledig gratis en zonder verplichtingen.
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
      <p style={cf.ss}>We nemen binnen <span style={{color:O}}>3 werkdagen</span> contact op met <strong>{form.naam}</strong>.</p>
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
  bar:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 24px",borderBottom:`1px solid ${BORDER}`,position:"sticky",top:0,background:"rgba(245,240,232,0.96)",backdropFilter:"blur(8px)",zIndex:100},
  logo:{display:"flex",alignItems:"center",gap:10,cursor:"pointer"},
  ob:{background:O,color:"#fff",fontFamily:"'Bebas Neue',cursive",fontSize:14,padding:"4px 7px",letterSpacing:1},
  name:{fontFamily:"'Bebas Neue',cursive",fontSize:18,letterSpacing:2,color:DARK},
  links:{display:"flex",alignItems:"center",gap:24},
  link:{fontSize:13,color:MUTED2,cursor:"pointer",letterSpacing:"0.5px"},
  cta:{padding:"8px 16px",background:O,color:"#fff",border:"none",fontFamily:"'Bebas Neue',cursive",fontSize:14,letterSpacing:1.5,cursor:"pointer"},
};

const h = {
  wrap:{maxWidth:600,margin:"0 auto",padding:"64px 24px 48px",textAlign:"center"},
  tags:{display:"flex",justifyContent:"center",gap:8,marginBottom:24,flexWrap:"wrap"},
  tag:{fontSize:10,letterSpacing:"2px",color:O,border:`1px solid ${O}`,padding:"4px 10px"},
  h1:{fontFamily:"'Bebas Neue',cursive",fontSize:"clamp(56px,12vw,88px)",lineHeight:0.95,marginBottom:16,letterSpacing:1,color:DARK},
  slogan:{fontFamily:"'Bebas Neue',cursive",fontSize:"clamp(14px,2.5vw,18px)",letterSpacing:"3px",color:O,marginBottom:16,lineHeight:1.6},
  sub:{fontSize:16,color:MUTED2,lineHeight:1.7,marginBottom:32,maxWidth:440,margin:"0 auto 32px"},
  stats:{display:"flex",justifyContent:"center",gap:28,borderTop:`1px solid ${BORDER}`,paddingTop:32,flexWrap:"wrap",marginTop:32},
  stat:{display:"flex",flexDirection:"column",alignItems:"center",gap:3},
  sn:{fontFamily:"'Bebas Neue',cursive",fontSize:34,color:DARK,letterSpacing:1},
  sl:{fontSize:11,color:MUTED,letterSpacing:"1px"},
};

const qs = {
  wrap:{display:"flex",flexDirection:"column",gap:10,maxWidth:480,margin:"0 auto"},
  select:{padding:"13px 14px",background:CARD,border:`1px solid ${BORDER}`,color:DARK,fontSize:15,fontFamily:"'DM Sans',sans-serif",width:"100%"},
  btn:{padding:"13px 20px",background:O,color:"#fff",border:"none",fontFamily:"'Bebas Neue',cursive",fontSize:16,letterSpacing:2,cursor:"pointer"},
};

const sl = {
  wrap:{background:DARK,padding:"28px 24px",textAlign:"center"},
  inner:{maxWidth:900,margin:"0 auto"},
  line1:{fontFamily:"'Bebas Neue',cursive",fontSize:"clamp(20px,4vw,36px)",letterSpacing:"4px",color:"#fff",marginBottom:4},
  line2:{fontFamily:"'Bebas Neue',cursive",fontSize:"clamp(20px,4vw,36px)",letterSpacing:"4px",color:O},
};

const hw = {
  wrap:{maxWidth:900,margin:"0 auto",padding:"56px 24px"},
  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:14},
  card:{background:CARD,border:`1px solid ${BORDER}`,padding:"26px 22px",transition:"border-color 0.2s"},
  num:{fontFamily:"'Bebas Neue',cursive",fontSize:44,color:O,display:"block",marginBottom:10},
  ct:{fontSize:16,fontWeight:700,marginBottom:6,color:DARK},
  cb:{fontSize:14,color:MUTED2,lineHeight:1.6},
};

const cat = {
  wrap:{maxWidth:1000,margin:"0 auto",padding:"0 24px 64px"},
  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12},
  card:{background:CARD,border:`1px solid ${BORDER}`,cursor:"pointer",transition:"all 0.2s",overflow:"hidden",display:"flex",alignItems:"center",gap:16,padding:"20px"},
  iconWrap:{width:56,height:56,background:"#F5EDE0",border:`1px solid ${BORDER}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},
  cardBody:{flex:1},
  label:{fontWeight:700,fontSize:15,marginBottom:3,color:DARK},
  desc:{fontSize:12,color:MUTED2,marginBottom:6,lineHeight:1.4},
  saving:{fontSize:12,color:O,fontWeight:600},
};

const tr = {
  wrap:{background:CARD,borderTop:`1px solid ${BORDER}`,borderBottom:`1px solid ${BORDER}`,padding:"64px 24px"},
  inner:{maxWidth:900,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,alignItems:"start"},
  left:{},
  right:{display:"flex",flexDirection:"column",gap:20},
  h2:{fontFamily:"'Bebas Neue',cursive",fontSize:"clamp(30px,5vw,50px)",lineHeight:1.05,letterSpacing:1,marginBottom:24,color:DARK},
  btn:{padding:"13px 24px",background:O,color:"#fff",border:"none",fontFamily:"'Bebas Neue',cursive",fontSize:16,letterSpacing:2,cursor:"pointer"},
  item:{display:"flex",gap:14,alignItems:"flex-start"},
  check:{color:O,fontSize:18,fontWeight:700,marginTop:2,flexShrink:0},
  it:{fontWeight:600,fontSize:14,marginBottom:2,color:DARK},
  ib:{fontSize:13,color:MUTED2,lineHeight:1.5},
};

const cf = {
  wrap:{maxWidth:520,margin:"0 auto",padding:"56px 24px"},
  card:{background:CARD,border:`1px solid ${BORDER}`,padding:"32px 28px"},
  progWrap:{display:"flex",alignItems:"center",gap:12,marginBottom:22},
  progTrack:{flex:1,height:2,background:BORDER,overflow:"hidden"},
  progFill:{height:"100%",background:O},
  progLbl:{fontSize:11,color:MUTED,letterSpacing:1,flexShrink:0},
  stepTag:{fontSize:10,color:O,letterSpacing:"3px",marginBottom:6,fontWeight:600},
  q:{fontFamily:"'Bebas Neue',cursive",fontSize:28,letterSpacing:1,marginBottom:4,color:DARK},
  sub2:{fontSize:13,color:MUTED2,marginBottom:20},
  sel:{padding:"13px 14px",background:BG,border:`1px solid ${BORDER}`,color:DARK,fontSize:15,fontFamily:"'DM Sans',sans-serif",width:"100%"},
  opt:{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",background:BG,border:`1px solid ${BORDER}`,color:MUTED2,fontSize:15,cursor:"pointer",textAlign:"left",transition:"all 0.15s"},
  optA:{background:"#F5EDE0",border:`1px solid ${O}`,color:DARK},
  inp:{padding:"12px 13px",background:BG,border:`1px solid ${BORDER}`,color:DARK,fontSize:15,fontFamily:"'DM Sans',sans-serif",width:"100%"},
  subBtn:{padding:"15px",background:O,color:"#fff",border:"none",fontFamily:"'Bebas Neue',cursive",fontSize:18,letterSpacing:2,cursor:"pointer",width:"100%"},
  badge:{width:56,height:56,background:O,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:700,margin:"0 auto 16px",color:"#fff"},
  st:{fontFamily:"'Bebas Neue',cursive",fontSize:30,letterSpacing:2,marginBottom:8,color:DARK},
  ss:{fontSize:15,color:MUTED2,lineHeight:1.6,marginBottom:20},
  sumBox:{background:BG,border:`1px solid ${BORDER}`,padding:"16px",textAlign:"left"},
};

const pc = {
  wrap:{background:DARK,padding:"40px 24px"},
  inner:{maxWidth:900,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",gap:24,flexWrap:"wrap"},
  label:{fontSize:10,letterSpacing:"2px",color:"rgba(255,255,255,0.6)",marginBottom:6},
  h3:{fontFamily:"'Bebas Neue',cursive",fontSize:28,letterSpacing:1,color:"#fff",marginBottom:4},
  sub:{fontSize:14,color:"rgba(255,255,255,0.7)"},
  btn:{padding:"12px 24px",background:"transparent",color:"#fff",border:`2px solid ${O}`,fontFamily:"'Bebas Neue',cursive",fontSize:16,letterSpacing:2,cursor:"pointer",flexShrink:0},
};

const f = {
  wrap:{borderTop:`1px solid ${BORDER}`,padding:"48px 24px 24px",background:CARD},
  inner:{maxWidth:900,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr auto",gap:40,marginBottom:32,flexWrap:"wrap"},
  logo:{fontFamily:"'Bebas Neue',cursive",fontSize:22,letterSpacing:3,marginBottom:8,color:DARK},
  tagline:{fontSize:13,color:MUTED2,maxWidth:280},
  cols:{display:"flex",gap:40},
  colHead:{fontSize:10,color:MUTED,letterSpacing:"2px",marginBottom:10},
  colLink:{fontSize:13,color:MUTED2,marginBottom:6,cursor:"pointer"},
  bottom:{maxWidth:900,margin:"0 auto",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,paddingTop:20,borderTop:`1px solid ${BORDER}`,fontSize:11,color:MUTED},
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #F5F0E8; }
  .ob-btn { transition: background 0.15s, transform 0.15s !important; }
  .ob-btn:hover { background: #A8360A !important; transform: translateY(-1px); }
  .ob-btn-outline:hover { background: rgba(200,68,10,0.15) !important; }
  .ob-btn-outline { transition: background 0.15s !important; }
  .ob-card:hover { border-color: ${O} !important; }
  .cat-card:hover { background: #E8E0D0 !important; transform: translateY(-3px); box-shadow: 0 8px 24px rgba(44,31,20,0.12); }
  .opt-btn { animation: slideUp 0.28s ease both; }
  .opt-btn:hover { border-color: ${O} !important; background: #F5EDE0 !important; color: #2C1F14 !important; }
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
