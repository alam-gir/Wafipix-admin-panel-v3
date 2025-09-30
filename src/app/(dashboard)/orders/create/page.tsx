import { UnderConstruction } from '@/components/ui/under-construction'

export default function CreateNewOrderPage() {
  return (
    <UnderConstruction 
      title="Create New Order"
      message="The order creation system is currently under development. This will allow you to create new orders, select products/services, and manage customer details."
      showBackButton={true}
    />
  )
}
