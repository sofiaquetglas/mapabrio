import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { proyecto, modulos } = body;

    const prompt = `Eres un consultor estratégico experto. Analiza este negocio y genera un diagnóstico completo en JSON.

NEGOCIO:
- Nombre: ${proyecto.nombre_empresa}
- Sector: ${proyecto.sector}
- Tipo: ${proyecto.tipo_negocio}
- País: ${proyecto.pais}
- Etapa: ${proyecto.etapa}
- Objetivo: ${proyecto.objetivo_principal}

RESPUESTAS DEL DIAGNÓSTICO:
${Object.entries(modulos).map(([mod, data]: [string, any]) => `
MÓDULO ${mod}:
${data.sin_datos ? "Sin datos" : Object.entries(data.respuestas || {}).map(([k, v]) => `${k}: ${v}`).join("\n")}
`).join("\n")}

Genera un JSON con exactamente esta estructura, sin texto adicional:
{
  "nivel_madurez": "En construcción|En crecimiento|Escalable",
  "resumen": {
    "situacion_actual": "2-3 frases sobre el estado real del negocio",
    "oportunidad_principal": "La oportunidad más importante detectada",
    "prioridad_inmediata": "Qué hacer primero y por qué",
    "mensaje_estrategico": "Frase de posicionamiento recomendada específica y diferenciadora"
  },
  "scores": {
    "vision": 0,
    "posicionamiento": 0,
    "cliente": 0,
    "oferta": 0,
    "marketing": 0,
    "ventas": 0,
    "ingresos": 0,
    "operacion": 0,
    "escalabilidad": 0
  },
  "fortalezas": ["fortaleza 1", "fortaleza 2", "fortaleza 3"],
  "debilidades": ["debilidad 1", "debilidad 2", "debilidad 3"],
  "oportunidades": ["oportunidad 1", "oportunidad 2", "oportunidad 3"],
  "roadmap": [
    {
      "fase": "Primeros 30 días",
      "acciones": [
        {"accion": "acción concreta", "kpi": "métrica", "resultado": "resultado esperado"}
      ]
    },
    {
      "fase": "Días 31-60",
      "acciones": [
        {"accion": "acción concreta", "kpi": "métrica", "resultado": "resultado esperado"}
      ]
    },
    {
      "fase": "Días 61-90",
      "acciones": [
        {"accion": "acción concreta", "kpi": "métrica", "resultado": "resultado esperado"}
      ]
    }
  ],
  "plan_ingresos": {
    "actual": 0,
    "conservador": {"meta": 0, "clientes": 0, "ticket": 0, "oferta": "descripción"},
    "realista": {"meta": 0, "clientes": 0, "ticket": 0, "oferta": "descripción"},
    "ambicioso": {"meta": 0, "clientes": 0, "ticket": 0, "oferta": "descripción"}
  }
}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    const text = data.content[0].text;
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    
    const diagnostico = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ diagnostico });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
