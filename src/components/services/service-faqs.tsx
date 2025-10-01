'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
  HelpCircle,
  Loader2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { Service, ServiceFAQ } from '@/types/api'
import { servicesApi } from '@/lib/api/services'

interface ServiceFAQsProps {
  service: Service
  isOpen: boolean
  onClose: () => void
}

export function ServiceFAQs({ service, isOpen, onClose }: ServiceFAQsProps) {
  const [faqs, setFaqs] = useState<ServiceFAQ[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [alert, setAlert] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  // Load FAQs when dialog opens
  const loadFAQs = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await servicesApi.getFAQs(service.id)
      if (response.success && response.data) {
        setFaqs(response.data)
      } else {
        showAlert('error', response.message || 'Failed to load FAQs')
      }
    } catch (error) {
      console.error('Error loading FAQs:', error)
      showAlert('error', 'Failed to load FAQs')
    } finally {
      setIsLoading(false)
    }
  }, [service.id])

  useEffect(() => {
    if (isOpen) {
      loadFAQs()
    }
  }, [isOpen, service.id, loadFAQs])

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 5000)
  }

  const addFAQ = () => {
    setFaqs([...faqs, { id: null, question: '', answer: '' }])
  }

  const updateFAQ = (index: number, field: keyof ServiceFAQ, value: string) => {
    const updatedFAQs = [...faqs]
    updatedFAQs[index] = { ...updatedFAQs[index], [field]: value }
    setFaqs(updatedFAQs)
  }

  const removeFAQ = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index))
  }

  const saveFAQs = async () => {
    try {
      setIsSaving(true)
      
      // Filter out empty FAQs
      const validFAQs = faqs.filter(faq => 
        faq.question.trim() !== '' && faq.answer.trim() !== ''
      )
      
      const requestData = {
        serviceId: service.id,
        faqs: validFAQs.map(faq => ({
          id: faq.id,
          question: faq.question.trim(),
          answer: faq.answer.trim()
        }))
      }

      const response = await servicesApi.updateFAQs(requestData)
      if (response.success) {
        showAlert('success', 'FAQs updated successfully')
        // Reload FAQs to get the latest data
        await loadFAQs()
      } else {
        showAlert('error', response.message || 'Failed to update FAQs')
      }
    } catch (error) {
      console.error('Error saving FAQs:', error)
      showAlert('error', 'Failed to save FAQs')
    } finally {
      setIsSaving(false)
    }
  }

  const handleClose = () => {
    setFaqs([])
    setAlert(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5 text-blue-500" />
            <span>Manage FAQs - {service.title}</span>
          </DialogTitle>
          <DialogDescription>
            Add and manage frequently asked questions for this service.
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

          {/* FAQs List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
                <Button onClick={addFAQ} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add FAQ
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : faqs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No FAQs added yet. Click &quot;Add FAQ&quot; to get started.
                </div>
              ) : (
                <div className="space-y-6">
                  {faqs.map((faq, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm text-muted-foreground">
                          FAQ #{index + 1}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFAQ(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`question-${index}`}>Question</Label>
                        <Input
                          id={`question-${index}`}
                          value={faq.question}
                          onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                          placeholder="Enter the question"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`answer-${index}`}>Answer</Label>
                        <Textarea
                          id={`answer-${index}`}
                          value={faq.answer}
                          onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                          placeholder="Enter the answer"
                          rows={3}
                        />
                      </div>
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
            <Button onClick={saveFAQs} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save FAQs
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
