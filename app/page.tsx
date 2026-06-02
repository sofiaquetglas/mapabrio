"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);
const supabase = typeof window !== "undefined" ? getSupabase() : null as any;

const MODULOS = [
  { id:"vision", emoji:"◎", label:"Visión del negocio", preguntas:[
    { id:"mision", label:"¿Cuál es la misión de tu negocio?", placeholder:"¿Por qué existe? ¿Qué cambio genera?" },
    { id:"vision_5", label:"¿Cómo imaginas tu negocio en 3–5 años?", placeholder:"Facturación, equipo, impacto..." },
    { id:"valores", label:"¿Cuáles son tus valores?", placeholder:"Autenticidad, excelencia, libertad..." },
    { id:"diferencial", label:"¿Por qué tú? ¿Qué te hace diferente?", placeholder:"Tu historia, perspectiva única..." }
  ]},
  { id:"posicionamiento", emoji:"◈", label:"Posicionamiento", preguntas:[
    { id:"descripcion", label:"¿Cómo describes tu negocio hoy?", placeholder:"La frase que usas cuando te preguntan '¿a qué te dedicas?'" },
    { id:"diferenciador", label:"¿Cuál es tu principal diferenciador?", placeholder:"¿Por qué eligen trabajar contigo?" },
    { id:"competidores", label:"¿Quiénes son tus competidores?", placeholder:"URLs o nombres de marca" },
    { id:"percepcion", label:"¿Cómo te percibe tu audiencia?", placeholder:"¿Qué palabras usarían para describirte?" }
  ]},
  { id:"cliente_ideal", emoji:"◉", label:"Cliente ideal", preguntas:[
    { id:"perfil", label:"Describe a tu cliente ideal", placeholder:"Edad, profesión, situación vital..." },
    { id:"dolor", label:"¿Cuál es su dolor principal?", placeholder:"El problema que le quita el sueño..." },
    { id:"deseo", label:"¿Cuál es su deseo principal?", placeholder:"Lo que quiere conseguir contigo..." },
    { id:"objeciones", label:"¿Cuáles son sus objeciones?", placeholder:"Precio, tiempo, desconfianza..." }
  ]},
  { id:"propuesta_valor", emoji:"◇", label:"Propuesta de valor", preguntas:[
    { id:"oferta_actual", label:"¿Qué ofreces actualmente?", placeholder:"Servicios, productos, programas..." },
    { id:"oferta_estrella", label:"¿Cuál es tu oferta más rentable?", placeholder:"Nombre y precio aproximado" },
    { id:"transformacion", label:"¿Qué transformación genera tu oferta?", placeholder:"Antes y después de trabajar contigo..." },
    { id:"precio", label:"¿Cuál es tu ticket medio?", placeholder:"€/$ por cliente" }
  ]},
  { id:"ingresos", emoji:"$", label:"Ingresos", preguntas:[
    { id:"facturacion", label:"¿Cuánto facturas al mes?", placeholder:"Rango aproximado" },
    { id:"fuentes", label:"¿De dónde vienen tus ingresos?", placeholder:"Servicios 1:1, grupo, productos digitales..." },
    { id:"dependencia", label:"¿Hay una fuente que represente más del 70%?", placeholder:"Concentración de riesgo..." },
    { id:"meta", label:"¿Cuál es tu meta mensual?", placeholder:"€/$ que quieres alcanzar" }
  ]},
  { id:"embudo_ventas", emoji:"△", label:"Embudo de ventas", preguntas:[
    { id:"captacion", label:"¿Cómo llegan los clientes a ti?", placeholder:"Redes, referidos, publicidad..." },
    { id:"conversion", label:"¿Cuál es tu proceso de venta?", placeholder:"¿Cómo pasan de conocerte a comprarte?" },
    { id:"tasa", label:"¿Cuántos de cada 10 leads compran?", placeholder:"Estimación aproximada" },
    { id:"fugas", label:"¿Dónde se pierden más leads?", placeholder:"¿En qué punto se enfrían?" }
  ]},
  { id:"marketing", emoji:"◫", label:"Marketing", preguntas:[
    { id:"canales", label:"¿En qué canales tienes presencia?", placeholder:"Instagram, LinkedIn, email..." },
    { id:"contenido", label:"¿Qué contenido genera más respuesta?", placeholder:"¿Qué formatos conectan mejor?" },
    { id:"frecuencia", label:"¿Con qué frecuencia publicas?", placeholder:"Ej: 3 reels + 1 email a la semana" },
    { id:"email", label:"¿Tienes lista de email?", placeholder:"Tamaño y plataforma" }
  ]},
  { id:"autoridad", emoji:"★", label:"Autoridad", preguntas:[
    { id:"testimonios", label:"¿Tienes testimonios?", placeholder:"Número, formato, dónde están" },
    { id:"casos", label:"¿Tienes casos de éxito?", placeholder:"Resultados concretos en clientes" },
    { id:"medios", label:"¿Has aparecido en medios o eventos?", placeholder:"Menciones, ponencias..." },
    { id:"comunidad", label:"¿Tienes comunidad activa?", placeholder:"Telegram, grupos, membresía..." }
  ]},
  { id:"operacion", emoji:"⊞", label:"Operación", preguntas:[
    { id:"equipo", label:"¿Con quién operas el negocio?", placeholder:"Solo/a, equipo, freelances..." },
    { id:"herramientas", label:"¿Qué herramientas usas?", placeholder:"CRM, facturación, email marketing..." },
    { id:"dependencia_f", label:"¿Qué parte solo funciona contigo?", placeholder:"Entrega, ventas, contenido..." },
    { id:"procesos", label:"¿Tienes procesos documentados?", placeholder:"¿Hay SOPs o checklists?" }
  ]},
  { id:"escalabilidad", emoji:"↑", label:"Escalabilidad", preguntas:[
    { id:"techo", label:"¿Cuál es el techo de tu modelo?", placeholder:"¿Qué te impide ganar más sin trabajar más?" },
    { id:"pasivo", label:"¿Tienes ingresos recurrentes?", placeholder:"Membresías, licencias, productos digitales..." },
    { id:"automatizaciones", label:"¿Qué automatizaciones tienes?", placeholder:"Embudos, emails, WhatsApp..." },
    { id:"vision_escala", label:"¿Cómo imaginas escalar?", placeholder:"Más clientes, precios más altos, equipo..." }
  ]}
];

