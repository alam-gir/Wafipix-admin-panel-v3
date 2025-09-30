import { UnderConstruction } from '@/components/ui/under-construction'

export default function NotFound() {
  return (
    <UnderConstruction 
      title="Page Not Found"
      message="The page you're looking for doesn't exist or is still under development."
      showBackButton={true}
    />
  )
}
