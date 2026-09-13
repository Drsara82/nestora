"use client";
/* Local portfolio photography uses responsive native images intentionally. */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import {
  Bath,
  BedDouble,
  CalendarDays,
  CalendarRange,
  Check,
  GitCompareArrows,
  Heart,
  Eye,
  EyeOff,
  KeyRound,
  MapPin,
  Menu,
  Ruler,
  Search,
  Sofa,
  X,
} from "lucide-react";
import {
  agents,
  navigation,
  neighborhoods,
  properties,
  site,
} from "./data/site";

const money = (n) =>
  new Intl.NumberFormat("en-SA", { maximumFractionDigits: 0 }).format(n);
const galleryLabels = ["Exterior", "Living room", "Kitchen", "Primary bedroom"];
const readStoredArray = (key) => {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};
const writeStoredArray = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Browser storage can be unavailable; the in-memory experience still works.
  }
};

function Link({ to, children, className = "", onClick, ...rest }) {
  return (
    <a
      href={to}
      className={className}
      {...rest}
      onClick={(e) => {
        if (
          e.defaultPrevented ||
          e.button !== 0 ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey
        )
          return;
        e.preventDefault();
        history.pushState({}, "", to);
        dispatchEvent(new PopStateEvent("popstate"));
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}

function Header({ favorites, compare, path }) {
  const [open, setOpen] = useState(false);
  const propertyRoute = path.startsWith("/property/")
    ? properties.find((property) => `/property/${property.slug}` === path)
    : null;
  const isActiveRoute = (href) =>
    path === href ||
    (href === "/neighborhoods" && path.startsWith("/neighborhood/")) ||
    (href === "/agents" && path.startsWith("/agent/")) ||
    (href === "/buy" && propertyRoute?.purpose === "Sale") ||
    (href === "/rent" && propertyRoute?.purpose === "Rent");
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event) => event.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link to="/" className="brand">
          <span className="brand-mark">N</span>Nestora
        </Link>
        <button
          type="button"
          className="menu-button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <nav
          id="main-navigation"
          className={`nav-links ${open ? "open" : ""}`}
          aria-label="Main navigation"
        >
          {navigation.map(([label, href]) => (
            <Link
              key={href}
              to={href}
              className={isActiveRoute(href) ? "active" : ""}
              aria-current={isActiveRoute(href) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <Link
            to="/compare"
            aria-label={`${compare.length} properties to compare`}
          >
            <GitCompareArrows aria-hidden="true" />
            <span>{compare.length}</span>
          </Link>
          <Link
            to="/favorites"
            aria-label={`${favorites.length} saved properties`}
          >
            <Heart aria-hidden="true" />
            <span>{favorites.length}</span>
          </Link>
          <Link to="/signin" className="account-link">
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}

function SearchBox({ initialPurpose = "Sale", onSearch, onSaveSearch }) {
  const [purpose, setPurpose] = useState(initialPurpose),
    [location, setLocation] = useState(""),
    [type, setType] = useState(""),
    [budget, setBudget] = useState("");
  const budgetOptions =
    purpose === "Sale"
      ? [
          ["1500000", "SAR 1,500,000"],
          ["3000000", "SAR 3,000,000"],
          ["5000000", "SAR 5,000,000"],
          ["8000000", "SAR 8,000,000"],
        ]
      : [
          ["60000", "SAR 60,000 / year"],
          ["100000", "SAR 100,000 / year"],
          ["150000", "SAR 150,000 / year"],
          ["250000", "SAR 250,000 / year"],
        ];
  const changePurpose = (nextPurpose) => {
    setPurpose(nextPurpose);
    setBudget("");
  };
  const submit = (event) => {
    event.preventDefault();
    onSearch({ purpose, location: location.trim(), type, budget });
  };
  return (
    <div className="search-shell">
      <div className="search-tabs" role="group" aria-label="Listing purpose">
        {["Sale", "Rent"].map((x) => (
          <button
            type="button"
            aria-pressed={purpose === x}
            key={x}
            onClick={() => changePurpose(x)}
          >
            {x === "Sale" ? "Buy" : "Rent"}
          </button>
        ))}
      </div>
      <form className="search-fields" onSubmit={submit}>
        <label>
          <span>Location</span>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Neighborhood or address"
            autoComplete="street-address"
          />
        </label>
        <label>
          <span>Property type</span>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Any type</option>
            {[
              "Villa",
              "Apartment",
              "Townhouse",
              "Duplex",
              "Residential Floor",
              "Studio",
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          <span>
            {purpose === "Sale" ? "Maximum price" : "Maximum annual rent"}
          </span>
          <select value={budget} onChange={(e) => setBudget(e.target.value)}>
            <option value="">Any budget</option>
            {budgetOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <div className="search-actions">
          <button type="submit" className="primary search-button">
            <Search aria-hidden="true" /> Search homes
          </button>
          <button
            type="button"
            className="save-search-hero"
            onClick={() =>
              onSaveSearch({
                purpose,
                location: location.trim(),
                type,
                maxPrice: budget,
              })
            }
          >
            Save search
          </button>
        </div>
      </form>
    </div>
  );
}

function PropertyCard({
  property: p,
  favorite,
  comparing,
  toggleFavorite,
  toggleCompare,
  savedView = false,
}) {
  return (
    <article
      className={`property-card ${p.purpose === "Rent" ? "rental-card" : ""} ${savedView ? "saved-property-card" : ""}`}
    >
      <div className="property-media">
        <Link to={`/property/${p.slug}`}>
          <img
            src={p.coverImage}
            alt={`${p.propertyType} in ${p.neighborhood}`}
            loading="lazy"
          />
        </Link>
        <div className="property-badges">
          <span
            className={`status-badge ${p.status === "Reserved" ? "reserved" : ""}`}
          >
            {p.status === "Reserved" ? "Reserved" : `For ${p.purpose}`}
          </span>
          {p.purpose === "Rent" && p.furnished && (
            <span className="feature-badge">
              <Sofa aria-hidden="true" /> Furnished
            </span>
          )}
        </div>
        <button
          type="button"
          className="heart-button"
          aria-label={favorite ? "Remove from favorites" : "Save property"}
          aria-pressed={favorite}
          onClick={() => toggleFavorite(p.id)}
        >
          <Heart aria-hidden="true" fill={favorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="property-body">
        <div className="price-row">
          <div>
            <strong>
              SAR {money(p.price)}
              {p.rentPeriod && <small> / {p.rentPeriod}</small>}
            </strong>
            {p.purpose === "Rent" && (
              <span className="monthly-equivalent">
                ≈ SAR {money(Math.round(p.price / 12))} / month
              </span>
            )}
          </div>
          <button
            type="button"
            className={`compare ${comparing ? "active" : ""}`}
            aria-label={
              comparing ? "Remove from comparison" : "Add to comparison"
            }
            onClick={() => toggleCompare(p.id)}
            aria-pressed={comparing}
          >
            <GitCompareArrows aria-hidden="true" />
          </button>
        </div>
        <Link to={`/property/${p.slug}`} className="property-title">
          {p.title}
        </Link>
        <p className="location">
          <MapPin aria-hidden="true" /> {p.neighborhood}, Riyadh
        </p>
        <div className="facts">
          <span>
            <BedDouble aria-hidden="true" /> {p.bedrooms} beds
          </span>
          <span>
            <Bath aria-hidden="true" /> {p.bathrooms} baths
          </span>
          <span>
            <Ruler aria-hidden="true" /> {p.area} m²
          </span>
        </div>
        {savedView && (
          <div className="saved-card-actions">
            <Link to={`/property/${p.slug}`}>View property</Link>
            <button type="button" onClick={() => toggleFavorite(p.id)}>
              Remove
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

function Grid({
  items,
  favorites,
  compare,
  toggleFavorite,
  toggleCompare,
  savedView = false,
}) {
  if (!items.length)
    return (
      <div className="empty">
        <Search aria-hidden="true" />
        <h2>No homes match these filters</h2>
        <p>
          Try changing the location, budget, bedrooms or furnishing preference.
        </p>
      </div>
    );
  return (
    <div className="property-grid">
      {items.map((p) => (
        <PropertyCard
          key={p.id}
          property={p}
          favorite={favorites.includes(p.id)}
          comparing={compare.includes(p.id)}
          toggleFavorite={toggleFavorite}
          toggleCompare={toggleCompare}
          savedView={savedView}
        />
      ))}
    </div>
  );
}

function SectionHead({ eyebrow, title, link }) {
  return (
    <div className="section-head">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {link && <Link to={link}>View all →</Link>}
    </div>
  );
}

function Home({ goSearch, onSaveSearch, ...props }) {
  return (
    <main>
      <section className="hero">
        <div className="hero-image" />
        <div className="hero-copy">
          <p className="eyebrow">Riyadh, thoughtfully explored</p>
          <h1>Find a home that fits the life you’re building.</h1>
          <p>
            Discover considered homes across Riyadh’s most distinctive
            neighborhoods.
          </p>
          <div
            className="hero-highlights"
            aria-label="Nestora collection overview"
          >
            <span>
              <b>{properties.length}</b> curated homes
            </span>
            <span>
              <b>{neighborhoods.length}</b> neighborhoods
            </span>
            <span>
              <b>100%</b> portfolio demo
            </span>
          </div>
        </div>
        <SearchBox onSearch={goSearch} onSaveSearch={onSaveSearch} />
      </section>
      <section className="section">
        <SectionHead
          eyebrow="Curated for you"
          title="Homes worth a closer look"
          link="/properties"
        />
        <Grid items={properties.filter((p) => p.featured)} {...props} />
      </section>
      <section className="section neighborhoods-section">
        <SectionHead
          eyebrow="Explore the city"
          title="Riyadh, neighborhood by neighborhood"
          link="/neighborhoods"
        />
        <div className="neighborhood-grid">
          {neighborhoods.slice(0, 4).map((n, i) => (
            <Link
              to={`/neighborhood/${n.slug}`}
              key={n.slug}
              className="hood-card"
              style={{ "--tone": n.tone }}
            >
              <span>0{i + 1}</span>
              <div>
                <h3>{n.name}</h3>
                <p>{n.note}</p>
                <b>
                  {properties.filter((p) => p.neighborhood === n.name).length}{" "}
                  homes →
                </b>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="section promise">
        <div>
          <p className="eyebrow">The Nestora approach</p>
          <h2>
            Less noise.
            <br />
            More clarity.
          </h2>
          <Link to="/about" className="editorial-link">
            Discover our approach →
          </Link>
        </div>
        <div className="promise-grid">
          {[
            [
              "01",
              "One coherent view",
              "Search, save and compare without losing your place.",
            ],
            [
              "02",
              "Riyadh context",
              "Browse by the neighborhoods that shape daily life.",
            ],
            [
              "03",
              "Human guidance",
              "Connect with demo specialists for each area.",
            ],
          ].map((x) => (
            <article key={x[0]}>
              <span>{x[0]}</span>
              <h3>{x[1]}</h3>
              <p>{x[2]}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section">
        <SectionHead
          eyebrow="Fresh to market"
          title="Recently listed"
          link="/properties"
        />
        <Grid
          items={[...properties]
            .sort((a, b) => b.listedDate.localeCompare(a.listedDate))
            .slice(0, 6)}
          {...props}
        />
      </section>
    </main>
  );
}

function Listings({
  routePurpose,
  filters,
  setFilters,
  onSaveSearch,
  ...props
}) {
  const [sort, setSort] = useState("recommended");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const purpose = routePurpose || filters.purpose;
  const isRent = purpose === "Rent";
  const rentalHomes = properties.filter(
    (property) => property.purpose === "Rent",
  );
  const availableRentals = rentalHomes.filter(
    (property) => property.status === "Available",
  ).length;
  const medianAnnualRent =
    [...rentalHomes].sort((a, b) => a.price - b.price)[
      Math.floor(rentalHomes.length / 2)
    ]?.price || 0;
  const priceFilterLabel = isRent ? "Maximum annual rent" : "Maximum price";
  const visibleFilters =
    routePurpose && filters.purpose && filters.purpose !== routePurpose
      ? {
          purpose: routePurpose,
          location: "",
          type: "",
          beds: "",
          furnished: "",
          maxPrice: "",
        }
      : filters;

  const found = properties
    .filter(
      (property) =>
        (!purpose || property.purpose === purpose) &&
        (!visibleFilters.location ||
          `${property.title} ${property.neighborhood} ${property.propertyType}`
            .toLowerCase()
            .includes(visibleFilters.location.toLowerCase())) &&
        (!visibleFilters.type ||
          property.propertyType === visibleFilters.type) &&
        (!visibleFilters.beds ||
          property.bedrooms >= Number(visibleFilters.beds)) &&
        (!visibleFilters.furnished ||
          String(property.furnished) === visibleFilters.furnished) &&
        (!visibleFilters.maxPrice ||
          property.price <= Number(visibleFilters.maxPrice)),
    )
    .sort((a, b) =>
      sort === "price-low"
        ? a.price - b.price
        : sort === "price-high"
          ? b.price - a.price
          : sort === "area"
            ? b.area - a.area
            : sort === "newest"
              ? b.listedDate.localeCompare(a.listedDate)
              : Number(b.featured) - Number(a.featured),
    );

  const totalPages = Math.max(1, Math.ceil(found.length / 9));
  const safePage = Math.min(page, totalPages);
  const shown = found.slice((safePage - 1) * 9, safePage * 9);
  const rangeStart = found.length ? (safePage - 1) * 9 + 1 : 0;
  const rangeEnd = Math.min(safePage * 9, found.length);
  const activeFilters = [
    visibleFilters.location && {
      key: "location",
      label: visibleFilters.location,
    },
    visibleFilters.type && { key: "type", label: visibleFilters.type },
    visibleFilters.beds && {
      key: "beds",
      label: `${visibleFilters.beds}+ beds`,
    },
    isRent &&
      visibleFilters.furnished && {
        key: "furnished",
        label:
          visibleFilters.furnished === "true" ? "Furnished" : "Unfurnished",
      },
    visibleFilters.maxPrice && {
      key: "maxPrice",
      label: `Up to SAR ${money(Number(visibleFilters.maxPrice))}${isRent ? " / year" : ""}`,
    },
  ].filter(Boolean);

  const update = (key, value) => {
    setFilters({
      ...visibleFilters,
      purpose: routePurpose || visibleFilters.purpose,
      [key]: value,
    });
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      purpose: routePurpose || "",
      location: "",
      type: "",
      beds: "",
      furnished: "",
      maxPrice: "",
    });
    setPage(1);
  };

  const changePage = (nextPage) => {
    setPage(nextPage);
    document
      .querySelector(".results-layout")
      ?.scrollIntoView({ block: "start" });
  };

  return (
    <main className={`listing-page ${isRent ? "rent-page" : ""}`}>
      <PageIntro
        eyebrow="Property discovery"
        title={
          routePurpose === "Sale"
            ? "Homes to buy in Riyadh"
            : routePurpose === "Rent"
              ? "Homes to rent in Riyadh"
              : "Explore Riyadh homes"
        }
        text={
          isRent
            ? "Explore annual rental homes with clear filters and comparable property details."
            : "Explore a curated collection of villas, apartments and townhouses available to buy."
        }
      />
      {isRent && (
        <section
          className="rental-summary"
          aria-label="Rental collection overview"
        >
          <div>
            <KeyRound aria-hidden="true" />
            <span>
              <strong>{availableRentals}</strong> available now
            </span>
          </div>
          <div>
            <CalendarRange aria-hidden="true" />
            <span>
              <strong>SAR {money(medianAnnualRent)}</strong> median annual rent
            </span>
          </div>
          <div>
            <Sofa aria-hidden="true" />
            <span>
              <strong>
                {rentalHomes.filter((property) => property.furnished).length}
              </strong>{" "}
              furnished options
            </span>
          </div>
        </section>
      )}
      <button
        type="button"
        className="filter-toggle"
        aria-expanded={filtersOpen}
        aria-controls="property-filters"
        onClick={() => setFiltersOpen((value) => !value)}
      >
        {filtersOpen
          ? "Close filters"
          : `Filters${activeFilters.length ? ` (${activeFilters.length})` : ""}`}
      </button>
      <div className="results-layout">
        <aside
          id="property-filters"
          className={`filters ${filtersOpen ? "open" : ""}`}
        >
          <div className="filter-title">
            <h2>Filters</h2>
            <button
              type="button"
              disabled={!activeFilters.length}
              onClick={clearFilters}
            >
              Clear all
            </button>
          </div>
          <label>
            Location
            <input
              value={visibleFilters.location || ""}
              onChange={(event) => update("location", event.target.value)}
              placeholder="Try Al Malqa"
            />
          </label>
          <label>
            Property type
            <select
              value={visibleFilters.type || ""}
              onChange={(event) => update("type", event.target.value)}
            >
              <option value="">All types</option>
              {[
                "Villa",
                "Apartment",
                "Townhouse",
                "Duplex",
                "Residential Floor",
                "Studio",
              ].map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
          <label>
            Minimum bedrooms
            <select
              value={visibleFilters.beds || ""}
              onChange={(event) => update("beds", event.target.value)}
            >
              <option value="">Any</option>
              {[1, 2, 3, 4, 5].map((count) => (
                <option key={count} value={count}>
                  {count}+
                </option>
              ))}
            </select>
          </label>
          {isRent && (
            <label>
              Furnishing
              <select
                value={visibleFilters.furnished || ""}
                onChange={(event) => update("furnished", event.target.value)}
              >
                <option value="">Any</option>
                <option value="true">Furnished</option>
                <option value="false">Unfurnished</option>
              </select>
            </label>
          )}
          <label>
            {priceFilterLabel}
            <input
              type="number"
              min="0"
              step={isRent ? "5000" : "10000"}
              inputMode="numeric"
              value={visibleFilters.maxPrice || ""}
              onChange={(event) => update("maxPrice", event.target.value)}
              placeholder={isRent ? "SAR per year" : "SAR"}
            />
          </label>
          <button
            type="button"
            className="save-filter-search"
            onClick={() =>
              onSaveSearch({ ...visibleFilters, purpose: purpose || "Sale" })
            }
          >
            Save this search
          </button>
          <button
            type="button"
            className="apply-mobile-filters primary"
            onClick={() => setFiltersOpen(false)}
          >
            Show {found.length} {found.length === 1 ? "home" : "homes"}
          </button>
        </aside>
        <section className="results">
          <div className="results-top">
            <p aria-live="polite">
              <strong>
                {rangeStart}–{rangeEnd}
              </strong>{" "}
              of {found.length}{" "}
              {isRent
                ? "homes for rent"
                : purpose === "Sale"
                  ? "homes for sale"
                  : "properties"}
              <span> · Demo collection</span>
            </p>
            <label>
              Sort by{" "}
              <select
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value);
                  setPage(1);
                }}
              >
                <option value="recommended">Recommended</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="area">Largest Area</option>
              </select>
            </label>
          </div>
          {activeFilters.length > 0 && (
            <div className="active-filters" aria-label="Active filters">
              {activeFilters.map((filter) => (
                <button
                  type="button"
                  key={filter.key}
                  onClick={() => update(filter.key, "")}
                >
                  {filter.label} <span aria-hidden="true">×</span>
                  <span className="sr-only">Remove filter</span>
                </button>
              ))}
              <button
                type="button"
                className="clear-chip"
                onClick={clearFilters}
              >
                Clear all
              </button>
            </div>
          )}
          <Grid items={shown} {...props} />
          {totalPages > 1 && (
            <nav className="pagination" aria-label="Pagination">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => changePage(safePage - 1)}
              >
                ← Previous
              </button>
              <span>
                Page {safePage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() => changePage(safePage + 1)}
              >
                Next →
              </button>
            </nav>
          )}
        </section>
      </div>
    </main>
  );
}

function Mortgage({ price }) {
  const [down, setDown] = useState(Math.round(price * 0.2)),
    [years, setYears] = useState(20),
    [rate, setRate] = useState(4.5);
  const principal = Math.max(0, price - down),
    r = rate / 1200,
    n = years * 12,
    payment = r
      ? (principal * r * (1 + r) ** n) / ((1 + r) ** n - 1)
      : principal / n;
  return (
    <div className="mortgage">
      <h2>Affordability estimate</h2>
      <div className="calc-fields">
        <label>
          Down payment
          <input
            type="number"
            min="0"
            max={price}
            value={down}
            onChange={(e) =>
              setDown(Math.min(price, Math.max(0, +e.target.value)))
            }
          />
        </label>
        <label>
          Loan term
          <select value={years} onChange={(e) => setYears(+e.target.value)}>
            <option value="15">15 years</option>
            <option value="20">20 years</option>
            <option value="25">25 years</option>
          </select>
        </label>
        <label>
          Interest rate
          <input
            type="number"
            min="0"
            max="20"
            step="0.1"
            value={rate}
            onChange={(e) =>
              setRate(Math.min(20, Math.max(0, +e.target.value)))
            }
          />
        </label>
      </div>
      <div className="estimate" aria-live="polite">
        <span>Estimated monthly payment</span>
        <strong>SAR {money(Math.round(payment))}</strong>
      </div>
      <small>
        Estimate only. Not financial advice or lender approval; actual financing
        terms may differ.
      </small>
    </div>
  );
}

function PropertyDetail({ slug, ...props }) {
  const p = properties.find((x) => x.slug === slug),
    [photo, setPhoto] = useState(0),
    [sent, setSent] = useState(false);
  if (!p) return <NotFound />;
  const agent = agents.find((a) => a.id === p.agentId);
  const statusLabel = p.status === "Reserved" ? "Reserved" : `For ${p.purpose}`;
  const favorite = props.favorites.includes(p.id),
    comparing = props.compare.includes(p.id),
    hasGallery = p.images.length > 1;
  return (
    <main className="detail-page">
      <div className="breadcrumbs">
        <Link to={p.purpose === "Rent" ? "/rent" : "/buy"}>
          {p.purpose === "Rent" ? "Rent" : "Buy"}
        </Link>{" "}
        / <span>{p.neighborhood}</span>
      </div>
      <section className="detail-title">
        <div>
          <span
            className={`status-badge inline ${p.status === "Reserved" ? "reserved" : ""}`}
          >
            {statusLabel}
          </span>
          <h1>{p.title}</h1>
          <p>
            <MapPin aria-hidden="true" /> {p.address}, Riyadh
          </p>
        </div>
        <div className="detail-price-wrap">
          <div className="detail-price">
            SAR {money(p.price)}
            {p.rentPeriod && <small> / {p.rentPeriod}</small>}
            {p.purpose === "Rent" && (
              <span>≈ SAR {money(Math.round(p.price / 12))} / month</span>
            )}
          </div>
          <div className="detail-actions">
            <button
              type="button"
              aria-pressed={favorite}
              onClick={() => props.toggleFavorite(p.id)}
            >
              <Heart
                aria-hidden="true"
                fill={favorite ? "currentColor" : "none"}
              />{" "}
              {favorite ? "Saved" : "Save"}
            </button>
            <button
              type="button"
              aria-pressed={comparing}
              onClick={() => props.toggleCompare(p.id)}
            >
              <GitCompareArrows aria-hidden="true" />{" "}
              {comparing ? "Comparing" : "Compare"}
            </button>
          </div>
        </div>
      </section>
      <section
        className={`gallery ${hasGallery ? "" : "single"}`}
        aria-label="Property photo gallery"
      >
        {hasGallery ? (
          <button
            type="button"
            className="gallery-main"
            aria-label={`Show next photo. Currently showing ${galleryLabels[photo]}`}
            onClick={() => setPhoto((photo + 1) % p.images.length)}
          >
            <img
              src={p.images[photo]}
              alt={`${galleryLabels[photo]} of ${p.title} in ${p.neighborhood}`}
            />
            <span>
              {galleryLabels[photo]} · {photo + 1} / {p.images.length}
            </span>
          </button>
        ) : (
          <div className="gallery-main static">
            <img src={p.images[0]} alt={`${p.title} in ${p.neighborhood}`} />
            <span>Featured property image</span>
          </div>
        )}
        {hasGallery && (
          <div>
            {p.images.slice(1).map((img, i) => (
              <button
                type="button"
                className={photo === i + 1 ? "active" : ""}
                key={img}
                aria-label={`Show ${galleryLabels[i + 1]}`}
                aria-pressed={photo === i + 1}
                onClick={() => setPhoto(i + 1)}
              >
                <img src={img} alt={`${galleryLabels[i + 1]} of ${p.title}`} />
              </button>
            ))}
          </div>
        )}
      </section>
      <div className="detail-layout">
        <article className="detail-content">
          <div className="big-facts">
            <span>
              <b>{p.bedrooms}</b> Bedrooms
            </span>
            <span>
              <b>{p.bathrooms}</b> Bathrooms
            </span>
            <span>
              <b>{p.area}</b> m²
            </span>
            <span>
              <b>{p.parking}</b> Parking
            </span>
          </div>
          <div className="property-meta">
            <span>
              <b>Property type</b>
              {p.propertyType}
            </span>
            <span>
              <b>Built</b>
              {p.yearBuilt}
            </span>
            <span>
              <b>Furnishing</b>
              {p.furnished ? "Furnished" : "Unfurnished"}
            </span>
          </div>
          <h2>A considered place to call home</h2>
          <p>
            {p.shortDescription} Designed for comfortable daily rhythms, the
            home balances private retreats with generous shared spaces.
          </p>
          <h2>Features & amenities</h2>
          <ul className="amenities">
            {p.amenities.map((x) => (
              <li key={x}>
                <Check aria-hidden="true" /> {x}
              </li>
            ))}
          </ul>
          <div className="map-panel">
            <span>Neighborhood preview</span>
            <b>{p.neighborhood}</b>
            <small>Approximate demo location · not a live map</small>
          </div>
          {p.purpose === "Sale" && <Mortgage price={p.price} />}
        </article>
        <aside className="agent-panel">
          <p className="panel-kicker">
            <CalendarDays aria-hidden="true" /> Arrange a viewing
          </p>
          <div className="agent-line">
            <Link
              to={`/agent/${agent.id}`}
              className="agent-mini-link"
              aria-label={`View ${agent.name}'s profile`}
            >
              <img className="agent-mini-portrait" src={agent.image} alt="" />
            </Link>
            <div>
              <small>Your property specialist</small>
              <h3>
                <Link to={`/agent/${agent.id}`}>{agent.name}</Link>
              </h3>
              <p>{agent.specialty}</p>
            </div>
          </div>
          {sent ? (
            <div className="success" role="status">
              <b>Request prepared</b>
              <p>
                This front-end demo validated your details. No message was sent.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <label>
                Full name
                <input required maxLength="80" autoComplete="name" />
              </label>
              <label>
                Email
                <input
                  required
                  type="email"
                  maxLength="120"
                  autoComplete="email"
                />
              </label>
              <label>
                Phone
                <input required type="tel" maxLength="20" autoComplete="tel" />
              </label>
              <label>
                Message
                <textarea
                  required
                  maxLength="1000"
                  defaultValue={`I'm interested in ${p.title}.`}
                />
              </label>
              <button className="primary" type="submit">
                Prepare viewing request
              </button>
              <small>No information is sent in this portfolio demo.</small>
            </form>
          )}
        </aside>
      </div>
      <section className="section compact">
        <SectionHead title="Similar homes nearby" />
        <Grid
          items={properties
            .filter((x) => x.neighborhood === p.neighborhood && x.id !== p.id)
            .slice(0, 3)}
          {...props}
        />
      </section>
    </main>
  );
}

function PageIntro({ eyebrow, title, text, small = false }) {
  return (
    <section className={`page-intro ${small ? "small" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{text}</p>
    </section>
  );
}
function NeighborhoodsPage() {
  return (
    <main className="neighborhoods-page">
      <PageIntro
        eyebrow="Know the city"
        title="Find your corner of Riyadh."
        text="Compare eight distinctive neighborhoods through curated demo homes and clear local context."
      />
      <section className="section neighborhood-directory">
        <div className="directory-intro">
          <p className="eyebrow">Eight ways to live</p>
          <p>
            From central apartments to spacious homes in the north and east,
            each area offers a different rhythm of Riyadh life.
          </p>
        </div>
        <div className="neighborhood-grid full">
          {neighborhoods.map((n, i) => {
            const list = properties.filter((p) => p.neighborhood === n.name),
              saleCount = list.filter((p) => p.purpose === "Sale").length;
            return (
              <Link
                to={`/neighborhood/${n.slug}`}
                key={n.slug}
                className={`hood-card ${i === 0 || i === 5 ? "featured" : ""}`}
                style={{ "--tone": n.tone }}
              >
                <div className="hood-image">
                  <img src={list[0].coverImage} alt="" loading="lazy" />
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <i aria-hidden="true">View area</i>
                </div>
                <div className="hood-copy">
                  <div>
                    <p className="hood-location">Riyadh neighborhood</p>
                    <h2>{n.name}</h2>
                    <p>{n.note}</p>
                  </div>
                  <div className="hood-meta">
                    <span>
                      <b>{list.length}</b> homes
                    </span>
                    <span>
                      <b>{saleCount}</b> for sale
                    </span>
                    <span>
                      <b>{list.length - saleCount}</b> to rent
                    </span>
                    <strong>
                      Explore area <span aria-hidden="true">→</span>
                    </strong>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <p className="demo-note">
          Listings and neighborhood information are fictional portfolio content
          created to demonstrate the experience.
        </p>
      </section>
    </main>
  );
}
function NeighborhoodDetail({ slug, ...props }) {
  const n = neighborhoods.find((x) => x.slug === slug);
  if (!n) return <NotFound />;
  const list = properties.filter((p) => p.neighborhoodSlug === slug),
    saleCount = list.filter((p) => p.purpose === "Sale").length,
    rentCount = list.length - saleCount;
  const index = neighborhoods.findIndex((x) => x.slug === slug),
    previous =
      neighborhoods[(index - 1 + neighborhoods.length) % neighborhoods.length],
    next = neighborhoods[(index + 1) % neighborhoods.length];
  const previousImage = properties.find(
      (p) => p.neighborhoodSlug === previous.slug,
    )?.coverImage,
    nextImage = properties.find(
      (p) => p.neighborhoodSlug === next.slug,
    )?.coverImage;
  return (
    <main className="neighborhood-detail">
      <div className="breadcrumbs hood-breadcrumbs">
        <Link to="/neighborhoods">Neighborhoods</Link> / <span>{n.name}</span>
      </div>
      <section
        className="hood-hero"
        style={{
          "--tone": n.tone,
          "--hood-image": `url(${list[0].coverImage})`,
        }}
      >
        <div className="hood-hero-copy">
          <p className="eyebrow">Riyadh neighborhood</p>
          <h1>{n.name}</h1>
          <p>{n.note}</p>
          <div className="hood-stats">
            <span>
              <b>{list.length}</b> demo homes
            </span>
            <span>
              <b>{saleCount}</b> for sale
            </span>
            <span>
              <b>{rentCount}</b> to rent
            </span>
          </div>
          <small>
            Fictional portfolio listings, not live market inventory.
          </small>
        </div>
      </section>
      <section className="section neighborhood-listings">
        <SectionHead
          eyebrow="Curated collection"
          title={`Homes in ${n.name}`}
        />
        <Grid items={list} {...props} />
      </section>
      <nav className="hood-pagination" aria-label="Explore neighboring areas">
        <Link to={`/neighborhood/${previous.slug}`} className="hood-page-link">
          <img src={previousImage} alt="" loading="lazy" />
          <span>
            <small>Previous neighborhood</small>
            <strong>
              <span aria-hidden="true">←</span> {previous.name}
            </strong>
          </span>
        </Link>
        <Link to="/neighborhoods" className="all-hoods">
          All neighborhoods
        </Link>
        <Link to={`/neighborhood/${next.slug}`} className="hood-page-link next">
          <img src={nextImage} alt="" loading="lazy" />
          <span>
            <small>Next neighborhood</small>
            <strong>
              {next.name} <span aria-hidden="true">→</span>
            </strong>
          </span>
        </Link>
      </nav>
    </main>
  );
}
function AgentsPage() {
  return (
    <main className="agents-page">
      <PageIntro
        eyebrow="Local guidance"
        title="People who understand the way Riyadh lives."
        text="Meet six fictional specialists, each focused on a distinct property journey and part of the city."
      />
      <section className="section agent-directory">
        <div className="directory-intro agent-directory-intro">
          <p className="eyebrow">A more personal search</p>
          <p>
            Explore each specialist’s focus and a curated set of demo homes they
            represent. Profiles and experience figures are fictional portfolio
            content.
          </p>
        </div>
        <div className="agents-grid">
          {agents.map((a, i) => {
            const count = properties.filter((p) => p.agentId === a.id).length;
            return (
              <Link
                to={`/agent/${a.id}`}
                className={`agent-card ${i === 0 ? "featured" : ""}`}
                key={a.id}
              >
                <div className="agent-card-media">
                  <img
                    src={a.image}
                    alt={`Portrait of ${a.name}, fictional Nestora specialist`}
                    loading="lazy"
                  />
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <b className="agent-specialty-badge">{a.specialty}</b>
                </div>
                <div className="agent-card-body">
                  <p className="agent-area">{a.areas}</p>
                  <h2>{a.name}</h2>
                  <p>{a.specialty}</p>
                  <div className="agent-card-meta">
                    <span>
                      <b>{a.years}</b> sample years
                    </span>
                    <span>
                      <b>{count}</b> demo homes
                    </span>
                  </div>
                  <strong>
                    View profile <span aria-hidden="true">→</span>
                  </strong>
                </div>
              </Link>
            );
          })}
        </div>
        <aside className="agent-guidance-cta">
          <div>
            <p className="eyebrow">Start with the place</p>
            <h2>Not sure which specialist fits?</h2>
            <p>
              Explore the homes or neighborhoods first, then meet the person
              whose focus matches your shortlist.
            </p>
          </div>
          <div className="agent-guidance-actions">
            <Link className="primary" to="/properties">
              Browse all homes
            </Link>
            <Link to="/neighborhoods">Explore neighborhoods →</Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
function AgentDetail({ id, ...props }) {
  const a = agents.find((x) => x.id === id);
  if (!a) return <NotFound />;
  const list = properties.filter((p) => p.agentId === id),
    index = agents.findIndex((x) => x.id === id),
    previous = agents[(index - 1 + agents.length) % agents.length],
    next = agents[(index + 1) % agents.length];
  return (
    <main className="agent-detail-page">
      <div className="breadcrumbs agent-breadcrumbs">
        <Link to="/agents">Agents</Link> / <span>{a.name}</span>
      </div>
      <section className="agent-hero">
        <div className="agent-portrait">
          <img
            src={a.image}
            alt={`Portrait of ${a.name}, fictional Nestora specialist`}
          />
        </div>
        <div className="agent-hero-copy">
          <p className="eyebrow">Nestora specialist</p>
          <h1>{a.name}</h1>
          <p className="agent-role">{a.specialty}</p>
          <p className="agent-bio">{a.bio}</p>
          <div className="agent-stats">
            <span>
              <b>{a.years}</b> sample years
            </span>
            <span>
              <b>{list.length}</b> demo listings
            </span>
            <span>
              <b>{a.areas.split(" · ").length}</b> focus areas
            </span>
          </div>
          <a className="primary agent-cta" href="#agent-listings">
            View represented homes <span aria-hidden="true">↓</span>
          </a>
          <small>
            Fictional profile for this front-end portfolio; no contact service
            is connected.
          </small>
        </div>
      </section>
      <section className="section agent-listings" id="agent-listings">
        <SectionHead
          eyebrow={a.areas}
          title={`Homes represented by ${a.name.split(" ")[0]}`}
        />
        <Grid items={list} {...props} />
      </section>
      <nav className="agent-pagination" aria-label="Explore other specialists">
        <Link to={`/agent/${previous.id}`} className="agent-page-link">
          <img src={previous.image} alt="" loading="lazy" />
          <span>
            <small>Previous specialist</small>
            <strong>
              <span aria-hidden="true">←</span> {previous.name}
            </strong>
          </span>
        </Link>
        <Link to="/agents" className="all-agents">
          All specialists
        </Link>
        <Link to={`/agent/${next.id}`} className="agent-page-link next">
          <img src={next.image} alt="" loading="lazy" />
          <span>
            <small>Next specialist</small>
            <strong>
              {next.name} <span aria-hidden="true">→</span>
            </strong>
          </span>
        </Link>
      </nav>
    </main>
  );
}

function SavedPage({ ids, ...props }) {
  const list = properties.filter((p) => ids.includes(p.id));
  return (
    <main className="saved-page">
      <section className="saved-hero">
        <div className="saved-hero-copy">
          <p className="eyebrow">Your shortlist</p>
          <h1>Homes worth another look.</h1>
          <p>
            Keep promising places together, revisit the details and compare your
            strongest options when you are ready.
          </p>
          <div className="saved-hero-actions">
            <Link className="primary" to="/buy">
              Explore homes to buy
            </Link>
            <Link to="/rent">Browse rentals</Link>
          </div>
        </div>
        <aside className="saved-count" aria-label="Saved homes summary">
          <Heart aria-hidden="true" />
          <strong aria-live="polite">{list.length}</strong>
          <span>saved {list.length === 1 ? "home" : "homes"}</span>
          <p>Stored privately in this browser on your device.</p>
        </aside>
      </section>

      {list.length ? (
        <section
          className="section saved-results"
          aria-labelledby="saved-list-title"
        >
          <div className="saved-section-head">
            <div>
              <p className="eyebrow">Your current selection</p>
              <h2 id="saved-list-title">
                {list.length} {list.length === 1 ? "property" : "properties"} to
                revisit
              </h2>
            </div>
            <p>Select the heart on any card to remove it from this list.</p>
          </div>
          <Grid items={list} savedView {...props} />
        </section>
      ) : (
        <section
          className="section saved-empty-section"
          aria-labelledby="saved-empty-title"
        >
          <div className="saved-empty">
            <div className="saved-empty-icon">
              <Heart aria-hidden="true" />
            </div>
            <div>
              <p className="eyebrow">A considered shortlist starts here</p>
              <h2 id="saved-empty-title">No saved homes yet</h2>
              <p>
                Use the heart on a property card to keep it here. Your saved
                homes stay on this device until you remove them.
              </p>
              <div className="saved-empty-actions">
                <Link className="primary" to="/buy">
                  Find a home to buy
                </Link>
                <Link className="secondary-button" to="/rent">
                  Explore rentals
                </Link>
              </div>
            </div>
            <ol className="saved-empty-steps" aria-label="How saved homes work">
              <li>
                <span>01</span>
                <p>
                  <b>Discover</b> Browse homes across Riyadh.
                </p>
              </li>
              <li>
                <span>02</span>
                <p>
                  <b>Save</b> Select the heart on a property.
                </p>
              </li>
              <li>
                <span>03</span>
                <p>
                  <b>Compare</b> Review your best options together.
                </p>
              </li>
            </ol>
          </div>
        </section>
      )}

      <section className="saved-note" aria-labelledby="saved-note-title">
        <div>
          <Check aria-hidden="true" />
          <div>
            <p className="eyebrow">Simple and private</p>
            <h2 id="saved-note-title">Your property tools, in one place.</h2>
            <p>
              Review saved homes, saved searches and comparisons from your
              account dashboard. No sign-in is required for this front-end demo.
            </p>
          </div>
        </div>
        <Link to="/account">Open account dashboard →</Link>
      </section>
    </main>
  );
}

function SavedSearches({ searches, runSearch, removeSearch }) {
  const matchingHomes = (search) =>
    properties.filter(
      (property) =>
        (!search.purpose || property.purpose === search.purpose) &&
        (!search.location ||
          `${property.title} ${property.neighborhood} ${property.propertyType}`
            .toLowerCase()
            .includes(search.location.toLowerCase())) &&
        (!search.type || property.propertyType === search.type) &&
        (!search.beds || property.bedrooms >= Number(search.beds)) &&
        (!search.furnished ||
          String(property.furnished) === search.furnished) &&
        (!search.maxPrice || property.price <= Number(search.maxPrice)),
    ).length;

  return (
    <main className="saved-search-page">
      <section className="search-library-hero">
        <div>
          <p className="eyebrow">Search library</p>
          <h1>Return to the right search, instantly.</h1>
          <p>
            Keep useful property criteria close, see how many homes currently
            match and continue exploring without rebuilding your filters.
          </p>
          <Link className="primary" to="/properties">
            Create a new search
          </Link>
        </div>
        <aside aria-label="Saved searches summary">
          <Search aria-hidden="true" />
          <strong aria-live="polite">{searches.length}</strong>
          <span>saved {searches.length === 1 ? "search" : "searches"}</span>
          <p>Available on this browser and device.</p>
        </aside>
      </section>

      <section
        className="section search-library"
        aria-labelledby="search-library-title"
      >
        <div className="search-library-heading">
          <div>
            <p className="eyebrow">Your criteria</p>
            <h2 id="search-library-title">
              {searches.length
                ? "Continue where you left off."
                : "Build your first search."}
            </h2>
          </div>
          <p>
            Result counts reflect the current demo property collection and may
            change when criteria are updated.
          </p>
        </div>

        <div className="saved-search-grid">
          {searches.length ? (
            searches.map((search, index) => {
              const resultCount = matchingHomes(search);
              const criteria = [
                ["Type", search.type || "Any property type"],
                ["Bedrooms", search.beds ? `${search.beds}+ bedrooms` : "Any"],
                [
                  "Furnishing",
                  search.furnished === "true"
                    ? "Furnished"
                    : search.furnished === "false"
                      ? "Unfurnished"
                      : "Any",
                ],
                [
                  "Budget",
                  search.maxPrice
                    ? `Up to SAR ${money(+search.maxPrice)}${search.purpose === "Rent" ? " / year" : ""}`
                    : "Any budget",
                ],
              ];
              return (
                <article className="saved-search-card" key={search.id}>
                  <header>
                    <div className="saved-search-index">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <span className="search-purpose">
                        {search.purpose === "Sale"
                          ? "Homes to buy"
                          : "Homes to rent"}
                      </span>
                      <h3>{search.location || "All Riyadh"}</h3>
                    </div>
                    <div className="search-match-count">
                      <strong>{resultCount}</strong>
                      <span>{resultCount === 1 ? "match" : "matches"}</span>
                    </div>
                  </header>
                  <dl>
                    {criteria.map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <footer>
                    <button
                      type="button"
                      className="primary"
                      onClick={() => runSearch(search)}
                    >
                      View {resultCount} {resultCount === 1 ? "home" : "homes"}
                    </button>
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => removeSearch(search.id)}
                      aria-label={`Remove saved search for ${search.location || "All Riyadh"}`}
                    >
                      Remove
                    </button>
                  </footer>
                </article>
              );
            })
          ) : (
            <div className="saved-search-empty">
              <div>
                <Search aria-hidden="true" />
              </div>
              <section>
                <p className="eyebrow">Nothing saved yet</p>
                <h3>Turn useful filters into a shortcut.</h3>
                <p>
                  Choose your location, property type and budget, then select
                  “Save this search” from the results page.
                </p>
                <div>
                  <Link className="primary" to="/buy">
                    Search homes to buy
                  </Link>
                  <Link className="secondary-button" to="/rent">
                    Search rentals
                  </Link>
                </div>
              </section>
              <ol aria-label="How to save a search">
                <li>
                  <span>01</span>
                  <p>
                    <b>Set criteria</b> Choose what matters.
                  </p>
                </li>
                <li>
                  <span>02</span>
                  <p>
                    <b>Review</b> Check matching homes.
                  </p>
                </li>
                <li>
                  <span>03</span>
                  <p>
                    <b>Save</b> Return here anytime.
                  </p>
                </li>
              </ol>
            </div>
          )}
        </div>
      </section>

      <section className="search-library-note">
        <CalendarRange aria-hidden="true" />
        <div>
          <p className="eyebrow">Device-local shortcuts</p>
          <h2>Your searches stay ready in this browser.</h2>
          <p>No alerts or emails are sent in this front-end demonstration.</p>
        </div>
        <Link to="/account">Back to account dashboard →</Link>
      </section>
    </main>
  );
}
function ComparePage({ compare, toggleCompare }) {
  const list = properties.filter((p) => compare.includes(p.id)),
    slots = Array.from({ length: site.compareLimit }, (_, i) => i);
  const samePurpose =
    list.length > 1 && list.every((p) => p.purpose === list[0].purpose);
  const lowestPrice = samePurpose
    ? list.reduce((best, p) => (p.price < best.price ? p : best), list[0])
    : null;
  const largestArea =
    list.length > 1
      ? list.reduce((best, p) => (p.area > best.area ? p : best), list[0])
      : null;
  const newestBuild =
    list.length > 1
      ? list.reduce(
          (best, p) => (p.yearBuilt > best.yearBuilt ? p : best),
          list[0],
        )
      : null;
  const propertyHighlights = (property) =>
    [
      lowestPrice?.id === property.id ? "Lowest price" : null,
      largestArea?.id === property.id ? "Largest area" : null,
      newestBuild?.id === property.id ? "Newest build" : null,
    ].filter(Boolean);
  const rows = [
    [
      "Price",
      (p) => `SAR ${money(p.price)}${p.rentPeriod ? ` / ${p.rentPeriod}` : ""}`,
    ],
    ["Purpose", (p) => (p.purpose === "Sale" ? "For sale" : "For rent")],
    ["Status", (p) => p.status],
    ["Neighborhood", (p) => p.neighborhood],
    ["Type", (p) => p.propertyType],
    ["Bedrooms", (p) => p.bedrooms],
    ["Bathrooms", (p) => p.bathrooms],
    ["Area", (p) => `${p.area} m²`],
    ["Year built", (p) => p.yearBuilt],
    ["Furnished", (p) => (p.furnished ? "Yes" : "No")],
  ];
  return (
    <main className="compare-page">
      <section className="compare-hero">
        <div>
          <p className="eyebrow">Decision workspace</p>
          <h1>Compare what matters, side by side.</h1>
          <p>
            Review price, space and practical details across up to{" "}
            {site.compareLimit} homes.
          </p>
        </div>
        <div className="compare-hero-status" aria-label="Comparison summary">
          <GitCompareArrows aria-hidden="true" />
          <strong aria-live="polite">
            {list.length}/{site.compareLimit}
          </strong>
          <span>comparison slots filled</span>
          <div aria-hidden="true">
            {slots.map((slot) => (
              <i className={list[slot] ? "filled" : ""} key={slot} />
            ))}
          </div>
        </div>
      </section>

      <section
        className="section compare-workspace"
        aria-labelledby="compare-title"
      >
        <div className="compare-workspace-heading">
          <div>
            <p className="eyebrow">Your selection</p>
            <h2 id="compare-title">
              {list.length > 1
                ? "The details, in one clear view."
                : list.length === 1
                  ? "Add another home to compare."
                  : "Choose homes to start comparing."}
            </h2>
          </div>
          <div>
            <p>
              {list.length
                ? `${site.compareLimit - list.length} ${site.compareLimit - list.length === 1 ? "slot" : "slots"} available`
                : `Up to ${site.compareLimit} homes`}
            </p>
            <Link to="/properties">Browse properties →</Link>
          </div>
        </div>

        {list.length ? (
          <>
            {list.length > 1 && (
              <div
                className="compare-insights"
                aria-label="Comparison highlights"
              >
                <article>
                  <span>01</span>
                  <div>
                    <small>
                      {samePurpose ? "Lowest listed price" : "Market mix"}
                    </small>
                    <strong>
                      {samePurpose
                        ? lowestPrice.title
                        : `${list.filter((p) => p.purpose === "Sale").length} buy · ${list.filter((p) => p.purpose === "Rent").length} rent`}
                    </strong>
                  </div>
                </article>
                <article>
                  <span>02</span>
                  <div>
                    <small>Largest floor area</small>
                    <strong>
                      {largestArea.title} · {largestArea.area} m²
                    </strong>
                  </div>
                </article>
                <article>
                  <span>03</span>
                  <div>
                    <small>Newest build</small>
                    <strong>
                      {newestBuild.title} · {newestBuild.yearBuilt}
                    </strong>
                  </div>
                </article>
              </div>
            )}
            <div
              className="compare-table"
              role="region"
              aria-label="Property comparison table"
              tabIndex="0"
            >
              <div className="compare-row compare-images">
                <b>Property</b>
                {slots.map((i) =>
                  list[i] ? (
                    <article key={list[i].id}>
                      <Link to={`/property/${list[i].slug}`}>
                        <img
                          src={list[i].coverImage}
                          alt={`${list[i].propertyType} in ${list[i].neighborhood}`}
                        />
                      </Link>
                      <span>Option {i + 1}</span>
                      {propertyHighlights(list[i]).length > 0 && (
                        <div className="compare-highlight-tags">
                          {propertyHighlights(list[i]).map((label) => (
                            <i key={label}>{label}</i>
                          ))}
                        </div>
                      )}
                      <h3>
                        <Link to={`/property/${list[i].slug}`}>
                          {list[i].title}
                        </Link>
                      </h3>
                      <div>
                        <Link to={`/property/${list[i].slug}`}>
                          View details
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleCompare(list[i].id)}
                          aria-label={`Remove ${list[i].title} from comparison`}
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  ) : (
                    <div className="compare-empty" key={i}>
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      <b>Open slot</b>
                      <Link to="/properties">Add a home</Link>
                    </div>
                  ),
                )}
              </div>
              {rows.map(([label, fn]) => (
                <div className="compare-row" key={label}>
                  <b>{label}</b>
                  {slots.map((i) => (
                    <span
                      className={
                        list[i] &&
                        ((label === "Price" &&
                          lowestPrice?.id === list[i].id) ||
                          (label === "Area" &&
                            largestArea?.id === list[i].id) ||
                          (label === "Year built" &&
                            newestBuild?.id === list[i].id))
                          ? "compare-best-value"
                          : ""
                      }
                      key={i}
                    >
                      {list[i] ? fn(list[i]) : "—"}
                    </span>
                  ))}
                </div>
              ))}
            </div>

            <div
              className="compare-mobile-list"
              aria-label="Property comparison for small screens"
            >
              {list.map((property, index) => (
                <article key={property.id}>
                  <header>
                    <span>Option {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => toggleCompare(property.id)}
                      aria-label={`Remove ${property.title} from comparison`}
                    >
                      Remove
                    </button>
                  </header>
                  <Link to={`/property/${property.slug}`}>
                    <img
                      src={property.coverImage}
                      alt={`${property.propertyType} in ${property.neighborhood}`}
                    />
                  </Link>
                  <h3>
                    <Link to={`/property/${property.slug}`}>
                      {property.title}
                    </Link>
                  </h3>
                  {propertyHighlights(property).length > 0 && (
                    <div className="compare-highlight-tags">
                      {propertyHighlights(property).map((label) => (
                        <i key={label}>{label}</i>
                      ))}
                    </div>
                  )}
                  <dl>
                    {rows.map(([label, fn]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd
                          className={
                            (label === "Price" &&
                              lowestPrice?.id === property.id) ||
                            (label === "Area" &&
                              largestArea?.id === property.id) ||
                            (label === "Year built" &&
                              newestBuild?.id === property.id)
                              ? "compare-best-value"
                              : ""
                          }
                        >
                          {fn(property)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <Link className="primary" to={`/property/${property.slug}`}>
                    View property
                  </Link>
                </article>
              ))}
              {list.length < site.compareLimit && (
                <Link className="compare-mobile-add" to="/properties">
                  <GitCompareArrows aria-hidden="true" />
                  <b>Add another home</b>
                  <span>
                    {site.compareLimit - list.length}{" "}
                    {site.compareLimit - list.length === 1 ? "slot" : "slots"}{" "}
                    remaining
                  </span>
                </Link>
              )}
            </div>
          </>
        ) : (
          <div className="compare-start">
            <div>
              <GitCompareArrows aria-hidden="true" />
            </div>
            <section>
              <p className="eyebrow">Start with a shortlist</p>
              <h3>No properties selected yet.</h3>
              <p>
                Select the compare icon on any property card. Your choices will
                appear here together.
              </p>
              <div>
                <Link className="primary" to="/buy">
                  Browse homes to buy
                </Link>
                <Link className="secondary-button" to="/rent">
                  Browse rentals
                </Link>
              </div>
            </section>
            <ol aria-label="How comparison works">
              <li>
                <span>01</span>
                <p>
                  <b>Select</b> Add up to three homes.
                </p>
              </li>
              <li>
                <span>02</span>
                <p>
                  <b>Review</b> Compare key details.
                </p>
              </li>
              <li>
                <span>03</span>
                <p>
                  <b>Decide</b> Open the strongest option.
                </p>
              </li>
            </ol>
          </div>
        )}
      </section>

      <section className="compare-note">
        <Check aria-hidden="true" />
        <div>
          <p className="eyebrow">A clearer decision</p>
          <h2>Use the facts as a starting point.</h2>
          <p>
            Property details are demonstration data. Confirm availability and
            terms before making a real decision.
          </p>
        </div>
        <Link to="/favorites">Review saved homes →</Link>
      </section>
    </main>
  );
}

function Auth({ signup = false }) {
  const [done, setDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const firstFieldRef = useRef(null);
  const successRef = useRef(null);

  useEffect(() => {
    if (done) successRef.current?.focus();
  }, [done]);

  function submitAuth(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (signup && form.get("password") !== form.get("confirmPassword")) {
      setError("Passwords do not match. Please check both fields.");
      event.currentTarget.elements.confirmPassword.focus();
      return;
    }
    setError("");
    setDone(true);
  }

  function resetAuth() {
    setDone(false);
    setError("");
    requestAnimationFrame(() => firstFieldRef.current?.focus());
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-card-inner">
          <Link to="/" className="auth-back">
            ← Back to browsing
          </Link>
          <nav className="auth-mode-switch" aria-label="Account access">
            <Link
              to="/signin"
              className={!signup ? "active" : ""}
              aria-current={!signup ? "page" : undefined}
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className={signup ? "active" : ""}
              aria-current={signup ? "page" : undefined}
            >
              Create account
            </Link>
          </nav>
          <div className="auth-heading">
            <span className="auth-form-number" aria-hidden="true">
              {signup ? "02" : "01"}
            </span>
            <p className="eyebrow">
              {signup ? "Create your space" : "Welcome back"}
            </p>
            <h1>
              {signup
                ? "Make room for the right home."
                : "Your shortlist is waiting."}
            </h1>
            <p>
              {signup
                ? "Create a demonstration profile to explore the account experience."
                : "Sign in to preview the account flow. No real authentication takes place."}
            </p>
          </div>

          {done ? (
            <div
              className="auth-success"
              role="status"
              tabIndex="-1"
              ref={successRef}
            >
              <span aria-hidden="true">
                <Check />
              </span>
              <p className="eyebrow">Form complete</p>
              <h2>
                {signup ? "Demo profile prepared." : "Form checked locally."}
              </h2>
              <p>
                {signup
                  ? "No account was created and no personal information was stored."
                  : "You were not authenticated because this portfolio has no connected account service."}
              </p>
              <div className="auth-success-actions">
                <Link className="primary" to="/account">
                  Preview account space
                </Link>
                <button type="button" onClick={resetAuth}>
                  Use different details
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={submitAuth} onInput={() => error && setError("")}>
              {signup && (
                <label>
                  Full name
                  <input
                    ref={firstFieldRef}
                    name="name"
                    required
                    maxLength="80"
                    autoComplete="name"
                  />
                </label>
              )}
              <label>
                Email address
                <input
                  name="email"
                  ref={signup ? undefined : firstFieldRef}
                  required
                  type="email"
                  maxLength="120"
                  autoComplete="email"
                  inputMode="email"
                />
              </label>
              <label>
                Password
                <span className="password-field">
                  <input
                    name="password"
                    required
                    minLength="8"
                    maxLength="72"
                    type={showPassword ? "text" : "password"}
                    autoComplete={signup ? "new-password" : "current-password"}
                    aria-describedby={signup ? "password-hint" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </span>
                {signup && (
                  <small id="password-hint">Use at least 8 characters.</small>
                )}
              </label>
              {signup && (
                <label>
                  Confirm password
                  <input
                    name="confirmPassword"
                    required
                    minLength="8"
                    maxLength="72"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    aria-describedby={error ? "auth-error" : undefined}
                    aria-invalid={error ? "true" : undefined}
                  />
                </label>
              )}
              {error && (
                <p className="auth-error" id="auth-error" role="alert">
                  {error}
                </p>
              )}
              <div className="auth-demo-note">
                <KeyRound aria-hidden="true" />
                <p>
                  <strong>Portfolio demo</strong>
                  <span>
                    Form fields are checked locally and are not sent or saved.
                  </span>
                </p>
              </div>
              <button type="submit" className="primary auth-submit">
                {signup ? "Prepare demo account" : "Preview sign-in result"}
              </button>
            </form>
          )}
          <p className="auth-switch">
            {signup ? "Already explored this flow? " : "New to Nestora? "}
            <Link to={signup ? "/signin" : "/signup"}>
              {signup ? "Sign in" : "Create a demo account"}
            </Link>
          </p>
        </div>
      </section>
      <aside className="auth-visual">
        <div className="auth-visual-top">
          <span>Private by design</span>
          <small>Front-end portfolio experience</small>
        </div>
        <div className="auth-visual-copy">
          <p className="eyebrow">Your Nestora space</p>
          <blockquote>
            “A calmer way to keep every promising home in view.”
          </blockquote>
          <ul>
            <li>
              <Check aria-hidden="true" />
              Saved homes
            </li>
            <li>
              <Check aria-hidden="true" />
              Search preferences
            </li>
            <li>
              <Check aria-hidden="true" />
              Property comparisons
            </li>
          </ul>
        </div>
      </aside>
    </main>
  );
}

function AboutPage() {
  const principles = [
    [
      "01",
      "Clarity before volume",
      "Useful facts, calm layouts and focused choices make every listing easier to understand.",
    ],
    [
      "02",
      "Local context matters",
      "Neighborhood-led discovery helps people consider the life around a home, not only the rooms inside it.",
    ],
    [
      "03",
      "Tools that support decisions",
      "Search, saved homes and comparisons stay connected so a shortlist can develop naturally.",
    ],
  ];
  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-hero-copy">
          <p className="eyebrow">About Nestora</p>
          <h1>A calmer way to find your place in Riyadh.</h1>
          <p>
            Nestora is a fictional front-end portfolio product shaped around a
            real idea: finding a home should feel considered, not crowded.
          </p>
          <div className="about-hero-actions">
            <Link className="primary" to="/properties">
              Explore the collection
            </Link>
            <Link to="/neighborhoods">Discover neighborhoods →</Link>
          </div>
        </div>
        <div className="about-hero-visual">
          <img
            src="/images/brand/about-hero-v2.webp"
            alt="Contemporary limestone villa courtyard with shaded colonnades and desert landscaping"
            width="1600"
            height="1067"
            fetchPriority="high"
          />
          <span>
            Inspired by Riyadh
            <br />
            <b>Built for clear decisions</b>
          </span>
        </div>
      </section>

      <section className="section about-manifesto">
        <p className="eyebrow">Why it exists</p>
        <div>
          <h2>Property discovery without the usual noise.</h2>
          <div className="about-story">
            <p>
              The experience brings imagery, practical details and neighborhood
              context into one coherent path—from the first search to a useful
              side-by-side comparison.
            </p>
            <p>
              Every listing, profile and market-style figure is sample content.
              The product demonstrates responsive interface design, accessible
              interactions and thoughtful front-end state management.
            </p>
          </div>
        </div>
      </section>

      <section className="about-principles">
        <div className="section">
          <div className="section-head">
            <div>
              <p className="eyebrow">Our approach</p>
              <h2>Three principles guide the experience.</h2>
            </div>
          </div>
          <div className="about-principles-grid">
            {principles.map(([number, title, text]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-proof">
        <div className="about-proof-copy">
          <p className="eyebrow">The portfolio build</p>
          <h2>One connected product, not a collection of isolated screens.</h2>
          <p>
            Routes, property relationships and device-local tools work together
            across a responsive browsing experience.
          </p>
          <Link to="/agents">Meet the fictional specialists →</Link>
        </div>
        <div className="about-metrics" aria-label="Nestora demo collection">
          <span>
            <b>{properties.length}</b>
            <small>sample homes</small>
          </span>
          <span>
            <b>{neighborhoods.length}</b>
            <small>Riyadh neighborhoods</small>
          </span>
          <span>
            <b>{agents.length}</b>
            <small>fictional specialists</small>
          </span>
          <span>
            <b>3</b>
            <small>shortlist tools</small>
          </span>
        </div>
      </section>

      <section className="section about-closing">
        <div>
          <p className="eyebrow">Continue exploring</p>
          <h2>Find the part of Riyadh that feels right.</h2>
        </div>
        <Link className="primary" to="/buy">
          Browse homes for sale
        </Link>
      </section>
    </main>
  );
}

function ContactPage() {
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState("");
  const nameFieldRef = useRef(null);
  const successRef = useRef(null);

  useEffect(() => {
    if (done) successRef.current?.focus();
  }, [done]);

  function resetForm() {
    setDone(false);
    setMessage("");
    requestAnimationFrame(() => nameFieldRef.current?.focus());
  }

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-copy">
          <p className="eyebrow">Contact Nestora</p>
          <h1>A clearer next step starts with the right details.</h1>
          <p>
            Tell us what you are looking for in Riyadh. This portfolio form
            demonstrates a complete enquiry experience without transmitting or
            storing personal information.
          </p>
        </div>
        <div className="contact-hero-note" aria-label="About this contact form">
          <span>01</span>
          <p>Front-end demonstration</p>
          <strong>Your details stay in this browser session.</strong>
          <small>No inbox, CRM or support service is connected.</small>
        </div>
      </section>

      <section
        className="contact-journey"
        aria-label="How the demo enquiry works"
      >
        <div>
          <span>01</span>
          <p>
            <strong>Share the brief</strong>
            <small>Priorities, budget and timing</small>
          </p>
        </div>
        <div>
          <span>02</span>
          <p>
            <strong>Check the details</strong>
            <small>Clear, accessible validation</small>
          </p>
        </div>
        <div>
          <span>03</span>
          <p>
            <strong>Keep exploring</strong>
            <small>No data leaves this device</small>
          </p>
        </div>
      </section>

      <section className="section contact-layout">
        <div className="contact-form-card">
          <span className="contact-card-number" aria-hidden="true">
            02
          </span>
          <div className="contact-section-heading">
            <p className="eyebrow">Your enquiry</p>
            <h2>How can we help?</h2>
            <p>Fields marked with an asterisk are required.</p>
          </div>

          {done ? (
            <div
              className="contact-success"
              role="status"
              tabIndex="-1"
              ref={successRef}
            >
              <span aria-hidden="true">✓</span>
              <p className="eyebrow">Form complete</p>
              <h2>Message prepared locally.</h2>
              <p>
                Your details passed validation. No information was sent or
                stored because this is a front-end portfolio demonstration.
              </p>
              <div className="contact-success-actions">
                <button className="primary" type="button" onClick={resetForm}>
                  Prepare another message
                </button>
                <Link to="/buy">Browse homes for sale →</Link>
              </div>
            </div>
          ) : (
            <form
              className="contact-form"
              onSubmit={(e) => {
                e.preventDefault();
                setDone(true);
              }}
              aria-describedby="contact-privacy-note"
            >
              <div className="contact-form-grid">
                <label>
                  Full name <span aria-hidden="true">*</span>
                  <input
                    ref={nameFieldRef}
                    name="name"
                    required
                    maxLength="80"
                    autoComplete="name"
                  />
                </label>
                <label>
                  Email address <span aria-hidden="true">*</span>
                  <input
                    required
                    type="email"
                    name="email"
                    maxLength="120"
                    autoComplete="email"
                  />
                </label>
                <label>
                  Phone number <small>Optional</small>
                  <input
                    type="tel"
                    name="phone"
                    maxLength="20"
                    autoComplete="tel"
                    inputMode="tel"
                  />
                </label>
                <label>
                  Enquiry type <span aria-hidden="true">*</span>
                  <select required defaultValue="" name="enquiryType">
                    <option value="" disabled>
                      Select a topic
                    </option>
                    <option>Buying a home</option>
                    <option>Renting a home</option>
                    <option>Neighborhood guidance</option>
                    <option>Product feedback</option>
                  </select>
                </label>
                <label className="contact-message-field">
                  Your message <span aria-hidden="true">*</span>
                  <textarea
                    required
                    name="message"
                    rows="6"
                    maxLength="1000"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    aria-describedby="message-count"
                  />
                  <small id="message-count" className="character-count">
                    {message.length} / 1000 characters
                  </small>
                </label>
              </div>
              <div className="contact-submit-row">
                <p id="contact-privacy-note">
                  This validates the form only. Nothing is transmitted or saved.
                </p>
                <button className="primary" type="submit">
                  Prepare message
                </button>
              </div>
            </form>
          )}
        </div>

        <aside
          className="contact-guidance"
          aria-labelledby="contact-guidance-title"
        >
          <p className="eyebrow">Before you write</p>
          <h2 id="contact-guidance-title">A useful enquiry is specific.</h2>
          <ol>
            <li>
              <span>01</span>
              <div>
                <h3>Share your priorities</h3>
                <p>Include your preferred neighborhood, budget and timing.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Keep it private</h3>
                <p>
                  Avoid financial documents or sensitive identification details.
                </p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Find a specialist</h3>
                <p>
                  Explore fictional agent profiles by neighborhood and property
                  type.
                </p>
              </div>
            </li>
          </ol>
          <Link className="contact-agent-link" to="/agents">
            Meet the specialists →
          </Link>
        </aside>
      </section>

      <section className="section contact-closing">
        <div>
          <p className="eyebrow">Prefer to explore?</p>
          <h2>Start with the homes, then narrow the conversation.</h2>
        </div>
        <div>
          <Link to="/buy">Homes to buy →</Link>
          <Link to="/rent">Homes to rent →</Link>
        </div>
      </section>
    </main>
  );
}
function AccountPage({ favorites, savedSearches, compare }) {
  const items = [
    {
      label: "Saved homes",
      count: favorites.length,
      href: "/favorites",
      action: "Review saved homes",
      empty: "Save promising listings to build a focused shortlist.",
      ready: "Your shortlisted homes are ready to review.",
      icon: Heart,
    },
    {
      label: "Saved searches",
      count: savedSearches.length,
      href: "/saved-searches",
      action: "Open saved searches",
      empty: "Keep useful filter combinations for your next visit.",
      ready: "Your search preferences are stored on this device.",
      icon: Search,
    },
    {
      label: "Comparisons",
      count: compare.length,
      href: "/compare",
      action: "Open comparison",
      empty: "Select up to three homes to compare key details.",
      ready: "Your selected properties are ready side by side.",
      icon: GitCompareArrows,
    },
  ];
  const total = favorites.length + savedSearches.length + compare.length;
  return (
    <main className="account-page">
      <section className="account-hero">
        <div className="account-hero-copy">
          <p className="eyebrow">My Nestora</p>
          <h1>Your property plans, in one calm place.</h1>
          <p>
            Revisit saved homes, useful searches and side-by-side comparisons.
            Everything in this portfolio dashboard stays on this device.
          </p>
          <div className="account-hero-actions">
            <Link className="primary" to="/buy">
              Explore homes to buy
            </Link>
            <Link to="/rent">Browse rentals →</Link>
          </div>
        </div>
        <aside className="account-overview" aria-label="Account overview">
          <p>Local planning overview</p>
          <strong>{String(total).padStart(2, "0")}</strong>
          <span>items across your planning tools</span>
          <div>
            {items.map(({ label, count }) => (
              <small key={label}>
                <b>{count}</b>
                {label}
              </small>
            ))}
          </div>
        </aside>
      </section>

      <section
        className="section account-dashboard"
        aria-labelledby="account-tools-title"
      >
        <div className="account-section-heading">
          <div>
            <p className="eyebrow">Planning tools</p>
            <h2 id="account-tools-title">Pick up where you left off.</h2>
          </div>
          <p>
            Counts reflect this browser only and may change when local site data
            is cleared.
          </p>
        </div>
        <div className="account-tool-grid">
          {items.map(
            ({ label, count, href, action, empty, ready, icon: Icon }, i) => (
              <article className="account-tool-card" key={label}>
                <div className="account-tool-top">
                  <span>
                    <Icon aria-hidden="true" />
                  </span>
                  <small>0{i + 1}</small>
                </div>
                <strong>{String(count).padStart(2, "0")}</strong>
                <h3>{label}</h3>
                <p>{count > 0 ? ready : empty}</p>
                <Link to={href}>
                  {action} <span aria-hidden="true">→</span>
                </Link>
              </article>
            ),
          )}
        </div>
      </section>

      <section className="section account-progress">
        <div className="account-progress-copy">
          <p className="eyebrow">A simpler decision path</p>
          <h2>Shortlist first. Compare when the details matter.</h2>
          <p>
            The tools are designed to work together without requiring a real
            account in this front-end demonstration.
          </p>
        </div>
        <ol>
          {[
            [
              "Save",
              "Keep the homes worth another look.",
              favorites.length > 0,
            ],
            [
              "Refine",
              "Store searches that match your priorities.",
              savedSearches.length > 0,
            ],
            [
              "Compare",
              "Review the strongest options side by side.",
              compare.length > 1,
            ],
          ].map(([title, text, complete], i) => (
            <li className={complete ? "complete" : ""} key={title}>
              <span>
                {complete ? (
                  <Check aria-hidden="true" />
                ) : (
                  String(i + 1).padStart(2, "0")
                )}
              </span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section account-note">
        <KeyRound aria-hidden="true" />
        <div>
          <p className="eyebrow">Device-local experience</p>
          <h2>No profile or cloud account is connected.</h2>
          <p>
            Your shortlist tools use browser storage for demonstration purposes
            only.
          </p>
        </div>
        <Link to="/about">How this portfolio works →</Link>
      </section>
    </main>
  );
}
function NotFound({ attemptedPath = "" }) {
  return (
    <main className="not-found">
      <section className="not-found-hero">
        <div className="not-found-copy">
          <p className="eyebrow">Page not found</p>
          <span aria-hidden="true">404</span>
          <h1>This address doesn’t feel like home.</h1>
          <p>
            The page may have moved, or the address may not be available. Let’s
            get you back to a useful place.
          </p>
          {attemptedPath && <code>{attemptedPath}</code>}
          <div className="not-found-actions">
            <Link className="primary" to="/">
              Return home
            </Link>
            <Link className="secondary-button" to="/properties">
              Browse all properties
            </Link>
          </div>
        </div>
        <aside
          className="not-found-guide"
          aria-labelledby="not-found-guide-title"
        >
          <MapPin aria-hidden="true" />
          <p className="eyebrow">Continue exploring</p>
          <h2 id="not-found-guide-title">Where would you like to go?</h2>
          <nav aria-label="Helpful destinations">
            <Link to="/buy">
              <span>01</span>
              <b>Homes to buy</b>
              <i aria-hidden="true">→</i>
            </Link>
            <Link to="/rent">
              <span>02</span>
              <b>Homes to rent</b>
              <i aria-hidden="true">→</i>
            </Link>
            <Link to="/neighborhoods">
              <span>03</span>
              <b>Riyadh neighborhoods</b>
              <i aria-hidden="true">→</i>
            </Link>
            <Link to="/contact">
              <span>04</span>
              <b>Contact Nestora</b>
              <i aria-hidden="true">→</i>
            </Link>
          </nav>
        </aside>
      </section>

      <section className="not-found-note">
        <Search aria-hidden="true" />
        <div>
          <p className="eyebrow">Still looking?</p>
          <h2>Start again with the full property collection.</h2>
          <p>
            Explore the fictional Riyadh listings included in this portfolio
            demonstration.
          </p>
        </div>
        <Link to="/properties">Open property search →</Link>
      </section>
    </main>
  );
}
function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div>
          <Link to="/" className="brand light">
            <span className="brand-mark">N</span>Nestora
          </Link>
          <p>A considered way to discover your place in Riyadh.</p>
        </div>
        <div>
          <b>Explore</b>
          <Link to="/buy">Buy</Link>
          <Link to="/rent">Rent</Link>
          <Link to="/neighborhoods">Neighborhoods</Link>
        </div>
        <div>
          <b>Company</b>
          <Link to="/about">About</Link>
          <Link to="/agents">Agents</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div>
          <b>Your Nestora</b>
          <Link to="/favorites">Saved homes</Link>
          <Link to="/saved-searches">Saved searches</Link>
          <Link to="/compare">Compare</Link>
          <Link to="/account">Account</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Nestora. Portfolio demonstration.</span>
        <span>Fictional listings · Riyadh, Saudi Arabia</span>
      </div>
    </footer>
  );
}

export default function NestoraApp() {
  const [path, setPath] = useState("/"),
    [favorites, setFavorites] = useState([]),
    [compare, setCompare] = useState([]),
    [savedSearches, setSavedSearches] = useState([]),
    [hydrated, setHydrated] = useState(false),
    [notice, setNotice] = useState(""),
    [filters, setFilters] = useState({
      purpose: "",
      location: "",
      type: "",
      beds: "",
      furnished: "",
      maxPrice: "",
    });
  useEffect(() => {
    const cleanPath = () =>
      location.pathname !== "/" ? location.pathname.replace(/\/+$/, "") : "/";
    const pop = () => setPath(cleanPath());
    addEventListener("popstate", pop);
    queueMicrotask(() => {
      setPath(cleanPath());
      const validPropertyIds = new Set(
        properties.map((property) => property.id),
      );
      setFavorites(
        [...new Set(readStoredArray("nestora-favorites"))].filter(
          (id) => typeof id === "string" && validPropertyIds.has(id),
        ),
      );
      setCompare(
        [...new Set(readStoredArray("nestora-compare"))]
          .filter((id) => typeof id === "string" && validPropertyIds.has(id))
          .slice(0, site.compareLimit),
      );
      setSavedSearches(
        readStoredArray("nestora-searches")
          .filter(
            (search) =>
              search &&
              typeof search === "object" &&
              typeof search.id === "string" &&
              (search.purpose === "Sale" || search.purpose === "Rent"),
          )
          .map((search) => ({
            id: search.id,
            purpose: search.purpose,
            location:
              typeof search.location === "string" ? search.location : "",
            type: typeof search.type === "string" ? search.type : "",
            beds: typeof search.beds === "string" ? search.beds : "",
            furnished:
              search.furnished === "true" || search.furnished === "false"
                ? search.furnished
                : "",
            maxPrice:
              typeof search.maxPrice === "string" ? search.maxPrice : "",
          }))
          .filter(
            (search, index, all) =>
              all.findIndex((item) => item.id === search.id) === index,
          ),
      );
      setHydrated(true);
    });
    return () => removeEventListener("popstate", pop);
  }, []);
  useEffect(() => {
    if (hydrated) writeStoredArray("nestora-favorites", favorites);
  }, [favorites, hydrated]);
  useEffect(() => {
    if (hydrated) writeStoredArray("nestora-compare", compare);
  }, [compare, hydrated]);
  useEffect(() => {
    if (hydrated) writeStoredArray("nestora-searches", savedSearches);
  }, [savedSearches, hydrated]);
  useEffect(() => {
    scrollTo(0, 0);
    const staticRoutes = new Set([
      "/",
      "/buy",
      "/rent",
      "/properties",
      "/neighborhoods",
      "/agents",
      "/favorites",
      "/saved-searches",
      "/compare",
      "/signin",
      "/signup",
      "/account",
      "/about",
      "/contact",
    ]);
    const validDynamicRoute =
      (path.startsWith("/property/") &&
        properties.some((p) => `/property/${p.slug}` === path)) ||
      (path.startsWith("/neighborhood/") &&
        neighborhoods.some((n) => `/neighborhood/${n.slug}` === path)) ||
      (path.startsWith("/agent/") &&
        agents.some((a) => `/agent/${a.id}` === path));
    const routeExists = staticRoutes.has(path) || validDynamicRoute;
    document.title = !routeExists
      ? "Page not found — Nestora"
      : path === "/"
        ? "Nestora — Riyadh homes, thoughtfully found"
        : `${path.split("/").filter(Boolean).pop()?.replaceAll("-", " ") || "Home"} — Nestora`;
  }, [path]);
  const toggleFavorite = (id) =>
    setFavorites((x) =>
      x.includes(id) ? x.filter((y) => y !== id) : [...x, id],
    );
  const toggleCompare = (id) =>
    setCompare((x) => {
      if (x.includes(id)) return x.filter((y) => y !== id);
      if (x.length >= site.compareLimit) {
        setNotice(`You can compare up to ${site.compareLimit} properties.`);
        return x;
      }
      return [...x, id];
    });
  const common = { favorites, compare, toggleFavorite, toggleCompare };
  const saveSearch = (search) => {
    const normalized = {
      ...search,
      furnished: search.furnished || "",
      id: `${search.purpose}-${search.location}-${search.type}-${search.beds || ""}-${search.furnished || ""}-${search.maxPrice}`,
    };
    if (savedSearches.some((x) => x.id === normalized.id)) {
      setNotice("This search is already saved.");
      return;
    }
    setSavedSearches((items) => [normalized, ...items]);
    setNotice("Search saved on this device.");
  };
  const runSavedSearch = (search) => {
    setFilters({
      purpose: search.purpose,
      location: search.location,
      type: search.type,
      beds: search.beds || "",
      furnished: search.furnished || "",
      maxPrice: search.maxPrice,
    });
    history.pushState({}, "", "/properties");
    setPath("/properties");
  };
  const removeSavedSearch = (id) => {
    setSavedSearches((items) => items.filter((search) => search.id !== id));
    setNotice("Saved search removed from this device.");
  };
  const goSearch = (f) => {
    setFilters({
      purpose: f.purpose,
      location: f.location,
      type: f.type,
      beds: "",
      furnished: "",
      maxPrice: f.budget,
    });
    history.pushState({}, "", "/properties");
    setPath("/properties");
  };
  let page;
  if (path === "/")
    page = <Home goSearch={goSearch} onSaveSearch={saveSearch} {...common} />;
  else if (path === "/buy")
    page = (
      <Listings
        routePurpose="Sale"
        filters={filters}
        setFilters={setFilters}
        onSaveSearch={saveSearch}
        {...common}
      />
    );
  else if (path === "/rent")
    page = (
      <Listings
        routePurpose="Rent"
        filters={filters}
        setFilters={setFilters}
        onSaveSearch={saveSearch}
        {...common}
      />
    );
  else if (path === "/properties")
    page = (
      <Listings
        filters={filters}
        setFilters={setFilters}
        onSaveSearch={saveSearch}
        {...common}
      />
    );
  else if (/^\/property\/[^/]+$/.test(path))
    page = <PropertyDetail slug={path.split("/").pop()} {...common} />;
  else if (path === "/neighborhoods") page = <NeighborhoodsPage />;
  else if (/^\/neighborhood\/[^/]+$/.test(path))
    page = <NeighborhoodDetail slug={path.split("/").pop()} {...common} />;
  else if (path === "/agents") page = <AgentsPage />;
  else if (/^\/agent\/[^/]+$/.test(path))
    page = <AgentDetail id={path.split("/").pop()} {...common} />;
  else if (path === "/favorites")
    page = <SavedPage ids={favorites} {...common} />;
  else if (path === "/saved-searches")
    page = (
      <SavedSearches
        searches={savedSearches}
        runSearch={runSavedSearch}
        removeSearch={removeSavedSearch}
      />
    );
  else if (path === "/compare")
    page = <ComparePage compare={compare} toggleCompare={toggleCompare} />;
  else if (path === "/signin") page = <Auth key="signin" />;
  else if (path === "/signup") page = <Auth key="signup" signup />;
  else if (path === "/account")
    page = (
      <AccountPage
        favorites={favorites}
        savedSearches={savedSearches}
        compare={compare}
      />
    );
  else if (path === "/about") page = <AboutPage />;
  else if (path === "/contact") page = <ContactPage />;
  else page = <NotFound attemptedPath={path} />;
  return (
    <>
      <Header favorites={favorites} compare={compare} path={path} />
      {page}
      <Footer />
      {compare.length > 0 && path !== "/compare" && (
        <div className="compare-bar">
          <span>
            <b>{compare.length}</b> of {site.compareLimit} selected
          </span>
          <Link to="/compare" className="primary">
            Compare homes →
          </Link>
        </div>
      )}
      {notice && (
        <div className="toast" role="status" aria-live="polite">
          <span>{notice}</span>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
