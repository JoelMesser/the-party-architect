import { useState, type FormEvent } from 'react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  destination: string;
  dates: string;
  groupSize: string;
  activityBudget: string;
  housingBudget: string;
  vibe: string;
  details: string;
  website: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  destination: '',
  dates: '',
  groupSize: '',
  activityBudget: '',
  housingBudget: '',
  vibe: '',
  details: '',
  website: '',
};

const budgetOptions = [
  'Under $500/person',
  '$500\u2013$1,000/person',
  '$1,000\u2013$2,000/person',
  '$2,000+/person',
  'Not sure yet',
];

const vibeOptions = [
  { label: 'Chill & low-key', emoji: '\u2601\uFE0F' },
  { label: 'Classic & classy', emoji: '\u2728' },
  { label: 'Full send', emoji: '\uD83C\uDF89' },
  { label: 'Surprise me', emoji: '\uD83C\uDF1F' },
];

const inputClass =
  'w-full bg-white/50 backdrop-blur-sm border border-champagne/30 rounded-xl px-5 py-3.5 text-ink placeholder-muted/40 focus:ring-2 focus:ring-rose/30 focus:border-rose/50 outline-none transition-all duration-200 font-sans text-base';

const labelClass = 'block font-sans text-sm font-medium text-ink/80 mb-2.5 tracking-wide';

export default function InquiryForm() {
  const [form, setForm] = useState<FormData>(initialFormData);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Enter a valid email';
    if (!form.phone.trim()) newErrors.phone = 'Phone is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    if (form.website) {
      setStatus('success');
      return;
    }

    setStatus('submitting');

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('success');
      }
    } catch {
      setStatus('success');
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-sage/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="font-display text-3xl md:text-4xl text-ink mb-4">Got it!</p>
        <p className="font-sans text-lg text-muted leading-relaxed max-w-sm mx-auto">
          I'll be in touch within 48 hours. In the meantime, check out{' '}
          <a href="https://instagram.com/__thepartyarchitect" target="_blank" rel="noopener noreferrer" className="text-rose hover:text-rose-dark transition-colors underline underline-offset-2">
            my Instagram
          </a>{' '}
          for past weekend inspo.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7" noValidate>
      {/* Honeypot */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off"
          value={form.website} onChange={(e) => handleChange('website', e.target.value)} />
      </div>

      {/* Name + Email row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name <span className="text-rose">*</span>
          </label>
          <input type="text" id="name" className={inputClass} placeholder="Your name"
            value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
          {errors.name && <p className="text-rose text-xs mt-1.5 font-medium">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email <span className="text-rose">*</span>
          </label>
          <input type="email" id="email" className={inputClass} placeholder="you@email.com"
            value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
          {errors.email && <p className="text-rose text-xs mt-1.5 font-medium">{errors.email}</p>}
        </div>
      </div>

      {/* Phone + Group Size row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone <span className="text-rose">*</span>
          </label>
          <input type="tel" id="phone" className={inputClass} placeholder="(555) 123-4567"
            value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
          {errors.phone && <p className="text-rose text-xs mt-1.5 font-medium">{errors.phone}</p>}
        </div>
        <div>
          <label htmlFor="groupSize" className={labelClass}>Group Size</label>
          <input type="text" id="groupSize" className={inputClass} placeholder="How many people?"
            value={form.groupSize} onChange={(e) => handleChange('groupSize', e.target.value)} />
        </div>
      </div>

      {/* Destination + Dates row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="destination" className={labelClass}>Destination</label>
          <input type="text" id="destination" className={inputClass}
            placeholder="City or 'help me decide'"
            value={form.destination} onChange={(e) => handleChange('destination', e.target.value)} />
        </div>
        <div>
          <label htmlFor="dates" className={labelClass}>Dates</label>
          <input type="text" id="dates" className={inputClass} placeholder="Approximate month or dates"
            value={form.dates} onChange={(e) => handleChange('dates', e.target.value)} />
        </div>
      </div>

      {/* Vibe — visual selector */}
      <div>
        <label className={labelClass}>What's the vibe?</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {vibeOptions.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => handleChange('vibe', option.label)}
              className={`flex flex-col items-center gap-2 px-4 py-5 rounded-2xl border text-sm font-sans transition-all duration-200
                ${form.vibe === option.label
                  ? 'border-rose bg-rose/10 text-ink shadow-sm'
                  : 'border-champagne/30 bg-white/30 text-muted hover:border-champagne/60 hover:bg-white/50'
                }`}
            >
              <span className="text-2xl">{option.emoji}</span>
              <span className="font-medium text-xs text-center leading-tight">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Budget — compact row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
        <div>
          <label className={labelClass}>Activity Budget</label>
          <div className="space-y-2">
            {budgetOptions.map((option) => (
              <button
                key={`activity-${option}`}
                type="button"
                onClick={() => handleChange('activityBudget', option)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm font-sans font-medium transition-all duration-200 text-left
                  ${form.activityBudget === option
                    ? 'border-rose bg-rose/10 text-ink'
                    : 'border-champagne/20 bg-white/30 text-muted hover:border-champagne/50'
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className={labelClass}>Housing Budget</label>
          <div className="space-y-2">
            {budgetOptions.map((option) => (
              <button
                key={`housing-${option}`}
                type="button"
                onClick={() => handleChange('housingBudget', option)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm font-sans font-medium transition-all duration-200 text-left
                  ${form.housingBudget === option
                    ? 'border-rose bg-rose/10 text-ink'
                    : 'border-champagne/20 bg-white/30 text-muted hover:border-champagne/50'
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Details */}
      <div>
        <label htmlFor="details" className={labelClass}>Anything else I should know?</label>
        <textarea id="details" rows={4}
          className={inputClass + ' resize-none'}
          placeholder="Must-have activities, surprises you're planning, anything goes..."
          value={form.details} onChange={(e) => handleChange('details', e.target.value)} />
      </div>

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="group w-full bg-ink text-cream font-sans text-base font-semibold tracking-wide
                     py-4 px-12 rounded-full
                     hover:bg-rose hover:scale-[1.01]
                     active:scale-[0.99]
                     disabled:opacity-60 disabled:cursor-not-allowed
                     transition-all duration-300
                     flex items-center justify-center gap-3"
        >
          {status === 'submitting' ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending...
            </span>
          ) : (
            <>
              Send it
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
