'use client'

import { useState, useEffect } from 'react'
import { ServiceList } from '@/components/services/service-list'
import { ServiceForm } from '@/components/services/service-form'
import { ServiceFeatures } from '@/components/services/service-features'
import { ServiceFAQs } from '@/components/services/service-faqs'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle, 
  Loader2,
  Briefcase,
  Star,
  HelpCircle
} from 'lucide-react'
import { Service, CreateServiceRequest, UpdateServiceRequest, ServiceSearchRequest, Category } from '@/types/api'
import { servicesApi } from '@/lib/api/services'
import { categoriesApi } from '@/lib/api/categories'

type ViewMode = 'list' | 'create' | 'edit'

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alert, setAlert] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)
  
  // Dialog states
  const [featuresDialogOpen, setFeaturesDialogOpen] = useState(false)
  const [faqsDialogOpen, setFaqsDialogOpen] = useState(false)

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      await Promise.all([
        loadServices(),
        loadCategories()
      ])
    } catch (error) {
      console.error('Error loading data:', error)
      showAlert('error', 'Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  const loadServices = async () => {
    try {
      const response = await servicesApi.getAll()
      if (response.success && response.data) {
        setServices(response.data)
      } else {
        showAlert('error', response.message || 'Failed to load services')
      }
    } catch (error) {
      console.error('Error loading services:', error)
      showAlert('error', 'Failed to load services')
    }
  }

  const loadCategories = async () => {
    try {
      const response = await categoriesApi.getAll()
      if (response.success && response.data) {
        setCategories(response.data)
      } else {
        showAlert('error', response.message || 'Failed to load categories')
      }
    } catch (error) {
      console.error('Error loading categories:', error)
      showAlert('error', 'Failed to load categories')
    }
  }

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 5000)
  }

  const handleCreate = () => {
    setSelectedService(null)
    setViewMode('create')
  }

  const handleEdit = (service: Service) => {
    setSelectedService(service)
    setViewMode('edit')
  }

  const handleDelete = async (service: Service) => {
    if (!confirm(`Are you sure you want to delete "${service.title}"?`)) {
      return
    }

    try {
      setIsSubmitting(true)
      const response = await servicesApi.delete(service.id)
      if (response.success) {
        setServices(services.filter(s => s.id !== service.id))
        showAlert('success', 'Service deleted successfully')
      } else {
        showAlert('error', response.message || 'Failed to delete service')
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      showAlert('error', 'Failed to delete service')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleActive = async (service: Service) => {
    try {
      const response = await servicesApi.updateActivityStatus(service.id, !service.active)
      if (response.success) {
        setServices(services.map(s => 
          s.id === service.id ? { ...s, active: !s.active } : s
        ))
        showAlert('success', `Service ${!service.active ? 'activated' : 'deactivated'} successfully`)
      } else {
        showAlert('error', response.message || 'Failed to update service status')
      }
    } catch (error) {
      console.error('Error updating service status:', error)
      showAlert('error', 'Failed to update service status')
    }
  }

  const handleFormSubmit = async (data: CreateServiceRequest | UpdateServiceRequest) => {
    try {
      setIsSubmitting(true)
      
      if (viewMode === 'create') {
        // Create new service
        const response = await servicesApi.create(data as CreateServiceRequest)
        if (response.success && response.data) {
          setServices([response.data, ...services])
          showAlert('success', 'Service created successfully')
          setViewMode('list')
        } else {
          showAlert('error', response.message || 'Failed to create service')
        }
      } else if (viewMode === 'edit' && selectedService) {
        // Update existing service
        const response = await servicesApi.update(selectedService.id, data as UpdateServiceRequest)
        if (response.success && response.data) {
          setServices(services.map(s => 
            s.id === selectedService.id ? response.data! : s
          ))
          showAlert('success', 'Service updated successfully')
          setViewMode('list')
        } else {
          showAlert('error', response.message || 'Failed to update service')
        }
      }
    } catch (error) {
      console.error('Error saving service:', error)
      showAlert('error', 'Failed to save service')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setViewMode('list')
    setSelectedService(null)
  }

  const handleManageFeatures = (service: Service) => {
    setSelectedService(service)
    setFeaturesDialogOpen(true)
  }

  const handleManageFAQs = (service: Service) => {
    setSelectedService(service)
    setFaqsDialogOpen(true)
  }

  const handleSearch = async (searchRequest: ServiceSearchRequest) => {
    try {
      setIsLoading(true)
      const response = await servicesApi.search(searchRequest)
      if (response.success && response.data) {
        setServices(response.data)
      } else {
        showAlert('error', response.message || 'Search failed')
      }
    } catch (error) {
      console.error('Error searching services:', error)
      showAlert('error', 'Search failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Services
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {viewMode === 'create' ? 'Create New Service' : 'Edit Service'}
            </h1>
            <p className="text-muted-foreground">
              {viewMode === 'create' 
                ? 'Add a new service to your design agency portfolio'
                : 'Update service information'
              }
            </p>
          </div>
        </div>

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

        {/* Form */}
        <ServiceForm
          service={selectedService || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          isLoading={isSubmitting}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Briefcase className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Service Management</h1>
          <p className="text-muted-foreground">
            Manage your design services, features, and FAQs
          </p>
        </div>
      </div>

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

      {/* Services List */}
      <ServiceList
        services={services}
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        onToggleActive={handleToggleActive}
        onManageFeatures={handleManageFeatures}
        onManageFAQs={handleManageFAQs}
        isLoading={isLoading}
        onSearch={handleSearch}
      />

      {/* Features Dialog */}
      {selectedService && (
        <ServiceFeatures
          service={selectedService}
          isOpen={featuresDialogOpen}
          onClose={() => {
            setFeaturesDialogOpen(false)
            setSelectedService(null)
          }}
        />
      )}

      {/* FAQs Dialog */}
      {selectedService && (
        <ServiceFAQs
          service={selectedService}
          isOpen={faqsDialogOpen}
          onClose={() => {
            setFaqsDialogOpen(false)
            setSelectedService(null)
          }}
        />
      )}
    </div>
  )
}
