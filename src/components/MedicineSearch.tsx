import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Pill, 
  MapPin, 
  Clock, 
  Phone,
  ShoppingCart,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  IndianRupee,
  Package,
  Truck,
  Store,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  category: string;
  dosageForm: string;
  strength: string;
  price: number;
  mrp: number;
  stock: number;
  requiresPrescription: boolean;
  description: string;
  uses: string[];
  sideEffects: string[];
  precautions: string[];
  alternatives: string[];
  composition: string;
}

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  distance: string;
  phone: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
  hasStock: boolean;
  stockQuantity: number;
  price: number;
  deliveryAvailable: boolean;
  deliveryTime: string;
}

export const MedicineSearch: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Medicine[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [nearbyPharmacies, setNearbyPharmacies] = useState<Pharmacy[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [cartItems, setCartItems] = useState<{medicine: Medicine; quantity: number}[]>([]);

  // Mock medicine database
  const medicineDatabase: Medicine[] = [
    {
      id: '1',
      name: 'Paracetamol',
      genericName: 'Acetaminophen',
      manufacturer: 'Cipla Ltd',
      category: 'Analgesic & Antipyretic',
      dosageForm: 'Tablet',
      strength: '500mg',
      price: 15,
      mrp: 20,
      stock: 500,
      requiresPrescription: false,
      description: 'Paracetamol is used to treat mild to moderate pain and reduce fever.',
      uses: ['Fever', 'Headache', 'Body ache', 'Toothache', 'Common cold'],
      sideEffects: ['Nausea', 'Allergic reactions (rare)', 'Liver damage (overdose)'],
      precautions: ['Do not exceed recommended dose', 'Avoid alcohol', 'Consult doctor if symptoms persist'],
      alternatives: ['Ibuprofen', 'Aspirin', 'Diclofenac'],
      composition: 'Paracetamol 500mg'
    },
    {
      id: '2',
      name: 'Amoxicillin',
      genericName: 'Amoxicillin',
      manufacturer: 'GlaxoSmithKline',
      category: 'Antibiotic',
      dosageForm: 'Capsule',
      strength: '500mg',
      price: 65,
      mrp: 80,
      stock: 200,
      requiresPrescription: true,
      description: 'Broad-spectrum antibiotic used to treat various bacterial infections.',
      uses: ['Respiratory infections', 'Ear infections', 'Skin infections', 'Urinary tract infections'],
      sideEffects: ['Diarrhea', 'Nausea', 'Rash', 'Allergic reactions'],
      precautions: ['Complete full course', 'Take with food', 'Inform doctor of allergies'],
      alternatives: ['Azithromycin', 'Cefixime', 'Ciprofloxacin'],
      composition: 'Amoxicillin Trihydrate 500mg'
    },
    {
      id: '3',
      name: 'Cetirizine',
      genericName: 'Cetirizine Hydrochloride',
      manufacturer: 'Dr. Reddy\'s',
      category: 'Antihistamine',
      dosageForm: 'Tablet',
      strength: '10mg',
      price: 25,
      mrp: 35,
      stock: 300,
      requiresPrescription: false,
      description: 'Antihistamine used to relieve allergy symptoms.',
      uses: ['Allergic rhinitis', 'Hay fever', 'Urticaria', 'Allergic conjunctivitis'],
      sideEffects: ['Drowsiness', 'Dry mouth', 'Fatigue', 'Headache'],
      precautions: ['May cause drowsiness', 'Avoid driving', 'Avoid alcohol'],
      alternatives: ['Loratadine', 'Fexofenadine', 'Levocetirizine'],
      composition: 'Cetirizine Hydrochloride 10mg'
    },
    {
      id: '4',
      name: 'Omeprazole',
      genericName: 'Omeprazole',
      manufacturer: 'Sun Pharma',
      category: 'Proton Pump Inhibitor',
      dosageForm: 'Capsule',
      strength: '20mg',
      price: 45,
      mrp: 60,
      stock: 150,
      requiresPrescription: true,
      description: 'Used to treat acid reflux and stomach ulcers.',
      uses: ['GERD', 'Peptic ulcers', 'Acid reflux', 'Heartburn'],
      sideEffects: ['Headache', 'Nausea', 'Diarrhea', 'Abdominal pain'],
      precautions: ['Take before meals', 'Long-term use requires monitoring', 'May interact with other drugs'],
      alternatives: ['Pantoprazole', 'Rabeprazole', 'Esomeprazole'],
      composition: 'Omeprazole 20mg'
    },
    {
      id: '5',
      name: 'Metformin',
      genericName: 'Metformin Hydrochloride',
      manufacturer: 'USV Ltd',
      category: 'Antidiabetic',
      dosageForm: 'Tablet',
      strength: '500mg',
      price: 35,
      mrp: 45,
      stock: 0,
      requiresPrescription: true,
      description: 'First-line medication for type 2 diabetes management.',
      uses: ['Type 2 diabetes', 'PCOS', 'Prediabetes'],
      sideEffects: ['Nausea', 'Diarrhea', 'Metallic taste', 'Vitamin B12 deficiency'],
      precautions: ['Take with food', 'Monitor kidney function', 'Avoid alcohol'],
      alternatives: ['Glimepiride', 'Sitagliptin', 'Pioglitazone'],
      composition: 'Metformin Hydrochloride 500mg'
    }
  ];

  // Mock pharmacy data
  const pharmacyDatabase: Pharmacy[] = [
    {
      id: '1',
      name: 'Nabha Medical Store',
      address: 'Main Market, Near Bus Stand, Nabha',
      distance: '0.5 km',
      phone: '+91 98765 43210',
      openTime: '8:00 AM',
      closeTime: '10:00 PM',
      isOpen: true,
      hasStock: true,
      stockQuantity: 50,
      price: 15,
      deliveryAvailable: true,
      deliveryTime: '30 mins'
    },
    {
      id: '2',
      name: 'Apollo Pharmacy',
      address: 'Civil Hospital Road, Nabha',
      distance: '1.2 km',
      phone: '+91 98765 12345',
      openTime: '24 Hours',
      closeTime: '24 Hours',
      isOpen: true,
      hasStock: true,
      stockQuantity: 100,
      price: 18,
      deliveryAvailable: true,
      deliveryTime: '45 mins'
    },
    {
      id: '3',
      name: 'MedPlus Pharmacy',
      address: 'Railway Station Road, Nabha',
      distance: '2.0 km',
      phone: '+91 98765 67890',
      openTime: '9:00 AM',
      closeTime: '9:00 PM',
      isOpen: true,
      hasStock: false,
      stockQuantity: 0,
      price: 16,
      deliveryAvailable: false,
      deliveryTime: 'N/A'
    },
    {
      id: '4',
      name: 'Wellness Forever',
      address: 'GT Road, Nabha',
      distance: '3.5 km',
      phone: '+91 98765 11111',
      openTime: '8:30 AM',
      closeTime: '10:30 PM',
      isOpen: true,
      hasStock: true,
      stockQuantity: 25,
      price: 14,
      deliveryAvailable: true,
      deliveryTime: '1 hour'
    }
  ];

  const searchMedicine = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Enter Medicine Name",
        description: "Please enter a medicine name to search.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      const results = medicineDatabase.filter(med => 
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(results);
      setIsSearching(false);
      
      if (results.length === 0) {
        toast({
          title: "No Results Found",
          description: "Try searching with a different medicine name or generic name.",
          variant: "destructive"
        });
      }
    }, 1000);
  };

  const selectMedicine = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    // Load pharmacy availability
    const availablePharmacies = pharmacyDatabase.map(pharmacy => ({
      ...pharmacy,
      hasStock: Math.random() > 0.3,
      stockQuantity: Math.floor(Math.random() * 100),
      price: medicine.price + Math.floor(Math.random() * 5)
    }));
    setNearbyPharmacies(availablePharmacies);
  };

  const addToCart = (medicine: Medicine) => {
    const existingItem = cartItems.find(item => item.medicine.id === medicine.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.medicine.id === medicine.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { medicine, quantity: 1 }]);
    }
    
    toast({
      title: "Added to Cart",
      description: `${medicine.name} has been added to your cart.`,
    });
  };

  const orderMedicine = (pharmacy: Pharmacy) => {
    toast({
      title: "Order Placed!",
      description: `Your order from ${pharmacy.name} will be delivered in ${pharmacy.deliveryTime}.`,
    });
  };

  return (
    <div className="space-y-4">
      {/* Search Section */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Pill className="h-5 w-5 text-primary" />
            <span>Medicine Search & Availability</span>
          </CardTitle>
          <CardDescription>
            Search for medicines and check availability at nearby pharmacies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Search by medicine name, generic name, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchMedicine()}
              className="flex-1"
            />
            <Button 
              onClick={searchMedicine} 
              variant="medical"
              disabled={isSearching}
            >
              <Search className="h-4 w-4 mr-2" />
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>{searchResults.length} medicine(s) found</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {searchResults.map(medicine => (
                  <div 
                    key={medicine.id} 
                    className="border rounded-lg p-4 hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => selectMedicine(medicine)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{medicine.name}</h3>
                          <Badge variant={medicine.requiresPrescription ? "destructive" : "success"}>
                            {medicine.requiresPrescription ? "Rx Required" : "OTC"}
                          </Badge>
                          {medicine.stock === 0 && (
                            <Badge variant="destructive">Out of Stock</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {medicine.genericName} • {medicine.strength} • {medicine.dosageForm}
                        </p>
                        <p className="text-sm text-muted-foreground">{medicine.manufacturer}</p>
                        <p className="text-sm">{medicine.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <IndianRupee className="h-4 w-4" />
                          <span className="text-lg font-bold">{medicine.price}</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-through">MRP ₹{medicine.mrp}</p>
                        <Badge variant="outline" className="text-green-600 mt-1">
                          {Math.round(((medicine.mrp - medicine.price) / medicine.mrp) * 100)}% OFF
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex space-x-2">
                        <Badge variant="secondary">{medicine.category}</Badge>
                      </div>
                      <Button 
                        size="sm" 
                        variant="medical"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(medicine);
                        }}
                        disabled={medicine.stock === 0}
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Selected Medicine Details */}
      {selectedMedicine && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>{selectedMedicine.name} - Detailed Information</CardTitle>
            <CardDescription>{selectedMedicine.genericName}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="details" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="uses">Uses & Effects</TabsTrigger>
                <TabsTrigger value="availability">Availability</TabsTrigger>
                <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Composition</label>
                    <p className="font-medium">{selectedMedicine.composition}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Category</label>
                    <p className="font-medium">{selectedMedicine.category}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Manufacturer</label>
                    <p className="font-medium">{selectedMedicine.manufacturer}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Form & Strength</label>
                    <p className="font-medium">{selectedMedicine.dosageForm} • {selectedMedicine.strength}</p>
                  </div>
                </div>
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    {selectedMedicine.requiresPrescription 
                      ? "This medicine requires a valid prescription from a registered medical practitioner."
                      : "This is an over-the-counter medicine, but please read instructions carefully."}
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="uses" className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Uses</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedMedicine.uses.map((use, index) => (
                        <Badge key={index} variant="secondary">{use}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span>Side Effects</span>
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedMedicine.sideEffects.map((effect, index) => (
                        <li key={index} className="text-sm text-muted-foreground">{effect}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center space-x-2">
                      <Info className="h-4 w-4 text-blue-600" />
                      <span>Precautions</span>
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedMedicine.precautions.map((precaution, index) => (
                        <li key={index} className="text-sm text-muted-foreground">{precaution}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="availability" className="space-y-4">
                <div className="space-y-3">
                  {nearbyPharmacies.map(pharmacy => (
                    <div key={pharmacy.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Store className="h-4 w-4 text-primary" />
                            <h4 className="font-semibold">{pharmacy.name}</h4>
                            {pharmacy.isOpen ? (
                              <Badge variant="success">Open Now</Badge>
                            ) : (
                              <Badge variant="destructive">Closed</Badge>
                            )}
                          </div>
                          
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p className="flex items-center space-x-2">
                              <MapPin className="h-3 w-3" />
                              <span>{pharmacy.address} • {pharmacy.distance}</span>
                            </p>
                            <p className="flex items-center space-x-2">
                              <Clock className="h-3 w-3" />
                              <span>{pharmacy.openTime} - {pharmacy.closeTime}</span>
                            </p>
                            <p className="flex items-center space-x-2">
                              <Phone className="h-3 w-3" />
                              <span>{pharmacy.phone}</span>
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-2">
                          <div className="flex items-center justify-end space-x-2">
                            {pharmacy.hasStock ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium text-green-600">
                                  In Stock ({pharmacy.stockQuantity})
                                </span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-red-600" />
                                <span className="text-sm font-medium text-red-600">Out of Stock</span>
                              </>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-end space-x-1">
                            <IndianRupee className="h-4 w-4" />
                            <span className="text-lg font-bold">{pharmacy.price}</span>
                          </div>
                          
                          {pharmacy.deliveryAvailable && (
                            <div className="flex items-center justify-end space-x-1 text-sm text-muted-foreground">
                              <Truck className="h-3 w-3" />
                              <span>Delivery: {pharmacy.deliveryTime}</span>
                            </div>
                          )}
                          
                          {pharmacy.hasStock && (
                            <Button 
                              size="sm" 
                              variant="medical"
                              onClick={() => orderMedicine(pharmacy)}
                            >
                              Order Now
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="alternatives" className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    These are alternative medicines with similar effects. Always consult your doctor before switching medications.
                  </AlertDescription>
                </Alert>
                
                <div className="grid md:grid-cols-2 gap-3">
                  {selectedMedicine.alternatives.map((alt, index) => (
                    <div key={index} className="border rounded-lg p-3 hover:bg-muted cursor-pointer">
                      <p className="font-medium">{alt}</p>
                      <p className="text-sm text-muted-foreground">Click to search</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Shopping Cart Summary */}
      {cartItems.length > 0 && (
        <Card className="shadow-card border-primary">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Shopping Cart</span>
              <Badge variant="default">{cartItems.length} items</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {cartItems.map(item => (
                <div key={item.medicine.id} className="flex items-center justify-between">
                  <span className="text-sm">{item.medicine.name} x {item.quantity}</span>
                  <span className="font-medium">₹{item.medicine.price * item.quantity}</span>
                </div>
              ))}
              <div className="pt-2 border-t flex items-center justify-between">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg">
                  ₹{cartItems.reduce((sum, item) => sum + (item.medicine.price * item.quantity), 0)}
                </span>
              </div>
              <Button variant="medical" className="w-full">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Proceed to Checkout
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};