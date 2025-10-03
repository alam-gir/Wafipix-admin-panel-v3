'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  Plus, 
  Trash2, 
  Save, 
  Package,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Edit
} from 'lucide-react'
import { Service, Package as ServicePackage, CreatePackageRequest, UpdatePackageRequest, Pricing, Feature } from '@/types/api'
import { servicesApi } from '@/lib/api/services'

interface ServicePackagesProps {
  service: Service
  isOpen: boolean
  onClose: () => void
}

export function ServicePackages({ service, isOpen, onClose }: ServicePackagesProps) {
  const [packages, setPackages] = useState<ServicePackage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editingPackage, setEditingPackage] = useState<ServicePackage | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [alert, setAlert] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  // Form state
  const [formData, setFormData] = useState<CreatePackageRequest | UpdatePackageRequest>({
    serviceId: service.id,
    title: '',
    subtitle: '',
    pricing: {
      usd: 0,
      bdt: 0
    },
    features: [],
    status: 'ACTIVE',
    deliveryTime: '',
    advancePercentage: 0,
    popular: false
  })

  const loadPackages = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await servicesApi.getPackagesByServiceId(service.id)
      if (response.success && response.data) {
        setPackages(response.data)
      } else {
        showAlert('error', response.message || 'Failed to load packages')
      }
    } catch (error) {
      console.error('Error loading packages:', error)
      showAlert('error', 'Failed to load packages')
    } finally {
      setIsLoading(false)
    }
  }, [service.id])

  // Load packages when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadPackages()
    }
  }, [isOpen, service.id, loadPackages])

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 5000)
  }

  const resetForm = () => {
    setFormData({
      serviceId: service.id,
      title: '',
      subtitle: '',
      pricing: {
        usd: 0,
        bdt: 0
      },
      features: [],
      status: 'ACTIVE',
      deliveryTime: '',
      advancePercentage: 0,
      popular: false
    })
    setEditingPackage(null)
    setIsCreating(false)
  }

  const handleCreate = () => {
    resetForm()
    setIsCreating(true)
  }

  const handleEdit = (pkg: ServicePackage) => {
    setFormData({
      serviceId: pkg.serviceId,
      title: pkg.title,
      subtitle: pkg.subtitle || '',
      pricing: pkg.pricing,
      features: pkg.features,
      status: pkg.status,
      deliveryTime: pkg.deliveryTime || '',
      advancePercentage: pkg.advancePercentage || 0,
      popular: pkg.popular || false
    })
    setEditingPackage(pkg)
    setIsCreating(false)
  }

  const handleCancel = () => {
    resetForm()
  }

  const updateFormData = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updatePricing = (field: keyof Pricing, value: number) => {
    setFormData(prev => ({
      ...prev,
      pricing: { 
        usd: prev.pricing?.usd || 0, 
        bdt: prev.pricing?.bdt || 0, 
        [field]: value 
      }
    }))
  }

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...(prev.features || []), { text: '', highlight: false }]
    }))
  }

  const updateFeature = (index: number, field: keyof Feature, value: string | boolean) => {
    setFormData(prev => {
      const updatedFeatures = [...(prev.features || [])]
      updatedFeatures[index] = { ...updatedFeatures[index], [field]: value }
      return { ...prev, features: updatedFeatures }
    })
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index)
    }))
  }

  const savePackage = async () => {
    try {
      setIsSaving(true)
      
      if (editingPackage) {
        // Update existing package
        const response = await servicesApi.updatePackage(editingPackage.id, formData as UpdatePackageRequest)
        if (response.success && response.data) {
          setPackages(packages.map(p => p.id === editingPackage.id ? response.data! : p))
          showAlert('success', 'Package updated successfully')
          resetForm()
        } else {
          showAlert('error', response.message || 'Failed to update package')
        }
      } else {
        // Create new package
        const response = await servicesApi.createPackage(formData as CreatePackageRequest)
        if (response.success && response.data) {
          setPackages([response.data, ...packages])
          showAlert('success', 'Package created successfully')
          resetForm()
        } else {
          showAlert('error', response.message || 'Failed to create package')
        }
      }
    } catch (error) {
      console.error('Error saving package:', error)
      showAlert('error', 'Failed to save package')
    } finally {
      setIsSaving(false)
    }
  }

  const deletePackage = async (packageId: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return

    try {
      const response = await servicesApi.deletePackage(packageId)
      if (response.success) {
        setPackages(packages.filter(p => p.id !== packageId))
        showAlert('success', 'Package deleted successfully')
      } else {
        showAlert('error', response.message || 'Failed to delete package')
      }
    } catch (error) {
      console.error('Error deleting package:', error)
      showAlert('error', 'Failed to delete package')
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-blue-500" />
            <span>Manage Packages - {service.title}</span>
          </DialogTitle>
          <DialogDescription>
            Create and manage pricing packages for this service. Each package can have different features and pricing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Alert */}
          {alert && (
            <Alert variant={alert.type === 'error' ? 'destructive' : 'default'}>
              {alert.type === 'error' ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          )}

          {/* Packages List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Packages ({packages.length})</CardTitle>
                <Button onClick={handleCreate} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Package
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : packages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No packages found. Create your first package to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{pkg.title}</h3>
                            {pkg.popular && (
                              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                Popular
                              </span>
                            )}
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              pkg.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                              pkg.status === 'FEATURED' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {pkg.status}
                            </span>
                          </div>
                          {pkg.subtitle && (
                            <p className="text-sm text-muted-foreground mt-1">{pkg.subtitle}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-2 text-sm">
                            <span className="font-medium">
                              ${pkg.pricing.usd} USD / {pkg.pricing.bdt} BDT
                            </span>
                            {pkg.deliveryTime && (
                              <span className="text-muted-foreground">
                                Delivery: {pkg.deliveryTime}
                              </span>
                            )}
                            {pkg.advancePercentage && (
                              <span className="text-muted-foreground">
                                Advance: {pkg.advancePercentage}%
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(pkg)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deletePackage(pkg.id)}
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

          {/* Package Form */}
          {(isCreating || editingPackage) && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingPackage ? 'Edit Package' : 'Create New Package'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => updateFormData('title', e.target.value)}
                      placeholder="Package title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      value={formData.subtitle}
                      onChange={(e) => updateFormData('subtitle', e.target.value)}
                      placeholder="Package subtitle"
                    />
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <h4 className="font-medium">Pricing</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="usd">USD Price *</Label>
                      <Input
                        id="usd"
                        type="number"
                        value={formData.pricing?.usd || 0}
                        onChange={(e) => updatePricing('usd', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bdt">BDT Price *</Label>
                      <Input
                        id="bdt"
                        type="number"
                        value={formData.pricing?.bdt || 0}
                        onChange={(e) => updatePricing('bdt', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => updateFormData('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="FEATURED">Featured</SelectItem>
                        <SelectItem value="COMING_SOON">Coming Soon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="deliveryTime">Delivery Time</Label>
                    <Input
                      id="deliveryTime"
                      value={formData.deliveryTime}
                      onChange={(e) => updateFormData('deliveryTime', e.target.value)}
                      placeholder="e.g., 7-10 days"
                    />
                  </div>
                  <div>
                    <Label htmlFor="advancePercentage">Advance Percentage</Label>
                    <Input
                      id="advancePercentage"
                      type="number"
                      value={formData.advancePercentage}
                      onChange={(e) => updateFormData('advancePercentage', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Popular Toggle */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="popular"
                    checked={formData.popular}
                    onCheckedChange={(checked) => updateFormData('popular', checked)}
                  />
                  <Label htmlFor="popular">Mark as Popular</Label>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Features</h4>
                    <Button onClick={addFeature} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Feature
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {(formData.features || []).map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={feature.text}
                          onChange={(e) => updateFeature(index, 'text', e.target.value)}
                          placeholder="Feature description"
                          className="flex-1"
                        />
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={feature.highlight}
                            onCheckedChange={(checked) => updateFeature(index, 'highlight', checked)}
                          />
                          <Label className="text-sm">Highlight</Label>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFeature(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-2">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={savePackage} disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {editingPackage ? 'Update Package' : 'Create Package'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
