import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

/**
 * Burgundy Botanical Editorial reminder:
 * Keep the page feeling like a private luxury letter: ivory space, oxblood ink,
 * editorial type, asymmetric composition, tactile photo frames, and restrained motion.
 */

const ASSET_BASE = import.meta.env.BASE_URL;
const asset = (name: string) => `${ASSET_BASE}assets/${name}`;
const HERO_IMAGE = asset("shreyu-purple-orchid-hero.png");
const TEXTURE_IMAGE = "/manus-storage/shreyu-botanical-texture_da9314e2.jpg";
const SEAL_IMAGE = asset("orchid-wax-seal-clean.png");
const ENVELOPE_IMAGE = `${asset("envelope-home-cropped.jpg")}?v=3`;
const OPEN_ENVELOPE_IMAGE = asset("envelope-open-interior.jpg");
const PAPER_IMAGE = asset("a4-letter-paper.jpg");
const BOUQUET_IMAGE = asset("purple-bouquet.png");

const messageParagraphs = [
  {
    text: "I’m writing this for the world’s most cheerful and strongest soul, wishing her a heartful",
    emphasis: "HAPPIEST BIRTHDAY.",
  },
  {
    text: "I know the days haven’t been favourable. You’re facing and fighting through a lot. But being pessimistic is not an option. Losing hope is not an option. Embrace the pain.",
  },
  {
    text: "You might think you’re trapped in a swamp, but don’t ever forget",
    emphasis: "the lotus grows there too, and it blooms just as beautifully as you.",
  },
  {
    text: "It’s been a very long night. Dry, scary, cold and windy. A night that has already tried to destroy you, break you, trap you, and submerge you into the deepest depths of darkness.",
  },
  {
    text: "And yet, you never lost the fight. But this is a war. A very long one.",
  },
  {
    text: "A lot of time has already passed, and I know you’re tired from swinging that sword again and again. I know you're wounded and exhausted, and sometimes you probably wonder how much longer you have keep going.",
  },
  {
    text: "But listen —",
    emphasis: "Dawn is very near.",
  },
  {
    text: "Just keep fighting a little longer. Everything has its price, and I very well know, that you’ll win this one too. You are not someone who gives up when things get difficult. You’ve come too far, fought too hard, and survived too much to let this darkness define you. So be a little more optimistic.",
  },
  {
    text: "I know you’re tired and wounded, so just hold on. Take a little rest when you need it. Close your eyes. Take a deep breath.",
  },
];

const photos = [
  { file: "image1.jpg", src: asset("image1.jpg"), label: "A beginning", ratio: "tall" },
  { file: "image2.jpg", src: asset("image2.jpg"), label: "A soft morning", ratio: "wide" },
  { file: "image3.jpg", src: asset("image3.jpg"), label: "The little things", ratio: "square" },
  { file: "image4.jpg", src: asset("image4.jpg"), label: "Somewhere golden", ratio: "tall" },
  { file: "image5.jpg", src: asset("image5.jpg"), label: "A day to remember", ratio: "wide" },
  { file: "image6.jpg", src: asset("image6.jpg"), label: "Your brightest laugh", ratio: "square" },
  { file: "image7.jpg", src: asset("image7.jpg"), label: "A quiet favourite", ratio: "tall" },
  { file: "image8.jpg", src: asset("image8.jpg"), label: "The view from here", ratio: "wide" },
  { file: "image9.jpg", src: asset("image9.jpg"), label: "A little magic", ratio: "square" },
  { file: "image10.jpg", src: asset("image10.jpg"), label: "Still blooming", ratio: "tall" },
  { file: "image11.jpg", src: asset("image11.jpg"), label: "A beautiful pause", ratio: "wide" },
  { file: "image12.jpg", src: asset("image12.jpg"), label: "For the next chapter", ratio: "square" },
] as const;

type Photo = (typeof photos)[number];


