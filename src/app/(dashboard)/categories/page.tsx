'use client'

import { useState, useEffect } from 'react'
import { CategoryList } from '@/components/categories/category-list'
import { CategoryForm } from '@/components/categories/category-form'
import { Button } from '@/components/ui/button'
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
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle, 
  Loader2,
  FolderOpen
} from 'lucide-react'
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/api'
import { categoriesApi } from '@/lib/api/categories'

type ViewMode = 'list' | 'create' | 'edit'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alert, setAlert] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  // Load categories on component mount
  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setIsLoading(true)
      const response = await categoriesApi.getAll()
      if (response.success && response.data) {
        setCategories(response.data)
      } else {
        showAlert('error', response.message || 'Failed to load categories')
      }
    } catch (error) {
      console.error('Error loading categories:', error)
      showAlert('error', 'Failed to load categories')
    } finally {
      setIsLoading(false)
    }
  }

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 5000)
  }

  const handleCreate = () => {
    setSelectedCategory(null)
    setViewMode('create')
  }

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setViewMode('edit')
  }

  const handleDelete = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete "${category.title}"?`)) {
      return
    }

    try {
      setIsSubmitting(true)
      const response = await categoriesApi.delete(category.id)
      if (response.success) {
        setCategories(categories.filter(c => c.id !== category.id))
        showAlert('success', 'Category deleted successfully')
      } else {
        showAlert('error', response.message || 'Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      showAlert('error', 'Failed to delete category')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFormSubmit = async (data: CreateCategoryRequest | UpdateCategoryRequest) => {
    try {
      setIsSubmitting(true)
      
      if (viewMode === 'create') {
        // Create new category
        const response = await categoriesApi.create(data)
        if (response.success && response.data) {
          setCategories([response.data, ...categories])
          showAlert('success', 'Category created successfully')
          setViewMode('list')
        } else {
          showAlert('error', response.message || 'Failed to create category')
        }
      } else if (viewMode === 'edit' && selectedCategory) {
        // Update existing category
        const response = await categoriesApi.update(selectedCategory.id, data)
        if (response.success && response.data) {
          setCategories(categories.map(c => 
            c.id === selectedCategory.id ? response.data! : c
          ))
          showAlert('success', 'Category updated successfully')
          setViewMode('list')
        } else {
          showAlert('error', response.message || 'Failed to update category')
        }
      }
    } catch (error) {
      console.error('Error saving category:', error)
      showAlert('error', 'Failed to save category')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setViewMode('list')
    setSelectedCategory(null)
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
            Back to Categories
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {viewMode === 'create' ? 'Create New Category' : 'Edit Category'}
            </h1>
            <p className="text-muted-foreground">
              {viewMode === 'create' 
                ? 'Add a new category to organize your design services'
                : 'Update category information'
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
        <CategoryForm
          category={selectedCategory || undefined}
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
          <FolderOpen className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Category Management</h1>
          <p className="text-muted-foreground">
            Organize your design services with categories
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

      {/* Categories List */}
      <CategoryList
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        isLoading={isLoading}
      />
    </div>
  )
}
