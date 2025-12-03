// src/components/AdminPortal.jsx
import React, { useEffect, useState } from "react";

// ---------- fetch wrapper ----------
async function apiFetch(path, opts = {}) {
  const baseOpts = {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...opts,
  };
  const res = await fetch(path, baseOpts);
  if (!res.ok) {
    const text = await res.text();
    const err = new Error(`${res.status} ${res.statusText}: ${text}`);
    err.status = res.status;
    throw err;
  }
  if (res.status === 204) return null;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return res.json();
  return res.text();
}

// ---------- fallback mocks ----------
const fallbackMovies = [
  { id: 1, title: "Inception", runtimeMin: 148, status: "NOW_PLAYING", genres: ["Action", "Sci-Fi"] },
  { id: 2, title: "Interstellar", runtimeMin: 169, status: "COMING_SOON", genres: ["Sci-Fi", "Drama"] },
];
const fallbackShowrooms = [
  { id: 1, name: "Showroom 1", capacity: 100 },
  { id: 2, name: "Showroom 2", capacity: 150 },
];
const fallbackPromotions = [{ code: "NEWYEAR25", discount: 25, startsOn: "2025-01-01", endsOn: "2025-01-15" }];
const fallbackUsers = [{ id: 1, email: "admin@cine.com", firstName: "Admin", lastName: "", userType: { typeName: "Admin" }, promoOptIn: true }];

// ---------- UI helpers ----------
const gridContainer = { display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", marginTop: 16 };
const smallCard = {
  background: "#2f2f2f",
  padding: "1.25rem",
  borderRadius: 12,
  width: 260,
  color: "#fff",
  boxShadow: "0 6px 20px rgba(0,0,0,0.45)",
  cursor: "pointer",
  transition: "transform .15s ease",
};
const cardTitle = { fontSize: "1.05rem", fontWeight: 700, marginBottom: 8 };
const cardDesc = { color: "#dcdcdc", fontSize: ".95rem", minHeight: 34 };

// ---------- AdminPortal root ----------
export default function AdminPortal() {
  const [page, setPage] = useState("dashboard");
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const navigate = (p, opts = {}) => {
    setSelectedMovieId(opts.movieId ?? null);
    setPage(p);
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ padding: 24 }}>

      {/* Centered heading */}
      <h1 style={{ textAlign: "center", fontSize: "3rem", color: "#fff", marginBottom: 20 }}>
        Admin Dashboard
      </h1>

      <main style={{ marginTop: 8 }}>
        {page === "dashboard" && <AdminDashboard onNavigate={(p) => navigate(p)} />}
        {page === "movies" && <AdminMoviesPage onBack={() => navigate("dashboard")} onOpenMovie={(id) => navigate("movie-detail", { movieId: id })} />}
        {page === "movie-detail" && selectedMovieId && <MovieDetailPage movieId={selectedMovieId} onBack={() => navigate("movies")} />}
        {page === "showtimes" && <AdminShowtimesPage onBack={() => navigate("dashboard")} />}
        {page === "promotions" && <AdminPromotionsPage onBack={() => navigate("dashboard")} />}
        {page === "users" && <AdminUsersPage onBack={() => navigate("dashboard")} />}
      </main>
    </div>
  );
}

// ---------- Dashboard ----------
export const AdminDashboard = ({ onNavigate }) => {
  const cards = [
    { label: "Manage Movies", desc: "Add, edit, or remove movies.", page: "movies" },
    { label: "Manage Showtimes", desc: "Schedule movie showtimes.", page: "showtimes" },
    { label: "Manage Promotions", desc: "Create and manage promotions.", page: "promotions" },
    { label: "Manage Users", desc: "View and edit user accounts.", page: "users" },
  ];

  return (
    <section>
      <div style={gridContainer}>
        {cards.map((c) => (
          <div
            key={c.page}
            style={smallCard}
            onClick={() => onNavigate(c.page)}
            onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-6px)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "none")}
          >
            <div style={cardTitle}>{c.label}</div>
            <div style={cardDesc}>{c.desc}</div>
          </div>
        ))}

        <div
          style={smallCard}
          onClick={() => alert("Manage Tickets coming soon!")}
          onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-6px)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "none")}
        >
          <div style={cardTitle}>Manage Tickets</div>
          <div style={cardDesc}>View or modify tickets. (Coming soon)</div>
        </div>
      </div>
    </section>
  );
};

