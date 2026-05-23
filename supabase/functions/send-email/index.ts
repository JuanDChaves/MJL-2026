// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const GMAIL_RESEND = Deno.env.get('GMAIL_RESEND');

Deno.serve(async (request: Request) => {

  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { emailToSend, nombre, apellido, resultado} = await request.json();
    const logoUrl ='https://tvoosqcbxhokrluyettu.supabase.co/storage/v1/object/public/ProfilePhoto/IconApp/icon-only.png'
  
  const resultadoTexto = resultado ? 'APROBADA' : 'RECHAZADA';
  const colorPrincipal = resultado ? '#388E3C': '#CA2C12'; // verde para aprobado, rojo para rechazado
  const mensaje = resultado 
    ? 'Tu solicitud fue aprobada. Ya podés iniciar sesión en la app.'
    : 'Tu solicitud fue rechazada. Podés volver a registrarte con datos distintos.';
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Georgia, serif; background-color: #F3E9DA;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <!-- Header -->
    <div style="background-color: #F8A112; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
      <img src="${logoUrl}" alt="HTN Bar" style="width: 80px; height: 80px; border-radius: 50%;">
      <h1 style="color: #FFFFFF; margin: 15px 0 0; font-size: 24px;">HTN Bar</h1>
    </div>
    
    <!-- Content -->
    <div style="background-color: #FFFFFF; padding: 40px 30px; text-align: center;">
      <h2 style="color: ${colorPrincipal}; font-size: 28px; margin: 0 0 20px;">
        Solicitud ${resultadoTexto}
      </h2>
      <p style="color: #6E4839; font-size: 18px; line-height: 1.6;">
        Hola <strong>${nombre} ${apellido}</strong>,
      </p>
      <p style="color: #6E4839; font-size: 16px; line-height: 1.6;">
        ${mensaje}
      </p>
      
      ${resultado 
        ? '<p style="color: #6E4839; font-size: 14px; margin-top: 30px;">Ya podés comenzar a usar la app.</p>'
        : '<p style="color: #6E4839; font-size: 14px; margin-top: 30px;">Si creés que hay un error, contactá a soporte.</p>'
      }
    </div>
    
    <!-- Footer -->
    <div style="background-color: #6E4839; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
      <p style="color: #F3E9DA; font-size: 12px; margin: 0;">
        © 2024 HTN Bar. Todos los derechos reservados.
      </p>
    </div>
    
  </div>
</body>
</html>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'HTN Bar <htn.app.bar@customermjl.shop>',
        to: [emailToSend],
        subject: 'Solicitud de registro',
        html: html,
      }),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-email' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
