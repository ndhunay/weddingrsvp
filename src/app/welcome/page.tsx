export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-serif text-stone-800 mb-4">
        Marissa &amp; Ross
      </h1>
      <p className="text-stone-600 text-lg mb-8 max-w-md">
        To access your personal invitation, please use the unique link sent to
        your household. If you can&apos;t find it, reach out to the family
        directly.
      </p>
      <div className="w-16 h-px bg-rose-300" />
      <p className="text-stone-400 text-sm mt-8">
        With love — Marissa &amp; Ross
      </p>
    </main>
  );
}