// -------------------------------------------------------------
// ------------------- MOVIES PAGE ------------------------------
// -------------------------------------------------------------
// ---------- Movies list + search (replacement AdminMoviesPage) ----------
export const AdminMoviesPage = ({ onBack, onOpenMovie }) => {
  const [movies, setMovies] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState([]);

  // edit state
  const [editing, setEditing] = useState(null); // movie object being edited or null

  const loadAll = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/movies");
      setMovies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("Failed to fetch /api/movies — using fallback", err);
      setMovies(fallbackMovies);
    } finally {
      setLoading(false);
    }
  };

  const loadGenres = async () => {
    try {
      const g = await apiFetch("/api/movies/genres");
      setGenres(Array.isArray(g) ? g : []);
    } catch (err) {
      setGenres([]);
    }
  };

  useEffect(() => {
    loadAll();
    loadGenres();
  }, []);

  const doSearch = async (ev) => {
    ev?.preventDefault();
    if (!q || q.trim() === "") {
      loadAll();
      return;
    }
    setLoading(true);
    try {
      const res = await apiFetch(`/api/movies/search?q=${encodeURIComponent(q)}`);
      setMovies(Array.isArray(res) ? res : []);
    } catch (err) {
      console.warn("Search failed", err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // Add movie (unchanged)
  const handleAdd = async (ev) => {
    ev.preventDefault();

    const form = new FormData(ev.target);
    const rawCats = form.get("categoryIds") || "";
    const categoryIds = rawCats
      .split(",")
      .map((x) => x.trim())
      .filter((x) => x !== "")
      .map((x) => parseInt(x));

    const payload = {
      title: form.get("title"),
      synopsis: form.get("synopsis"),
      ratingId: parseInt(form.get("ratingId")),
      trailerUrl: form.get("trailerUrl"),
      posterUrl: form.get("posterUrl"),
      runtimeMin: parseInt(form.get("runtimeMin")),
      releaseDate: form.get("releaseDate"),
      categoryIds: categoryIds,
    };

    console.log("FINAL MOVIE PAYLOAD:", payload);

    try {
      // Use admin endpoint (your backend has /api/admin/movies POST)
      await apiFetch("/api/admin/movies", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      alert("Movie created successfully!");
      ev.target.reset();
      await loadAll(); // refresh movie list
    } catch (err) {
      console.warn("Create movie failed:", err);
      alert("Create movie failed — check console for payload");
    }
  };

  // === EDIT FLOW ===
  // Open edit UI with movie data
  const openEdit = (movie) => {
    // shallow clone so edits don't mutate list item
    setEditing({
      ...movie,
      // ensure categoryIds is present (backend exposes categories -> map to ids if needed)
      categoryIds: movie.categories ? Array.from(movie.categories).map((c) => c.id).join(",") : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancel editing
  const cancelEdit = () => setEditing(null);

  // Submit edit
  const handleEditSubmit = async (ev) => {
    ev.preventDefault();
    if (!editing || !editing.id) return;

    const form = new FormData(ev.target);
    const rawCats = form.get("categoryIds") || "";
    const categoryIds = rawCats
      .split(",")
      .map((x) => x.trim())
      .filter((x) => x !== "")
      .map((x) => parseInt(x));

    const payload = {
      title: form.get("title"),
      synopsis: form.get("synopsis"),
      ratingId: parseInt(form.get("ratingId")),
      trailerUrl: form.get("trailerUrl"),
      posterUrl: form.get("posterUrl"),
      runtimeMin: parseInt(form.get("runtimeMin")),
      releaseDate: form.get("releaseDate"),
      categoryIds: categoryIds,
    };

    try {
      // Try PATCH to admin update route; if your backend uses PUT or a different route change accordingly
      await apiFetch(`/api/admin/movies/${editing.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      alert("Movie updated successfully!");
      setEditing(null);
      await loadAll();
    } catch (err) {
      console.warn("Update movie failed:", err);
      alert("Update failed — backend may not expose PATCH /api/admin/movies/{id}. Check console for payload.");
      console.log("update payload:", payload);
    }
  };

  return (
    <div>
      <button onClick={onBack} style={{ marginBottom: 12 }}>← Back</button>
      <h2 style={{ color: "#fff" }}>Manage Movies</h2>

      {/* Search */}
      <form onSubmit={doSearch} style={{ marginBottom: 12, display: "flex", gap: 8 }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title or synopsis..." />
        <button type="submit">Search</button>
        <button type="button" onClick={loadAll}>Clear</button>
      </form>

      <div style={{ marginBottom: 12, color: "#ddd" }}>
        <strong>Genres:</strong>{" "}
        {genres.length ? genres.join(", ") : <em>(no genres endpoint / none returned)</em>}
      </div>

      {/* Table listing */}
      {loading ? <div style={{ color: "#ddd" }}>Loading…</div> : (
        <table style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <th>Title</th>
              <th>Runtime</th>
              <th>Release</th>
              <th>Genres</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((m) => (
              <tr key={m.id} style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                <td style={{ padding: "8px 6px" }}>{m.title}</td>
                <td>{m.runtimeMin ?? m.duration ?? "--"} min</td>
                <td>{m.releaseDate ?? "--"}</td>
                <td>{(m.genres && m.genres.join(", ")) || "—"}</td>
                <td>
                  <button onClick={() => onOpenMovie(m.id)}>Open</button>{" "}
                  <button onClick={() => openEdit(m)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* If editing: show Edit form (prefilled) */}
      {editing && (
        <section style={{ marginTop: 20, padding: 12, border: "1px dashed rgba(255,255,255,0.06)", borderRadius: 8 }}>
          <h3 style={{ color: "#fff" }}>Edit Movie</h3>
          <form onSubmit={handleEditSubmit} style={{ marginTop: 10, display: "grid", gap: 8, maxWidth: 520 }}>
            <input name="title" defaultValue={editing.title} placeholder="Title" required />
            <textarea name="synopsis" defaultValue={editing.synopsis} placeholder="Synopsis" rows={3} required />
            <input name="ratingId" type="number" defaultValue={editing.ratingId} placeholder="Rating ID (integer)" required />
            <input name="trailerUrl" defaultValue={editing.trailerUrl} placeholder="Trailer URL" />
            <input name="posterUrl" defaultValue={editing.posterUrl} placeholder="Poster URL" />
            <input name="runtimeMin" type="number" defaultValue={editing.runtimeMin} placeholder="Runtime (minutes)" required />
            <input name="releaseDate" type="date" defaultValue={editing.releaseDate ? editing.releaseDate.split("T")[0] : ""} required />
            <input name="categoryIds" defaultValue={editing.categoryIds} placeholder="Category IDs (comma separated)" />
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit">Save changes</button>
              <button type="button" onClick={cancelEdit}>Cancel</button>
            </div>
          </form>
        </section>
      )}

      {/* Add movie */}
      <section style={{ marginTop: 20, padding: 12, border: "1px dashed rgba(255,255,255,0.06)", borderRadius: 8 }}>
        <h3 style={{ color: "#fff" }}>Add Movie</h3>
        <form onSubmit={handleAdd} style={{ marginTop: 10, display: "grid", gap: 8, maxWidth: 520 }}>
          <input name="title" placeholder="Title" required />
          <textarea name="synopsis" placeholder="Synopsis" rows={3} required />
          <input name="ratingId" type="number" placeholder="Rating ID (integer)" required />
          <input name="trailerUrl" placeholder="Trailer URL" required />
          <input name="posterUrl" placeholder="Poster URL" required />
          <input name="runtimeMin" type="number" placeholder="Runtime (minutes)" required />
          <input name="releaseDate" type="date" required />
          <input name="categoryIds" placeholder="Category IDs (comma separated, e.g. 1,2,3)" required />
          <button type="submit">Create Movie</button>
        </form>
      </section>
    </div>
  );
};


// -------------------------------------------------------------
// -------------------- MOVIE DETAIL PAGE ----------------------
// -------------------------------------------------------------
const MovieDetailPage = ({ movieId, onBack }) => {
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [screeningOptions, setScreeningOptions] = useState([]);
  const [seatMap, setSeatMap] = useState(null);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const m = await apiFetch(`/api/movies/${movieId}`);
        setMovie(m);
      } catch {
        setMovie(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [movieId]);

  const loadShowtimes = async () => {
    try {
      const s = await apiFetch(`/api/movies/${movieId}/showtimes?date=${date}`);
      setShowtimes(Array.isArray(s) ? s : []);
    } catch {
      setShowtimes([]);
    }
  };

  const loadScreeningOptions = async () => {
    try {
      const s = await apiFetch(`/api/movies/${movieId}/screening-options`);
      setScreeningOptions(Array.isArray(s) ? s : []);
    } catch {
      setScreeningOptions([]);
    }
  };

  useEffect(() => {
    loadShowtimes();
    loadScreeningOptions();
  }, [movieId, date]);

  const loadSeatMap = async (screeningId) => {
    setSeatMap(null);
    try {
      const map = await apiFetch(`/api/screenings/${screeningId}/seatmap`);
      setSeatMap(map);
    } catch {
      setSeatMap(null);
      alert("Seatmap not available.");
    }
  };

  return (
    <div>
      <button onClick={onBack}>← Back</button>
      <h2 style={{ color: "#fff" }}>Movie detail</h2>

      {loading && <div style={{ color: "#ddd" }}>Loading…</div>}

      {movie && (
        <div style={{ color: "#fff" }}>
          <h3>{movie.title}</h3>
          <div>{movie.synopsis}</div>
          <div style={{ marginTop: 8 }}>
            <strong>Genres:</strong> {movie.genres?.join(", ") || "—"}
          </div>
        </div>
      )}

      <section style={{ marginTop: 16 }}>
        <h4 style={{ color: "#fff" }}>Showtimes for {date}</h4>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button onClick={loadShowtimes} style={{ marginLeft: 8 }}>Load</button>

        <ul style={{ color: "#ddd", marginTop: 8 }}>
          {showtimes.length
            ? showtimes.map((s) => (
                <li key={s.id}>
                  {new Date(s.startsAt).toLocaleString()} — Hall: {s.hall?.name ?? s.hall?.id}
                  <button style={{ marginLeft: 8 }} onClick={() => loadSeatMap(s.id)}>View seats</button>
                </li>
              ))
            : <li><em>No showtimes</em></li>}
        </ul>
      </section>

      <section style={{ marginTop: 16 }}>
        <h4 style={{ color: "#fff" }}>Quick screening options</h4>
        {screeningOptions.map((o) => (
          <button key={o.id} style={{ marginRight: 8 }} onClick={() => loadSeatMap(o.id)}>
            {o.date} @ {o.time}
          </button>
        ))}
      </section>

      <section style={{ marginTop: 16 }}>
        <h4 style={{ color: "#fff" }}>Seat map</h4>
        {seatMap ? (
          <pre style={{ background: "#111", padding: 8, color: "#eee", borderRadius: 6 }}>
            {JSON.stringify(seatMap, null, 2)}
          </pre>
        ) : (
          <div style={{ color: "#ccc" }}><em>Select a screening</em></div>
        )}
      </section>
    </div>
  );
};

// -------------------------------------------------------------
// -------------------- SHOWTIMES PAGE -------------------------
// -------------------------------------------------------------
// Replace the existing AdminShowtimesPage with this implementation
export const AdminShowtimesPage = ({ onBack }) => {
  const [movies, setMovies] = useState([]);
  const [showrooms, setShowrooms] = useState([]); // built from screenings
  const [screenings, setScreenings] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [movieRuntime, setMovieRuntime] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [scheduling, setScheduling] = useState(false);

  // Build unique halls array from screening list
  const buildHallsFromScreenings = (screeningsList = []) => {
    const map = {};
    (screeningsList || []).forEach((s) => {
      // backend ScreeningResponse has hallId and hallName
      if (s.hallId != null) map[s.hallId] = s.hallName ?? map[s.hallId] ?? `Hall ${s.hallId}`;
    });
    return Object.entries(map).map(([id, name]) => ({ id: Number(id), name }));
  };

  // Load movies and screenings on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // parallel fetch movies + screenings
        const [mv, sc] = await Promise.all([
          (async () => {
            try {
              const data = await apiFetch("/api/movies");
              return Array.isArray(data) ? data : [];
            } catch (err) {
              console.warn("Failed to load movies, fallback used", err);
              return fallbackMovies;
            }
          })(),
          (async () => {
            try {
              const data = await apiFetch("/api/admin/screenings");
              return Array.isArray(data) ? data : [];
            } catch (err) {
              console.warn("Failed to load screenings, fallback empty", err);
              return [];
            }
          })(),
        ]);

        setMovies(mv);
        setScreenings(sc);
        setShowrooms(buildHallsFromScreenings(sc));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // When a movie is selected, fetch its runtime (if available)
  const fetchMovieRuntime = async (movieId) => {
    setMovieRuntime(null);
    if (!movieId) return;
    try {
      const m = await apiFetch(`/api/movies/${movieId}`);
      setMovieRuntime(m?.runtimeMin ?? null);
    } catch (err) {
      console.warn("Failed to fetch movie runtime", err);
      setMovieRuntime(null);
    }
  };

  // Quick helper to refresh screenings + derived halls
  const reloadScreenings = async () => {
    try {
      const data = await apiFetch("/api/admin/screenings");
      const sc = Array.isArray(data) ? data : [];
      setScreenings(sc);
      setShowrooms(buildHallsFromScreenings(sc));
    } catch (err) {
      console.warn("Failed to refresh screenings", err);
      setScreenings([]);
      setShowrooms([]);
    }
  };

  // Calculate a preview end time using runtime (for UX)
  const calculateEnd = () => {
    if (!startTime || !movieRuntime) return "";
    const start = new Date(startTime);
    start.setMinutes(start.getMinutes() + movieRuntime);
    // return a datetime-local compatible string without timezone seconds
    // but for preview we show a simple iso-like substring
    return start.toISOString().slice(0, 16);
  };

  // Submit schedule -> backend expects ScreeningRequest: { movieId, hallId, startsAt }
  const handleSchedule = async (ev) => {
    ev?.preventDefault();
    if (!selectedMovieId) return alert("Choose a movie first.");
    if (!startTime) return alert("Choose a start time.");
    if (!ev) return;

    const form = new FormData(ev.target);
    const hallIdRaw = form.get("hallId");
    if (!hallIdRaw) return alert("Choose a showroom.");

    // Normalize startsAt to "YYYY-MM-DDTHH:mm:00" (no Z)
    // The <input type="datetime-local"> gives "YYYY-MM-DDTHH:mm"
    // append :00 so Spring's LocalDateTime parser accepts it.
    let startsAtVal = startTime;
    if (!startsAtVal.includes(":")) {
      return alert("Invalid start time format.");
    }
    if (startsAtVal.length === 16) startsAtVal = `${startsAtVal}:00`;

    const payload = {
      movieId: Number(selectedMovieId),
      hallId: Number(hallIdRaw),
      startsAt: startsAtVal,
      // isCanceled optional: not sending means false/default
    };

    setScheduling(true);
    try {
      await apiFetch("/api/admin/screenings", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      alert("Screening scheduled!");
      // clear form and reload listings
      setStartTime("");
      setSelectedMovieId("");
      setMovieRuntime(null);
      await reloadScreenings();
    } catch (err) {
      console.error("Schedule failed:", err);
      // apiFetch throws Error(status message) — show it
      alert(`Scheduling failed — check console. ${err.message || ""}`);
    } finally {
      setScheduling(false);
    }
  };

  // Small renderer helpers
  const fmtDateTime = (iso) => {
    try {
      if (!iso) return "—";
      // if backend returns with seconds / no Z, new Date() may treat as local; keep simple
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return iso;
      return d.toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <div>
      <button onClick={onBack}>← Back</button>
      <h2 style={{ color: "#fff" }}>Manage Showtimes</h2>

      {loading ? (
        <div style={{ color: "#ddd" }}>Loading…</div>
      ) : (
        <>
          <form onSubmit={handleSchedule} style={{ display: "grid", gap: 8, maxWidth: 520 }}>

            <label style={{ color: "#ddd" }}>
              Movie:
              <select
                name="movieId"
                required
                value={selectedMovieId}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedMovieId(id);
                  fetchMovieRuntime(id);
                }}
              >
                <option value="">Choose</option>
                {movies.map((m) => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
            </label>

            <label style={{ color: "#ddd" }}>
              Runtime:
              <input readOnly value={movieRuntime ? `${movieRuntime} minutes` : "—"} style={{ background: "#444", color: "#fff" }} />
            </label>

            <label style={{ color: "#ddd" }}>
              Showroom:
              <select name="hallId" required>
                <option value="">Choose</option>
                {showrooms.map((h) => (
                  <option key={h.id} value={h.id}>{h.name ?? `Hall ${h.id}`}</option>
                ))}
              </select>
            </label>

            <label style={{ color: "#ddd" }}>
              Starts At:
              <input
                name="startsAt"
                type="datetime-local"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </label>

            <label style={{ color: "#ddd" }}>
              Ends At (preview):
              <input readOnly value={calculateEnd()} style={{ background: "#444", color: "#fff" }} />
            </label>

            <button type="submit" disabled={scheduling}>
              {scheduling ? "Scheduling…" : "Schedule Showtime"}
            </button>
          </form>

          {/* All screenings table */}
          <h3 style={{ color: "#fff", marginTop: 20 }}>All Screenings</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <th>Movie</th>
                  <th>Hall</th>
                  <th>Starts</th>
                  <th>Ends</th>
                  <th>Seats</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {screenings.length ? screenings.map((s) => (
                  <tr key={s.id} style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                    <td style={{ padding: "8px 6px" }}>{s.movieTitle ?? `#${s.movieId}`}</td>
                    <td>{s.hallName ?? `Hall ${s.hallId}`}</td>
                    <td>{fmtDateTime(s.startsAt)}</td>
                    <td>{fmtDateTime(s.endsAt)}</td>
                    <td>{s.availableSeats ?? "—"}</td>
                    <td>{s.isCanceled ? "Canceled" : "Active"}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} style={{ color: "#ddd", padding: 12 }}><em>No screenings</em></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};




// -------------------------------------------------------------
// -------------------- PROMOTIONS PAGE ------------------------
// -------------------------------------------------------------
// Small form used to apply promo to a booking
function ApplyPromoForm({ onApply }) {
  const [bookingId, setBookingId] = useState("");
  const [code, setCode] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!bookingId || !code) {
          alert("Enter bookingId and code");
          return;
        }
        onApply(bookingId, code);
      }}
      style={{ display: "flex", gap: 8, marginTop: 8 }}
    >
      <input
        placeholder="Booking ID"
        value={bookingId}
        onChange={(e) => setBookingId(e.target.value)}
      />
      <input
        placeholder="Promo Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button type="submit">Apply</button>
    </form>
  );
}

export const AdminPromotionsPage = ({ onBack }) => {
  const [promotions, setPromotions] = useState([]);

  // Load promotions from backend
  useEffect(() => {
    (async () => {
      try {
        const p = await apiFetch("/api/admin/promotions");
        setPromotions(Array.isArray(p) ? p : []);
      } catch (err) {
        console.warn("Failed to load promotions, using fallback", err);
        setPromotions(fallbackPromotions);
      }
    })();
  }, []);

  // Create promotion
  const handleCreate = async (ev) => {
    ev.preventDefault();

    const formData = Object.fromEntries(new FormData(ev.target).entries());

    const payload = {
      ...formData,
      discountType: null // backend overrides to PERCENT
    };

    try {
      await apiFetch("/api/admin/promotions", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      alert("Promotion created successfully!");

      // Reload list
      const p = await apiFetch("/api/admin/promotions");
      setPromotions(Array.isArray(p) ? p : []);

    } catch (err) {
      console.warn("Failed to create promotion:", err);
      alert("Create promo failed — check console");
      console.log("payload:", payload);
    }
  };

  // Apply promo to booking (fixed for your backend)
  const handleApply = async (bookingId, code) => {
    const url = `/api/promotions/api/promotions/apply?bookingId=${bookingId}&code=${encodeURIComponent(code)}`;

    try {
      await apiFetch(url, { method: "POST" });
      alert("Promotion applied successfully!");
    } catch (err) {
      console.error("Apply promo failed:", err);
      alert("Failed to apply promotion — see console.");
    }
  };

  return (
    <div>
      <button onClick={onBack}>← Back</button>
      <h2 style={{ color: "#fff" }}>Manage Promotions</h2>

      {/* Create promo */}
      <form onSubmit={handleCreate} style={{ maxWidth: 480, display: "grid", gap: 8 }}>
        <input name="code" placeholder="Promo code (e.g. NEWYEAR25)" required />
        <input name="discountValue" type="number" placeholder="Discount %" required />
        <input name="startsOn" type="date" required />
        <input name="endsOn" type="date" required />
        <button type="submit">Create Promotion</button>
      </form>

      {/* List */}
      <h3 style={{ color: "#fff", marginTop: 16 }}>Existing promotions</h3>
      <ul style={{ color: "#ddd" }}>
        {promotions.map((p) => (
          <li key={p.id}>
            {p.code} — {p.discountValue}% ({p.startsOn} → {p.endsOn})
          </li>
        ))}
      </ul>

      {/* Apply promo */}
      <div style={{ marginTop: 12, color: "#ddd" }}>
        <strong>Apply a promo to a booking</strong>
        <ApplyPromoForm onApply={handleApply} />
      </div>
    </div>
  );
};



// -------------------------------------------------------------
// ---------------------- USERS PAGE ---------------------------
// -------------------------------------------------------------
export const AdminUsersPage = ({ onBack }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const list = await apiFetch("/api/users");
        setUsers(Array.isArray(list) ? list : []);
      } catch {
        setUsers(fallbackUsers);
      }
    })();
  }, []);

  return (
    <div>
      <button onClick={onBack}>← Back</button>
      <h2 style={{ color: "#fff" }}>Manage Users</h2>

      <table style={{ width: "100%", color: "#fff", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Email</th><th>Name</th><th>Role</th><th>Promo</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.email || u.id}>
              <td>{u.email}</td>
              <td>{(u.firstName || "") + " " + (u.lastName || "")}</td>
              <td>{u.userType?.typeName ?? u.role ?? "—"}</td>
              <td>{u.promoOptIn ? "✅" : "❌"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
