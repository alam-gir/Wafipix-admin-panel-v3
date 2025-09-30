import { UnderConstruction } from '@/components/ui/under-construction'

export default function PaymentSettingsPage() {
  return (
    <UnderConstruction 
      title="Payment Settings"
      message="The payment settings system is currently under development. This will include payment gateway configuration, tax settings, and billing preferences."
      showBackButton={true}
    />
  )
}
