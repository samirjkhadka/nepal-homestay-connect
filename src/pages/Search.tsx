import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Heart, Filter, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { getAllHomestays, Homestay } from '@/data/homestays';

const provinces = [
  'All Provinces',
  'Gandaki Province',
  'Bagmati Province',
  'Province 1',
  'Province 2',
  'Lumbini Province',
  'Karnali Province',
  'Sudurpashchim Province',
];

const amenityFilters = [
  { id: 'wifi', label: 'WiFi' },
  { id: 'meals', label: 'Home-cooked Meals' },
  { id: 'mountainView', label: 'Mountain View' },
  { id: 'hotWater', label: 'Hot Water' },
  { id: 'culturalProgram', label: 'Cultural Program' },
  { id: 'garden', label: 'Garden' },
  { id: 'terrace', label: 'Terrace' },
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('All Provinces');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');

  const allHomestays = getAllHomestays();

  const filteredHomestays = useMemo(() => {
    let results = allHomestays;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        h =>
          h.name.toLowerCase().includes(query) ||
          h.location.toLowerCase().includes(query) ||
          h.province.toLowerCase().includes(query)
      );
    }

    // Filter by province
    if (selectedProvince !== 'All Provinces') {
      results = results.filter(h => h.province === selectedProvince);
    }

    // Filter by price
    results = results.filter(
      h => h.pricePerNight >= priceRange[0] && h.pricePerNight <= priceRange[1]
    );

    // Filter by amenities
    if (selectedAmenities.length > 0) {
      results = results.filter(h =>
        selectedAmenities.every(amenity => h.amenities.includes(amenity))
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        results = [...results].sort((a, b) => a.pricePerNight - b.pricePerNight);
        break;
      case 'price-high':
        results = [...results].sort((a, b) => b.pricePerNight - a.pricePerNight);
        break;
      case 'rating':
        results = [...results].sort((a, b) => b.rating - a.rating);
        break;
      default:
        // recommended - keep original order
        break;
    }

    return results;
  }, [allHomestays, searchQuery, selectedProvince, priceRange, selectedAmenities, sortBy]);

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityId)
        ? prev.filter(a => a !== amenityId)
        : [...prev, amenityId]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedProvince('All Provinces');
    setPriceRange([0, 5000]);
    setSelectedAmenities([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="section-container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Find Your Perfect Homestay
            </h1>
            <p className="text-muted-foreground">
              Discover authentic Nepali hospitality across the Himalayas
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col md:flex-row gap-4 mb-8"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, location, or province..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-card rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
              {(selectedAmenities.length > 0 || selectedProvince !== 'All Provinces') && (
                <span className="w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                  {selectedAmenities.length + (selectedProvince !== 'All Provinces' ? 1 : 0)}
                </span>
              )}
            </Button>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 bg-card rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </motion.div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-card rounded-xl border border-border p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-foreground">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:underline"
                >
                  Clear all
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Province Filter */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Province
                  </label>
                  <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className="w-full px-4 py-2 bg-muted rounded-lg border-0 focus:ring-2 focus:ring-primary outline-none"
                  >
                    {provinces.map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Price Range: NPR {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={5000}
                    step={100}
                    className="mt-2"
                  />
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Amenities
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {amenityFilters.map(amenity => (
                      <label
                        key={amenity.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedAmenities.includes(amenity.id)}
                          onCheckedChange={() => toggleAmenity(amenity.id)}
                        />
                        <span className="text-sm text-foreground">{amenity.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Active Filters Tags */}
          {(selectedAmenities.length > 0 || selectedProvince !== 'All Provinces') && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedProvince !== 'All Provinces' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {selectedProvince}
                  <button onClick={() => setSelectedProvince('All Provinces')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedAmenities.map(amenity => (
                <span key={amenity} className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {amenityFilters.find(a => a.id === amenity)?.label}
                  <button onClick={() => toggleAmenity(amenity)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Results Count */}
          <p className="text-muted-foreground mb-6">
            {filteredHomestays.length} homestay{filteredHomestays.length !== 1 ? 's' : ''} found
          </p>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHomestays.map((homestay, index) => (
              <HomestayCard key={homestay.id} homestay={homestay} index={index} />
            ))}
          </div>

          {filteredHomestays.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">No homestays found matching your criteria.</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function HomestayCard({ homestay, index }: { homestay: Homestay; index: number }) {
  return (
    <Link to={`/homestay/${homestay.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -8 }}
        className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 border border-border"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={homestay.images[0]}
            alt={homestay.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <button 
            onClick={(e) => e.preventDefault()}
            className="absolute top-3 right-3 p-2 rounded-full bg-card/80 hover:bg-card transition-colors"
          >
            <Heart className="w-4 h-4 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
            <MapPin className="w-4 h-4" />
            {homestay.location}, {homestay.province}
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            {homestay.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {homestay.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span className="font-medium">{homestay.rating}</span>
              <span className="text-muted-foreground text-sm">
                ({homestay.reviews})
              </span>
            </div>
            <div className="text-right">
              <span className="font-semibold text-primary">
                NPR {homestay.pricePerNight.toLocaleString()}
              </span>
              <span className="text-muted-foreground text-sm">/night</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
