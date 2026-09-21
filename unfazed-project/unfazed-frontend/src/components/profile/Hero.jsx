export default function Hero({ therapist }) {
  return (
    <section className="border-b border-line">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-moss-600 text-sm mb-3">{therapist.languages?.join(' · ')}</p>
        <h1 className="font-serif text-4xl leading-tight mb-4">{therapist.name}</h1>
        <p className="text-ink/70 text-lg max-w-xl">{therapist.bio}</p>
      </div>
    </section>
  );
}
