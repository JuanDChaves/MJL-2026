import { createClient } from 'npm:@supabase/supabase-js@2'
import { JWT } from 'npm:google-auth-library@9'
import serviceAccount from './service-account.json' with { type: 'json' }

interface Notification {
  id: string
  user_id: string | null
  title: string | null
  body: string
  data: Record<string, unknown> | null
}

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: Notification
  schema: 'public'
  old_record: null | Notification
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const getAccessToken = ({
  clientEmail,
  privateKey,
}: {
  clientEmail: string
  privateKey: string
}): Promise<string> => {
  return new Promise((resolve, reject) => {
    const jwtClient = new JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
    })
    jwtClient.authorize((err, tokens) => {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens!.access_token!)
    })
  })
}

Deno.serve(async (req) => {
  const payload: WebhookPayload = await req.json()

  if (payload.type !== 'INSERT') {
    return new Response(JSON.stringify({ message: 'Ignored: not an INSERT' }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const notification = payload.record

  const { data: recipients, error: recipientsError } = await supabase
    .from('usuarios')
    .select('fcm_token, id')
    .in('perfil', ['supervisor', 'duenio'])
    .not('fcm_token', 'is', null)

  if (recipientsError) {
    console.error('Error fetching recipients:', recipientsError)
    return new Response(
      JSON.stringify({ error: 'Error fetching recipients' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  if (!recipients || recipients.length === 0) {
    return new Response(
      JSON.stringify({ message: 'No recipients with FCM token found' }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  }

  const accessToken = await getAccessToken({
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key,
  })

  const results = []

  for (const recipient of recipients) {
    try {
      const res = await fetch(
        `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            message: {
              token: recipient.fcm_token,
              notification: {
                title: notification.title || 'Nueva notificación',
                body: notification.body,
              },
              data: notification.data
                ? Object.fromEntries(
                    Object.entries(notification.data).map(([k, v]) => [k, String(v)])
                  )
                : undefined,
            },
          }),
        }
      )

      const resData = await res.json()
      results.push({ user_id: recipient.id, success: res.status >= 200 && res.status <= 299, response: resData })
    } catch (err) {
      console.error(`Error sending to ${recipient.id}:`, err)
      results.push({ user_id: recipient.id, success: false, error: String(err) })
    }
  }

  return new Response(JSON.stringify({ processed: results }), {
    headers: { 'Content-Type': 'application/json' },
  })
})