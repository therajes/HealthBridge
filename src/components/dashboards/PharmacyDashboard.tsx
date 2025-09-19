import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Plus, 
  CheckCircle,
  ShoppingCart,
  Building2,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockMedicineStock } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { InventoryManagement } from '@/components/pharmacy/InventoryManagement';

const PharmacyDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddMedicineCard, setShowAddMedicineCard] = useState(false);
  const [showUpdateInventoryCard, setShowUpdateInventoryCard] = useState(false);
  const [showLowStockAlert, setShowLowStockAlert] = useState(false);

  const pharmacyStock = mockMedicineStock.filter(med => med.pharmacyId === user?.id);
  const lowStockCount = pharmacyStock.filter(med => med.stock < 10).length;
  const outOfStockCount = pharmacyStock.filter(med => med.stock === 0).length;
  const totalMedicines = pharmacyStock.length;

  const handleQuickAddMedicine = () => {
    setActiveTab('inventory');
    toast({
      title: "Inventory Management",
      description: "Use the inventory management tools to add new medicines.",
    });
  };

  const handleQuickUpdateInventory = () => {
    setActiveTab('inventory');
    toast({
      title: "Inventory Management",
      description: "Use the inventory management tools to update stock levels.",
    });
  };

  const handleQuickLowStock = () => {
    setShowLowStockAlert(true);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', variant: 'destructive' as const };
    if (stock < 10) return { label: 'Low Stock', variant: 'secondary' as const };
    return { label: 'In Stock', variant: 'default' as const };
  };

  return (
    <div className="px-4 md:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Pharmacy Dashboard</h1>
        <Badge variant="secondary" className="text-warning">
          {user?.name}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Management</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="requests">Medicine Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Medicines</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{totalMedicines}</div>
                <p className="text-xs text-muted-foreground">In your inventory</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">{lowStockCount}</div>
                <p className="text-xs text-muted-foreground">Need restocking</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emergency">{outOfStockCount}</div>
                <p className="text-xs text-muted-foreground">Urgent restocking</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">₹45,280</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common pharmacy management tasks</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <Button 
                variant="medical" 
                className="h-20 flex-col space-y-2"
                onClick={handleQuickAddMedicine}
              >
                <Plus className="h-6 w-6" />
                <span>Add New Medicine</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={handleQuickUpdateInventory}
              >
                <Package className="h-6 w-6" />
                <span>Update Inventory</span>
              </Button>
              <Button 
                variant="warning" 
                className="h-20 flex-col space-y-2"
                onClick={handleQuickLowStock}
              >
                <AlertTriangle className="h-6 w-6" />
                <span>Low Stock Alert</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <InventoryManagement />
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Manage customer orders and deliveries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Order #ORD-2024-0142</p>
                    <p className="text-sm text-muted-foreground">Customer: Rajesh Kumar</p>
                  </div>
                  <Badge variant="success">Delivered</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm">Paracetamol 500mg x 2 strips - ₹40</p>
                  <p className="text-sm">Cetirizine 10mg x 1 strip - ₹25</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total: ₹65</span>
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </div>
              </div>

              <div className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Order #ORD-2024-0141</p>
                    <p className="text-sm text-muted-foreground">Customer: Priya Sharma</p>
                  </div>
                  <Badge variant="secondary">Processing</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm">Amoxicillin 500mg x 1 strip - ₹80</p>
                  <p className="text-sm">Vitamin D3 supplements x 1 bottle - ₹250</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total: ₹330</span>
                  <Button size="sm" variant="medical">
                    Mark as Ready
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Medicine Requests</CardTitle>
              <CardDescription>Patient queries about medicine availability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Krishna</span>
                  <Badge variant="secondary">2 hours ago</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Requesting availability for: Azithromycin 250mg
                </p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="success">
                    Available - 45 units
                  </Button>
                  <Button size="sm" variant="outline">
                    Contact Patient
                  </Button>
                </div>
              </div>

              <div className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Meera Singh</span>
                  <Badge variant="secondary">5 hours ago</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Requesting availability for: Cetirizine 10mg
                </p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="emergency">
                    Out of Stock
                  </Button>
                  <Button size="sm" variant="outline">
                    Suggest Alternative
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Alert Card */}
          {showLowStockAlert && (
            <Card className="shadow-card border-orange-200 bg-orange-50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-orange-800">Low Stock Alert</CardTitle>
                  <CardDescription>Medicines requiring immediate attention</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowLowStockAlert(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {outOfStockCount > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-red-600">Out of Stock ({outOfStockCount})</h3>
                    {pharmacyStock.filter(m => m.stock === 0).slice(0, 3).map(medicine => (
                      <div key={medicine.id} className="flex justify-between items-center p-3 bg-white rounded-lg border border-red-200">
                        <div>
                          <p className="font-medium">{medicine.name}</p>
                          <p className="text-sm text-muted-foreground">{medicine.manufacturer}</p>
                        </div>
                        <Button size="sm" variant="destructive">
                          Order Now
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {lowStockCount > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-orange-600">Low Stock ({lowStockCount})</h3>
                    {pharmacyStock.filter(m => m.stock > 0 && m.stock < 10).slice(0, 3).map(medicine => (
                      <div key={medicine.id} className="flex justify-between items-center p-3 bg-white rounded-lg border border-orange-200">
                        <div>
                          <p className="font-medium">{medicine.name}</p>
                          <p className="text-sm text-muted-foreground">Stock: {medicine.stock} units</p>
                        </div>
                        <Button size="sm" variant="warning">
                          Reorder
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex space-x-2 mt-4">
                  <Button variant="medical" className="flex-1" onClick={() => setActiveTab('inventory')}>
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Manage Inventory
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Building2 className="h-4 w-4 mr-1" />
                    Contact Suppliers
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PharmacyDashboard;
