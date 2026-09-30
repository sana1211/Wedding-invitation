import { useEffect, useMemo, useRef, useState } from "react";

/* ---------- EDIT YOUR DETAILS HERE ---------- */
const WEDDING = {
  bride: "Nimali",
  groom: "Dinesh",
  blessing: "With the blessings of the Triple Gem and our beloved parents",
  dateText: "Saturday, 20 December 2026",
  // ISO date with Sri Lanka time zone (+05:30)
  countdownTo: "2026-12-20T09:47:00+05:30",
  rsvpBy: "1 December 2026",
  rsvpEmail: "rsvp@example.com",
  events: [
    { title: "Poruwa Ceremony", time: "At the auspicious hour of 9.47 a.m.", place: ["Grand Ballroom, Lotus Pond Hotel", "Colombo"] },
    { title: "Wedding Reception", time: "From 6.30 p.m. onwards", place: ["Grand Ballroom, Lotus Pond Hotel", "Dinner and dancing to follow"] },
  ],
};
/* -------------------------------------------- */

const PETALS = [
  "M0 0C-16-18-16-46 0-66C16-46 16-18 0 0Z",
  "M-4 0C-26-6-46-24-50-48C-30-44-12-28-4 0Z",
  "M4 0C26-6 46-24 50-48C30-44 12-28 4 0Z",
  "M-8 2C-38 6-60-6-68-26C-46-28-22-18-8 2Z",
  "M8 2C38 6 60-6 68-26C46-28 22-18 8 2Z",
  "M-40 8C-20 12 20 12 40 8",
];

function Lotus({ animate = false, className = "" }) {
  return (
    <svg viewBox="-70 -75 140 90" aria-hidden="true" className={`mx-auto block overflow-visible ${className}`}>
      {PETALS.map((d, i) => (
        <path
          key={i}
          d={d}
          pathLength="1"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeDasharray={animate ? 1 : undefined}
          strokeDashoffset={animate ? 1 : undefined}
          className={animate ? "animate-draw" : ""}
          style={animate ? { animationDelay: `${[0, 0.3, 0.3, 0.6, 0.6, 1.2][i]}s` } : undefined}
        />
      ))}
    </svg>
  );
}

function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return setShown(true);
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setShown(true), io.disconnect()),
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}s` }}
      className={`transition-all duration-1000 ease-out ${shown ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"} ${className}`}
    >
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div className="mx-auto my-6 flex w-64 max-w-[80%] items-center gap-3 text-gold">
      <span className="h-px flex-1 bg-line" />✦<span className="h-px flex-1 bg-line" />
    </div>
  );
}

