export default function HomePage() {
  return (
    <main className="min-h-screen bg-stone-50">
      {/* Hero */}
      <section className="bg-rose-900 text-white py-20 px-6 text-center">
        <p className="text-rose-300 uppercase tracking-widest text-sm mb-3">
          You are cordially invited
        </p>
        <h1 className="text-5xl md:text-6xl font-serif font-light mb-4">
          Marissa &amp; Ross
        </h1>
        <p className="text-rose-200 text-xl font-light">Wedding Celebrations</p>
      </section>

      {/* Welcome */}
      <section className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-serif text-stone-800 mb-6">Welcome</h2>
        <p className="text-stone-600 text-lg leading-relaxed mb-6">
          We are thrilled to celebrate our wedding with you across a series of
          joyful events. Our celebrations blend Indian traditions with our shared
          love story — we can&apos;t wait to share every moment with you.
        </p>
        <p className="text-stone-600 text-lg leading-relaxed">
          This site is your guide to all the festivities. Use your personal RSVP
          link (sent to you by the family) to let us know who from your household
          will be joining us for each event.
        </p>
      </section>

      {/* How it works */}
      <section className="bg-rose-50 py-14 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-serif text-stone-800 text-center mb-10">
            How to RSVP
          </h2>
          <ol className="space-y-6">
            {[
              {
                step: "1",
                title: "Find your invitation",
                body: "Check the card or email you received from the family. It contains a personal link just for your household.",
              },
              {
                step: "2",
                title: "Open your RSVP page",
                body: "Click the link to see all the events your family is invited to, along with details for each one.",
              },
              {
                step: "3",
                title: "Let us know who&apos;s coming",
                body: "Select Attending or Not Attending for each family member at each event, then hit Submit.",
              },
            ].map(({ step, title, body }) => (
              <li key={step} className="flex gap-5">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-900 text-white flex items-center justify-center font-semibold text-lg">
                  {step}
                </span>
                <div>
                  <h3 className="font-semibold text-stone-800 text-lg mb-1">
                    {title}
                  </h3>
                  <p className="text-stone-600">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="text-stone-600 mb-4">
          Already have your personal link? Click it from your invitation to get
          started.
        </p>
        <p className="text-stone-500 text-sm">
          If you cannot find your link, please contact the family directly.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-rose-900 text-rose-200 text-center py-6 text-sm">
        <p>With love — Marissa &amp; Ross</p>
      </footer>
    </main>
  );
}