export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [albumTravel, setAlbumTravel] = useState(0);
  const [letterOpen, setLetterOpen] = useState(false);

  const galleryRef = useRef<HTMLDivElement>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const albumSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const section = albumSectionRef.current;
    const viewport = galleryRef.current;
    const track = galleryTrackRef.current;
    if (!section || !viewport || !track) return;

    let targetOffset = 0;
    let currentOffset = 0;
    let animationFrame = 0;
    const animateTrack = () => {
      currentOffset += (targetOffset - currentOffset) * 0.12;
      if (Math.abs(targetOffset - currentOffset) < 0.35) currentOffset = targetOffset;
      track.style.transform = `translate3d(${-currentOffset}px, 0, 0)`;
      if (currentOffset !== targetOffset) {
        animationFrame = window.requestAnimationFrame(animateTrack);
      } else {
        animationFrame = 0;
      }
    };
    const requestTrackAnimation = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(animateTrack);
    };
    const updateGeometry = () => {
      const max = Math.max(0, track.scrollWidth - viewport.clientWidth);
      setAlbumTravel(window.innerWidth > 900 ? max : 0);
      targetOffset = Math.min(max, Math.max(0, targetOffset));
      currentOffset = Math.min(max, Math.max(0, currentOffset));
      if (window.innerWidth <= 900) {
        targetOffset = 0;
        currentOffset = 0;
        track.style.transform = "translate3d(0, 0, 0)";
      }
    };
    const syncTrackToPage = () => {
      if (window.innerWidth <= 900) return;
      const max = Math.max(0, track.scrollWidth - viewport.clientWidth);
      if (!max) return;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const progress = Math.min(1, Math.max(0, (window.scrollY - sectionTop) / max));
      targetOffset = progress * max;
      requestTrackAnimation();
    };
    updateGeometry();
    syncTrackToPage();
    window.addEventListener("resize", updateGeometry);
    window.addEventListener("scroll", syncTrackToPage, { passive: true });
    return () => {
      window.removeEventListener("resize", updateGeometry);
      window.removeEventListener("scroll", syncTrackToPage);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    if (!selectedPhoto) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedPhoto(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedPhoto]);

  const heroProgress = Math.min(scrollY / Math.max(window.innerHeight || 800, 1), 1);
  return (
    <main className="birthday-site" style={{ "--hero-progress": heroProgress } as React.CSSProperties}>
      <section className="hero-stage" aria-labelledby="birthday-title">
        <div
          className="hero-stage__sticky"
          style={{
            transform: `translateY(calc(var(--hero-progress) * -7.5rem)) scale(calc(1 - var(--hero-progress) * .018))`,
            filter: `blur(calc(var(--hero-progress) * 9px))`,
          }}
        >
          <div className="hero-stage__grain" />
          <div className="hero-stage__image" style={{ backgroundImage: `url(${HERO_IMAGE})` }} aria-hidden="true" />
          <div className="hero-stage__wash" aria-hidden="true" />
          <div className="hero-copy" id="top">
            <h1 id="birthday-title">Happy<br /><em>Birthday</em></h1>
          </div>

        </div>
      </section>

      <section className="letter-section" id="letter" style={{ backgroundImage: `url(${TEXTURE_IMAGE})` }}>
        <div className="letter-section__inner">
          <div className={`sealed-letter realistic-letter ${letterOpen ? "is-open" : ""}`}>
            <div className="realistic-letter__stage">
              <div className="realistic-letter__composition">
              <button
                type="button"
                className="realistic-letter__closed"
                onClick={() => setLetterOpen(true)}
                aria-expanded={letterOpen}
                aria-controls="birthday-letter"
              >
                <img className="realistic-letter__envelope" src={ENVELOPE_IMAGE} alt="Sealed handmade envelope" />
                <span className="realistic-letter__recipient">To – Shreyanshi</span>
                <img className="realistic-letter__seal" src={SEAL_IMAGE} alt="Orchid wax seal" />
                <span className="realistic-letter__hint">Click the seal to open</span>
              </button>

              <div className="realistic-letter__opening" aria-hidden={!letterOpen}>
                <img className="realistic-letter__open-envelope" src={OPEN_ENVELOPE_IMAGE} alt="Opened handmade envelope" />
                <article className="realistic-letter__paper" id="birthday-letter">
                  <img src={PAPER_IMAGE} alt="" aria-hidden="true" />
                  <div className="realistic-letter__copy">
                    <div className="letter-page__topline">
                      <span>For you, Shreyanshi</span>
                      <span>0809 ∞</span>
                    </div>
                    {messageParagraphs.map((paragraph, index) => (
                      <p key={`${paragraph.text}-${index}`} className={paragraph.emphasis ? "has-emphasis" : ""}>
                        {paragraph.text}{" "}
                        {paragraph.emphasis && <strong>{paragraph.emphasis}</strong>}
                      </p>
                    ))}
                    <p className="letter-copy__pause">The night will end soon.<br />The wounds will heal.<br />Until then, keep going.</p>
                    <p className="letter-copy__remember">And remember —<br /><strong>This too shall pass.</strong></p>
                    <p className="letter-copy__closing">Wishing you again a very <strong>Happy Birthday Shreyu.</strong></p>
                    <span className="micro-mark micro-mark--letter" aria-label="0809 infinity">0809 ∞</span>
                  </div>
                  <button type="button" className="letter-page__close" onClick={() => setLetterOpen(false)} aria-label="Close letter">Fold letter</button>
                </article>
              </div>
              <img className="realistic-letter__bouquet" src={BOUQUET_IMAGE} alt="Purple orchid bouquet" />
              </div>
            </div>
          </div>
        </div>
      </section>

            <section className="album-section" ref={albumSectionRef} aria-label="Photo album" style={{ "--album-travel": `${albumTravel}px` } as React.CSSProperties}>
        <div className="album-sticky">
          <div className="album-viewport" ref={galleryRef} aria-label="Photo album, swipe horizontally through the finite collection">
            <div className="album-track" ref={galleryTrackRef}>
            {photos.map((photo) => (
              <button
                type="button"
                className={`photo-card photo-card--${photo.ratio}`}
                key={photo.file}
                onClick={() => setSelectedPhoto(photo)}
                aria-label={`Open ${photo.file}, ${photo.label}`}
              >
                <span className="photo-card__matte">
                  <span className="photo-card__placeholder">
                    <img src={photo.src} alt="" className="photo-card__image" onError={(event) => { event.currentTarget.style.display = "none"; }} />
                  </span>
                </span>
              </button>
            ))}
            </div>
          </div>
          <span className="micro-mark micro-mark--album" aria-label="0809 infinity">0809 ∞</span>
        </div>
      </section>
      {selectedPhoto && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo preview" onClick={() => setSelectedPhoto(null)}>
          <div className="lightbox__panel" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="lightbox__close" onClick={() => setSelectedPhoto(null)} aria-label="Close photo"><X size={20} /></button>
              <div className={`lightbox__image lightbox__image--${selectedPhoto.ratio}`}>
                <div className="lightbox__placeholder">
                  <img src={selectedPhoto.src} alt="" className="lightbox__photo" onError={(event) => { event.currentTarget.style.display = "none"; }} />
                </div>
              </div>
          </div>
        </div>
      )}
    </main>
  );
}
