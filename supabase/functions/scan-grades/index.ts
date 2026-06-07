import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

interface ModuleInfo {
  id: string;
  name: string;
  hasTd: boolean;
  hasTp: boolean;
  hasExam: boolean;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { image, modules } = await req.json() as { image: string; modules: ModuleInfo[] };

    if (!image || !Array.isArray(modules)) {
      return new Response(JSON.stringify({ error: 'image and modules are required' }), {
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
        return `- id="${m.id}" | nom="${m.name}" | champs autorisés: ${fields.join(', ')}`;
      })
      .join('\n');

    const systemPrompt = `Tu es un assistant qui extrait des notes universitaires depuis une image (capture d'écran d'un relevé de notes, en français ou en arabe).

Voici la liste des modules de ce semestre avec leur id et les champs autorisés :
${moduleList}

Règles STRICTES :
- Retourne UNIQUEMENT les modules que tu reconnais dans l'image.
- Associe chaque ligne de l'image au module le plus proche par le nom (tolère les variations français/arabe, abréviations, fautes).
- Pour chaque module, ne remplis que les champs autorisés listés ci-dessus (td, tp, exam). Si un champ n'est pas autorisé, OMETS-LE complètement.
- Les notes sont des nombres entre 0 et 20 (accepte le format 12.5, 12,5, ١٢٫٥).
- Si une note n'est pas visible/lisible pour un champ autorisé, OMETS-LE.
- Ne devine jamais. Si tu n'es pas sûr, omets.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Extrais les notes de cette image.' },
              { type: 'image_url', image_url: { url: image } },
            ],
          },
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'fill_grades',
              description: 'Remplit les notes extraites depuis l\'image',
              parameters: {
                type: 'object',
                properties: {
                  grades: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        moduleId: { type: 'string', description: "id exact du module dans la liste" },
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
      return new Response(JSON.stringify({ error: 'Crédits IA épuisés. Ajoutez du crédit dans Cloud.' }), {
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

    // Filter to only allowed fields per module
    const modMap = new Map(modules.map((m) => [m.id, m]));
    const cleaned = (args.grades || [])
      .map((g: any) => {
        const m = modMap.get(g.moduleId);
        if (!m) return null;
        const out: any = { moduleId: g.moduleId };
        if (m.hasTd && typeof g.td === 'number') out.td = g.td;
        if (m.hasTp && typeof g.tp === 'number') out.tp = g.tp;
        if (m.hasExam && typeof g.exam === 'number') out.exam = g.exam;
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
