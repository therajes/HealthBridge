import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Brain, AlertTriangle, Home, Pill, Stethoscope } from 'lucide-react';

interface SymptomAssessment {
  severity: string;
  recommendation: string;
  action: string;
  suggestedMedicines: string[];
  homeRemedies: string[];
}

const AISymptomChecker: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState<SymptomAssessment | null>(null);
  
  const [symptoms, setSymptoms] = useState({
    fever: false,
    feverTemp: '',
    cough: false,
    headache: false,
    bodyPain: false,
    nausea: false,
    fatigue: false,
    breathingDifficulty: false,
    chestPain: false,
    vomiting: false,
    dizziness: false,
    rash: false,
    other: ''
  });

  const handleSymptomChange = (symptom: string, value: boolean | string) => {
    setSymptoms(prev => ({
      ...prev,
      [symptom]: value
    }));
  };

  const analyzeSymptoms = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-symptom-checker', {
        body: {
          symptoms,
          patientId: user.id
        }
      });

      if (error) throw error;

      setAssessment(data);
      
      toast({
        title: "Analysis Complete",
        description: "AI has analyzed your symptoms and provided recommendations.",
      });

    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      toast({
        title: "Analysis Error",
        description: "Failed to analyze symptoms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Stethoscope className="w-4 h-4" />;
      case 'low': return <Home className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const resetAssessment = () => {
    setAssessment(null);
    setSymptoms({
      fever: false,
      feverTemp: '',
      cough: false,
      headache: false,
      bodyPain: false,
      nausea: false,
      fatigue: false,
      breathingDifficulty: false,
      chestPain: false,
      vomiting: false,
      dizziness: false,
      rash: false,
      other: ''
    });
  };

  if (assessment) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-6 h-6" />
            <span>AI Symptom Analysis Results</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Severity Level */}
          <div>
            <Badge variant={getSeverityColor(assessment.severity)} className="mb-4">
              {getSeverityIcon(assessment.severity)}
              <span className="ml-2 capitalize">{assessment.severity} Severity</span>
            </Badge>
            
            <Alert className={`border-l-4 ${
              assessment.severity === 'high' ? 'border-red-500' :
              assessment.severity === 'medium' ? 'border-yellow-500' :
              'border-green-500'
            }`}>
              <AlertDescription className="text-base font-medium">
                {assessment.recommendation}
              </AlertDescription>
            </Alert>
          </div>

          {/* Home Remedies */}
          {assessment.homeRemedies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Home className="w-5 h-5" />
                  <span>Home Remedies</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {assessment.homeRemedies.map((remedy, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-green-500 font-bold">•</span>
                      <span>{remedy}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Suggested Medicines */}
          {assessment.suggestedMedicines.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Pill className="w-5 h-5" />
                  <span>Suggested Medicines</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {assessment.suggestedMedicines.map((medicine, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>{medicine}</span>
                    </li>
                  ))}
                </ul>
                <Alert className="mt-4">
                  <AlertDescription>
                    <strong>Important:</strong> Please consult with a pharmacist or doctor before taking any medications.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            {assessment.action === 'consult_doctor_urgent' || assessment.action === 'consult_doctor' ? (
              <Button className="flex-1" onClick={() => toast({ title: "Booking", description: "Redirecting to appointment booking..." })}>
                <Stethoscope className="w-4 h-4 mr-2" />
                Book Doctor Appointment
              </Button>
            ) : null}
            
            <Button variant="outline" onClick={() => toast({ title: "Medicines", description: "Checking medicine availability..." })}>
              <Pill className="w-4 h-4 mr-2" />
              Check Medicine Availability
            </Button>
            
            <Button variant="secondary" onClick={resetAssessment}>
              New Assessment
            </Button>
          </div>

          <Alert>
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              <strong>Disclaimer:</strong> This AI assessment is for informational purposes only and should not replace professional medical advice. 
              Always consult with a healthcare professional for serious symptoms or if you're unsure about your condition.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="w-6 h-6" />
          <span>AI-Powered Symptom Checker</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Brain className="w-4 h-4" />
          <AlertDescription>
            Our AI will analyze your symptoms and provide personalized recommendations including home remedies, 
            suggested medicines, or whether you should consult a doctor.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="fever"
              checked={symptoms.fever}
              onCheckedChange={(checked) => handleSymptomChange('fever', checked as boolean)}
            />
            <label htmlFor="fever" className="text-sm font-medium">Fever</label>
          </div>

          {symptoms.fever && (
            <div className="col-span-2 md:col-span-1">
              <input
                type="number"
                placeholder="Temperature (°F)"
                value={symptoms.feverTemp}
                onChange={(e) => handleSymptomChange('feverTemp', e.target.value)}
                className="w-full px-3 py-1 border rounded text-sm"
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="cough"
              checked={symptoms.cough}
              onCheckedChange={(checked) => handleSymptomChange('cough', checked as boolean)}
            />
            <label htmlFor="cough" className="text-sm font-medium">Cough</label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="headache"
              checked={symptoms.headache}
              onCheckedChange={(checked) => handleSymptomChange('headache', checked as boolean)}
            />
            <label htmlFor="headache" className="text-sm font-medium">Headache</label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="bodyPain"
              checked={symptoms.bodyPain}
              onCheckedChange={(checked) => handleSymptomChange('bodyPain', checked as boolean)}
            />
            <label htmlFor="bodyPain" className="text-sm font-medium">Body Pain</label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="nausea"
              checked={symptoms.nausea}
              onCheckedChange={(checked) => handleSymptomChange('nausea', checked as boolean)}
            />
            <label htmlFor="nausea" className="text-sm font-medium">Nausea</label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="fatigue"
              checked={symptoms.fatigue}
              onCheckedChange={(checked) => handleSymptomChange('fatigue', checked as boolean)}
            />
            <label htmlFor="fatigue" className="text-sm font-medium">Fatigue</label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="breathingDifficulty"
              checked={symptoms.breathingDifficulty}
              onCheckedChange={(checked) => handleSymptomChange('breathingDifficulty', checked as boolean)}
            />
            <label htmlFor="breathingDifficulty" className="text-sm font-medium">Breathing Difficulty</label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="chestPain"
              checked={symptoms.chestPain}
              onCheckedChange={(checked) => handleSymptomChange('chestPain', checked as boolean)}
            />
            <label htmlFor="chestPain" className="text-sm font-medium">Chest Pain</label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="vomiting"
              checked={symptoms.vomiting}
              onCheckedChange={(checked) => handleSymptomChange('vomiting', checked as boolean)}
            />
            <label htmlFor="vomiting" className="text-sm font-medium">Vomiting</label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="dizziness"
              checked={symptoms.dizziness}
              onCheckedChange={(checked) => handleSymptomChange('dizziness', checked as boolean)}
            />
            <label htmlFor="dizziness" className="text-sm font-medium">Dizziness</label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="rash"
              checked={symptoms.rash}
              onCheckedChange={(checked) => handleSymptomChange('rash', checked as boolean)}
            />
            <label htmlFor="rash" className="text-sm font-medium">Skin Rash</label>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Other Symptoms</label>
          <Textarea
            value={symptoms.other}
            onChange={(e) => handleSymptomChange('other', e.target.value)}
            placeholder="Describe any other symptoms you're experiencing..."
            className="min-h-20"
          />
        </div>

        <Button 
          onClick={analyzeSymptoms}
          disabled={loading || Object.values(symptoms).every(val => !val)}
          className="w-full"
        >
          {loading ? (
            <>
              <Brain className="w-4 h-4 mr-2 animate-pulse" />
              Analyzing Symptoms...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              Analyze Symptoms with AI
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AISymptomChecker;