import PaymentForm from "@/components/payment-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-7xl">
        <PaymentForm />
      </div>
    </main>
  )
}

