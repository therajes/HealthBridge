import React from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Video, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockAppointments } from '@/data/mockData';
import { useTranslation } from 'react-i18next';

const Appointments = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const userAppointments = mockAppointments.filter(apt => 
    user?.role === 'patient' ? apt.patientId === user.id : apt.doctorId === user.id
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'destructive';
      case 'completed': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <Layout>
      <div className="px-4 md:px-6 lg:px-8 space-y-8">
        <motion.div 
          className="text-center py-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
            {t('nav.appointments')}
          </h1>
          <p className="text-xl text-gray-600">
            Manage your medical consultations
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {userAppointments.length === 0 ? (
            <motion.div 
              variants={itemVariants}
              className="md:col-span-2 lg:col-span-3"
            >
              <Card className="text-center py-12">
                <CardContent>
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Appointments</h3>
                  <p className="text-gray-600 mb-4">You don't have any appointments scheduled</p>
                  <Button variant="medical">
                    Book New Appointment
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            userAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="shadow-lg border-0 overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${
                    appointment.status === 'approved' ? 'from-green-400 to-green-600' :
                    appointment.status === 'pending' ? 'from-yellow-400 to-yellow-600' :
                    appointment.status === 'cancelled' ? 'from-red-400 to-red-600' :
                    'from-gray-400 to-gray-600'
                  }`} />
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {user?.role === 'patient' ? appointment.doctorName : appointment.patientName}
                        </CardTitle>
                        <CardDescription>
                          {appointment.type === 'video' ? 'Video Consultation' : 'In-Person Visit'}
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusColor(appointment.status) as any} className="flex items-center gap-1">
                        {getStatusIcon(appointment.status)}
                        {appointment.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-green-500" />
                      <span>{appointment.time}</span>
                    </div>
                    {appointment.type === 'video' ? (
                      <div className="flex items-center text-sm text-gray-600">
                        <Video className="h-4 w-4 mr-2 text-purple-500" />
                        <span>Online Consultation</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                        <span>Clinic Visit</span>
                      </div>
                    )}
                    {appointment.symptoms && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500">Symptoms:</p>
                        <p className="text-sm text-gray-700">{appointment.symptoms}</p>
                      </div>
                    )}
                    <div className="flex gap-2 pt-3">
                      {appointment.status === 'approved' && (
                        <Button size="sm" variant="medical" className="flex-1">
                          {appointment.type === 'video' ? 'Join Call' : 'Get Directions'}
                        </Button>
                      )}
                      {appointment.status === 'pending' && (
                        <>
                          <Button size="sm" variant="outline" className="flex-1">
                            Reschedule
                          </Button>
                          <Button size="sm" variant="destructive" className="flex-1">
                            Cancel
                          </Button>
                        </>
                      )}
                      {appointment.status === 'completed' && (
                        <Button size="sm" variant="outline" className="flex-1">
                          View Details
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Appointments;