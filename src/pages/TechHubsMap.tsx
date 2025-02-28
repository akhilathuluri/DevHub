import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Globe, Building, Users, Briefcase, ChevronDown, ChevronUp, Search, Info } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for Leaflet marker icons
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom marker icon
const customIcon = (color: string) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface TechHub {
  id: number;
  name: string;
  city: string;
  country: string;
  description: string;
  position: [number, number];
  companies: string[];
  developers: number;
  category: 'major' | 'growing' | 'emerging';
  specialties: string[];
  image: string;
}

const techHubsData: TechHub[] = [
  {
    id: 1,
    name: 'Silicon Valley',
    city: 'San Francisco Bay Area',
    country: 'USA',
    description: 'The original tech hub, home to major tech companies and thousands of startups. Houses the largest concentration of software developers globally.',
    position: [37.387474, -122.057543],
    companies: ['Google', 'Apple', 'Meta', 'Netflix', 'Tesla', 'Salesforce', 'Twitter'],
    developers: 450000,
    category: 'major',
    specialties: ['AI/ML', 'Cloud Computing', 'Mobile Apps', 'Fintech', 'Blockchain', 'Autonomous Vehicles'],
    image: 'https://images.unsplash.com/photo-1537944434965-cf4679d1a598'
  },
  {
    id: 2,
    name: 'Beijing-Shanghai Tech Corridor',
    city: 'Beijing',
    country: 'China',
    description: 'China\'s largest tech ecosystem, featuring both established tech giants and innovative startups, with strong government support for technology development.',
    position: [39.9042, 116.4074],
    companies: ['Alibaba', 'ByteDance', 'Baidu', 'JD.com', 'DiDi', 'Meituan', 'Xiaomi'],
    developers: 380000,
    category: 'major',
    specialties: ['E-commerce', 'AI/ML', 'Mobile Apps', 'Social Media', 'IoT', 'Digital Payments'],
    image: 'https://images.unsplash.com/photo-1510332981392-36692ea3a195'
  },
  {
    id: 3,
    name: 'Bangalore Tech Hub',
    city: 'Bangalore',
    country: 'India',
    description: 'India\'s Silicon Valley with the largest pool of software developers in Asia, known for IT services, startups, and R&D centers of global tech companies.',
    position: [12.9716, 77.5946],
    companies: ['Infosys', 'Wipro', 'TCS', 'Flipkart', 'Amazon India', 'Microsoft India', 'Google India'],
    developers: 420000,
    category: 'major',
    specialties: ['IT Services', 'Cloud Computing', 'Enterprise Software', 'E-commerce', 'Mobile Development', 'Data Analytics'],
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2'
  },
  {
    id: 4,
    name: 'London Tech City',
    city: 'London',
    country: 'United Kingdom',
    description: 'Europe\'s largest tech hub and global fintech capital, with a diverse ecosystem of startups and established tech companies.',
    position: [51.5049, -0.0964],
    companies: ['Revolut', 'Wise', 'DeepMind', 'Monzo', 'Deliveroo', 'Checkout.com', 'Octopus Energy'],
    developers: 290000,
    category: 'major',
    specialties: ['Fintech', 'AI/ML', 'Cybersecurity', 'Digital Health', 'Clean Tech', 'E-commerce'],
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad'
  },
  {
    id: 5,
    name: 'Tokyo Tech District',
    city: 'Tokyo',
    country: 'Japan',
    description: 'Japan\'s primary tech hub, combining traditional tech giants with a growing startup ecosystem and strong robotics focus.',
    position: [35.6762, 139.6503],
    companies: ['Sony', 'Nintendo', 'Rakuten', 'SoftBank', 'Line', 'Mercari', 'NTT Data'],
    developers: 270000,
    category: 'major',
    specialties: ['Gaming', 'Robotics', 'IoT', 'Mobile Apps', 'AI/ML', 'E-commerce'],
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf'
  },
  {
    id: 6,
    name: 'Berlin',
    city: 'Berlin',
    country: 'Germany',
    description: 'A vibrant startup scene with affordable living and a creative atmosphere.',
    position: [52.5200, 13.4050],
    companies: ['N26', 'SoundCloud', 'Zalando', 'HelloFresh'],
    developers: 180000,
    category: 'growing',
    specialties: ['Fintech', 'E-commerce', 'Music Tech', 'Food Tech'],
    image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: 7,
    name: 'Singapore',
    city: 'Singapore',
    country: 'Singapore',
    description: 'A strategic tech hub in Asia with strong government support and excellent infrastructure.',
    position: [1.3521, 103.8198],
    companies: ['Grab', 'Sea Limited', 'Lazada', 'Razer'],
    developers: 120000,
    category: 'growing',
    specialties: ['Fintech', 'E-commerce', 'Smart Cities', 'Blockchain'],
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1452&q=80'
  },
  {
    id: 8,
    name: 'Toronto-Waterloo Corridor',
    city: 'Toronto',
    country: 'Canada',
    description: 'Canada\'s largest tech hub with strengths in AI, fintech, and life sciences.',
    position: [43.6532, -79.3832],
    companies: ['Shopify', 'Wattpad', 'Kik', 'Hootsuite'],
    developers: 160000,
    category: 'growing',
    specialties: ['AI', 'Fintech', 'E-commerce', 'Health Tech'],
    image: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80'
  },
  {
    id: 9,
    name: 'Stockholm',
    city: 'Stockholm',
    country: 'Sweden',
    description: 'A unicorn factory with a focus on gaming, music tech, and fintech.',
    position: [59.3293, 18.0686],
    companies: ['Spotify', 'Klarna', 'King', 'iZettle'],
    developers: 85000,
    category: 'growing',
    specialties: ['Music Tech', 'Fintech', 'Gaming', 'Greentech'],
    image: 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: 10,
    name: 'Shenzhen',
    city: 'Shenzhen',
    country: 'China',
    description: 'China\'s hardware capital and a major center for electronics manufacturing and innovation.',
    position: [22.5431, 114.0579],
    companies: ['Tencent', 'Huawei', 'DJI', 'BYD'],
    developers: 290000,
    category: 'major',
    specialties: ['Hardware', 'IoT', 'Robotics', 'Electric Vehicles'],
    image: 'https://images.unsplash.com/photo-1522998873429-143329252325?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80'
  },
  {
    id: 11,
    name: 'Austin',
    city: 'Austin',
    country: 'USA',
    description: 'A rapidly growing tech hub with a vibrant culture and lower cost of living compared to Silicon Valley.',
    position: [30.2672, -97.7431],
    companies: ['Dell', 'Tesla', 'Oracle', 'Indeed'],
    developers: 110000,
    category: 'growing',
    specialties: ['Hardware', 'Automotive Tech', 'Enterprise Software', 'Blockchain'],
    image: 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1428&q=80'
  },
  {
    id: 12,
    name: 'Lisbon',
    city: 'Lisbon',
    country: 'Portugal',
    description: 'An emerging tech hub with a growing startup ecosystem and quality of life.',
    position: [38.7223, -9.1393],
    companies: ['Farfetch', 'Unbabel', 'Talkdesk', 'Feedzai'],
    developers: 45000,
    category: 'emerging',
    specialties: ['E-commerce', 'AI', 'Customer Service Tech', 'Fintech'],
    image: 'https://images.unsplash.com/photo-1580323956606-5e19dcbf990c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: 13,
    name: 'Seoul Digital City',
    city: 'Seoul',
    country: 'South Korea',
    description: 'A dynamic tech hub known for gaming, mobile apps, and consumer electronics, with strong government support for digital innovation.',
    position: [37.5665, 126.9780],
    companies: ['Samsung', 'Naver', 'Kakao', 'Nexon', 'NC Soft', 'LG Electronics', 'Coupang'],
    developers: 250000,
    category: 'major',
    specialties: ['Gaming', 'Mobile Apps', 'E-commerce', 'Semiconductors', 'AI/ML', '5G Technology'],
    image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241'
  },
  {
    id: 14,
    name: 'Dubai Internet City',
    city: 'Dubai',
    country: 'UAE',
    description: 'Middle East\'s largest tech hub, attracting global companies and startups with zero-tax policies and modern infrastructure.',
    position: [25.0657, 55.1713],
    companies: ['Careem', 'Souq', 'Microsoft Gulf', 'IBM MEA', 'Google MENA', 'Amazon AWS'],
    developers: 85000,
    category: 'growing',
    specialties: ['E-commerce', 'Fintech', 'Smart City Solutions', 'Blockchain', 'Cloud Computing'],
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c'
  },
  {
    id: 15,
    name: 'São Paulo Tech Center',
    city: 'São Paulo',
    country: 'Brazil',
    description: 'Latin America\'s largest tech ecosystem, with a focus on fintech and e-commerce solutions.',
    position: [-23.5505, -46.6333],
    companies: ['Nubank', 'iFood', 'PagSeguro', 'QuintoAndar', 'Creditas', 'MercadoLivre'],
    developers: 120000,
    category: 'growing',
    specialties: ['Fintech', 'E-commerce', 'Mobile Apps', 'SaaS', 'Digital Banking'],
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8'
  }
];

