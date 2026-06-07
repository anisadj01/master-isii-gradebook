import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

interface ModuleInfo {
  id: string;
  name: string;
  unit?: string;
  hasTd: boolean;
  hasTp: boolean;
  hasExam: boolean;
}

interface InputImage {
  kind: 'cc' | 'exam';
  data: string; // data URL
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const modules: ModuleInfo[] = body.modules || [];

    // Accept either new `images: [{kind,data}]` or legacy `image: dataUrl`.
    let images: InputImage[] = Array.isArray(body.images) ? body.images : [];
    if (images.length === 0 && typeof body.image === 'string') {
      images = [{ kind: 'cc', data: body.image }];
    }

    if (images.length === 0 || !Array.isArray(modules)) {
      return new Response(JSON.stringify({ error: 'images and modules are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const moduleList = modules
      .map((m) => {
        const fields: string[] = [];
        if (m.hasTd) fields.push('td');
        if (m.hasTp) fields.push('tp');
        if (m.hasExam) fields.push('exam');
        return `- id="${m.id}" | UE=${m.unit ?? '?'} | nom="${m.name}" | champs autorisés: ${fields.join(', ') || '(aucun)'}`;
      })
      .join('\n');

    const imageLabels = images.map((i) => i.kind).join(' + ');

    const systemPrompt = `Tu es un assistant qui extrait des notes universitaires depuis une ou plusieurs captures d'écran (FR ou AR) de l'application universitaire (Univ Alger 1, Master ISII).

Modules de ce semestre (avec leur UE pour désambiguïser les doublons de nom) :
${moduleList}

Tu vas recevoir ${images.length} image(s), étiquetées dans l'ordre : ${imageLabels}.
- Image étiquetée "cc" = page "التقييم المستمر" → les notes sont des TD ou TP selon l'étiquette "TD"/"TP" visible à côté de chaque module.
- Image étiquetée "exam" = page "علامات الامتحانات" → toutes les notes vont dans le champ exam.

Vocabulaire arabe :
- "التقييم المستمر" = contrôle continu ; "علامات الامتحانات" = examens.
- "السداسي 1" / "السداسي 2" = Semestre 1 / 2.
- "دورة عادية" = session normale (utiliser). "دورة إستدراكية" = rattrapage (IGNORER).
- "لا توجد" = pas de note → laisser vide.
- "المقياس" = module, "العلامة" = note, "المعامل" = coefficient.

Règles STRICTES :
- Ignore complètement l'onglet "دورة إستدراكية".
- Si la note est verrouillée sans valeur, marquée "لا توجد", absente ou illisible → OMETS le champ (ne devine JAMAIS, ne mets pas 0).
- Sur la page CC, regarde TOUJOURS l'étiquette "TD" ou "TP" à côté de la note pour décider du champ. N'invente pas un champ td si l'étiquette dit TP, et inversement.
- Sur la page Examen, la note va toujours dans exam.
- Pour chaque module, ne remplis QUE les champs autorisés listés ci-dessus. Si un module n'a pas de td/tp/exam autorisé, n'écris pas ce champ.
- Désambiguïse les noms en double (ex: "Cryptographie") en utilisant le contexte (UE, ordre dans la page). Si tu n'es pas sûr du module exact, OMETS-LE.
- Notes = nombres 0–20. Accepte "12.5", "12,5", "١٢٫٥". Convertis les chiffres arabes en chiffres latins.

Réponds en appelant l'outil fill_grades avec uniquement les modules et champs sûrs.`;

    const userContent: any[] = [{ type: 'text', text: `Voici ${images.length} image(s) dans l'ordre : ${imageLabels}. Extrais les notes.` }];
    for (const img of images) {
      userContent.push({ type: 'text', text: `--- Image (${img.kind}) ---` });
      userContent.push({ type: 'image_url', image_url: { url: img.data } });
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'fill_grades',
              description: "Remplit les notes extraites depuis les images.",
              parameters: {
                type: 'object',
                properties: {
                  grades: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        moduleId: { type: 'string', description: 'id exact du module' },
                        td: { type: 'number', minimum: 0, maximum: 20 },
                        tp: { type: 'number', minimum: 0, maximum: 20 },
                        exam: { type: 'number', minimum: 0, maximum: 20 },
                      },
                      required: ['moduleId'],
                      additionalProperties: false,
                    },
                  },
                },
                required: ['grades'],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: 'function', function: { name: 'fill_grades' } },
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: 'Limite atteinte. Réessayez dans un moment.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: 'Crédits IA épuisés.' }), {
        status: 402,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!response.ok) {
      const text = await response.text();
      return new Response(JSON.stringify({ error: 'AI gateway error', detail: text }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];
    const args = toolCall?.function?.arguments ? JSON.parse(toolCall.function.arguments) : { grades: [] };

    const modMap = new Map(modules.map((m) => [m.id, m]));
    const cleaned = (args.grades || [])
      .map((g: any) => {
        const m = modMap.get(g.moduleId);
        if (!m) return null;
        const out: any = { moduleId: g.moduleId };
        if (m.hasTd && typeof g.td === 'number') out.td = g.td;
        if (m.hasTp && typeof g.tp === 'number') out.tp = g.tp;
        if (m.hasExam && typeof g.exam === 'number') out.exam = g.exam;
        if (Object.keys(out).length === 1) return null; // nothing useful
        return out;
      })
      .filter(Boolean);

    return new Response(JSON.stringify({ grades: cleaned }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
