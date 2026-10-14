import React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight, ArrowRight, CalendarDays, Check, ChevronDown, Compass,
  Heart, MapPin, Menu, Search, ShieldCheck, Sparkles, Star, Users, X
} from "lucide-react";

const destinations = [
  { id: 1, name: "Bali, Indonesia", country: "Indonesia", category: "Beach", price: 420, days: "5 days", rating: 4.9, image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=85", tag: "Popular", description: "Lush rice terraces, turquoise waters and peaceful island escapes." },
  { id: 2, name: "Swiss Alps", country: "Switzerland", category: "Mountain", price: 890, days: "7 days", rating: 4.8, image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1000&q=85", tag: "Scenic", description: "Snow-dusted peaks, alpine villages and unforgettable train rides." },
  { id: 3, name: "Jaipur, India", country: "India", category: "Culture", price: 180, days: "3 days", rating: 4.7, image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1000&q=85", tag: "Heritage", description: "Royal palaces, vibrant bazaars and rich Rajasthani culture." },
  { id: 4, name: "Santorini, Greece", country: "Greece", category: "Beach", price: 640, days: "4 days", rating: 4.9, image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=1000&q=85", tag: "Romantic", description: "Whitewashed villages, blue domes and golden-hour sea views." },
  { id: 5, name: "Kyoto, Japan", country: "Japan", category: "Culture", price: 560, days: "5 days", rating: 4.8, image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=85", tag: "Must visit", description: "Quiet shrines, bamboo paths and timeless Japanese traditions." },
  { id: 6, name: "Queenstown, NZ", country: "New Zealand", category: "Adventure", price: 720, days: "6 days", rating: 4.8, image: "https://images.unsplash.com/photo-1589491106922-a8e1f8c6e4f7?auto=format&fit=crop&w=1000&q=85", tag: "Adventure", description: "Dramatic lakes, mountain trails and outdoor adventures." }
];

const categories = ["All places", "Beach", "Mountain", "Culture", "Adventure"];

function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All places");
  const [saved, setSaved] = useState([]);
  const [booking, setBooking] = useState(null);
  const [notice, setNotice] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  const [trips, setTrips] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("roamly-trips") || "[]");
    } catch {
      return [];
    }
  });
    useEffect(() => {
    async function loadTrips() {
      try {
        const response = await fetch("http://localhost:8080/api/bookings");

        if (!response.ok) {
          throw new Error("Failed to load bookings");
        }

        const data = await response.json();
        setTrips(data);

        localStorage.setItem("roamly-trips", JSON.stringify(data));
      } catch (error) {
        console.error("Could not load bookings:", error);
      }
    }

    loadTrips();
  }, []);

  const filtered = useMemo(() => destinations.filter((d) => {
    const matchesCategory = category === "All places" || d.category === category;
    const matchesSearch = `${d.name} ${d.country} ${d.category}`
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  }), [category, search]);

  function toggleSaved(id) {
    setSaved((current) =>
      current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id]
    );
  }

  async function saveTrip(event) {
    event.preventDefault();

    if (!booking) return;

    const form = new FormData(event.currentTarget);

    const trip = {
      destination: booking.name,
      travelerName: String(form.get("traveler") || "").trim(),
      email: String(form.get("email") || "").trim(),
      startDate: form.get("startDate"),
      travelers: Number(form.get("travelers")),
      budget: Number(form.get("budget") || booking.price)
    };

    try {
      setNotice("Saving your trip request...");

      const response = await fetch("http://localhost:8080/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(trip)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Server error: ${response.status}`);
      }

      const savedTrip = await response.json();

      const updated = [savedTrip, ...trips];
      setTrips(updated);

      try {
        localStorage.setItem("roamly-trips", JSON.stringify(updated));
      } catch (storageError) {
        console.error("Could not update local browser storage:", storageError);
      }

      setBooking(null);
      setNotice(`Trip request saved for ${savedTrip.destination} in MySQL!`);

      window.setTimeout(() => setNotice(""), 6500);
    } catch (error) {
      console.error("Booking save failed:", error);

      setNotice(
        "Booking could not be saved. Check that the Java backend and MySQL are running."
      );

      window.setTimeout(() => setNotice(""), 6500);
    }
  }

  function scrollToPlaces() {
    document.getElementById("destinations")?.scrollIntoView({
      behavior: "smooth"
    });
    setMobileMenu(false);
  }

  return (
    <div className="app-shell">
      <header className="navbar">
        <a className="brand" href="#top" aria-label="Roamly home">
          <span className="brand-mark">
            <Compass size={23} strokeWidth={2.4} />
          </span>
          <span>roamly<span className="brand-dot">.</span></span>
        </a>

        <nav className={mobileMenu ? "nav-links open" : "nav-links"}>
          <a className="nav-active" href="#top" onClick={() => setMobileMenu(false)}>Home</a>
          <a href="#destinations" onClick={() => setMobileMenu(false)}>Destinations</a>
          <a href="#how-it-works" onClick={() => setMobileMenu(false)}>How it works</a>
          <button
            className="mobile-my-trips"
            onClick={() => {
              setNotice(`You have ${trips.length} saved trip request${trips.length === 1 ? "" : "s"} on this device.`);
              setMobileMenu(false);
            }}
          >
            My trips ({trips.length})
          </button>
        </nav>

        <div className="nav-actions">
          <button
            className="saved-link"
            onClick={() => setNotice(`You have ${trips.length} trip request${trips.length === 1 ? "" : "s"} saved on this device.`)}
          >
            My trips <span>{trips.length}</span>
          </button>
          <button className="nav-cta" onClick={scrollToPlaces}>
            Plan a trip <ArrowRight size={16} />
          </button>
        </div>

        <button
          className="menu-toggle"
          aria-label="Toggle menu"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? <X /> : <Menu />}
        </button>
      </header>

      <main id="top">
        <section className="hero">
          <img
            className="hero-image"
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2200&q=90"
            alt="Beautiful alpine lake surrounded by mountains"
          />
          <div className="hero-overlay" />

          <div className="hero-content">
            <div className="eyebrow">
              <Sparkles size={14} /> YOUR NEXT CHAPTER STARTS HERE
            </div>
            <h1>The world is<br />waiting <em>for you.</em></h1>
            <p>
              Discover extraordinary places, plan meaningful journeys, and make every trip a story worth telling.
            </p>
            <button className="hero-button" onClick={scrollToPlaces}>
              Explore destinations <ArrowRight size={17} />
            </button>

            <div className="hero-trust">
              <div className="avatar-stack">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" alt="" />
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80" alt="" />
                <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=80&q=80" alt="" />
                <span>+</span>
              </div>
              <div>
                <strong>2,400+ travelers</strong>
                <small>found their next adventure</small>
              </div>
            </div>
          </div>

          <div className="hero-note">
            <span className="note-icon"><MapPin size={18} /></span>
            <div>
              <small>THE VIEW OF THE WEEK</small>
              <strong>Lake Brienz, Switzerland</strong>
            </div>
            <span className="note-arrow"><ArrowDownRight size={19} /></span>
          </div>

          <div className="hero-pagination">
            <span className="active-line"></span><span></span><span></span>
            <small>01 / 03</small>
          </div>
        </section>

        <section className="search-wrap" aria-label="Search destinations">
          <div className="search-panel">
            <div className="search-field destination-search">
              <span className="search-icon"><MapPin size={19} /></span>
              <label htmlFor="destination-search">WHERE TO?</label>
              <div className="input-with-icon">
                <input
                  id="destination-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search destinations..."
                />
                <Search size={17} />
              </div>
            </div>

            <div className="search-divider" />

            <div className="search-field">
              <span className="search-icon"><CalendarDays size={19} /></span>
              <label htmlFor="travel-style">TRAVEL STYLE</label>
              <div className="select-wrap">
                <select
                  id="travel-style"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
                <ChevronDown size={16} />
              </div>
            </div>

            <button className="search-button" onClick={scrollToPlaces}>
              <Search size={18} /> Find my trip
            </button>
          </div>
        </section>

        <section className="destinations section-wrap" id="destinations">
          <div className="section-heading">
            <div>
              <div className="section-kicker">A LITTLE INSPIRATION</div>
              <h2>Places that stay<br className="mobile-break" /> <em>with you.</em></h2>
            </div>
            <p>
              Handpicked destinations for curious minds and open hearts. Your next unforgettable moment is just around the corner.
            </p>
          </div>

          <div className="category-row">
            <div className="category-pills">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={category === c ? "category-pill selected" : "category-pill"}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="results-count">
              {filtered.length} destinations <ArrowDownRight size={15} />
            </div>
          </div>

          {filtered.length ? (
            <div className="destination-grid">
              {filtered.map((d) => (
                <article className="destination-card" key={d.id}>
                  <div className="destination-photo-wrap">
                    <img className="destination-photo" src={d.image} alt={d.name} loading="lazy" />
                    <span className="destination-tag">{d.tag}</span>
                    <button
                      className={saved.includes(d.id) ? "heart-button saved" : "heart-button"}
                      aria-label={saved.includes(d.id) ? `Remove ${d.name} from favorites` : `Save ${d.name} to favorites`}
                      onClick={() => toggleSaved(d.id)}
                    >
                      <Heart size={18} fill={saved.includes(d.id) ? "currentColor" : "none"} />
                    </button>
                    <span className="photo-days">{d.days}</span>
                  </div>

                  <div className="destination-details">
                    <div className="destination-title-row">
                      <h3>{d.name}</h3>
                      <span className="rating"><Star size={14} fill="currentColor" /> {d.rating}</span>
                    </div>
                    <p>{d.description}</p>
                    <div className="destination-bottom">
                      <div>
                        <small>TRIPS FROM</small>
                        <strong>${d.price}<span> / person</span></strong>
                      </div>
                      <button
                        aria-label={`Plan trip to ${d.name}`}
                        onClick={() => setBooking(d)}
                        className="round-arrow"
                      >
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Search size={30} />
              <h3>No destinations found</h3>
              <p>Try another search or choose a different travel style.</p>
              <button onClick={() => { setSearch(""); setCategory("All places"); }}>
                Clear filters
              </button>
            </div>
          )}

          <div className="browse-footer">
            <span>GOOD TRIPS BEGIN WITH A LITTLE CURIOSITY</span>
            <button onClick={() => { setCategory("All places"); setSearch(""); }}>
              Browse all places <ArrowRight size={16} />
            </button>
          </div>
        </section>

        <section className="planning-section" id="how-it-works">
          <div className="planning-copy">
            <div className="section-kicker light-kicker">LESS PLANNING, MORE LIVING</div>
            <h2>Your journey.<br /><em>Your kind of magic.</em></h2>
            <p>
              Travel should feel exciting from the very first click. Find a place that inspires you, shape your trip around your budget, and keep your plans together in one place.
            </p>
            <button className="light-button" onClick={scrollToPlaces}>
              Start planning <ArrowRight size={17} />
            </button>
          </div>

          <div className="steps-list">
            <div className="step-item">
              <span className="step-number">01</span>
              <div><h3>Find your somewhere</h3><p>Explore curated places for beaches, mountains, culture and adventure.</p></div>
              <MapPin />
            </div>
            <div className="step-item">
              <span className="step-number">02</span>
              <div><h3>Make it yours</h3><p>Choose your dates, group size and budget to shape a trip that fits.</p></div>
              <CalendarDays />
            </div>
            <div className="step-item">
              <span className="step-number">03</span>
              <div><h3>Keep every detail close</h3><p>Save your trip requests and find your plans again whenever you need them.</p></div>
              <ShieldCheck />
            </div>
          </div>
        </section>

        <section className="closing-cta">
          <div className="closing-icon"><Compass size={27} /></div>
          <div>
            <div className="section-kicker">THE WORLD IS BIG. START SOMEWHERE.</div>
            <h2>Ready to go <em>a little further?</em></h2>
          </div>
          <button onClick={scrollToPlaces}>
            Find your destination <ArrowRight size={17} />
          </button>
        </section>
      </main>

      <footer className="footer">
        <a className="brand footer-brand" href="#top">
          <span className="brand-mark"><Compass size={20} /></span>
          <span>roamly<span className="brand-dot">.</span></span>
        </a>
        <p>Thoughtfully planned. Wonderfully traveled.</p>
        <span>SMART TRAVEL MANAGEMENT SYSTEM · STUDENT PROJECT</span>
        <span>© 2026 Roamly</span>
      </footer>

      {notice && (
        <div className="toast" role="status">
          <Check size={18} />
          <span>{notice}</span>
          <button aria-label="Dismiss notification" onClick={() => setNotice("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {booking && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setBooking(null);
          }}
        >
          <section className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title">
            <button className="modal-close" aria-label="Close booking form" onClick={() => setBooking(null)}>
              <X />
            </button>

            <div className="modal-kicker"><Sparkles size={14} /> YOUR NEXT ADVENTURE</div>
            <h2 id="booking-title">Plan your trip to<br /><em>{booking.name}</em></h2>
            <p className="modal-intro">Share a few details to save your trip request.</p>

            <form onSubmit={saveTrip}>
              <label>
                Traveler name
                <input name="traveler" placeholder="Your full name" required minLength="2" />
              </label>

              <label>
                Email address
                <input name="email" type="email" placeholder="you@example.com" required />
              </label>

              <div className="form-row">
                <label>
                  Start date
                  <input
                    name="startDate"
                    type="date"
                    required
                    min={new Date().toISOString().slice(0, 10)}
                  />
                </label>

                <label>
                  Travelers
                  <select name="travelers" defaultValue="2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "person" : "people"}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label>
                Estimated budget (USD)
                <input name="budget" type="number" min="1" defaultValue={booking.price * 2} required />
              </label>

              <div className="modal-estimate">
                <span>Starting estimate</span>
                <strong>${booking.price} <small>/ person</small></strong>
              </div>

              <button className="submit-booking" type="submit">
                Save trip request <ArrowRight size={17} />
              </button>

              <small className="demo-disclaimer">
                Your booking request will be sent to the Java backend and saved in the database.
              </small>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;