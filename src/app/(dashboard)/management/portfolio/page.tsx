'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { portfolioApi } from '@/lib/api/portfolio'
import { servicesApi } from '@/lib/api/services'
import { WorkListResponse, WorkResponse, CreateWorkRequest, UpdateWorkRequest, Service } from '@/types/api'
import { WorkForm } from '@/components/portfolio/work-form'
import { WorkList } from '@/components/portfolio/work-list'
import { AxiosProgressEvent } from 'axios'

export default function PortfolioPage() {
  const [works, setWorks] = useState<WorkListResponse[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingWork, setEditingWork] = useState<WorkResponse | null>(null)

  const loadWorks = useCallback(async () => {
    try {
      setLoading(true)
      const response = await portfolioApi.getAll(currentPage, 10)
      if (response.success && response.data) {
        // Handle Spring Boot Page structure
        const worksData = response.data.content || response.data
        setWorks(Array.isArray(worksData) ? worksData : [])
        
        // Handle pagination from Spring Boot Page structure
        if (response.data.totalPages) {
          setTotalPages(response.data.totalPages)
        } else if (response.pagination) {
          setTotalPages(Math.ceil(response.pagination.totalElements / response.pagination.size))
        }
      }
    } catch (error) {
      console.error('Failed to load works:', error)
      toast.error('Failed to load works')
    } finally {
      setLoading(false)
    }
  }, [currentPage])

  const loadServices = useCallback(async () => {
    try {
      const response = await servicesApi.getAll()
      if (response.success && response.data) {
        setServices(Array.isArray(response.data) ? response.data : [])
      }
    } catch (error) {
      console.error('Failed to load services:', error)
    }
  }, [])

  // Load data on component mount
  useEffect(() => {
    loadWorks()
    loadServices()
  }, [loadWorks, loadServices])

  const handleCreate = async (data: CreateWorkRequest, config?: { onUploadProgress?: (progressEvent: AxiosProgressEvent) => void }) => {
    try {
      setIsSubmitting(true)
      const response = await portfolioApi.create(data, config)
      if (response.success && response.data) {
        setWorks(prev => [response.data!, ...prev])
        toast.success('Work created successfully')
        setIsFormModalOpen(false)
      }
    } catch (error) {
      console.error('Failed to create work:', error)
      toast.error('Failed to create work')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async (data: UpdateWorkRequest, config?: { onUploadProgress?: (progressEvent: AxiosProgressEvent) => void }) => {
    if (!editingWork) return

    try {
      setIsSubmitting(true)
      const response = await portfolioApi.update(editingWork.id, data, config)
      if (response.success && response.data) {
        setWorks(prev => 
          prev.map(work => 
            work.id === editingWork.id ? { ...work, ...response.data! } : work
          )
        )
        setEditingWork(response.data)
        toast.success('Work updated successfully')
        setIsFormModalOpen(false)
      }
    } catch (error) {
      console.error('Failed to update work:', error)
      toast.error('Failed to update work')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      const response = await portfolioApi.updateActivityStatus(id, active)
      if (response.success && response.data) {
        setWorks(prev => 
          prev.map(work => 
            work.id === id ? { ...work, active: response.data!.active } : work
          )
        )
        toast.success(`Work ${active ? 'activated' : 'deactivated'} successfully`)
      }
    } catch (error) {
      console.error('Failed to update work status:', error)
      toast.error('Failed to update work status')
    }
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this work? This action cannot be undone.'
    )

    if (!confirmed) return

    try {
      await portfolioApi.delete(id)
      setWorks(prev => prev.filter(work => work.id !== id))
      toast.success('Work deleted successfully')
      
    } catch (error) {
      console.error('Failed to delete work:', error)
      toast.error('Failed to delete work')
    }
  }

  const handleEdit = async (work: WorkListResponse) => {
    try {
      const response = await portfolioApi.getById(work.id)
      if (response.success && response.data) {
        setEditingWork(response.data)
        setIsFormModalOpen(true)
      }
    } catch (error) {
      console.error('Failed to load work details:', error)
      toast.error('Failed to load work details')
    }
  }

  const handleAddNew = () => {
    setEditingWork(null)
    setIsFormModalOpen(true)
  }

  const handleCloseForm = () => {
    setEditingWork(null)
    setIsFormModalOpen(false)
  }

  const handleFormSubmit = async (data: CreateWorkRequest | UpdateWorkRequest) => {
    if (editingWork) {
      await handleUpdate(data as UpdateWorkRequest)
    } else {
      await handleCreate(data as CreateWorkRequest)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Portfolio</h1>
          <p className="text-muted-foreground">
            Manage your portfolio works and galleries
          </p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Work
        </Button>
      </div>

      {/* Work List */}
          <WorkList
            works={works}
            services={services}
            loading={loading}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
            isSubmitting={isSubmitting}
          />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}

      {/* Work Form Modal */}
      <WorkForm
        work={editingWork || undefined}
        services={services}
        isOpen={isFormModalOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
      />

    </div>
  )
}