const TechHubsMap = () => {
  const [selectedHub, setSelectedHub] = useState<TechHub | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedInfo, setExpandedInfo] = useState<boolean>(false);
  const [filteredHubs, setFilteredHubs] = useState<TechHub[]>(techHubsData);

  useEffect(() => {
    let result = techHubsData;
    
    // Apply category filter
    if (filter !== 'all') {
      result = result.filter(hub => hub.category === filter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(hub => 
        hub.name.toLowerCase().includes(term) || 
        hub.city.toLowerCase().includes(term) || 
        hub.country.toLowerCase().includes(term) ||
        hub.specialties.some(specialty => specialty.toLowerCase().includes(term))
      );
    }
    
    setFilteredHubs(result);
  }, [filter, searchTerm]);

  const getMarkerColor = (category: string) => {
    switch (category) {
      case 'major': return 'red';
      case 'growing': return 'blue';
      case 'emerging': return 'green';
      default: return 'blue';
    }
  };

  const handleHubClick = (hub: TechHub) => {
    setSelectedHub(hub);
    setExpandedInfo(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tech Hubs Map</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover technology hubs and developer hotspots around the world. Explore where innovation happens.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-lg shadow-md p-6 mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tech hubs by name, city, country or specialty"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              All Hubs
            </button>
            <button
              onClick={() => setFilter('major')}
              className={`px-4 py-2 rounded-md ${filter === 'major' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Major Hubs
            </button>
            <button
              onClick={() => setFilter('growing')}
              className={`px-4 py-2 rounded-md ${filter === 'growing' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Growing Hubs
            </button>
            <button
              onClick={() => setFilter('emerging')}
              className={`px-4 py-2 rounded-md ${filter === 'emerging' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Emerging Hubs
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-1 h-[600px] overflow-y-auto pr-2 space-y-4"
        >
          {filteredHubs.length === 0 ? (
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <p className="text-gray-600">No tech hubs found matching your criteria.</p>
            </div>
          ) : (
            filteredHubs.map((hub) => (
              <motion.div
                key={hub.id}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${selectedHub?.id === hub.id ? 'ring-2 ring-indigo-500' : ''}`}
                onClick={() => handleHubClick(hub)}
                whileHover={{ y: -3 }}
              >
                <div className="flex items-center p-4">
                  <div className={`w-3 h-12 mr-4 rounded-sm ${hub.category === 'major' ? 'bg-red-500' : hub.category === 'growing' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900">{hub.name}</h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="h-3 w-3 mr-1" />
                      {hub.city}, {hub.country}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-sm font-medium text-gray-900">{hub.developers.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">developers</div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2 h-[600px] bg-gray-100 rounded-lg overflow-hidden"
        >
          <MapContainer 
            center={[20, 0]} 
            zoom={2} 
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredHubs.map((hub) => (
              <Marker 
                key={hub.id} 
                position={hub.position}
                icon={customIcon(getMarkerColor(hub.category))}
                eventHandlers={{
                  click: () => {
                    handleHubClick(hub);
                  },
                }}
              >
                <Popup>
                  <div className="text-center">
                    <h3 className="font-bold">{hub.name}</h3>
                    <p>{hub.city}, {hub.country}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedHub && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="mt-8 bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative h-64 overflow-hidden">
              <img 
                src={selectedHub.image} 
                alt={selectedHub.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h2 className="text-2xl md:text-3xl font-bold">{selectedHub.name}</h2>
                  <div className="flex items-center mt-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{selectedHub.city}, {selectedHub.country}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedHub.specialties.map((specialty, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
              
              <p className="text-gray-700 mb-6">{selectedHub.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-700 mb-2">
                    <Building className="h-5 w-5 mr-2 text-indigo-600" />
                    <h3 className="font-semibold">Hub Category</h3>
                  </div>
                  <p className="capitalize">{selectedHub.category}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-700 mb-2">
                    <Users className="h-5 w-5 mr-2 text-indigo-600" />
                    <h3 className="font-semibold">Developer Population</h3>
                  </div>
                  <p>{selectedHub.developers.toLocaleString()}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-700 mb-2">
                    <Globe className="h-5 w-5 mr-2 text-indigo-600" />
                    <h3 className="font-semibold">Global Position</h3>
                  </div>
                  <p>{selectedHub.position[0].toFixed(4)}, {selectedHub.position[1].toFixed(4)}</p>
                </div>
              </div>
              
              <div>
                <button
                  onClick={() => setExpandedInfo(!expandedInfo)}
                  className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
                >
                  {expandedInfo ? (
                    <>
                      <ChevronUp className="h-5 w-5 mr-1" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-5 w-5 mr-1" />
                      Show More
                    </>
                  )}
                </button>
                <AnimatePresence>
                  {expandedInfo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="flex items-center text-gray-700 mb-2">
                          <Briefcase className="h-5 w-5 mr-2 text-indigo-600" />
                          <h3 className="font-semibold">Major Companies</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedHub.companies.map((company, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                            >
                              {company}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center text-gray-700 mb-2">
                          <Info className="h-5 w-5 mr-2 text-indigo-600" />
                          <h3 className="font-semibold">Additional Information</h3>
                        </div>
                        <p className="text-gray-700">
                          {selectedHub.name} is a {selectedHub.category} tech hub with a strong focus on {selectedHub.specialties.join(', ')}. 
                          It is home to {selectedHub.developers.toLocaleString()} developers and hosts major companies like {selectedHub.companies.slice(0, 3).join(', ')}.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TechHubsMap;