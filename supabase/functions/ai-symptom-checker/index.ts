import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { symptoms, patientId } = await req.json()
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // AI Analysis Logic (simplified for demo - in production, integrate with OpenAI/Claude)
    const analysisResult = analyzeSymptoms(symptoms)
    
    // Save assessment to database
    const { error } = await supabaseClient
      .from('symptom_assessments')
      .insert({
        patient_id: patientId,
        symptoms: symptoms,
        ai_recommendation: analysisResult.recommendation,
        severity_level: analysisResult.severity,
        recommended_action: analysisResult.action
      })

    if (error) throw error

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function analyzeSymptoms(symptoms: any) {
  // Simplified AI logic - replace with actual AI integration
  const severityScore = calculateSeverity(symptoms)
  
  if (severityScore >= 8) {
    return {
      severity: 'high',
      recommendation: 'Immediate medical attention required. Please visit emergency care or consult a doctor immediately.',
      action: 'consult_doctor_urgent',
      suggestedMedicines: [],
      homeRemedies: []
    }
  } else if (severityScore >= 5) {
    return {
      severity: 'medium',
      recommendation: 'Consult a doctor for proper diagnosis and treatment.',
      action: 'consult_doctor',
      suggestedMedicines: getSuggestedMedicines(symptoms),
      homeRemedies: getHomeRemedies(symptoms)
    }
  } else {
    return {
      severity: 'low',
      recommendation: 'Try home remedies first. Monitor symptoms and consult doctor if they persist.',
      action: 'home_remedies',
      suggestedMedicines: getOTCMedicines(symptoms),
      homeRemedies: getHomeRemedies(symptoms)
    }
  }
}

function calculateSeverity(symptoms: any): number {
  let score = 0
  
  if (symptoms.fever && symptoms.fever > 102) score += 3
  else if (symptoms.fever) score += 1
  
  if (symptoms.breathingDifficulty) score += 4
  if (symptoms.chestPain) score += 3
  if (symptoms.severeHeadache) score += 2
  if (symptoms.vomiting) score += 2
  if (symptoms.cough) score += 1
  if (symptoms.bodyPain) score += 1
  if (symptoms.fatigue) score += 1
  
  return score
}

function getSuggestedMedicines(symptoms: any): string[] {
  const medicines = []
  
  if (symptoms.fever) medicines.push('Paracetamol 500mg')
  if (symptoms.cough) medicines.push('Cough syrup')
  if (symptoms.bodyPain) medicines.push('Ibuprofen 400mg')
  if (symptoms.headache) medicines.push('Aspirin 325mg')
  
  return medicines
}

function getOTCMedicines(symptoms: any): string[] {
  const medicines = []
  
  if (symptoms.fever) medicines.push('Paracetamol 500mg (max 3 times daily)')
  if (symptoms.cough) medicines.push('Honey-based cough drops')
  if (symptoms.headache) medicines.push('Paracetamol or gentle head massage')
  
  return medicines
}

function getHomeRemedies(symptoms: any): string[] {
  const remedies = []
  
  if (symptoms.fever) {
    remedies.push('Rest and stay hydrated')
    remedies.push('Use cool compresses on forehead')
  }
  
  if (symptoms.cough) {
    remedies.push('Drink warm water with honey and lemon')
    remedies.push('Gargle with warm salt water')
  }
  
  if (symptoms.headache) {
    remedies.push('Rest in a quiet, dark room')
    remedies.push('Apply cold or warm compress to head')
  }
  
  if (symptoms.bodyPain) {
    remedies.push('Gentle stretching or light exercise')
    remedies.push('Warm bath or heating pad')
  }
  
  if (symptoms.fatigue) {
    remedies.push('Get adequate sleep (7-9 hours)')
    remedies.push('Stay hydrated and eat nutritious meals')
  }
  
  return remedies
}