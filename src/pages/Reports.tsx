import React from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, Calendar, Upload, Filter, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Reports = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const reports = [
    {
      id: '1',
      title: 'Complete Blood Count',
      type: 'Lab Test',
      date: '2024-01-15',
      doctor: 'Dr. Sharma',
      status: 'ready',
      fileSize: '2.3 MB'
    },
    {
      id: '2',
      title: 'X-Ray Report - Chest',
      type: 'Radiology',
      date: '2024-01-10',
      doctor: 'Dr. Singh',
      status: 'ready',
      fileSize: '5.1 MB'
    },
    {
      id: '3',
      title: 'ECG Report',
      type: 'Cardiology',
      date: '2024-01-05',
      doctor: 'Dr. Patel',
      status: 'ready',
      fileSize: '1.8 MB'
    },
    {
      id: '4',
      title: 'Diabetes Panel',
      type: 'Lab Test',
      date: '2023-12-20',
      doctor: 'Dr. Kumar',
      status: 'ready',
      fileSize: '1.2 MB'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Lab Test': return 'bg-blue-100 text-blue-700';
      case 'Radiology': return 'bg-purple-100 text-purple-700';
      case 'Cardiology': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <motion.div 
          className="text-center py-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
            {t('nav.reports')}
          </h1>
          <p className="text-xl text-gray-600">
            Your medical reports and test results
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Total Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">{reports.length}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-green-50 to-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Lab Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  {reports.filter(r => r.type === 'Lab Test').length}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-purple-50 to-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Imaging</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-600">
                  {reports.filter(r => r.type === 'Radiology').length}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-orange-50 to-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange-600">3</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Actions Bar */}
        <Card>
          <CardContent className="flex flex-wrap gap-4 p-6">
            <Button variant="medical">
              <Upload className="h-4 w-4 mr-2" />
              Upload Report
            </Button>
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Search Reports
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
          </CardContent>
        </Card>

        {/* Reports List */}
        <div className="grid md:grid-cols-2 gap-6">
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="shadow-lg border-0 overflow-hidden">
                <div className={`h-1 bg-gradient-to-r from-blue-400 to-cyan-400`} />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{report.title}</CardTitle>
                        <CardDescription className="mt-1">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                            {report.type}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="success">Ready</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{report.date}</span>
                    </div>
                    <div className="text-gray-600">
                      <span>{report.fileSize}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Prescribed by: <span className="font-medium text-gray-800">{report.doctor}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="medical" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Reports;