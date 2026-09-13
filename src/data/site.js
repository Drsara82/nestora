export const site = { name: "Nestora", city: "Riyadh", email: "hello@nestora.demo", phone: "+966 11 000 0000", compareLimit: 3 };

export const neighborhoods = [
  ["Al Malqa", "al-malqa", "Polished north Riyadh living with excellent city access.", "#d4b996"],
  ["Al Yasmin", "al-yasmin", "Contemporary family homes and calm residential streets.", "#a9b7a3"],
  ["Al Narjis", "al-narjis", "Spacious new-build homes near northern growth corridors.", "#c7ab89"],
  ["Hittin", "hittin", "Design-led homes close to dining and entertainment.", "#8fa49a"],
  ["Al Arid", "al-arid", "Generous villas and a relaxed neighborhood rhythm.", "#cabf9f"],
  ["Qurtubah", "qurtubah", "Connected east Riyadh living near key destinations.", "#9aa88d"],
  ["Al Rimal", "al-rimal", "Modern homes with space, privacy and open horizons.", "#d1aa76"],
  ["Al Olaya", "al-olaya", "Urban apartments at the center of Riyadh life.", "#83918b"],
].map(([name, slug, note, tone]) => ({ name, slug, note, tone }));

export const agents = [
  ["a1", "Lina Al Harbi", "North Riyadh villas", "Al Malqa · Al Yasmin", "Helps families compare villa layouts, everyday access and the details that make a long-term home work."],
  ["a2", "Omar Al Qahtani", "Family residences", "Al Narjis · Al Arid", "Focuses on practical family homes, balancing generous space with connected northern neighborhoods."],
  ["a3", "Reem Al Salem", "Urban apartments", "Al Olaya · Hittin", "Guides apartment searches with a clear eye for location, natural light and an effortless city routine."],
  ["a4", "Fahad Al Mutairi", "Investment properties", "Qurtubah · Al Rimal", "Brings a measured, detail-led approach to comparing homes with long-term ownership potential."],
  ["a5", "Sara Al Dosari", "Premium rentals", "Hittin · Al Malqa", "Makes rental decisions easier through thoughtful shortlists and transparent annual cost comparisons."],
  ["a6", "Yousef Al Anazi", "New-build homes", "North & East Riyadh", "Specializes in contemporary homes, helping buyers assess finishes, layouts and growing communities."],
].map(([id, name, specialty, areas, bio], i) => ({ id, name, specialty, areas, bio, image: `/images/agents/agent-0${i + 1}.webp`, years: 5 + i }));

const propertyGallery = index => {
  const number = String(index + 1).padStart(2, "0");
  return ["exterior", "living", "kitchen", "bedroom"].map(view => `/images/galleries/property-${number}-${view}.webp`);
};

const types = ["Villa", "Apartment", "Townhouse", "Duplex", "Residential Floor", "Studio"];
const titles = ["Quiet architectural villa", "Sunlit contemporary apartment", "Refined family townhouse", "Modern duplex with terrace", "Private residential floor", "City studio with skyline views"];

export const properties = Array.from({ length: 28 }, (_, i) => {
  const purpose = i % 3 === 1 ? "Rent" : "Sale";
  const propertyType = types[i % types.length];
  const studio = propertyType === "Studio";
  const bedrooms = studio ? 1 : 2 + (i % 4);
  const hood = neighborhoods[i % neighborhoods.length];
  const images = propertyGallery(i);
  return {
    id: `p${i + 1}`,
    slug: `${propertyType.toLowerCase().replaceAll(" ", "-")}-${hood.slug}-${i + 1}`,
    title: titles[i % titles.length], purpose, propertyType,
    price: purpose === "Sale" ? 1150000 + (i % 9) * 285000 + bedrooms * 125000 : 48000 + (i % 8) * 9500 + bedrooms * 6000,
    rentPeriod: purpose === "Rent" ? "year" : null,
    neighborhood: hood.name, neighborhoodSlug: hood.slug,
    address: `${12 + i} Al Waha Street, ${hood.name}`,
    bedrooms, bathrooms: studio ? 1 : Math.max(2, bedrooms - 1),
    area: studio ? 72 + (i % 3) * 10 : 145 + bedrooms * 45 + (i % 5) * 18,
    coverImage: images[0],
    images,
    shortDescription: "Balanced proportions, calm natural finishes and practical everyday living in a well-connected Riyadh neighborhood.",
    amenities: ["Air conditioning", "Equipped kitchen", i % 2 ? "Private entrance" : "Smart-home features", bedrooms > 3 ? "Maid's room" : "Storage", "Parking"],
    listedDate: `2026-09-${String(12 - (i % 10)).padStart(2, "0")}`,
    status: i % 11 === 0 ? "Reserved" : "Available", featured: i < 6,
    agentId: `a${(i % 6) + 1}`, yearBuilt: 2019 + (i % 7), parking: studio ? 1 : 1 + (i % 3), furnished: i % 4 === 0,
  };
});

export const navigation = [["Home", "/"], ["Buy", "/buy"], ["Rent", "/rent"], ["Neighborhoods", "/neighborhoods"], ["Agents", "/agents"], ["About", "/about"]];
