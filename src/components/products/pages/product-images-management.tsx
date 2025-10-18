/**
 * Product Images Management Component - Dedicated component for managing product images
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Save, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  useUpdateProductProfileImage,
  useAddProductImages,
  useRemoveProductImages,
  useAddProductDescriptionImages,
  useRemoveProductDescriptionImages
} from '@/lib/query/hooks/product-mutations';
import type { Product } from '@/lib/api/types/product';

interface ProductImagesManagementProps {
  product: Product;
  onUpdate?: () => void;
}

export const ProductImagesManagement: React.FC<ProductImagesManagementProps> = ({ 
  product, 
  onUpdate 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [newProfileFile, setNewProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [newProductFiles, setNewProductFiles] = useState<File[]>([]);
  const [newDescriptionFiles, setNewDescriptionFiles] = useState<File[]>([]);
  const [productPreviews, setProductPreviews] = useState<string[]>([]);
  const [descriptionPreviews, setDescriptionPreviews] = useState<string[]>([]);

  // API mutations
  const updateProfileImageMutation = useUpdateProductProfileImage();
  const addProductImagesMutation = useAddProductImages();
  const removeProductImagesMutation = useRemoveProductImages();
  const addDescriptionImagesMutation = useAddProductDescriptionImages();
  const removeDescriptionImagesMutation = useRemoveProductDescriptionImages();

  // Placeholder image as base64 SVG
  const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02NCA0MEM3Mi44MzY2IDQwIDgwIDQ3LjE2MzQgODAgNTZDODAgNjQuODM2NiA3Mi44MzY2IDcyIDY0IDcyQzU1LjE2MzQgNzIgNDggNjQuODM2NiA0OCA1NkM0OCA0Ny4xNjM0IDU1LjE2MzQgNDAgNjQgNDBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik02NCA4OEM3Mi44MzY2IDg4IDgwIDk1LjE2MzQgODAgMTA0QzgwIDExMi44MzcgNzIuODM2NiAxMjAgNjQgMTIwQzU1LjE2MzQgMTIwIDQ4IDExMi44MzcgNDggMTA0QzQ4IDk1LjE2MzQgNTUuMTYzNCA4OCA2NCA4OFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cg==';

  const handleImageUpload = async (type: 'product' | 'description', files: FileList) => {
    const fileArray = Array.from(files);
    const previews = fileArray.map(file => URL.createObjectURL(file));
    
    if (type === 'product') {
      setNewProductFiles(prev => [...prev, ...fileArray]);
      setProductPreviews(prev => [...prev, ...previews]);
    } else {
      setNewDescriptionFiles(prev => [...prev, ...fileArray]);
      setDescriptionPreviews(prev => [...prev, ...previews]);
    }
    
    setIsUploading(true);
    try {
      if (type === 'product') {
        await addProductImagesMutation.mutateAsync({ productId: product.id, imageFiles: fileArray });
        setNewProductFiles([]);
        setProductPreviews([]);
      } else {
        await addDescriptionImagesMutation.mutateAsync({ productId: product.id, imageFiles: fileArray });
        setNewDescriptionFiles([]);
        setDescriptionPreviews([]);
      }
      onUpdate?.();
    } catch (error) {
      console.error('Failed to upload images:', error);
      // Remove previews on error
      if (type === 'product') {
        setNewProductFiles(prev => prev.filter((_, i) => i >= prev.length - fileArray.length));
        setProductPreviews(prev => prev.filter((_, i) => i >= prev.length - fileArray.length));
      } else {
        setNewDescriptionFiles(prev => prev.filter((_, i) => i >= prev.length - fileArray.length));
        setDescriptionPreviews(prev => prev.filter((_, i) => i >= prev.length - fileArray.length));
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageDelete = async (type: 'profile' | 'product' | 'description', imageUrl: string) => {
    const confirmMessage = `Are you sure you want to delete this ${type} image?`;
    if (window.confirm(confirmMessage)) {
      try {
        if (type === 'product') {
          await removeProductImagesMutation.mutateAsync({ productId: product.id, imageUrls: [imageUrl] });
        } else if (type === 'description') {
          await removeDescriptionImagesMutation.mutateAsync({ 
            productId: product.id, 
            descriptionImageUrls: [imageUrl] 
          });
        }
        onUpdate?.();
      } catch (error) {
        console.error('Failed to delete image:', error);
      }
    }
  };

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setEditingProfile(true);
      setNewProfileFile(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfileImage = async () => {
    if (newProfileFile) {
      try {
        await updateProfileImageMutation.mutateAsync({ productId: product.id, imageFile: newProfileFile });
        setEditingProfile(false);
        setNewProfileFile(null);
        setProfilePreview(null);
        onUpdate?.();
      } catch (error) {
        console.error('Failed to save profile image:', error);
      }
    }
  };

  const handleCancelProfileEdit = () => {
    setEditingProfile(false);
    setNewProfileFile(null);
    setProfilePreview(null);
  };

  const renderProfileImageSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Main Product Image</h3>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group">
          <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
            <img
              src={profilePreview || product.profileImage || placeholderImage}
              alt="Profile Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                console.log('Profile image failed to load:', e.currentTarget.src);
                e.currentTarget.src = placeholderImage;
              }}
              onLoad={() => {
                console.log('Profile image loaded successfully');
              }}
            />
          </div>
          
          {!editingProfile && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                  id="profile-upload"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => document.getElementById('profile-upload')?.click()}
                  className="flex items-center gap-1 shadow-lg"
                >
                  <Edit className="h-3 w-3" />
                  Change
                </Button>
              </div>
            </div>
          )}
        </div>

        {editingProfile && (
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              onClick={handleSaveProfileImage}
              disabled={!newProfileFile || updateProfileImageMutation.isPending}
              className="flex items-center gap-1"
            >
              <Save className="h-3 w-3" />
              {updateProfileImageMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancelProfileEdit}
              className="flex items-center gap-1"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const renderImageSection = (
    title: string,
    type: 'product' | 'description',
    images: string[],
    isSingleColumn: boolean = false
  ) => {
    // const newFiles = type === 'product' ? newProductFiles : newDescriptionFiles;
    const previews = type === 'product' ? productPreviews : descriptionPreviews;
    const allImages = [...images, ...previews];
    const totalImages = allImages.length;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{title}</h3>
          <Badge variant="outline">{totalImages} images</Badge>
        </div>

        <div className={cn(
          isSingleColumn ? "space-y-0" : "grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        )}>
          {allImages.map((imageUrl, index) => {
            const isPreview = index >= images.length;
            // const isNewFile = isPreview;
            
            return (
              <div key={index} className={cn(
                "relative group",
                isSingleColumn ? "w-full" : ""
              )}>
                <div className={cn(
                  isSingleColumn ? "w-full" : "rounded-lg overflow-hidden border aspect-square"
                )}>
                  <img
                    src={imageUrl}
                    alt={`${title} ${index + 1}`}
                    className={cn(
                      isSingleColumn ? "w-full h-auto" : "object-cover w-full h-full"
                    )}
                    onError={(e) => {
                      console.log('Image failed to load:', e.currentTarget.src);
                      e.currentTarget.src = placeholderImage;
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', imageUrl);
                    }}
                  />
                </div>
                
                {/* Preview Badge */}
                {isPreview && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="text-xs">New</Badge>
                  </div>
                )}
                
                {/* Action Buttons - Top right corner like description images */}
                {!isSingleColumn && (
                  <div className="absolute top-2 right-2">
                    <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (isPreview) {
                            // Remove from previews
                            if (type === 'product') {
                              const previewIndex = index - images.length;
                              setProductPreviews(prev => prev.filter((_, i) => i !== previewIndex));
                              setNewProductFiles(prev => prev.filter((_, i) => i !== previewIndex));
                            } else {
                              const previewIndex = index - images.length;
                              setDescriptionPreviews(prev => prev.filter((_, i) => i !== previewIndex));
                              setNewDescriptionFiles(prev => prev.filter((_, i) => i !== previewIndex));
                            }
                          } else {
                            handleImageDelete(type, imageUrl);
                          }
                        }}
                        className="h-6 w-6 p-0 shadow-lg"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Description Image Actions - Always visible on mobile, hover on desktop */}
                {isSingleColumn && (
                  <div className="absolute top-2 right-2">
                    <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (isPreview) {
                            // Remove from previews
                            const previewIndex = index - images.length;
                            setDescriptionPreviews(prev => prev.filter((_, i) => i !== previewIndex));
                            setNewDescriptionFiles(prev => prev.filter((_, i) => i !== previewIndex));
                          } else {
                            handleImageDelete(type, imageUrl);
                          }
                        }}
                        className="h-6 w-6 p-0 shadow-lg"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Upload Area - Always visible */}
          <div className={cn(
            isSingleColumn ? "w-full h-32 border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors" : "rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors aspect-square"
          )}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => e.target.files && handleImageUpload(type, e.target.files)}
              className="hidden"
              id={`upload-${type}-empty`}
              disabled={isUploading}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => document.getElementById(`upload-${type}-empty`)?.click()}
              disabled={isUploading}
              className="flex flex-col items-center gap-1 h-full w-full"
            >
              <Upload className="h-6 w-6 text-gray-400" />
              <span className="text-xs text-gray-500">Add Image</span>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Profile Image */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Image</CardTitle>
        </CardHeader>
        <CardContent>
          {renderProfileImageSection()}
        </CardContent>
      </Card>

      {/* Product Images */}
      <Card>
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
        </CardHeader>
        <CardContent>
          {renderImageSection(
            'Additional Product Images',
            'product',
            product.images || [],
            false
          )}
        </CardContent>
      </Card>

      {/* Description Images */}
      <Card>
        <CardHeader>
          <CardTitle>Description Images</CardTitle>
        </CardHeader>
        <CardContent>
          {renderImageSection(
            'Images for Product Description',
            'description',
            product.descriptionImages || [],
            true
          )}
        </CardContent>
      </Card>
    </div>
  );
};
