// Comprehensive static airport list — no API key required
// ~250 major airports sorted by global traveler volume

export const AIRPORTS = [
  // ── North America — USA ───────────────────────────────────────────────────
  { iataCode: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'United States' },
  { iataCode: 'EWR', name: 'Newark Liberty International', city: 'New York', country: 'United States' },
  { iataCode: 'LGA', name: 'LaGuardia Airport', city: 'New York', country: 'United States' },
  { iataCode: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'United States' },
  { iataCode: 'SFO', name: 'San Francisco International', city: 'San Francisco', country: 'United States' },
  { iataCode: 'ORD', name: "O'Hare International", city: 'Chicago', country: 'United States' },
  { iataCode: 'MDW', name: 'Midway International', city: 'Chicago', country: 'United States' },
  { iataCode: 'ATL', name: 'Hartsfield-Jackson Atlanta International', city: 'Atlanta', country: 'United States' },
  { iataCode: 'DFW', name: 'Dallas/Fort Worth International', city: 'Dallas', country: 'United States' },
  { iataCode: 'IAH', name: 'George Bush Intercontinental', city: 'Houston', country: 'United States' },
  { iataCode: 'MIA', name: 'Miami International', city: 'Miami', country: 'United States' },
  { iataCode: 'BOS', name: 'Logan International', city: 'Boston', country: 'United States' },
  { iataCode: 'SEA', name: 'Seattle-Tacoma International', city: 'Seattle', country: 'United States' },
  { iataCode: 'DEN', name: 'Denver International', city: 'Denver', country: 'United States' },
  { iataCode: 'PHX', name: 'Phoenix Sky Harbor International', city: 'Phoenix', country: 'United States' },
  { iataCode: 'LAS', name: 'Harry Reid International', city: 'Las Vegas', country: 'United States' },
  { iataCode: 'MSP', name: 'Minneapolis-Saint Paul International', city: 'Minneapolis', country: 'United States' },
  { iataCode: 'DTW', name: 'Detroit Metropolitan Wayne County', city: 'Detroit', country: 'United States' },
  { iataCode: 'PHL', name: 'Philadelphia International', city: 'Philadelphia', country: 'United States' },
  { iataCode: 'CLT', name: 'Charlotte Douglas International', city: 'Charlotte', country: 'United States' },
  { iataCode: 'SAN', name: 'San Diego International', city: 'San Diego', country: 'United States' },
  { iataCode: 'PDX', name: 'Portland International', city: 'Portland', country: 'United States' },
  { iataCode: 'SLC', name: 'Salt Lake City International', city: 'Salt Lake City', country: 'United States' },
  { iataCode: 'BNA', name: 'Nashville International', city: 'Nashville', country: 'United States' },
  { iataCode: 'AUS', name: 'Austin-Bergstrom International', city: 'Austin', country: 'United States' },
  { iataCode: 'IAD', name: 'Dulles International', city: 'Washington DC', country: 'United States' },
  { iataCode: 'DCA', name: 'Ronald Reagan Washington National', city: 'Washington DC', country: 'United States' },

  // ── North America — Canada ────────────────────────────────────────────────
  { iataCode: 'YYZ', name: 'Toronto Pearson International', city: 'Toronto', country: 'Canada' },
  { iataCode: 'YVR', name: 'Vancouver International', city: 'Vancouver', country: 'Canada' },
  { iataCode: 'YUL', name: 'Montréal-Trudeau International', city: 'Montreal', country: 'Canada' },
  { iataCode: 'YYC', name: 'Calgary International', city: 'Calgary', country: 'Canada' },
  { iataCode: 'YEG', name: 'Edmonton International', city: 'Edmonton', country: 'Canada' },
  { iataCode: 'YOW', name: 'Ottawa Macdonald-Cartier International', city: 'Ottawa', country: 'Canada' },

  // ── United Kingdom ────────────────────────────────────────────────────────
  { iataCode: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom' },
  { iataCode: 'LGW', name: 'Gatwick Airport', city: 'London', country: 'United Kingdom' },
  { iataCode: 'STN', name: 'Stansted Airport', city: 'London', country: 'United Kingdom' },
  { iataCode: 'LTN', name: 'Luton Airport', city: 'London', country: 'United Kingdom' },
  { iataCode: 'MAN', name: 'Manchester Airport', city: 'Manchester', country: 'United Kingdom' },
  { iataCode: 'EDI', name: 'Edinburgh Airport', city: 'Edinburgh', country: 'United Kingdom' },
  { iataCode: 'GLA', name: 'Glasgow Airport', city: 'Glasgow', country: 'United Kingdom' },
  { iataCode: 'BHX', name: 'Birmingham Airport', city: 'Birmingham', country: 'United Kingdom' },
  { iataCode: 'BRS', name: 'Bristol Airport', city: 'Bristol', country: 'United Kingdom' },
  { iataCode: 'NCL', name: 'Newcastle Airport', city: 'Newcastle', country: 'United Kingdom' },

  // ── Europe — Germany ──────────────────────────────────────────────────────
  { iataCode: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
  { iataCode: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany' },
  { iataCode: 'BER', name: 'Berlin Brandenburg Airport', city: 'Berlin', country: 'Germany' },
  { iataCode: 'DUS', name: 'Düsseldorf Airport', city: 'Düsseldorf', country: 'Germany' },
  { iataCode: 'HAM', name: 'Hamburg Airport', city: 'Hamburg', country: 'Germany' },
  { iataCode: 'STR', name: 'Stuttgart Airport', city: 'Stuttgart', country: 'Germany' },

  // ── Europe — France ───────────────────────────────────────────────────────
  { iataCode: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' },
  { iataCode: 'ORY', name: 'Orly Airport', city: 'Paris', country: 'France' },
  { iataCode: 'LYS', name: 'Lyon-Saint Exupéry Airport', city: 'Lyon', country: 'France' },
  { iataCode: 'NCE', name: 'Nice Côte d\'Azur Airport', city: 'Nice', country: 'France' },
  { iataCode: 'MRS', name: 'Marseille Provence Airport', city: 'Marseille', country: 'France' },

  // ── Europe — Netherlands & Belgium ───────────────────────────────────────
  { iataCode: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands' },
  { iataCode: 'BRU', name: 'Brussels Airport', city: 'Brussels', country: 'Belgium' },

  // ── Europe — Switzerland & Austria ───────────────────────────────────────
  { iataCode: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland' },
  { iataCode: 'GVA', name: 'Geneva Airport', city: 'Geneva', country: 'Switzerland' },
  { iataCode: 'VIE', name: 'Vienna International Airport', city: 'Vienna', country: 'Austria' },
  { iataCode: 'SZG', name: 'Salzburg Airport', city: 'Salzburg', country: 'Austria' },

  // ── Europe — Scandinavia ──────────────────────────────────────────────────
  { iataCode: 'ARN', name: 'Stockholm Arlanda Airport', city: 'Stockholm', country: 'Sweden' },
  { iataCode: 'OSL', name: 'Oslo Gardermoen Airport', city: 'Oslo', country: 'Norway' },
  { iataCode: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', country: 'Denmark' },
  { iataCode: 'HEL', name: 'Helsinki-Vantaa Airport', city: 'Helsinki', country: 'Finland' },
  { iataCode: 'KEF', name: 'Keflavík International Airport', city: 'Reykjavik', country: 'Iceland' },

  // ── Europe — Southern ─────────────────────────────────────────────────────
  { iataCode: 'FCO', name: 'Leonardo da Vinci International', city: 'Rome', country: 'Italy' },
  { iataCode: 'MXP', name: 'Milan Malpensa Airport', city: 'Milan', country: 'Italy' },
  { iataCode: 'VCE', name: 'Venice Marco Polo Airport', city: 'Venice', country: 'Italy' },
  { iataCode: 'MAD', name: 'Adolfo Suárez Madrid-Barajas', city: 'Madrid', country: 'Spain' },
  { iataCode: 'BCN', name: 'Barcelona-El Prat Airport', city: 'Barcelona', country: 'Spain' },
  { iataCode: 'LIS', name: 'Humberto Delgado Airport', city: 'Lisbon', country: 'Portugal' },
  { iataCode: 'OPO', name: 'Francisco Sá Carneiro Airport', city: 'Porto', country: 'Portugal' },
  { iataCode: 'ATH', name: 'Athens International Airport', city: 'Athens', country: 'Greece' },
  { iataCode: 'WAW', name: 'Warsaw Chopin Airport', city: 'Warsaw', country: 'Poland' },
  { iataCode: 'PRG', name: 'Václav Havel Airport Prague', city: 'Prague', country: 'Czech Republic' },
  { iataCode: 'BUD', name: 'Budapest Ferenc Liszt International', city: 'Budapest', country: 'Hungary' },
  { iataCode: 'OTP', name: 'Henri Coandă International Airport', city: 'Bucharest', country: 'Romania' },
  { iataCode: 'SOF', name: 'Sofia Airport', city: 'Sofia', country: 'Bulgaria' },
  { iataCode: 'ZAG', name: 'Zagreb Airport', city: 'Zagreb', country: 'Croatia' },

  // ── Europe — Eastern ─────────────────────────────────────────────────────
  { iataCode: 'SVO', name: 'Sheremetyevo International Airport', city: 'Moscow', country: 'Russia' },
  { iataCode: 'DME', name: 'Domodedovo International Airport', city: 'Moscow', country: 'Russia' },
  { iataCode: 'LED', name: 'Pulkovo Airport', city: 'St Petersburg', country: 'Russia' },

  // ── Middle East ───────────────────────────────────────────────────────────
  { iataCode: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE' },
  { iataCode: 'AUH', name: 'Abu Dhabi International Airport', city: 'Abu Dhabi', country: 'UAE' },
  { iataCode: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar' },
  { iataCode: 'RUH', name: 'King Khalid International Airport', city: 'Riyadh', country: 'Saudi Arabia' },
  { iataCode: 'JED', name: 'King Abdulaziz International Airport', city: 'Jeddah', country: 'Saudi Arabia' },
  { iataCode: 'AMM', name: 'Queen Alia International Airport', city: 'Amman', country: 'Jordan' },
  { iataCode: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey' },
  { iataCode: 'SAW', name: 'Sabiha Gökçen International Airport', city: 'Istanbul', country: 'Turkey' },
  { iataCode: 'TLV', name: 'Ben Gurion International Airport', city: 'Tel Aviv', country: 'Israel' },
  { iataCode: 'MCT', name: 'Muscat International Airport', city: 'Muscat', country: 'Oman' },
  { iataCode: 'BAH', name: 'Bahrain International Airport', city: 'Manama', country: 'Bahrain' },
  { iataCode: 'KWI', name: 'Kuwait International Airport', city: 'Kuwait City', country: 'Kuwait' },
  { iataCode: 'BEY', name: 'Rafic Hariri International Airport', city: 'Beirut', country: 'Lebanon' },
  { iataCode: 'CAI', name: 'Cairo International Airport', city: 'Cairo', country: 'Egypt' },

  // ── India ─────────────────────────────────────────────────────────────────
  { iataCode: 'DEL', name: 'Indira Gandhi International Airport', city: 'New Delhi', country: 'India' },
  { iataCode: 'BOM', name: 'Chhatrapati Shivaji Maharaj International', city: 'Mumbai', country: 'India' },
  { iataCode: 'BLR', name: 'Kempegowda International Airport', city: 'Bangalore', country: 'India' },
  { iataCode: 'MAA', name: 'Chennai International Airport', city: 'Chennai', country: 'India' },
  { iataCode: 'CCU', name: 'Netaji Subhas Chandra Bose International', city: 'Kolkata', country: 'India' },
  { iataCode: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', country: 'India' },
  { iataCode: 'AMD', name: 'Sardar Vallabhbhai Patel International', city: 'Ahmedabad', country: 'India' },
  { iataCode: 'PNQ', name: 'Pune Airport', city: 'Pune', country: 'India' },
  { iataCode: 'COK', name: 'Cochin International Airport', city: 'Kochi', country: 'India' },
  { iataCode: 'TRV', name: 'Thiruvananthapuram International', city: 'Thiruvananthapuram', country: 'India' },
  { iataCode: 'IXC', name: 'Chandigarh International Airport', city: 'Chandigarh', country: 'India' },
  { iataCode: 'LKO', name: 'Chaudhary Charan Singh International', city: 'Lucknow', country: 'India' },
  { iataCode: 'JAI', name: 'Jaipur International Airport', city: 'Jaipur', country: 'India' },
  { iataCode: 'IXB', name: 'Bagdogra International Airport', city: 'Siliguri', country: 'India' },
  { iataCode: 'GAU', name: 'Lokpriya Gopinath Bordoloi International', city: 'Guwahati', country: 'India' },
  { iataCode: 'BBI', name: 'Biju Patnaik International Airport', city: 'Bhubaneswar', country: 'India' },

  // ── Nepal ─────────────────────────────────────────────────────────────────
  { iataCode: 'KTM', name: 'Tribhuvan International Airport', city: 'Kathmandu', country: 'Nepal' },
  { iataCode: 'PKR', name: 'Pokhara International Airport', city: 'Pokhara', country: 'Nepal' },

  // ── South Asia ────────────────────────────────────────────────────────────
  { iataCode: 'CMB', name: 'Bandaranaike International Airport', city: 'Colombo', country: 'Sri Lanka' },
  { iataCode: 'DAC', name: 'Hazrat Shahjalal International Airport', city: 'Dhaka', country: 'Bangladesh' },
  { iataCode: 'KHI', name: 'Jinnah International Airport', city: 'Karachi', country: 'Pakistan' },
  { iataCode: 'LHE', name: 'Allama Iqbal International Airport', city: 'Lahore', country: 'Pakistan' },
  { iataCode: 'ISB', name: 'Islamabad International Airport', city: 'Islamabad', country: 'Pakistan' },

  // ── Southeast Asia ────────────────────────────────────────────────────────
  { iataCode: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore' },
  { iataCode: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'Malaysia' },
  { iataCode: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
  { iataCode: 'DMK', name: 'Don Mueang International Airport', city: 'Bangkok', country: 'Thailand' },
  { iataCode: 'CGK', name: 'Soekarno-Hatta International Airport', city: 'Jakarta', country: 'Indonesia' },
  { iataCode: 'DPS', name: 'Ngurah Rai International Airport', city: 'Bali', country: 'Indonesia' },
  { iataCode: 'MNL', name: 'Ninoy Aquino International Airport', city: 'Manila', country: 'Philippines' },
  { iataCode: 'SGN', name: 'Tan Son Nhat International Airport', city: 'Ho Chi Minh City', country: 'Vietnam' },
  { iataCode: 'HAN', name: 'Noi Bai International Airport', city: 'Hanoi', country: 'Vietnam' },
  { iataCode: 'RGN', name: 'Yangon International Airport', city: 'Yangon', country: 'Myanmar' },
  { iataCode: 'PNH', name: 'Phnom Penh International Airport', city: 'Phnom Penh', country: 'Cambodia' },
  { iataCode: 'VTE', name: 'Wattay International Airport', city: 'Vientiane', country: 'Laos' },

  // ── East Asia ─────────────────────────────────────────────────────────────
  { iataCode: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong' },
  { iataCode: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan' },
  { iataCode: 'HND', name: 'Haneda Airport', city: 'Tokyo', country: 'Japan' },
  { iataCode: 'KIX', name: 'Kansai International Airport', city: 'Osaka', country: 'Japan' },
  { iataCode: 'NGO', name: 'Chubu Centrair International Airport', city: 'Nagoya', country: 'Japan' },
  { iataCode: 'ICN', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea' },
  { iataCode: 'GMP', name: 'Gimpo International Airport', city: 'Seoul', country: 'South Korea' },
  { iataCode: 'PEK', name: 'Beijing Capital International Airport', city: 'Beijing', country: 'China' },
  { iataCode: 'PKX', name: 'Beijing Daxing International Airport', city: 'Beijing', country: 'China' },
  { iataCode: 'PVG', name: 'Shanghai Pudong International Airport', city: 'Shanghai', country: 'China' },
  { iataCode: 'SHA', name: 'Shanghai Hongqiao International Airport', city: 'Shanghai', country: 'China' },
  { iataCode: 'CAN', name: 'Guangzhou Baiyun International Airport', city: 'Guangzhou', country: 'China' },
  { iataCode: 'SZX', name: 'Shenzhen Bao\'an International Airport', city: 'Shenzhen', country: 'China' },
  { iataCode: 'CTU', name: 'Chengdu Tianfu International Airport', city: 'Chengdu', country: 'China' },
  { iataCode: 'TPE', name: 'Taiwan Taoyuan International Airport', city: 'Taipei', country: 'Taiwan' },
  { iataCode: 'MFM', name: 'Macau International Airport', city: 'Macau', country: 'Macau' },

  // ── Australia & New Zealand ───────────────────────────────────────────────
  { iataCode: 'SYD', name: 'Kingsford Smith Airport', city: 'Sydney', country: 'Australia' },
  { iataCode: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia' },
  { iataCode: 'BNE', name: 'Brisbane Airport', city: 'Brisbane', country: 'Australia' },
  { iataCode: 'PER', name: 'Perth Airport', city: 'Perth', country: 'Australia' },
  { iataCode: 'ADL', name: 'Adelaide Airport', city: 'Adelaide', country: 'Australia' },
  { iataCode: 'CBR', name: 'Canberra Airport', city: 'Canberra', country: 'Australia' },
  { iataCode: 'AKL', name: 'Auckland Airport', city: 'Auckland', country: 'New Zealand' },
  { iataCode: 'CHC', name: 'Christchurch Airport', city: 'Christchurch', country: 'New Zealand' },
  { iataCode: 'WLG', name: 'Wellington Airport', city: 'Wellington', country: 'New Zealand' },

  // ── Africa ────────────────────────────────────────────────────────────────
  { iataCode: 'JNB', name: 'O.R. Tambo International Airport', city: 'Johannesburg', country: 'South Africa' },
  { iataCode: 'CPT', name: 'Cape Town International Airport', city: 'Cape Town', country: 'South Africa' },
  { iataCode: 'DUR', name: 'King Shaka International Airport', city: 'Durban', country: 'South Africa' },
  { iataCode: 'NBO', name: 'Jomo Kenyatta International Airport', city: 'Nairobi', country: 'Kenya' },
  { iataCode: 'ADD', name: 'Addis Ababa Bole International Airport', city: 'Addis Ababa', country: 'Ethiopia' },
  { iataCode: 'LOS', name: 'Murtala Muhammed International Airport', city: 'Lagos', country: 'Nigeria' },
  { iataCode: 'ACC', name: 'Kotoka International Airport', city: 'Accra', country: 'Ghana' },
  { iataCode: 'CMN', name: 'Mohammed V International Airport', city: 'Casablanca', country: 'Morocco' },
  { iataCode: 'TUN', name: 'Tunis-Carthage Airport', city: 'Tunis', country: 'Tunisia' },
  { iataCode: 'ALG', name: 'Houari Boumediene Airport', city: 'Algiers', country: 'Algeria' },

  // ── South America ─────────────────────────────────────────────────────────
  { iataCode: 'GRU', name: 'São Paulo/Guarulhos International Airport', city: 'São Paulo', country: 'Brazil' },
  { iataCode: 'CGH', name: 'Congonhas Airport', city: 'São Paulo', country: 'Brazil' },
  { iataCode: 'GIG', name: 'Rio de Janeiro/Galeão International', city: 'Rio de Janeiro', country: 'Brazil' },
  { iataCode: 'BSB', name: 'Brasília International Airport', city: 'Brasília', country: 'Brazil' },
  { iataCode: 'EZE', name: 'Ministro Pistarini International Airport', city: 'Buenos Aires', country: 'Argentina' },
  { iataCode: 'AEP', name: 'Jorge Newbery Airfield', city: 'Buenos Aires', country: 'Argentina' },
  { iataCode: 'SCL', name: 'Comodoro Arturo Merino Benítez', city: 'Santiago', country: 'Chile' },
  { iataCode: 'BOG', name: 'El Dorado International Airport', city: 'Bogotá', country: 'Colombia' },
  { iataCode: 'LIM', name: 'Jorge Chávez International Airport', city: 'Lima', country: 'Peru' },
  { iataCode: 'UIO', name: 'Mariscal Sucre International Airport', city: 'Quito', country: 'Ecuador' },
  { iataCode: 'GYE', name: 'José Joaquín de Olmedo International', city: 'Guayaquil', country: 'Ecuador' },
  { iataCode: 'CCS', name: 'Simón Bolívar International Airport', city: 'Caracas', country: 'Venezuela' },

  // ── Central America & Caribbean ───────────────────────────────────────────
  { iataCode: 'MEX', name: 'Benito Juárez International Airport', city: 'Mexico City', country: 'Mexico' },
  { iataCode: 'CUN', name: 'Cancún International Airport', city: 'Cancún', country: 'Mexico' },
  { iataCode: 'GDL', name: 'Miguel Hidalgo y Costilla International', city: 'Guadalajara', country: 'Mexico' },
  { iataCode: 'SJO', name: 'Juan Santamaría International Airport', city: 'San José', country: 'Costa Rica' },
  { iataCode: 'PTY', name: 'Tocumen International Airport', city: 'Panama City', country: 'Panama' },
  { iataCode: 'MBJ', name: 'Sangster International Airport', city: 'Montego Bay', country: 'Jamaica' },
  { iataCode: 'NAS', name: 'Lynden Pindling International Airport', city: 'Nassau', country: 'Bahamas' },

  // ── Central Asia ─────────────────────────────────────────────────────────
  { iataCode: 'ALA', name: 'Almaty International Airport', city: 'Almaty', country: 'Kazakhstan' },
  { iataCode: 'TAS', name: 'Islam Karimov Tashkent International', city: 'Tashkent', country: 'Uzbekistan' },
  { iataCode: 'FRU', name: 'Manas International Airport', city: 'Bishkek', country: 'Kyrgyzstan' },
  { iataCode: 'TBS', name: 'Tbilisi International Airport', city: 'Tbilisi', country: 'Georgia' },
  { iataCode: 'EVN', name: 'Zvartnots International Airport', city: 'Yerevan', country: 'Armenia' },
  { iataCode: 'GYD', name: 'Heydar Aliyev International Airport', city: 'Baku', country: 'Azerbaijan' },
]

// Search airports by code, city, or name — returns up to `limit` results
export function searchAirportsLocal(query, limit = 8) {
  if (!query || query.trim().length < 1) return []
  const q = query.trim().toLowerCase()
  const qu = q.toUpperCase()

  const scored = AIRPORTS.map(a => {
    let score = 0
    if (a.iataCode === qu) score = 100
    else if (a.iataCode.startsWith(qu)) score = 80
    else if (a.city.toLowerCase().startsWith(q)) score = 70
    else if (a.city.toLowerCase().includes(q)) score = 50
    else if (a.name.toLowerCase().includes(q)) score = 30
    else if (a.country.toLowerCase().includes(q)) score = 10
    return { ...a, score }
  }).filter(a => a.score > 0)

  return scored.sort((a, b) => b.score - a.score).slice(0, limit)
}
