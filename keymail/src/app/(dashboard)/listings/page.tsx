"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Square,
  Calendar
} from "lucide-react";

interface Listing {
  id: string;
  mlsId: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  description: string;
  photos: string[];
  features: string[];
  bedrooms: number | null;
  bathrooms: number | null;
  squareFeet: number | null;
  lotSize: number | null;
  propertyType: string;
  neighborhood: string;
  status: string;
  createdAt: string;
}

export default function ListingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "pending" | "sold" | "withdrawn">("all");
  const [filterPropertyType, setFilterPropertyType] = useState<string>("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  // Form state for creating/editing listing
  const [formData, setFormData] = useState({
    mlsId: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    price: "",
    description: "",
    photos: [] as string[],
    features: [] as string[],
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
    lotSize: "",
    propertyType: "",
    neighborhood: "",
    status: "active",
  });

  useEffect(() => {
    fetchListings();
  }, [filterStatus, filterPropertyType]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchTerm) {
        params.append("search", searchTerm);
      }
      if (filterStatus !== "all") {
        params.append("status", filterStatus);
      }
      if (filterPropertyType !== "all") {
        params.append("propertyType", filterPropertyType);
      }

      const response = await fetch(`/api/listings?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch listings");
      }

      const data = await response.json();
      setListings(data.data || []);
    } catch (error) {
      console.error("Error fetching listings:", error);
      setError("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.mlsId || !formData.address || !formData.city || !formData.state || !formData.zipCode || !formData.price) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const url = editingListing ? `/api/listings` : `/api/listings`;
      const method = editingListing ? "PUT" : "POST";
      const body = editingListing 
        ? { listingId: editingListing.id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save listing");
      }

      // Reset form and refresh
      resetForm();
      await fetchListings();
      
      alert(editingListing ? "Listing updated successfully!" : "Listing created successfully!");
    } catch (error) {
      console.error("Error saving listing:", error);
      setError(error instanceof Error ? error.message : "Failed to save listing");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (listingId: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/listings?listingId=${listingId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete listing");
      }

      await fetchListings();
      alert("Listing deleted successfully!");
    } catch (error) {
      console.error("Error deleting listing:", error);
      setError(error instanceof Error ? error.message : "Failed to delete listing");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (listing: Listing) => {
    setEditingListing(listing);
    setFormData({
      mlsId: listing.mlsId,
      address: listing.address,
      city: listing.city,
      state: listing.state,
      zipCode: listing.zipCode,
      price: listing.price.toString(),
      description: listing.description || "",
      photos: listing.photos || [],
      features: listing.features || [],
      bedrooms: listing.bedrooms?.toString() || "",
      bathrooms: listing.bathrooms?.toString() || "",
      squareFeet: listing.squareFeet?.toString() || "",
      lotSize: listing.lotSize?.toString() || "",
      propertyType: listing.propertyType || "",
      neighborhood: listing.neighborhood || "",
      status: listing.status,
    });
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setFormData({
      mlsId: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      price: "",
      description: "",
      photos: [],
      features: [],
      bedrooms: "",
      bathrooms: "",
      squareFeet: "",
      lotSize: "",
      propertyType: "",
      neighborhood: "",
      status: "active",
    });
    setEditingListing(null);
    setShowCreateForm(false);
  };

  const addFeature = () => {
    const feature = prompt("Enter a feature:");
    if (feature && feature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, feature.trim()]
      }));
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "sold": return "bg-blue-100 text-blue-800";
      case "withdrawn": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = 
      listing.mlsId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.neighborhood?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">MLS Listings</h1>
          <p className="text-gray-600 mt-2">
            Manage your property listings and MLS data
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          {editingListing ? "Update Listing" : "New Listing"}
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingListing ? "Edit Listing" : "Create New Listing"}</CardTitle>
            <CardDescription>
              {editingListing ? "Update the listing information" : "Add a new property listing to your MLS"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mlsId">MLS ID *</Label>
                  <Input
                    id="mlsId"
                    value={formData.mlsId}
                    onChange={(e) => setFormData({...formData, mlsId: e.target.value})}
                    placeholder="Enter MLS number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="withdrawn">Withdrawn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Address Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Street address"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="City"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      placeholder="State"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP *</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                      placeholder="ZIP code"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    step="0.5"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="squareFeet">Square Feet</Label>
                  <Input
                    id="squareFeet"
                    type="number"
                    value={formData.squareFeet}
                    onChange={(e) => setFormData({...formData, squareFeet: e.target.value})}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select value={formData.propertyType} onValueChange={(value) => setFormData({...formData, propertyType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single_family">Single Family</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="multi_family">Multi-Family</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Neighborhood</Label>
                  <Input
                    id="neighborhood"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
                    placeholder="Neighborhood name"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Property description..."
                  rows={4}
                />
              </div>

              {/* Features */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Features</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Feature
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="ml-1 hover:text-red-600"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                  {loading ? "Saving..." : (editingListing ? "Update Listing" : "Create Listing")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search listings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="withdrawn">Withdrawn</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPropertyType} onValueChange={(value: any) => setFilterPropertyType(value)}>
                <SelectTrigger className="w-40">
                  <Home className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="single_family">Single Family</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="multi_family">Multi-Family</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Listings Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Home className="h-5 w-5 mr-2" />
            Property Listings ({filteredListings.length})
          </CardTitle>
          <CardDescription>
            Manage and view all your MLS property listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
              <span className="ml-2">Loading listings...</span>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-8">
              <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterStatus !== "all" || filterPropertyType !== "all"
                  ? "Try adjusting your search or filters"
                  : "Create your first property listing to get started"
                }
              </p>
              {!searchTerm && filterStatus === "all" && filterPropertyType === "all" && (
                <Button onClick={() => setShowCreateForm(true)} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Listing
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <div key={listing.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Listing Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                    <Home className="h-16 w-16 text-purple-400" />
                  </div>

                  {/* Listing Details */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          MLS #{listing.mlsId}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {listing.address}<br />
                          {listing.city}, {listing.state} {listing.zipCode}
                        </p>
                      </div>
                      <Badge className={getStatusColor(listing.status)}>
                        {listing.status}
                      </Badge>
                    </div>

                    {/* Price */}
                    <div className="mb-3">
                      <p className="text-2xl font-bold text-green-600">
                        ${listing.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Property Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                      <div className="text-center">
                        <Bed className="h-4 w-4 mx-auto mb-1 text-gray-500" />
                        <p className="font-medium">{listing.bedrooms || "N/A"}</p>
                        <p className="text-gray-500">Beds</p>
                      </div>
                      <div className="text-center">
                        <Bath className="h-4 w-4 mx-auto mb-1 text-gray-500" />
                        <p className="font-medium">{listing.bathrooms || "N/A"}</p>
                        <p className="text-gray-500">Baths</p>
                      </div>
                      <div className="text-center">
                        <Square className="h-4 w-4 mx-auto mb-1 text-gray-500" />
                        <p className="font-medium">
                          {listing.squareFeet ? `${listing.squareFeet.toLocaleString()}` : "N/A"}
                        </p>
                        <p className="text-gray-500">Sq Ft</p>
                      </div>
                    </div>

                    {/* Property Type & Neighborhood */}
                    <div className="mb-4 text-sm">
                      <p className="text-gray-600">
                        <span className="font-medium">Type:</span> {listing.propertyType.replace("_", " ")}
                      </p>
                      {listing.neighborhood && (
                        <p className="text-gray-600">
                          <span className="font-medium">Area:</span> {listing.neighborhood}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(listing)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/listings/${listing.id}`)}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(listing.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

