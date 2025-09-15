import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { appointmentId, userId, userRole } = await req.json()
    
    // Generate video call room token (integrate with your video service)
    // For demo purposes, using a simple room ID system
    const roomId = `room_${appointmentId}`
    const token = generateSimpleToken(userId, userRole, roomId)
    
    return new Response(
      JSON.stringify({
        roomId,
        token,
        videoUrl: `https://meet.jit.si/${roomId}` // Using Jitsi Meet for demo
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function generateSimpleToken(userId: string, userRole: string, roomId: string): string {
  // Simple token generation - in production, use proper JWT with video service
  const tokenData = {
    userId,
    userRole,
    roomId,
    timestamp: Date.now(),
    expiresIn: Date.now() + (60 * 60 * 1000) // 1 hour
  }
  
  return btoa(JSON.stringify(tokenData))
}