function Petals() {
  const items = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        left: Math.random() * 100,
        dur: 12 + Math.random() * 12,
        delay: -Math.random() * 20,
        scale: 0.7 + Math.random() * 0.8,
        color: i % 3 === 0 ? "bg-rose opacity-20" : i % 4 === 0 ? "bg-soft opacity-20" : "bg-gold opacity-35",
      })),
    []
  );
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
      {items.map((p, i) => (
        <i
          key={i}
          className={`petal absolute -top-8 h-[18px] w-3 animate-fall rounded-[70%_0_70%_0] ${p.color}`}
          style={{ left: `${p.left}%`, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`, scale: p.scale }}
        />
      ))}
    </div>
  );
}

function Cover({ open, onOpen }) {
  return (
    <div
      role="dialog"
      aria-label="Wedding invitation"
      className={`fixed inset-0 z-20 grid place-items-center bg-[#21382f] p-8 text-center text-[#eee9dc] transition-transform duration-[1600ms] ease-[cubic-bezier(.77,0,.18,1)] ${open ? "-translate-y-[101%]" : ""}`}
      style={open ? { visibility: "hidden", transitionProperty: "transform, visibility", transitionDelay: "0s, 1.7s" } : undefined}
    >
      <div className="max-w-sm">
        <Lotus animate className="mb-5 w-[150px]" />
        <div className="animate-rise font-script text-4xl leading-tight opacity-0 [animation-delay:1.6s]">
          {WEDDING.bride} &amp; {WEDDING.groom}
        </div>
        <p className="mt-3 animate-rise font-sans text-sm font-light tracking-wider text-[#c9c2b0] opacity-0 [animation-delay:2.1s]">
          Together with our families, we invite you
        </p>
        <button
          onClick={onOpen}
          className="mt-8 animate-rise cursor-pointer border border-[#b3915a] bg-transparent px-9 py-3 font-sans text-[.95rem] font-light tracking-[.14em] text-[#eee9dc] opacity-0 transition-colors duration-500 [animation-delay:2.6s] hover:bg-[#b3915a] hover:text-[#21382f] focus-visible:bg-[#b3915a] focus-visible:text-[#21382f] focus-visible:outline-none"
        >
          OPEN INVITATION
        </button>
      </div>
    </div>
  );
}

function Countdown({ to }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const d = Math.max(0, new Date(to).getTime() - now);
  const units = [
    [Math.floor(d / 864e5), "days"],
    [Math.floor((d % 864e5) / 36e5), "hours"],
    [Math.floor((d % 36e5) / 6e4), "minutes"],
    [Math.floor((d % 6e4) / 1e3), "seconds"],
  ];
  return (
    <div className="my-7 flex flex-wrap justify-center gap-5 font-sans font-light">
      {units.map(([n, label]) => (
        <div key={label} className="min-w-[4.2rem]">
          <b className="block font-serif text-[2.6rem] font-normal leading-none text-rose">{n}</b>
          <small className="text-xs tracking-wider text-soft">{label}</small>
        </div>
      ))}
    </div>
  );
}

const section = "flex min-h-svh flex-col items-center justify-center px-6 py-[4.5rem] text-center";

export default function App() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "" : "hidden";
  }, [open]);

  const { bride, groom } = WEDDING;

  return (
    <>
      <Cover open={open} onOpen={() => setOpen(true)} />
      <Petals />

      <main className="relative z-[1]">
        {/* Hero */}
        <section className={section}>
          <Reveal className="relative w-full max-w-[34rem] border border-line bg-card px-7 py-12 outline outline-1 outline-offset-8 outline-line before:absolute before:-left-px before:-top-px before:size-[22px] before:border-l before:border-t before:border-gold after:absolute after:-bottom-px after:-right-px after:size-[22px] after:border-b after:border-r after:border-gold">
            <Lotus className="mb-2 w-[70px]" />
            <p className="text-lg italic text-soft">{WEDDING.blessing}</p>
            <h1 className="mb-1 mt-6 font-script text-[clamp(3.2rem,13vw,5rem)] font-normal leading-[1.05] text-rose">
              {bride}
              <span className="block text-[.4em] text-gold">&amp;</span>
              {groom}
            </h1>
            <p className="mx-auto mt-5 max-w-sm">
              request the pleasure of your company as they begin their life together
            </p>
            <Divider />
            <p className="text-2xl tracking-wide">{WEDDING.dateText}</p>
          </Reveal>
        </section>

        {/* Events */}
        <section className={section}>
          <div className="grid w-full max-w-[34rem] gap-10">
            <Reveal>
              <h2 className="mb-1 text-[2rem] font-medium text-rose">The Celebrations</h2>
              <Divider />
            </Reveal>
            {WEDDING.events.map((e, i) => (
              <Reveal key={e.title} delay={i * 0.12}>
                <h3 className="text-2xl font-medium">{e.title}</h3>
                <p className="text-xl text-gold">{e.time}</p>
                <p className="text-soft">
                  {e.place.map((line, j) => (
                    <span key={j} className="block">{line}</span>
                  ))}
                </p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Countdown + RSVP */}
        <section className={section}>
          <Reveal>
            <h2 className="mb-1 text-[2rem] font-medium text-rose">Until we celebrate</h2>
            <Countdown to={WEDDING.countdownTo} />
            <Divider />
            <p className="mx-auto max-w-sm">
              Your presence and blessings will make our day complete.
              <br />
              Kindly let us know by {WEDDING.rsvpBy}.
            </p>
            <a
              href={`mailto:${WEDDING.rsvpEmail}?subject=${encodeURIComponent(`RSVP - ${bride} & ${groom}`)}`}
              className="mt-6 inline-block border border-ink bg-ink px-10 py-3.5 font-sans text-[.95rem] font-light tracking-[.12em] text-card no-underline transition-colors duration-500 hover:bg-transparent hover:text-ink focus-visible:bg-transparent focus-visible:text-ink focus-visible:outline-none"
            >
              RSVP BY EMAIL
            </a>
          </Reveal>
        </section>

        <Reveal className="px-6 pb-16 pt-4 text-center italic text-soft">
          Ayubowan · Vanakkam · With love
          <br />
          <span className="font-script text-3xl not-italic text-rose">{bride} &amp; {groom}</span>
        </Reveal>
      </main>
    </>
  );
}
