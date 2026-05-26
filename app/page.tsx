import PetForm from '@/components/pet/PetForm'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-gray-900">🐾 Pet Diet Planner</h1>
          <p className="text-sm text-gray-500 mt-1">AAFCO veterinary nutrition standards · AI meal guidance</p>
        </div>
        <PetForm />
      </div>
    </main>
  )
}