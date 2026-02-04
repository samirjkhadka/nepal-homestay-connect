import { motion } from 'framer-motion';
import { Heart, Users, MapPin, Award, Target, Eye } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const stats = [
  { label: 'Homestays', value: '500+' },
  { label: 'Happy Guests', value: '10,000+' },
  { label: 'Provinces Covered', value: '7' },
  { label: 'Local Hosts', value: '300+' },
];

const team = [
  {
    name: 'Bikash Sharma',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    bio: 'A passionate traveler with 15+ years in tourism.',
  },
  {
    name: 'Sunita Tamang',
    role: 'Head of Operations',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
    bio: 'Expert in hospitality and community development.',
  },
  {
    name: 'Rajan Gurung',
    role: 'Community Manager',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
    bio: 'Connecting travelers with authentic local experiences.',
  },
  {
    name: 'Maya Thapa',
    role: 'Customer Success',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300',
    bio: 'Ensuring every guest has a memorable stay.',
  },
];

const values = [
  {
    icon: Heart,
    title: 'Authentic Experiences',
    description: 'We believe in genuine connections between travelers and local communities.',
  },
  {
    icon: Users,
    title: 'Community First',
    description: 'Our platform directly benefits local families and preserves cultural heritage.',
  },
  {
    icon: MapPin,
    title: 'Sustainable Tourism',
    description: 'We promote responsible travel that respects nature and local traditions.',
  },
  {
    icon: Award,
    title: 'Quality Assurance',
    description: 'Every homestay is personally verified to ensure comfort and safety.',
  },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              About Nepali Homestays
            </h1>
            <p className="text-lg text-muted-foreground">
              Connecting travelers with authentic Nepali hospitality since 2018. We're more than a booking platform – we're a bridge between cultures.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 bg-card rounded-2xl border border-border"
            >
              <div className="font-display text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="section-container py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Nepali Homestays was born from a simple idea: that the best way to experience Nepal isn't in a hotel, but in the home of a local family. Our founder, Bikash, grew up in a small village in the Annapurna region, where his family often hosted trekkers passing through.
              </p>
              <p>
                Those interactions – sharing meals, stories, and laughter – inspired him to create a platform that would make these authentic experiences accessible to travelers from around the world, while ensuring that local communities benefit directly from tourism.
              </p>
              <p>
                Today, we partner with over 300 families across all seven provinces of Nepal, from the peaks of the Himalayas to the plains of the Terai. Each homestay is carefully selected and regularly visited to ensure quality and authenticity.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden"
          >
            <img 
              src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800"
              alt="Nepali village"
              className="w-full h-96 object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-primary/5 py-16">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card p-8 rounded-2xl border border-border"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground">
                To provide travelers with authentic, enriching homestay experiences while empowering local communities through sustainable tourism that preserves and celebrates Nepali culture.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-card p-8 rounded-2xl border border-border"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground">
                To become the leading platform for authentic travel experiences in South Asia, setting the standard for community-based tourism that benefits both travelers and local hosts.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-container py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">Our Values</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            These principles guide everything we do
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <value.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{value.title}</h3>
              <p className="text-muted-foreground text-sm">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-muted/50 py-16">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The passionate people behind Nepali Homestays
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl overflow-hidden border border-border text-center"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground">{member.name}</h3>
                  <p className="text-primary text-sm mb-2">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;