type Pantalla = "login"|"onboarding"|"diagnostico"|"entregable";

export default function App() {
  const [pantalla, setPantalla] = useState<Pantalla>("login");
  const [proyectoId, setProyectoId] = useState("");
  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [userId, setUserId] = useState("");
  const [proyectoData, setProyectoData] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUserId(data.session.user.id);
        setPantalla("onboarding");
      }
    });
  }, []);

  if (pantalla === "onboarding") return (
    <Onboarding userId={userId} onDone={(id, nombre, data) => {
      setProyectoId(id);
      setNombreEmpresa(nombre);
      setProyectoData(data);
      setPantalla("diagnostico");
    }} />
  );

  if (pantalla === "diagnostico") return (
    <Diagnostico
      proyectoId={proyectoId}
      nombreEmpresa={nombreEmpresa}
      proyectoData={proyectoData}
      onDone={() => setPantalla("entregable")}
    />
  );

  if (pantalla === "entregable") return (
    <Entregable proyectoId={proyectoId} nombreEmpresa={nombreEmpresa} proyectoData={proyectoData} />
  );

  return <Login onLogin={(uid) => { setUserId(uid); setPantalla("onboarding"); }} />;
}

function Login({ onLogin }: { onLogin: (uid: string) => void }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [modo, setModo] = useState<"login"|"registro">("login");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setMsg("");
    try {
      if (modo === "registro") {
        const { error } = await supabase.auth.signUp({ email, password: pass });
        if (error) throw error;
        setMsg("Revisa tu correo para confirmar la cuenta.");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) throw error;
        onLogin(data.user.id);
      }
    } catch (e: any) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:"#1A1410", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"#FAF7F2", borderRadius:16, padding:"48px 40px", width:420 }}>
        <h1 style={{ fontFamily:"Georgia,serif", fontSize:28, fontWeight:300, marginBottom:8, color:"#1A1410" }}>
          Mapa de Crecimiento<br /><em style={{ color:"#B8935A" }}>con BRÍO</em>
        </h1>
        <p style={{ fontSize:13, color:"#9E9088", marginBottom:32 }}>
          {modo === "login" ? "Accede a tu diagnóstico" : "Crea tu cuenta gratis"}
        </p>
        {msg && (
          <div style={{ padding:"10px 14px", borderRadius:8, marginBottom:16, fontSize:13,
            background: msg.includes("correo") ? "#D1FAE5" : "#FEE2E2",
            color: msg.includes("correo") ? "#065F46" : "#991B1B"
          }}>{msg}</div>
        )}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <input type="email" placeholder="tu@email.com" value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ padding:"12px 14px", borderRadius:8, border:"1px solid #DDD5C8", background:"#F0EBE1", fontSize:14, outline:"none" }} />
          <input type="password" placeholder="Contraseña" value={pass}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            style={{ padding:"12px 14px", borderRadius:8, border:"1px solid #DDD5C8", background:"#F0EBE1", fontSize:14, outline:"none" }} />
          <button onClick={handleSubmit} disabled={loading || !email || !pass}
            style={{ padding:"14px", borderRadius:8, border:"none", background:"#1A1410", color:"#FAF7F2", fontSize:14, cursor:"pointer", fontWeight:500 }}>
            {loading ? "Cargando..." : modo === "login" ? "Entrar" : "Crear cuenta"}
          </button>
          <button onClick={() => { setModo(modo === "login" ? "registro" : "login"); setMsg(""); }}
            style={{ padding:"12px", borderRadius:8, border:"1px solid #B8935A", background:"transparent", color:"#B8935A", fontSize:13, cursor:"pointer" }}>
            {modo === "login" ? "¿Primera vez? Crear cuenta →" : "¿Ya tienes cuenta? Entrar →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Onboarding({ userId, onDone }: { userId: string, onDone: (id: string, nombre: string, data: any) => void }) {
  const [paso, setPaso] = useState(0);
  const [datos, setDatos] = useState({
    nombre_empresa:"", sector:"", tipo_negocio:"",
    web:"", instagram:"", linkedin:"",
    pais:"", etapa:"", objetivo_principal:""
  });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const set = (k: string, v: string) => setDatos(p => ({ ...p, [k]: v }));

  const guardar = async () => {
    setGuardando(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from("proyectos")
        .insert({
          user_id: userId,
          nombre_empresa: datos.nombre_empresa,
          sector: datos.sector,
          tipo_negocio: datos.tipo_negocio,
          web: datos.web,
          pais: datos.pais,
          etapa: datos.etapa || "crecimiento",
          objetivo_principal: datos.objetivo_principal || "posicionamiento",
          redes_sociales: { instagram: datos.instagram, linkedin: datos.linkedin }
        })
        .select()
        .single();
      if (error) { setError(error.message); return; }
      onDone(data.id, datos.nombre_empresa, data);
    } catch(e: any) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  };

  const inp = (label: string, key: string, placeholder: string) => (
    <div key={key}>
      <label style={{ fontSize:11, letterSpacing:"0.1em", color:"#9E9088", display:"block", marginBottom:6 }}>{label.toUpperCase()}</label>
      <input value={(datos as any)[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder}
        style={{ width:"100%", padding:"12px 14px", borderRadius:8, border:"1px solid #DDD5C8", background:"#F0EBE1", fontSize:14, outline:"none" }} />
    </div>
  );

  const btn = (label: string, key: string, val: string) => (
    <button key={val} onClick={() => set(key, val)}
      style={{ padding:"12px 16px", borderRadius:8, border:`1px solid ${(datos as any)[key]===val?"#1A1410":"#DDD5C8"}`,
        background:(datos as any)[key]===val?"#1A1410":"#F0EBE1",
        color:(datos as any)[key]===val?"#FAF7F2":"#1A1410", fontSize:13, cursor:"pointer" }}>
      {label}
    </button>
  );

  const pasos = [
    <div key={0} style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <h2 style={{ fontFamily:"Georgia,serif", fontSize:24, fontWeight:300 }}>Tu negocio</h2>
      {inp("Nombre del negocio *","nombre_empresa","Ej: Studio Lumina...")}
      <div>
        <label style={{ fontSize:11, letterSpacing:"0.1em", color:"#9E9088", display:"block", marginBottom:8 }}>SECTOR</label>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {["Consultoría","Educación","E-commerce","Salud / Bienestar","Tecnología","Moda / Lifestyle"].map(s=>btn(s,"sector",s))}
        </div>
      </div>
      {inp("¿Qué tipo de negocio es?","tipo_negocio","Ej: Consultoría de marca...")}
    </div>,
    <div key={1} style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <h2 style={{ fontFamily:"Georgia,serif", fontSize:24, fontWeight:300 }}>Presencia digital</h2>
      {inp("Sitio web","web","https://tunegocio.com")}
      {inp("Instagram","instagram","@usuario")}
      {inp("LinkedIn","linkedin","linkedin.com/in/usuario")}
    </div>,
    <div key={2} style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <h2 style={{ fontFamily:"Georgia,serif", fontSize:24, fontWeight:300 }}>Contexto estratégico</h2>
      {inp("País / Mercado","pais","España, México...")}
      <div>
        <label style={{ fontSize:11, letterSpacing:"0.1em", color:"#9E9088", display:"block", marginBottom:8 }}>ETAPA</label>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {[["idea","Idea"],["lanzamiento","Lanzamiento"],["crecimiento","Crecimiento"],["escalando","Escalando"]].map(([v,l])=>btn(l,"etapa",v))}
        </div>
      </div>
      <div>
        <label style={{ fontSize:11, letterSpacing:"0.1em", color:"#9E9088", display:"block", marginBottom:8 }}>OBJETIVO PRINCIPAL</label>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {[["posicionamiento","Posicionamiento"],["ventas","Aumentar ventas"],["captacion","Captación"],["expansion","Expansión"],["automatizacion","Automatización"]].map(([v,l])=>btn(l,"objetivo_principal",v))}
        </div>
      </div>
    </div>
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#1A1410", display:"flex" }}>
      <div style={{ width:240, padding:"48px 32px", display:"flex", flexDirection:"column", gap:24 }}>
        <div style={{ fontFamily:"Georgia,serif", color:"#D4AE7A", fontSize:20 }}>BRÍO</div>
        {["Tu negocio","Presencia digital","Contexto estratégico"].map((s,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:12, opacity:i<=paso?1:0.4 }}>
            <div style={{ width:26, height:26, borderRadius:"50%", border:`1px solid ${i<paso?"#B8935A":i===paso?"#D4AE7A":"#3D2B1F"}`,
              background:i<paso?"#B8935A":"transparent", display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:11, color:i<paso?"#1A1410":"#D4AE7A", flexShrink:0 }}>
              {i<paso?"✓":i+1}
            </div>
            <span style={{ color:i===paso?"#FAF7F2":"#9E9088", fontSize:13 }}>{s}</span>
          </div>
        ))}
      </div>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:48 }}>
        <div style={{ background:"#FAF7F2", borderRadius:16, padding:"48px 40px", width:"100%", maxWidth:520 }}>
          <div style={{ fontSize:11, color:"#9E9088", marginBottom:16, letterSpacing:"0.1em" }}>PASO {paso+1} DE 3</div>
          <div style={{ height:3, background:"#DDD5C8", borderRadius:2, marginBottom:32 }}>
            <div style={{ height:"100%", width:`${((paso+1)/3)*100}%`, background:"#B8935A", borderRadius:2, transition:"width 0.4s" }} />
          </div>
          {pasos[paso]}
          {error && <div style={{ marginTop:16, padding:"10px 14px", borderRadius:8, background:"#FEE2E2", color:"#991B1B", fontSize:13 }}>{error}</div>}
          <div style={{ display:"flex", gap:12, marginTop:32 }}>
            {paso>0 && <button onClick={()=>setPaso(p=>p-1)} style={{ padding:"12px 24px", borderRadius:8, border:"1px solid #DDD5C8", background:"transparent", color:"#9E9088", fontSize:14, cursor:"pointer" }}>← Atrás</button>}
            <button onClick={()=>paso<2?setPaso(p=>p+1):guardar()} disabled={paso===0&&!datos.nombre_empresa||guardando}
              style={{ flex:1, padding:"14px", borderRadius:8, border:"none", background:"#1A1410", color:"#FAF7F2", fontSize:14, cursor:"pointer", fontWeight:500 }}>
              {guardando?"Guardando...":paso<2?"Continuar →":"Crear proyecto →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Diagnostico({ proyectoId, nombreEmpresa, proyectoData, onDone }: { proyectoId:string, nombreEmpresa:string, proyectoData:any, onDone:()=>void }) {
  const [moduloActivo, setModuloActivo] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<string,Record<string,string>>>({});
  const [sinDatos, setSinDatos] = useState<Record<string,boolean>>({});
  const [guardando, setGuardando] = useState(false);
  const [generando, setGenerando] = useState(false);

  const modulo = MODULOS[moduloActivo];

  const setResp = (moduloId:string, pregId:string, val:string) => {
    setRespuestas(p=>({...p,[moduloId]:{...(p[moduloId]||{}),[pregId]:val}}));
  };

  const getEstado = (moduloId:string) => {
    if (sinDatos[moduloId]) return "sin_datos";
    const r = respuestas[moduloId]||{};
    const filled = Object.values(r).filter((v:any)=>v?.trim()).length;
    if (filled===0) return "pendiente";
    if (filled<2) return "parcial";
    return "completo";
  };

  const estadoColor:Record<string,string> = { completo:"#7A8C7E", parcial:"#B8935A", pendiente:"#DDD5C8", sin_datos:"#9E9088" };
  const estadoLabel:Record<string,string> = { completo:"✓", parcial:"~", pendiente:"·", sin_datos:"—" };

  const guardarModulo = async () => {
    setGuardando(true);
    const r = respuestas[modulo.id]||{};
    const filled = Object.values(r).filter((v:any)=>v?.trim()).length;
    await supabase.from("modulos_respuestas").upsert({
      proyecto_id: proyectoId,
      modulo: modulo.id,
      respuestas: r,
      sin_datos: sinDatos[modulo.id]||false,
      estado: sinDatos[modulo.id]?"sin_datos":filled>=3?"completo":filled>0?"parcial":"pendiente",
      score: sinDatos[modulo.id]?0:Math.round((filled/modulo.preguntas.length)*10)
    }, { onConflict:"proyecto_id,modulo" });
    setGuardando(false);
    if (moduloActivo<MODULOS.length-1) setModuloActivo(m=>m+1);
  };

  const generarDiagnostico = async () => {
    setGenerando(true);
    try {
      const modulosData: Record<string,any> = {};
      MODULOS.forEach(m => {
        modulosData[m.id] = {
          respuestas: respuestas[m.id]||{},
          sin_datos: sinDatos[m.id]||false
        };
      });
      const res = await fetch("/api/generar", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ proyecto: proyectoData, modulos: modulosData })
      });
      const data = await res.json();
      if (data.diagnostico) {
        localStorage.setItem("diagnostico_brio", JSON.stringify(data.diagnostico));
      }
    } catch(e) {
      console.error(e);
    }
    setGenerando(false);
    onDone();
  };

  const completados = MODULOS.filter(m=>["completo","parcial","sin_datos"].includes(getEstado(m.id))).length;

  if (generando) return (
    <div style={{ minHeight:"100vh", background:"#1A1410", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:24 }}>
      <div style={{ width:60, height:60, border:"3px solid #3D2B1F", borderTopColor:"#B8935A", borderRadius:"50%", animation:"spin 1s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{ fontFamily:"Georgia,serif", fontSize:28, color:"#FAF7F2", fontWeight:300 }}>Generando tu diagnóstico...</p>
      <p style={{ color:"#9E9088", fontSize:14 }}>Claude está analizando tu negocio</p>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#1A1410", display:"flex" }}>
      <div style={{ width:260, background:"#1A1410", padding:"32px 0", display:"flex", flexDirection:"column", borderRight:"1px solid #3D2B1F", flexShrink:0 }}>
        <div style={{ padding:"0 24px 24px" }}>
          <div style={{ fontFamily:"Georgia,serif", color:"#D4AE7A", fontSize:16, marginBottom:4 }}>{nombreEmpresa}</div>
          <div style={{ fontSize:11, color:"#9E9088", marginBottom:12 }}>{completados}/{MODULOS.length} módulos</div>
          <div style={{ height:3, background:"#3D2B1F", borderRadius:2 }}>
            <div style={{ height:"100%", width:`${(completados/MODULOS.length)*100}%`, background:"#B8935A", borderRadius:2, transition:"width 0.4s" }} />
          </div>
        </div>
        <div style={{ flex:1, overflowY:"auto" }}>
          {MODULOS.map((m,i)=>{
            const est=getEstado(m.id);
            return (
              <button key={m.id} onClick={()=>setModuloActivo(i)}
                style={{ width:"100%", padding:"12px 24px", textAlign:"left", background:moduloActivo===i?"#B8935A18":"transparent",
                  border:"none", borderLeft:`3px solid ${moduloActivo===i?"#B8935A":"transparent"}`,
                  cursor:"pointer", display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ color:"#9E9088", fontSize:13, width:20 }}>{m.emoji}</span>
                <span style={{ color:moduloActivo===i?"#FAF7F2":"#9E9088", fontSize:13, flex:1 }}>{m.label}</span>
                <span style={{ color:estadoColor[est], fontSize:14, fontWeight:600 }}>{estadoLabel[est]}</span>
              </button>
            );
          })}
        </div>
        <div style={{ padding:"20px 24px" }}>
          <button onClick={generarDiagnostico}
            style={{ width:"100%", padding:"13px", background:"#B8935A", border:"none", borderRadius:8, color:"#1A1410", fontSize:13, fontWeight:600, cursor:"pointer" }}>
            ✦ Generar diagnóstico
          </button>
        </div>
      </div>
      <div style={{ flex:1, padding:"48px 64px", overflowY:"auto" }}>
        <div style={{ marginBottom:8, display:"flex", gap:10, alignItems:"center" }}>
          <span style={{ fontSize:20 }}>{modulo.emoji}</span>
          <span style={{ fontSize:11, color:"#9E9088", letterSpacing:"0.1em" }}>MÓDULO {moduloActivo+1} DE {MODULOS.length}</span>
        </div>
        <h1 style={{ fontFamily:"Georgia,serif", fontSize:42, fontWeight:300, marginBottom:32, color:"#FAF7F2" }}>{modulo.label}</h1>
        <div onClick={()=>setSinDatos(p=>({...p,[modulo.id]:!p[modulo.id]}))}
          style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"10px 16px", borderRadius:8, cursor:"pointer", marginBottom:32,
            background:sinDatos[modulo.id]?"#3D2B1F":"#2A2016", border:`1px solid ${sinDatos[modulo.id]?"#B8935A":"#3D2B1F"}` }}>
          <div style={{ width:18, height:18, borderRadius:4, background:sinDatos[modulo.id]?"#B8935A":"transparent",
            border:`2px solid ${sinDatos[modulo.id]?"#B8935A":"#9E9088"}`, display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:11, color:"#1A1410" }}>{sinDatos[modulo.id]?"✓":""}</div>
          <span style={{ fontSize:13, color:sinDatos[modulo.id]?"#D4AE7A":"#9E9088" }}>No tengo esta información todavía</span>
        </div>
        {!sinDatos[modulo.id]?(
          <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
            {modulo.preguntas.map(p=>(
              <div key={p.id}>
                <label style={{ fontSize:13, color:"#FAF7F2", display:"block", marginBottom:10, fontWeight:500 }}>{p.label}</label>
                <textarea value={respuestas[modulo.id]?.[p.id]||""} onChange={e=>setResp(modulo.id,p.id,e.target.value)}
                  placeholder={p.placeholder} rows={3}
                  style={{ width:"100%", padding:"12px 14px", borderRadius:8, border:"1px solid #3D2B1F",
                    background:"#2A2016", color:"#FAF7F2", fontSize:13, resize:"vertical", outline:"none", lineHeight:1.6, fontFamily:"inherit" }} />
              </div>
            ))}
          </div>
        ):(
          <div style={{ padding:32, background:"#2A2016", borderRadius:12, border:"1px dashed #3D2B1F", textAlign:"center" }}>
            <p style={{ fontFamily:"Georgia,serif", fontSize:20, color:"#B8935A", marginBottom:8 }}>Módulo pendiente</p>
            <p style={{ color:"#9E9088", fontSize:13, lineHeight:1.6 }}>El diagnóstico marcará esta área como "No desarrollada".</p>
          </div>
        )}
        <div style={{ display:"flex", gap:12, marginTop:40, paddingTop:32, borderTop:"1px solid #3D2B1F" }}>
          {moduloActivo>0 && <button onClick={()=>setModuloActivo(m=>m-1)} style={{ padding:"12px 24px", background:"transparent", border:"1px solid #3D2B1F", borderRadius:8, color:"#9E9088", fontSize:14, cursor:"pointer" }}>← Anterior</button>}
          <button onClick={guardarModulo} disabled={guardando}
            style={{ flex:1, padding:"14px", background:"#FAF7F2", border:"none", borderRadius:8, color:"#1A1410", fontSize:14, cursor:"pointer", fontWeight:500 }}>
            {guardando?"Guardando...":moduloActivo<MODULOS.length-1?"Guardar y continuar →":"Guardar módulo →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Entregable({ proyectoId, nombreEmpresa, proyectoData }: { proyectoId:string, nombreEmpresa:string, proyectoData:any }) {
  const [diagnostico, setDiagnostico] = useState<any>(null);
  const [seccion, setSeccion] = useState("resumen");

  useEffect(() => {
    const saved = localStorage.getItem("diagnostico_brio");
    if (saved) setDiagnostico(JSON.parse(saved));
  }, []);

  const scoreColor = (s:number) => s>=7?"#7A8C7E":s>=5?"#B8935A":"#C0623A";

  const scoreLabels: Record<string,string> = {
    vision:"Visión", posicionamiento:"Posicionamiento", cliente:"Cliente",
    oferta:"Oferta", marketing:"Marketing", ventas:"Ventas",
    ingresos:"Ingresos", operacion:"Operación", escalabilidad:"Escalabilidad"
  };

  if (!diagnostico) return (
    <div style={{ minHeight:"100vh", background:"#1A1410", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
      <div style={{ fontFamily:"Georgia,serif", fontSize:48, color:"#D4AE7A" }}>✦</div>
      <h1 style={{ fontFamily:"Georgia,serif", fontSize:32, color:"#FAF7F2", fontWeight:300 }}>Diagnóstico de <em style={{ color:"#D4AE7A" }}>{nombreEmpresa}</em></h1>
      <p style={{ color:"#9E9088", fontSize:14 }}>Cargando diagnóstico...</p>
    </div>
  );

  const secciones = ["resumen","scores","roadmap","ingresos"];

  return (
    <div style={{ minHeight:"100vh", background:"#1A1410", display:"flex" }}>
      <div style={{ width:240, padding:"32px 0", borderRight:"1px solid #3D2B1F", display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"0 24px 24px" }}>
          <div style={{ fontFamily:"Georgia,serif", color:"#D4AE7A", fontSize:16, marginBottom:4 }}>{nombreEmpresa}</div>
          <div style={{ display:"inline-flex", padding:"3px 10px", borderRadius:20, background:"#B8935A22", color:"#D4AE7A", fontSize:11, marginTop:4 }}>
            {diagnostico.nivel_madurez}
          </div>
        </div>
        {[["resumen","Resumen ejecutivo"],["scores","Scores"],["roadmap","Roadmap 90 días"],["ingresos","Plan de ingresos"]].map(([id,label])=>(
          <button key={id} onClick={()=>setSeccion(id)}
            style={{ width:"100%", padding:"12px 24px", textAlign:"left", background:seccion===id?"#B8935A18":"transparent",
              border:"none", borderLeft:`3px solid ${seccion===id?"#B8935A":"transparent"}`,
              cursor:"pointer", color:seccion===id?"#FAF7F2":"#9E9088", fontSize:13 }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ flex:1, padding:"48px 64px", overflowY:"auto" }}>
        {seccion==="resumen" && (
          <div>
            <h1 style={{ fontFamily:"Georgia,serif", fontSize:40, fontWeight:300, color:"#FAF7F2", marginBottom:40 }}>Resumen ejecutivo</h1>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:32 }}>
              {[
                ["Situación actual", diagnostico.resumen?.situacion_actual],
                ["Oportunidad principal", diagnostico.resumen?.oportunidad_principal],
                ["Prioridad inmediata", diagnostico.resumen?.prioridad_inmediata],
                ["Nivel de madurez", diagnostico.nivel_madurez]
              ].map(([label,valor])=>(
                <div key={label as string} style={{ padding:24, background:"#2A2016", borderRadius:12, border:"1px solid #3D2B1F" }}>
                  <div style={{ fontSize:10, letterSpacing:"0.1em", color:"#9E9088", marginBottom:10 }}>{(label as string).toUpperCase()}</div>
                  <p style={{ fontFamily:"Georgia,serif", fontSize:16, color:"#FAF7F2", lineHeight:1.6, fontStyle:"italic" }}>{valor as string}</p>
                </div>
              ))}
            </div>
            <div style={{ padding:32, background:"#2A2016", borderRadius:12, border:"1px solid #B8935A33" }}>
              <div style={{ fontSize:10, letterSpacing:"0.2em", color:"#B8935A", marginBottom:16 }}>✦ MENSAJE ESTRATÉGICO</div>
              <p style={{ fontFamily:"Georgia,serif", fontSize:24, color:"#FAF7F2", fontStyle:"italic", fontWeight:300, lineHeight:1.5 }}>
                "{diagnostico.resumen?.mensaje_estrategico}"
              </p>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginTop:24 }}>
              {[["Fortalezas","#7A8C7E",diagnostico.fortalezas],["Debilidades","#C0623A",diagnostico.debilidades],["Oportunidades","#B8935A",diagnostico.oportunidades]].map(([label,color,items])=>(
                <div key={label as string} style={{ padding:20, background:"#2A2016", borderRadius:12, border:`1px solid ${color as string}33` }}>
                  <div style={{ fontSize:11, color:color as string, marginBottom:12, letterSpacing:"0.05em" }}>{label as string}</div>
                  {(items as string[])?.map((item,i)=>(
                    <div key={i} style={{ fontSize:13, color:"#FAF7F2", marginBottom:8, display:"flex", gap:8, lineHeight:1.5 }}>
                      <span style={{ color:color as string, flexShrink:0 }}>·</span>{item}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {seccion==="scores" && (
          <div>
            <h1 style={{ fontFamily:"Georgia,serif", fontSize:40, fontWeight:300, color:"#FAF7F2", marginBottom:40 }}>Score de negocio</h1>
            <div style={{ display:"flex", gap:32, marginBottom:48, alignItems:"flex-start" }}>
              <div style={{ width:140, height:140, borderRadius:"50%", border:"3px solid #B8935A", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"#2A2016", flexShrink:0 }}>
                <div style={{ fontFamily:"Georgia,serif", fontSize:48, color:"#B8935A", lineHeight:1 }}>
                  {diagnostico.scores ? Math.round(Object.values(diagnostico.scores as Record<string,number>).reduce((a:number,b:number)=>a+b,0)/Object.keys(diagnostico.scores).length*10)/10 : "—"}
                </div>
                <div style={{ fontSize:10, color:"#9E9088" }}>SCORE GLOBAL</div>
              </div>
              <div style={{ flex:1, display:"flex", flexDirection:"column", gap:10 }}>
                {Object.entries(diagnostico.scores||{}).map(([key,score])=>(
                  <div key={key} style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:120, fontSize:13, color:"#FAF7F2" }}>{scoreLabels[key]||key}</div>
                    <div style={{ flex:1, height:6, background:"#3D2B1F", borderRadius:3, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${(score as number)*10}%`, background:scoreColor(score as number), borderRadius:3, transition:"width 1s" }} />
                    </div>
                    <div style={{ width:32, fontSize:14, fontWeight:600, color:scoreColor(score as number), textAlign:"right" }}>{score as number}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {seccion==="roadmap" && (
          <div>
            <h1 style={{ fontFamily:"Georgia,serif", fontSize:40, fontWeight:300, color:"#FAF7F2", marginBottom:40 }}>Roadmap 90 días</h1>
            {diagnostico.roadmap?.map((fase:any, fi:number)=>{
              const colors = ["#B8935A","#8B5E3C","#7A8C7E"];
              return (
                <div key={fi} style={{ marginBottom:32 }}>
                  <div style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"6px 16px", borderRadius:20, border:`1px solid ${colors[fi]}`, background:`${colors[fi]}15`, marginBottom:16 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:colors[fi] }} />
                    <span style={{ fontFamily:"Georgia,serif", fontSize:18, color:colors[fi] }}>{fase.fase}</span>
                  </div>
                  {fase.acciones?.map((item:any, i:number)=>(
                    <div key={i} style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:16, padding:"16px 20px", background:"#2A2016", borderRadius:10, border:"1px solid #3D2B1F", marginBottom:10 }}>
                      <div>
                        <div style={{ fontSize:10, color:"#9E9088", marginBottom:6 }}>ACCIÓN</div>
                        <div style={{ fontSize:13, color:"#FAF7F2", fontWeight:500 }}>{item.accion}</div>
                      </div>
                      <div>
                        <div style={{ fontSize:10, color:"#9E9088", marginBottom:6 }}>KPI</div>
                        <div style={{ fontSize:12, color:"#FAF7F2" }}>{item.kpi}</div>
                      </div>
                      <div>
                        <div style={{ fontSize:10, color:"#9E9088", marginBottom:6 }}>RESULTADO</div>
                        <div style={{ fontSize:12, color:colors[fi], fontWeight:500 }}>{item.resultado}</div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {seccion==="ingresos" && (
          <div>
            <h1 style={{ fontFamily:"Georgia,serif", fontSize:40, fontWeight:300, color:"#FAF7F2", marginBottom:40 }}>Plan de ingresos</h1>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:20 }}>
              {[
                ["Conservador","#9E9088",diagnostico.plan_ingresos?.conservador],
                ["Realista","#B8935A",diagnostico.plan_ingresos?.realista],
                ["Ambicioso","#7A8C7E",diagnostico.plan_ingresos?.ambicioso]
              ].map(([label,color,data]:any[])=>(
                <div key={label} style={{ padding:24, background:"#2A2016", borderRadius:12, border:`1px solid ${color}33`, position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:color }} />
                  <div style={{ fontSize:10, letterSpacing:"0.1em", color, marginBottom:12, marginTop:4 }}>{label?.toUpperCase()}</div>
                  <div style={{ fontFamily:"Georgia,serif", fontSize:40, color:"#FAF7F2", lineHeight:1, marginBottom:4 }}>{data?.meta?.toLocaleString("es-ES")}€</div>
                  <div style={{ fontSize:11, color:"#9E9088", marginBottom:20 }}>/mes</div>
                  {[["Clientes",data?.clientes],["Ticket",`${data?.ticket}€`],["Oferta",data?.oferta]].map(([k,v])=>(
                    <div key={k as string} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #3D2B1F", fontSize:12 }}>
                      <span style={{ color:"#9E9088" }}>{k as string}</span>
                      <span style={{ color:"#FAF7F2", fontWeight:500 }}>{v as string}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
