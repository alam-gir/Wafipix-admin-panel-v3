'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
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
  Star,
  Loader2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { Service, ServiceFeature } from '@/types/api'
import { servicesApi } from '@/lib/api/services'

interface ServiceFeaturesProps {
  service: Service
  isOpen: boolean
  onClose: () => void
}

export function ServiceFeatures({ service, isOpen, onClose }: ServiceFeaturesProps) {
  const [features, setFeatures] = useState<ServiceFeature[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [alert, setAlert] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  // Load features when dialog opens
  const loadFeatures = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await servicesApi.getFeatures(service.id)
      if (response.success && response.data) {
        setFeatures(response.data)
      } else {
        showAlert('error', response.message || 'Failed to load features')
      }
    } catch (error) {
      console.error('Error loading features:', error)
      showAlert('error', 'Failed to load features')
    } finally {
      setIsLoading(false)
    }
  }, [service.id])

  useEffect(() => {
    if (isOpen) {
      loadFeatures()
    }
  }, [isOpen, service.id, loadFeatures])

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 5000)
  }

  const addFeature = () => {
    setFeatures([...features, { id: null, text: '', highlight: false }])
  }

  const updateFeature = (index: number, field: keyof ServiceFeature, value: string | boolean) => {
    const updatedFeatures = [...features]
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value }
    setFeatures(updatedFeatures)
  }

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  const saveFeatures = async () => {
    try {
      setIsSaving(true)
      
      // Filter out empty features
      const validFeatures = features.filter(feature => feature.text.trim() !== '')
      
      const requestData = {
        serviceId: service.id,
        features: validFeatures.map(feature => ({
          id: feature.id,
          text: feature.text.trim(),
          highlight: feature.highlight
        }))
      }

      const response = await servicesApi.updateFeatures(requestData)
      if (response.success) {
        showAlert('success', 'Features updated successfully')
        // Reload features to get the latest data
        await loadFeatures()
      } else {
        showAlert('error', response.message || 'Failed to update features')
      }
    } catch (error) {
      console.error('Error saving features:', error)
      showAlert('error', 'Failed to save features')
    } finally {
      setIsSaving(false)
    }
  }

  const handleClose = () => {
    setFeatures([])
    setAlert(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span>Manage Features - {service.title}</span>
          </DialogTitle>
          <DialogDescription>
            Add and manage features for this service. Highlighted features will be emphasized in the display.
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

          {/* Features List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Service Features</CardTitle>
                <Button onClick={addFeature} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : features.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No features added yet. Click &quot;Add Feature&quot; to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor={`feature-${index}`}>Feature Text</Label>
                        <Input
                          id={`feature-${index}`}
                          value={feature.text}
                          onChange={(e) => updateFeature(index, 'text', e.target.value)}
                          placeholder="Enter feature description"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={feature.highlight}
                          onCheckedChange={(checked) => updateFeature(index, 'highlight', checked)}
                        />
                        <Label className="text-sm">Highlight</Label>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3">
            <Button variant="outline" onClick={handleClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={saveFeatures} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Features
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
