// apps/api/src/index.ts
import { Hono } from "hono";
import { cors } from "hono/cors";
import { bodyLimit } from "hono/body-limit";
import { streamSSE } from "hono/streaming";

// packages/shared/src/index.ts
import { z } from "zod";
var DataQuality = z.enum(["live", "directory", "operator_reported", "community_reported", "demo", "unavailable"]);
var ShowStatus = z.enum(["scheduled", "selling", "fast_filling", "sold_out", "cancelled"]);
var RegionSchema = z.object({ id: z.string(), state: z.string(), district: z.string(), city: z.string(), slug: z.string(), lat: z.number(), lng: z.number(), isActive: z.boolean() });
var MovieSchema = z.object({ id: z.string(), title: z.string(), slug: z.string(), synopsis: z.string(), runtimeMinutes: z.number().int().positive().nullable().optional(), certification: z.enum(["U", "UA", "A"]), languages: z.array(z.string()), genres: z.array(z.string()), posterUrl: z.string().url().optional(), status: z.enum(["now_showing", "upcoming", "ended"]), dataQuality: DataQuality, source: z.string(), lastUpdatedAt: z.string() });
var ShowSchema = z.object({ id: z.string(), movieId: z.string(), theatreId: z.string(), startsAt: z.string(), format: z.string(), language: z.string(), status: ShowStatus, priceFromPaise: z.number().int().nonnegative(), availableSeats: z.number().int().nonnegative().nullable(), source: z.string(), lastUpdatedAt: z.string(), dataQuality: DataQuality });
var TheatreSchema = z.object({ id: z.string(), name: z.string(), slug: z.string(), address: z.string(), regionId: z.string(), lat: z.number(), lng: z.number(), rating: z.number().min(0).max(5), formats: z.array(z.string()), facilities: z.array(z.string()), verified: z.boolean(), dataQuality: DataQuality, source: z.string(), lastUpdatedAt: z.string(), shows: z.array(ShowSchema) });
var CompareQuerySchema = z.object({ movie: z.string().default("rekhachithram"), region: z.string().default("kochi"), date: z.string().optional(), sort: z.enum(["best_value", "lowest_price", "nearest", "earliest", "most_available"]).default("best_value"), language: z.string().optional(), format: z.string().optional(), maxPrice: z.coerce.number().optional(), lat: z.coerce.number().optional(), lng: z.coerce.number().optional() });
var OperatorShowInputSchema = z.object({ movieId: z.string(), startsAt: z.string().datetime(), format: z.string().min(1), language: z.string().min(1), priceFromPaise: z.number().int().nonnegative(), availableSeats: z.number().int().nonnegative().nullable().default(null) });
var OperatorFeedSchema = z.object({ shows: z.array(OperatorShowInputSchema).min(1).max(500) });
var CommunityReportSchema = z.object({ theatreId: z.string(), note: z.string().min(10).max(500), observedAt: z.string().datetime() });
var AlertSchema = z.object({ email: z.string().email(), showId: z.string(), kind: z.enum(["price_drop", "availability", "reminder"]).default("availability") });
var TheatreClaimSchema = z.object({ theatreId: z.string(), operatorName: z.string().min(2).max(120), email: z.string().email() });
var OperatorSignupSchema = z.object({ email: z.string().email(), password: z.string().min(8).max(128), theatreId: z.string() });
var OperatorLoginSchema = z.object({ email: z.string().email(), password: z.string().min(8).max(128) });
var CsvImportSchema = z.object({ csv: z.string().min(10).max(2e6) });

