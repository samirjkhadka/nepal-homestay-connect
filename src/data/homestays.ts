import homestay1 from '@/assets/homestay-1.jpg';
import homestay2 from '@/assets/homestay-2.jpg';
import homestay3 from '@/assets/homestay-3.jpg';
import homestay4 from '@/assets/homestay-4.jpg';
import homestay5 from '@/assets/homestay-5.jpg';
import homestay6 from '@/assets/homestay-6.jpg';
import room1 from '@/assets/room-1.jpg';
import room2 from '@/assets/room-2.jpg';
import room3 from '@/assets/room-3.jpg';

export interface Homestay {
  id: string;
  name: string;
  location: string;
  province: string;
  description: string;
  longDescription: string;
  pricePerNight: number;
  rating: number;
  reviews: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  coordinates: { lat: number; lng: number };
  host: {
    name: string;
    since: string;
    responseRate: number;
    responseTime: string;
    isSuperhost: boolean;
    bio: string;
    languages: string[];
    expertise: string[];
  };
  images: string[];
  amenities: string[];
  reviewsList: {
    id: number;
    author: string;
    avatar: string;
    date: string;
    rating: number;
    comment: string;
    helpful: number;
  }[];
  bookedDates: string[];
}

export const homestaysData: Record<string, Homestay> = {
  'mountain-view-retreat': {
    id: 'mountain-view-retreat',
    name: 'Mountain View Retreat',
    location: 'Sarangkot',
    province: 'Gandaki Province',
    description: 'A stunning traditional homestay with panoramic Himalayan views',
    longDescription: `Welcome to Mountain View Retreat, a beautiful traditional Nepali homestay perched on the hills of Sarangkot. Wake up to breathtaking views of the Annapurna range and Machapuchare (Fishtail) mountain right from your window.

Our family has been welcoming travelers for over 15 years, offering authentic Nepali hospitality and home-cooked organic meals. The homestay features traditional stone architecture with modern comforts, surrounded by terraced gardens and rhododendron forests.

Experience village life, join us for morning yoga sessions, or simply relax on the terrace watching the sunset paint the mountains in golden hues. We're perfectly located for day hikes to nearby viewpoints and just 30 minutes from Pokhara city.`,
    pricePerNight: 2500,
    rating: 4.9,
    reviews: 128,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    coordinates: { lat: 28.2436, lng: 83.9456 },
    host: {
      name: 'Deepak Gurung',
      since: '2010',
      responseRate: 98,
      responseTime: 'within an hour',
      isSuperhost: true,
      bio: 'Born and raised in Sarangkot, I spent 10 years as a trekking guide before opening our family home to travelers. I love sharing stories about the mountains and cooking traditional Gurung dishes with my wife.',
      languages: ['Nepali', 'English', 'Hindi', 'Gurung'],
      expertise: ['Trekking Guide', 'Cultural Expert', 'Organic Farming'],
    },
    images: [homestay1, room1, room2, room3, homestay2, homestay3],
    amenities: ['wifi', 'meals', 'mountainView', 'hotWater', 'heating', 'breakfast', 'garden', 'terrace', 'familyFriendly', 'bedroom', 'bathroom', 'cleaning'],
    reviewsList: [
      { id: 1, author: 'Sarah Mitchell', avatar: '', date: 'January 2026', rating: 5, comment: 'Absolutely magical experience! Deepak and his family made us feel like part of their home. The views are even better than the photos, and the dal bhat was the best we had in Nepal.', helpful: 24 },
      { id: 2, author: 'James Chen', avatar: '', date: 'December 2025', rating: 5, comment: 'The perfect escape from the busy tourist areas. Peaceful, authentic, and the sunrise views of the Annapurna range are unforgettable. Highly recommend the cooking class!', helpful: 18 },
      { id: 3, author: 'Emma Watson', avatar: '', date: 'November 2025', rating: 5, comment: 'We stayed for 4 nights and didnt want to leave. The hospitality is genuine, the food is incredible, and Deepak knows all the best hiking trails. Book this place!', helpful: 31 },
    ],
    bookedDates: ['2026-02-10', '2026-02-11', '2026-02-12', '2026-02-15', '2026-02-16', '2026-02-20', '2026-02-21', '2026-02-22', '2026-02-23'],
  },
  'traditional-gurung-house': {
    id: 'traditional-gurung-house',
    name: 'Traditional Gurung House',
    location: 'Ghandruk',
    province: 'Gandaki Province',
    description: 'Authentic Gurung village experience with stunning Annapurna views',
    longDescription: `Step into the heart of Gurung culture at our traditional stone house in Ghandruk, one of Nepal's most beautiful mountain villages. Our 200-year-old ancestral home has been lovingly restored to offer modern comfort while preserving its authentic character.

Located on the famous Annapurna Circuit, our homestay offers unobstructed views of Annapurna South, Hiunchuli, and Machhapuchhre. Watch the mountains glow pink at sunrise from our traditional kitchen while enjoying chai made with fresh local herbs.

We offer home-cooked organic meals using vegetables from our garden, cultural programs featuring traditional Gurung dance and music, and guided village walks to learn about local customs and traditions. Perfect for trekkers and culture enthusiasts alike.`,
    pricePerNight: 1800,
    rating: 4.8,
    reviews: 95,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    coordinates: { lat: 28.3741, lng: 83.8047 },
    host: {
      name: 'Maya Gurung',
      since: '2008',
      responseRate: 95,
      responseTime: 'within 2 hours',
      isSuperhost: true,
      bio: 'I am a proud Gurung woman who has dedicated my life to preserving our cultural heritage. I teach traditional Gurung dance and weaving, and love introducing guests to our village way of life.',
      languages: ['Nepali', 'English', 'Gurung'],
      expertise: ['Cultural Expert', 'Traditional Dance Instructor', 'Weaving Artisan'],
    },
    images: [homestay2, room2, room1, homestay1, room3, homestay3],
    amenities: ['meals', 'mountainView', 'hotWater', 'culturalProgram', 'breakfast', 'garden', 'familyFriendly', 'bedroom', 'bathroom', 'localGuide'],
    reviewsList: [
      { id: 1, author: 'Thomas Berg', avatar: '', date: 'January 2026', rating: 5, comment: 'Maya and her family are incredible hosts. The cultural evening with traditional dance was a highlight of our trip. The food was amazing and plentiful!', helpful: 19 },
      { id: 2, author: 'Lisa Wong', avatar: '', date: 'December 2025', rating: 4, comment: 'Beautiful location, authentic experience. The trek to get here is worth it. Only wish we could have stayed longer. Will definitely return!', helpful: 14 },
    ],
    bookedDates: ['2026-02-05', '2026-02-06', '2026-02-07', '2026-02-14', '2026-02-18', '2026-02-19'],
  },
  'himalayan-eco-lodge': {
    id: 'himalayan-eco-lodge',
    name: 'Himalayan Eco Lodge',
    location: 'Nagarkot',
    province: 'Bagmati Province',
    description: 'Sustainable eco-lodge with panoramic Himalayan sunrise views',
    longDescription: `Experience sustainable luxury at our award-winning eco-lodge in Nagarkot, famous for having one of the widest views of the Himalayan range. On clear days, you can see from Dhaulagiri to Everest – eight of the world's thirteen highest peaks!

Built using traditional methods and local materials, our lodge operates entirely on solar power and rainwater harvesting. We grow organic vegetables in our permaculture garden and compost all organic waste. Your stay directly supports local conservation efforts.

Wake up early to witness the spectacular sunrise painting the snow peaks in gold and crimson. Spend your days hiking through rhododendron forests, visiting ancient temples, or simply relaxing in our peaceful gardens with a good book and mountain views.`,
    pricePerNight: 3200,
    rating: 4.9,
    reviews: 156,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    coordinates: { lat: 27.7172, lng: 85.5200 },
    host: {
      name: 'Bikash Tamang',
      since: '2012',
      responseRate: 100,
      responseTime: 'within an hour',
      isSuperhost: true,
      bio: 'An environmentalist and nature photographer, I built this eco-lodge to prove that tourism can be sustainable. I lead nature walks and teach guests about permaculture and Himalayan ecology.',
      languages: ['Nepali', 'English', 'Tamang', 'Japanese'],
      expertise: ['Eco Tourism Expert', 'Nature Photographer', 'Permaculture Guide'],
    },
    images: [homestay3, room3, room1, room2, homestay1, homestay2],
    amenities: ['wifi', 'meals', 'mountainView', 'hotWater', 'heating', 'breakfast', 'garden', 'terrace', 'eco', 'solar', 'bedroom', 'bathroom'],
    reviewsList: [
      { id: 1, author: 'Amanda Foster', avatar: '', date: 'January 2026', rating: 5, comment: 'The sunrise here is simply unbelievable. Eight Himalayan peaks visible from the terrace! Bikash is incredibly knowledgeable about the mountains and local ecology.', helpful: 32 },
      { id: 2, author: 'Robert Kim', avatar: '', date: 'December 2025', rating: 5, comment: 'Love the sustainable approach. Great food, comfortable rooms, and the views are world-class. The guided nature walk was educational and enjoyable.', helpful: 21 },
    ],
    bookedDates: ['2026-02-08', '2026-02-09', '2026-02-13', '2026-02-14', '2026-02-25', '2026-02-26', '2026-02-27'],
  },
  'tharu-cultural-homestay': {
    id: 'tharu-cultural-homestay',
    name: 'Tharu Cultural Homestay',
    location: 'Sauraha, Chitwan',
    province: 'Bagmati Province',
    description: 'Immerse yourself in indigenous Tharu culture near Chitwan National Park',
    longDescription: `Discover the rich culture of the Tharu people at our traditional homestay in Sauraha, gateway to Chitwan National Park. Our family has lived in this region for generations, and we're proud to share our unique traditions, cuisine, and way of life with visitors from around the world.

Stay in our traditional Tharu-style house with mud walls and thatched roof, designed to stay cool in the summer heat. Enjoy authentic Tharu cuisine including dhikri, ghonghi, and fish curry made with freshly caught river fish.

We offer cultural experiences including Tharu stick dance performances, village walks, fishing trips, and visits to local artisans. Our location is perfect for exploring Chitwan National Park – we can arrange jungle safaris, elephant encounters, and canoe rides to spot crocodiles and birds.`,
    pricePerNight: 1500,
    rating: 4.7,
    reviews: 87,
    maxGuests: 5,
    bedrooms: 2,
    bathrooms: 1,
    coordinates: { lat: 27.5833, lng: 84.5000 },
    host: {
      name: 'Ram Bahadur Tharu',
      since: '2015',
      responseRate: 92,
      responseTime: 'within 3 hours',
      isSuperhost: false,
      bio: 'A Tharu community leader and wildlife enthusiast, I grew up on the edge of Chitwan jungle. I am a certified nature guide and love sharing the stories and traditions of the Tharu people.',
      languages: ['Nepali', 'English', 'Tharu', 'Hindi'],
      expertise: ['Wildlife Guide', 'Cultural Expert', 'Community Leader'],
    },
    images: [homestay4, room1, room2, homestay5, room3, homestay6],
    amenities: ['meals', 'culturalProgram', 'breakfast', 'garden', 'familyFriendly', 'bedroom', 'bathroom', 'localGuide', 'wildlife'],
    reviewsList: [
      { id: 1, author: 'Sophie Laurent', avatar: '', date: 'January 2026', rating: 5, comment: 'The Tharu dance performance was magical! Ram and his family are wonderful hosts. The jungle safari arranged by them was excellent value.', helpful: 16 },
      { id: 2, author: 'Michael Torres', avatar: '', date: 'November 2025', rating: 4, comment: 'Great cultural experience and perfect location for Chitwan. The food was delicious and different from typical Nepali food. Basic but authentic accommodation.', helpful: 11 },
    ],
    bookedDates: ['2026-02-03', '2026-02-04', '2026-02-17', '2026-02-24'],
  },
  'peaceful-lakeside-cottage': {
    id: 'peaceful-lakeside-cottage',
    name: 'Peaceful Lakeside Cottage',
    location: 'Begnas Lake',
    province: 'Gandaki Province',
    description: 'Serene lakeside retreat away from the tourist crowds',
    longDescription: `Escape to tranquility at our charming cottage on the shores of Begnas Lake, Pokhara's quieter and more pristine sister lake. Just 15 km from the bustling Lakeside, our homestay offers peace and natural beauty that's increasingly rare to find.

Wake up to the sound of birdsong and the gentle lapping of waves against the shore. Enjoy your morning tea on our private deck watching fishermen cast their nets as mist rises from the lake. The Annapurna range provides a stunning backdrop to this idyllic scene.

We offer rowing boat trips on the lake, guided bird watching (over 100 species spotted!), fishing experiences, and peaceful walks through nearby rice terraces and villages. Perfect for those seeking a slower pace and genuine connection with nature.`,
    pricePerNight: 2200,
    rating: 4.8,
    reviews: 64,
    maxGuests: 3,
    bedrooms: 1,
    bathrooms: 1,
    coordinates: { lat: 28.1747, lng: 84.0950 },
    host: {
      name: 'Sunita Poudel',
      since: '2018',
      responseRate: 97,
      responseTime: 'within an hour',
      isSuperhost: true,
      bio: 'A former school teacher turned birding enthusiast, I left city life to build this peaceful retreat by the lake. I have spotted over 100 bird species here and love guiding guests on nature walks.',
      languages: ['Nepali', 'English'],
      expertise: ['Birding Guide', 'Nature Educator', 'Local Cuisine Expert'],
    },
    images: [homestay5, room2, room3, homestay2, room1, homestay1],
    amenities: ['wifi', 'meals', 'lakeView', 'hotWater', 'breakfast', 'garden', 'terrace', 'boating', 'bedroom', 'bathroom', 'birdwatching'],
    reviewsList: [
      { id: 1, author: 'David Palmer', avatar: '', date: 'January 2026', rating: 5, comment: 'Heaven on earth! So peaceful after the chaos of Kathmandu. Sunita is a wonderful host and her cooking is incredible. The sunrise boat ride was magical.', helpful: 22 },
      { id: 2, author: 'Maria Gonzalez', avatar: '', date: 'December 2025', rating: 5, comment: 'We extended our stay twice! The cottage is simple but has everything you need. The lake views are breathtaking and it is so quiet and peaceful.', helpful: 17 },
    ],
    bookedDates: ['2026-02-06', '2026-02-07', '2026-02-08', '2026-02-12', '2026-02-13', '2026-02-28'],
  },
  'ancient-newari-house': {
    id: 'ancient-newari-house',
    name: 'Ancient Newari House',
    location: 'Bhaktapur',
    province: 'Bagmati Province',
    description: 'Stay in a restored 400-year-old Newari heritage home',
    longDescription: `Step back in time at our meticulously restored 400-year-old Newari house in the heart of Bhaktapur's ancient quarter. This architectural gem features intricate wood carvings, traditional clay tiles, and a central courtyard that has witnessed centuries of history.

Our home is located in a quiet corner of the UNESCO World Heritage Site, just steps from Dattatreya Square and its famous Peacock Window. Experience life as locals do – morning pujas at nearby temples, evening strolls through medieval streets, and conversations with skilled artisans in their workshops.

We offer cultural immersion experiences including pottery making with local masters, cooking classes for traditional Newari feast (bhoj), and guided heritage walks. Our rooftop terrace offers stunning views of pagoda temples and the distant Himalayas.`,
    pricePerNight: 2800,
    rating: 4.9,
    reviews: 112,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    coordinates: { lat: 27.6710, lng: 85.4298 },
    host: {
      name: 'Rajendra Shrestha',
      since: '2011',
      responseRate: 99,
      responseTime: 'within an hour',
      isSuperhost: true,
      bio: 'A heritage conservationist and Newari culture scholar, I restored my ancestral home to share its beauty with the world. I lead heritage walks through Bhaktapur and teach traditional Newari cooking.',
      languages: ['Nepali', 'English', 'Newari', 'German'],
      expertise: ['Heritage Conservationist', 'Tour Guide', 'Newari Cooking Instructor'],
    },
    images: [homestay6, room1, room3, homestay4, room2, homestay3],
    amenities: ['wifi', 'meals', 'heritage', 'hotWater', 'culturalProgram', 'breakfast', 'terrace', 'bedroom', 'bathroom', 'artisan', 'cooking'],
    reviewsList: [
      { id: 1, author: 'Jennifer Adams', avatar: '', date: 'January 2026', rating: 5, comment: 'Staying here was like living in a museum, but with all the comforts! Rajendra is incredibly knowledgeable about Newari culture. The pottery class was unforgettable.', helpful: 28 },
      { id: 2, author: 'Hans Mueller', avatar: '', date: 'December 2025', rating: 5, comment: 'Exceptional heritage property. The wood carvings are stunning and the location is perfect. Walking through the ancient streets at dawn was magical.', helpful: 19 },
    ],
    bookedDates: ['2026-02-09', '2026-02-10', '2026-02-11', '2026-02-16', '2026-02-17', '2026-02-21', '2026-02-22'],
  },
};

// Get all homestays as an array
export const getAllHomestays = () => Object.values(homestaysData);

// Get featured homestays (first 4)
export const getFeaturedHomestays = () => Object.values(homestaysData).slice(0, 4);

// Get homestay by ID
export const getHomestayById = (id: string) => homestaysData[id];

// Get nearby homestays (same province, excluding current)
export const getNearbyHomestays = (id: string, limit = 3) => {
  const current = homestaysData[id];
  if (!current) return [];
  return Object.values(homestaysData)
    .filter(h => h.id !== id)
    .sort((a, b) => (a.province === current.province ? -1 : 1) - (b.province === current.province ? -1 : 1))
    .slice(0, limit);
};

// Check if a date is available
export const isDateAvailable = (homestayId: string, date: Date): boolean => {
  const homestay = homestaysData[homestayId];
  if (!homestay) return false;
  const dateString = date.toISOString().split('T')[0];
  return !homestay.bookedDates.includes(dateString);
};

// Get unavailable dates for a homestay
export const getUnavailableDates = (homestayId: string): Date[] => {
  const homestay = homestaysData[homestayId];
  if (!homestay) return [];
  return homestay.bookedDates.map(dateStr => new Date(dateStr));
};
