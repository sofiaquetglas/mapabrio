"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
    { id:"facturacion", label:"¿Cuánto fact