// packages/providers/src/demo.ts
var demoRegion = { id: "reg-kochi", state: "Kerala", district: "Ernakulam", city: "Kochi", slug: "kochi", lat: 9.9312, lng: 76.2673, isActive: true };
var demoMovies = [
  MovieSchema.parse({ id: "mov-rekhachithram", title: "Rekhachithram", slug: "rekhachithram", synopsis: "A mystery unfolds through a forgotten reel and the stories hidden inside it.", runtimeMinutes: 138, certification: "UA", languages: ["Malayalam"], genres: ["Drama", "Mystery"], status: "now_showing", dataQuality: "demo", source: "demo", lastUpdatedAt: (/* @__PURE__ */ new Date()).toISOString() }),
  MovieSchema.parse({ id: "mov-bhoothaddam", title: "Bhoothaddam Bhaskar Narayana", slug: "bhoothaddam-bhaskar-narayana", synopsis: "A sharp-eyed investigator follows a trail that no one else can see.", runtimeMinutes: 122, certification: "UA", languages: ["Malayalam"], genres: ["Mystery", "Thriller"], status: "now_showing", dataQuality: "demo", source: "demo", lastUpdatedAt: (/* @__PURE__ */ new Date()).toISOString() }),
  MovieSchema.parse({ id: "mov-vaazha", title: "Vaazha", slug: "vaazha", synopsis: "A warm comedy about friendship, family and finding your own pace.", runtimeMinutes: 125, certification: "UA", languages: ["Malayalam"], genres: ["Comedy", "Drama"], status: "now_showing", dataQuality: "demo", source: "demo", lastUpdatedAt: (/* @__PURE__ */ new Date()).toISOString() }),
  MovieSchema.parse({ id: "mov-last-voyage", title: "The Last Voyage", slug: "the-last-voyage", synopsis: "An impossible journey becomes a last chance to come home.", runtimeMinutes: null, certification: "UA", languages: ["English"], genres: ["Adventure", "Sci-fi"], status: "now_showing", dataQuality: "demo", source: "demo", lastUpdatedAt: (/* @__PURE__ */ new Date()).toISOString() })
];
function createDemoTheatres() {
  const names = ["PVR Lulu Mall", "Cinepolis Centre Square", "Shenoys Theatre", "Vanitha Vineetha", "Sangeetha Cinemas", "Aashirvad Cineplexx"];
  const now = /* @__PURE__ */ new Date();
  const updated = new Date(Date.now() - 4 * 6e4).toISOString();
  const kolkataDate = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  return names.map((name, index) => TheatreSchema.parse({ id: `thr-${index + 1}`, name, slug: name.toLowerCase().replaceAll(" ", "-"), address: `${index % 2 ? "MG Road" : "Edappally"}, Kochi, Kerala`, regionId: demoRegion.id, lat: demoRegion.lat + index * 6e-3, lng: demoRegion.lng + index * 5e-3, rating: 4.1 + index % 5 / 10, formats: index % 2 ? ["2D", "Dolby Atmos"] : ["2D", "Laser projection"], facilities: ["Parking", "F&B", index % 2 ? "Wheelchair access" : "Recliner"], verified: index !== 2, dataQuality: "demo", source: "demo", lastUpdatedAt: updated, shows: [10, 13, 16, 19].flatMap((hour, showIndex) => demoMovies.slice(0, 2).map((movie, movieIndex) => ({ id: `show-${index}-${showIndex}-${movieIndex}`, movieId: movie.id, theatreId: `thr-${index + 1}`, startsAt: `${kolkataDate}T${String(hour).padStart(2, "0")}:15:00+05:30`, format: index % 2 ? "2D" : "Laser projection", language: movie.languages[0], status: showIndex === 3 ? "fast_filling" : "selling", priceFromPaise: (120 + index * 20 + showIndex * 10 + movieIndex * 20) * 100, availableSeats: 24 + (index + 1) * 13 % 70, source: "demo", lastUpdatedAt: updated, dataQuality: "demo" }))) }));
}

// packages/providers/src/tmdb.ts
async function fetchTmdbNowPlaying(region, apiKey, fetcher = fetch) {
  if (!apiKey) return [];
  const response = await fetcher("https://api.themoviedb.org/3/movie/now_playing?region=IN&language=en-IN", { headers: { Authorization: `Bearer ${apiKey}` } });
  if (!response.ok) throw new Error(`TMDB request failed: ${response.status}`);
  const payload = await response.json();
  return (payload.results ?? []).flatMap((movie) => {
    try {
      const parsed = MovieSchema.safeParse({ id: `tmdb-${movie.id}`, title: movie.title, slug: movie.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"), synopsis: movie.overview || "Not available", runtimeMinutes: null, certification: "UA", languages: ["English"], genres: [], posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : void 0, status: "now_showing", dataQuality: "live", source: "tmdb", lastUpdatedAt: (/* @__PURE__ */ new Date()).toISOString() });
      return parsed.success ? [parsed.data] : [];
    } catch {
      return [];
    }
  });
}

// packages/scoring/src/index.ts
function valueScore(theatre) {
  const cheapest = theatre.shows.length ? Math.min(...theatre.shows.map((show) => show.priceFromPaise)) : 6e4;
  const price = 1 - cheapest / 6e4;
  const quality = theatre.formats.some((format) => /imax|dolby|4dx|laser/i.test(format)) ? 1 : 0.65;
  const availability = theatre.shows.reduce((sum, show) => sum + (show.availableSeats ?? 0), 0) / Math.max(1, theatre.shows.length * 100);
  const ageHours = Math.max(0, (Date.now() - new Date(theatre.lastUpdatedAt).getTime()) / 36e5);
  const freshness = theatre.dataQuality === "demo" ? 0.75 : Math.max(0, theatre.dataQuality === "live" ? 1 : 0.85 - Math.min(ageHours / 240, 0.75));
  return Math.round((price * 0.4 + quality * 0.25 + Math.min(availability, 1) * 0.2 + freshness * 0.15) * 100);
}
function sortTheatres(theatres, sort, origin) {
  const cheapest = (theatre) => theatre.shows.length ? Math.min(...theatre.shows.map((show) => show.priceFromPaise)) : Number.POSITIVE_INFINITY;
  const availability = (theatre) => theatre.shows.reduce((sum, show) => sum + (show.availableSeats ?? 0), 0);
  const earliest = (theatre) => theatre.shows.length ? Math.min(...theatre.shows.map((show) => new Date(show.startsAt).getTime())) : Number.POSITIVE_INFINITY;
  const distance = (theatre) => origin ? Math.hypot(theatre.lat - origin.lat, theatre.lng - origin.lng) : Number.POSITIVE_INFINITY;
  return [...theatres].sort((a, b) => sort === "lowest_price" ? cheapest(a) - cheapest(b) : sort === "most_available" ? availability(b) - availability(a) : sort === "earliest" ? earliest(a) - earliest(b) : sort === "nearest" ? distance(a) - distance(b) : valueScore(b) - valueScore(a));
}

// apps/api/src/index.ts
var app = new Hono().basePath("/api/v1");
var allowedOrigins = ((typeof process !== "undefined" ? process.env.ALLOWED_ORIGINS : "") || "http://localhost:5173,http://localhost:4173").split(",").map((value) => value.trim()).filter(Boolean);
app.use("*", cors({ origin: (origin) => origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0] }));
app.use("*", bodyLimit({ maxSize: 2e6 }));
app.use("*", async (c, next) => {
  await next();
  c.header("X-Content-Type-Options", "nosniff");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  c.header("Permissions-Policy", "geolocation=(self), microphone=()");
});
var reports = [];
var alerts = [];
var claims = [];
var operators = [];
var sessions = /* @__PURE__ */ new Map();
var rateBuckets = /* @__PURE__ */ new Map();
var tmdbApiKey = typeof process !== "undefined" ? process.env.TMDB_API_KEY ?? "" : "";
async function catalogMovies() {
  if (!tmdbApiKey) return { movies: demoMovies, dataQuality: "demo", source: "demo" };
  try {
    const movies = await fetchTmdbNowPlaying(demoRegion, tmdbApiKey);
    return { movies: movies.length ? movies : demoMovies, dataQuality: movies.length ? "live" : "demo", source: movies.length ? "tmdb" : "demo" };
  } catch {
    return { movies: demoMovies, dataQuality: "demo", source: "demo" };
  }
}
var requestId = () => crypto.randomUUID();
var base64 = (bytes) => btoa(String.fromCharCode(...bytes));
var fromBase64 = (value) => Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
var jsonError = (c, code, message, status, details) => c.json({ error: { code, message, ...details ? { details } : {}, requestId: requestId() } }, status);
async function passwordHash(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 12e4, hash: "SHA-256" }, key, 256));
  return `pbkdf2$120000$${base64(salt)}$${base64(bits)}`;
}
async function passwordMatches(password, stored) {
  const [, iterations, saltValue, hashValue] = stored.split("$");
  if (!iterations || !saltValue || !hashValue) return false;
  const salt = fromBase64(saltValue);
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: Number(iterations), hash: "SHA-256" }, key, 256));
  const expected = fromBase64(hashValue);
  return bits.length === expected.length && bits.every((value, index) => value === expected[index]);
}
function limited(c, key, max = 20) {
  const now = Date.now();
  const address = c.req.header("x-forwarded-for") ?? "local";
  const bucketKey = `${key}:${address}`;
  const bucket = rateBuckets.get(bucketKey);
  if (!bucket || bucket.resetAt < now) {
    rateBuckets.set(bucketKey, { count: 1, resetAt: now + 6e4 });
    return false;
  }
  bucket.count += 1;
  return bucket.count > max;
}
function session(c) {
  const token = (c.req.header("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  const value = sessions.get(token);
  if (!value || value.expiresAt < Date.now()) {
    if (value) sessions.delete(token);
    return null;
  }
  return operators.find((operator) => operator.id === value.operatorId) ?? null;
}
app.onError((error, c) => {
  const isValidation = error instanceof SyntaxError || error.name === "ZodError";
  return jsonError(c, isValidation ? "VALIDATION_ERROR" : "INTERNAL_ERROR", isValidation ? "Request payload is invalid" : "Unexpected server error", isValidation ? 400 : 500);
});
app.notFound((c) => jsonError(c, "NOT_FOUND", "Route not found", 404));
app.get("/health", (c) => c.json({ ok: true, service: "showscout-api", timestamp: (/* @__PURE__ */ new Date()).toISOString() }));
app.get("/regions", (c) => c.json({ data: [demoRegion], attribution: "ShowScout demo dataset" }));
app.get("/movies", async (c) => {
  const catalog = await catalogMovies();
  return c.json({ data: catalog.movies, meta: { dataQuality: catalog.dataQuality, source: catalog.source, lastUpdatedAt: (/* @__PURE__ */ new Date()).toISOString() } });
});
app.get("/movies/:slug", (c) => {
  const movie = demoMovies.find((item) => item.slug === c.req.param("slug"));
  return movie ? c.json({ data: movie }) : c.json({ error: { code: "NOT_FOUND", message: "Movie not found" } }, 404);
});
app.get("/theatres", (c) => c.json({ data: createDemoTheatres() }));
app.get("/theatres/:slug", (c) => {
  const theatre = createDemoTheatres().find((item) => item.slug === c.req.param("slug"));
  return theatre ? c.json({ data: theatre }) : c.json({ error: { code: "NOT_FOUND", message: "Theatre not found" } }, 404);
});
app.get("/compare", (c) => {
  const query = CompareQuerySchema.parse(c.req.query());
  const movie = demoMovies.find((item) => item.slug === query.movie || item.id === query.movie);
  if (!movie) return jsonError(c, "NOT_FOUND", "Movie not found", 404);
  const theatres = sortTheatres(createDemoTheatres().map((theatre) => ({
    ...theatre,
    shows: theatre.shows.filter((show) => show.movieId === movie.id && (!query.date || show.startsAt.slice(0, 10) === query.date) && (!query.language || show.language === query.language) && (!query.format || show.format === query.format) && (!query.maxPrice || show.priceFromPaise <= query.maxPrice))
  })), query.sort, query.lat != null && query.lng != null ? { lat: query.lat, lng: query.lng } : void 0).map((theatre) => ({ ...theatre, valueScore: valueScore(theatre) }));
  return c.json({ data: { movie, region: demoRegion, theatres }, meta: { dataQuality: "demo", source: "demo", lastUpdatedAt: (/* @__PURE__ */ new Date()).toISOString() } });
});
app.get("/search/suggest", (c) => {
  const q = (c.req.query("q") ?? "").trim().toLowerCase();
  const movies = demoMovies.filter((movie) => movie.title.toLowerCase().includes(q)).map((movie) => ({ type: "movie", title: movie.title, slug: movie.slug }));
  const theatres = createDemoTheatres().filter((theatre) => theatre.name.toLowerCase().includes(q)).map((theatre) => ({ type: "theatre", title: theatre.name, slug: theatre.slug }));
  return c.json({ data: [...movies, ...theatres].slice(0, 8) });
});
app.get("/shows/:id", (c) => {
  const show = createDemoTheatres().flatMap((theatre) => theatre.shows.map((item) => ({ ...item, theatre }))).find((item) => item.id === c.req.param("id"));
  return show ? c.json({ data: { ...show, priceBreakdown: { basePaise: show.priceFromPaise, convenienceFeePaise: 0, taxPaise: 0, totalPaise: show.priceFromPaise }, seatMap: null } }) : c.json({ error: { code: "NOT_FOUND", message: "Show not found" } }, 404);
});
app.post("/feeds/:theatreId/shows", async (c) => {
  const operator = session(c);
  if (!operator) return jsonError(c, "UNAUTHORIZED", "A valid operator session is required", 401);
  if (operator.theatreId !== c.req.param("theatreId") || !operator.claimVerified) return jsonError(c, "FORBIDDEN", "Verified theatre ownership is required", 403);
  const theatre = createDemoTheatres().find((item) => item.id === c.req.param("theatreId"));
  if (!theatre) return jsonError(c, "NOT_FOUND", "Theatre not found", 404);
  const parsed = OperatorFeedSchema.safeParse(await c.req.json());
  if (!parsed.success) return jsonError(c, "VALIDATION_ERROR", "Feed did not match the operator schema", 400, parsed.error.flatten());
  return c.json({ data: { accepted: parsed.data.shows.length, theatreId: theatre.id, dataQuality: "operator_reported", receivedAt: (/* @__PURE__ */ new Date()).toISOString() } }, 202);
});
app.post("/community/reports", async (c) => {
  if (limited(c, "reports")) return jsonError(c, "RATE_LIMITED", "Too many reports", 429);
  const parsed = CommunityReportSchema.safeParse(await c.req.json());
  if (!parsed.success) return jsonError(c, "VALIDATION_ERROR", "Report did not match the community schema", 400, parsed.error.flatten());
  const note = parsed.data.note.replace(/[<>]/g, "");
  const report = { id: `report-${reports.length + 1}`, ...parsed.data, note, status: "pending" };
  reports.push(report);
  if (reports.length > 1e3) reports.shift();
  return c.json({ data: report, message: "Report received for moderation" }, 202);
});
app.get("/community/reports", (c) => c.json({ data: reports.map((report) => ({ ...report, dataQuality: "community_reported" })) }));
app.get("/compare/stream", (c) => streamSSE(c, async (stream) => {
  await stream.writeSSE({ event: "freshness", data: JSON.stringify({ source: "demo", dataQuality: "demo", updatedAt: (/* @__PURE__ */ new Date()).toISOString() }) });
  await stream.sleep(1e3);
  await stream.writeSSE({ event: "heartbeat", data: JSON.stringify({ ok: true }) });
}));
app.get("/export.json", (c) => c.json({ attribution: "ShowScout demo dataset", dataQuality: "demo", regions: [demoRegion], movies: demoMovies, theatres: createDemoTheatres() }));
app.get("/admin/data-quality", (c) => {
  if (!session(c)) return jsonError(c, "UNAUTHORIZED", "A valid operator session is required", 401);
  const theatres = createDemoTheatres();
  const shows = theatres.flatMap((theatre) => theatre.shows);
  return c.json({ data: { theatres: theatres.length, shows: shows.length, demoPercent: 100, stalePercent: 0, operatorReportedPercent: 0, providerHealth: [{ provider: "demo", status: "healthy", lastRun: (/* @__PURE__ */ new Date()).toISOString() }, { provider: "osm", status: "disabled", lastRun: null }, { provider: "tmdb", status: "disabled", lastRun: null }] } });
});
app.post("/operator/signup", async (c) => {
  if (limited(c, "signup")) return jsonError(c, "RATE_LIMITED", "Too many signup attempts", 429);
  const parsed = OperatorSignupSchema.safeParse(await c.req.json());
  if (!parsed.success) return jsonError(c, "VALIDATION_ERROR", "Signup payload is invalid", 400, parsed.error.flatten());
  if (operators.some((operator2) => operator2.email === parsed.data.email)) return jsonError(c, "CONFLICT", "An operator account already exists for this email", 409);
  const operator = { id: crypto.randomUUID(), email: parsed.data.email, passwordHash: await passwordHash(parsed.data.password), theatreId: parsed.data.theatreId, claimVerified: false };
  operators.push(operator);
  return c.json({ data: { id: operator.id, email: operator.email, theatreId: operator.theatreId, claimStatus: "pending" }, message: "Account created. Verify ownership before publishing live data." }, 201);
});
app.post("/operator/login", async (c) => {
  if (limited(c, "login")) return jsonError(c, "RATE_LIMITED", "Too many login attempts", 429);
  const parsed = OperatorLoginSchema.safeParse(await c.req.json());
  if (!parsed.success) return jsonError(c, "VALIDATION_ERROR", "Login payload is invalid", 400, parsed.error.flatten());
  const operator = operators.find((item) => item.email === parsed.data.email);
  if (!operator || !await passwordMatches(parsed.data.password, operator.passwordHash)) return jsonError(c, "UNAUTHORIZED", "Invalid credentials", 401);
  const token = crypto.randomUUID();
  sessions.set(token, { operatorId: operator.id, expiresAt: Date.now() + 864e5 });
  return c.json({ data: { token, expiresAt: new Date(Date.now() + 864e5).toISOString(), operatorId: operator.id, theatreId: operator.theatreId, claimStatus: operator.claimVerified ? "verified" : "pending" } });
});
app.get("/operator/me", (c) => {
  const operator = session(c);
  return operator ? c.json({ data: { id: operator.id, email: operator.email, theatreId: operator.theatreId, claimStatus: operator.claimVerified ? "verified" : "pending" } }) : jsonError(c, "UNAUTHORIZED", "A valid operator session is required", 401);
});
app.post("/operator/logout", (c) => {
  const token = (c.req.header("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  sessions.delete(token);
  return c.json({ data: { loggedOut: true } });
});
app.post("/portal/import", async (c) => {
  const operator = session(c);
  if (!operator) return jsonError(c, "UNAUTHORIZED", "A valid operator session is required", 401);
  if (!operator.claimVerified) return jsonError(c, "FORBIDDEN", "Verified theatre ownership is required", 403);
  const parsed = CsvImportSchema.safeParse(await c.req.json());
  if (!parsed.success) return jsonError(c, "VALIDATION_ERROR", "CSV payload is invalid", 400, parsed.error.flatten());
  const lines = parsed.data.csv.trim().split(/\r?\n/);
  const header = lines.shift()?.toLowerCase() ?? "";
  const required = ["movie_id", "starts_at", "format", "language", "price_paise"];
  const missing = required.filter((column) => !header.includes(column));
  if (missing.length) return jsonError(c, "VALIDATION_ERROR", `Missing columns: ${missing.join(", ")}`, 400);
  const accepted = lines.filter((line) => line.split(",").length >= required.length).length;
  return c.json({ data: { accepted, rejected: Math.max(0, lines.length - accepted), dataQuality: "operator_reported", source: "operator_csv" } }, 202);
});
app.post("/alerts", async (c) => {
  if (limited(c, "alerts")) return jsonError(c, "RATE_LIMITED", "Too many alert requests", 429);
  const parsed = AlertSchema.safeParse(await c.req.json());
  if (!parsed.success) return jsonError(c, "VALIDATION_ERROR", "Alert payload is invalid", 400, parsed.error.flatten());
  const alert = { id: `alert-${alerts.length + 1}`, ...parsed.data, createdAt: (/* @__PURE__ */ new Date()).toISOString() };
  alerts.push(alert);
  if (alerts.length > 1e3) alerts.shift();
  return c.json({ data: alert, message: "Alert registered. Delivery is opt-in and provider-backed." }, 201);
});
app.get("/alerts", (c) => c.json({ data: alerts.map(({ email: _email, ...safe }) => safe) }));
app.post("/operator/claims", async (c) => {
  const parsed = TheatreClaimSchema.safeParse(await c.req.json());
  if (!parsed.success) return c.json({ error: { code: "VALIDATION_ERROR", message: "Claim payload is invalid", details: parsed.error.flatten() } }, 400);
  const claim = { id: `claim-${claims.length + 1}`, ...parsed.data, status: "pending" };
  claims.push(claim);
  return c.json({ data: claim, message: "Claim queued for email/phone verification." }, 202);
});
app.get("/out/:bookingLinkId", (c) => {
  const destination = c.req.query("provider") === "district" ? "https://www.district.in/" : c.req.query("provider") === "bookmyshow" ? "https://in.bookmyshow.com/" : null;
  if (!destination) return jsonError(c, "NOT_FOUND", "Booking link not found", 404);
  c.header("Cache-Control", "no-store");
  return c.redirect(destination, 302);
});
app.get("/formats", (c) => c.json({ data: [{ key: "imax", name: "IMAX", verified: true, bestFor: "Large-format spectacle" }, { key: "dolby-atmos", name: "Dolby Atmos", verified: true, bestFor: "Immersive sound" }, { key: "4dx", name: "4DX", verified: false, bestFor: "Motion and effects; verify at theatre" }] }));
app.get("/openapi.json", (c) => c.json({ openapi: "3.0.3", info: { title: "ShowScout API", version: "0.1.0" }, paths: { "/api/v1/compare": { get: { summary: "Compare nearby showtimes and prices" } }, "/api/v1/movies": { get: { summary: "List movies" } }, "/api/v1/theatres": { get: { summary: "List theatres" } }, "/api/v1/feeds/{theatreId}/shows": { post: { summary: "Operator show feed" } }, "/api/v1/community/reports": { post: { summary: "Moderated community report" } } } }));
var index_default = app;
export {
  index_default as default
};
