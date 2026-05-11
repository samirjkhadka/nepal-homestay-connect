import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageTransition } from "@/components/PageTransition";
import { ScrollToTop } from "@/components/ScrollToTop";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { CompareProvider } from "@/contexts/CompareContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { CMSProvider } from "@/contexts/CMSContext";
import { HostDataProvider } from "@/contexts/HostDataContext";
import { CompareWidget } from "@/components/CompareWidget";
import { PhrasebookButton } from "@/components/PhrasebookButton";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";

// Public pages
import Index from "./pages/Index";
import HomestayDetail from "./pages/HomestayDetail";
import Search from "./pages/Search";
import Packages from "./pages/Packages";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Team from "./pages/Team";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Destinations from "./pages/Destinations";
import Experiences from "./pages/Experiences";
import Help from "./pages/Help";
import Safety from "./pages/Safety";
import Cancellation from "./pages/Cancellation";
import FAQs from "./pages/FAQs";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import Homestays from "./pages/Homestays";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import Festivals from "./pages/Festivals";
import TripPlanner from "./pages/TripPlanner";
import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHomestays from "./pages/admin/AdminHomestays";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminCMSHero from "./pages/admin/AdminCMSHero";
import AdminCMSPartners from "./pages/admin/AdminCMSPartners";
import AdminCMSFestivals from "./pages/admin/AdminCMSFestivals";
import AdminCMSExperiences from "./pages/admin/AdminCMSExperiences";
import AdminCMSBlogs from "./pages/admin/AdminCMSBlogs";
import AdminCMSTestimonials from "./pages/admin/AdminCMSTestimonials";
import AdminCMSPages from "./pages/admin/AdminCMSPages";
import AdminCMSNavigation from "./pages/admin/AdminCMSNavigation";
import AdminCMSTheme from "./pages/admin/AdminCMSTheme";
import AdminCMSMedia from "./pages/admin/AdminCMSMedia";

// Host pages
import HostDashboard from "./pages/host/HostDashboard";
import HostListings from "./pages/host/HostListings";
import HostCalendar from "./pages/host/HostCalendar";
import HostBookings from "./pages/host/HostBookings";
import HostExperiences from "./pages/host/HostExperiences";
import HostInbox from "./pages/host/HostInbox";
import HostReviews from "./pages/host/HostReviews";
import HostEarnings from "./pages/host/HostEarnings";
import HostProfilePage from "./pages/host/HostProfilePage";
import HostSettings from "./pages/host/HostSettings";

// Guest pages
import GuestDashboard from "./pages/guest/GuestDashboard";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <>
    <ScrollToTop />
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/homestay/:id" element={<PageTransition><HomestayDetail /></PageTransition>} />
        <Route path="/homestays" element={<PageTransition><Homestays /></PageTransition>} />
        <Route path="/search" element={<PageTransition><Search /></PageTransition>} />
        <Route path="/packages" element={<PageTransition><Packages /></PageTransition>} />
        <Route path="/blogs" element={<PageTransition><Blogs /></PageTransition>} />
        <Route path="/blog/:slug" element={<PageTransition><BlogDetail /></PageTransition>} />
        <Route path="/about" element={<PageTransition><AboutUs /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/team" element={<PageTransition><Team /></PageTransition>} />
        <Route path="/careers" element={<PageTransition><Careers /></PageTransition>} />
        <Route path="/press" element={<PageTransition><Press /></PageTransition>} />
        <Route path="/destinations" element={<PageTransition><Destinations /></PageTransition>} />
        <Route path="/experiences" element={<PageTransition><Experiences /></PageTransition>} />
        <Route path="/help" element={<PageTransition><Help /></PageTransition>} />
        <Route path="/safety" element={<PageTransition><Safety /></PageTransition>} />
        <Route path="/cancellation" element={<PageTransition><Cancellation /></PageTransition>} />
        <Route path="/faqs" element={<PageTransition><FAQs /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
        <Route path="/cookies" element={<PageTransition><Cookies /></PageTransition>} />
        <Route path="/signin" element={<PageTransition><SignIn /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><SignUp /></PageTransition>} />
        <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
        <Route path="/verify-otp" element={<PageTransition><VerifyOTP /></PageTransition>} />
        <Route path="/festivals" element={<PageTransition><Festivals /></PageTransition>} />
        <Route path="/trip-planner" element={<PageTransition><TripPlanner /></PageTransition>} />
        <Route path="/wishlist" element={<PageTransition><Wishlist /></PageTransition>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/homestays" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminHomestays /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/bookings" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminBookings /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminUsers /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminAnalytics /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminSettings /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/cms/hero" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminCMSHero /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/cms/partners" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminCMSPartners /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/cms/festivals" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminCMSFestivals /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/cms/experiences" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminCMSExperiences /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/cms/blogs" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminCMSBlogs /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/cms/testimonials" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminCMSTestimonials /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/cms/pages" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminCMSPages /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/cms/navigation" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminCMSNavigation /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/cms/theme" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminCMSTheme /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/cms/media" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminCMSMedia /></DashboardLayout></ProtectedRoute>} />

        {/* Host Routes */}
        <Route path="/host" element={<ProtectedRoute allowedRoles={['host']}><DashboardLayout><HostDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/host/listings" element={<ProtectedRoute allowedRoles={['host']}><DashboardLayout><HostListings /></DashboardLayout></ProtectedRoute>} />
        <Route path="/host/calendar" element={<ProtectedRoute allowedRoles={['host']}><DashboardLayout><HostCalendar /></DashboardLayout></ProtectedRoute>} />
        <Route path="/host/bookings" element={<ProtectedRoute allowedRoles={['host']}><DashboardLayout><HostBookings /></DashboardLayout></ProtectedRoute>} />
        <Route path="/host/experiences" element={<ProtectedRoute allowedRoles={['host']}><DashboardLayout><HostExperiences /></DashboardLayout></ProtectedRoute>} />
        <Route path="/host/inbox" element={<ProtectedRoute allowedRoles={['host']}><DashboardLayout><HostInbox /></DashboardLayout></ProtectedRoute>} />
        <Route path="/host/reviews" element={<ProtectedRoute allowedRoles={['host']}><DashboardLayout><HostReviews /></DashboardLayout></ProtectedRoute>} />
        <Route path="/host/earnings" element={<ProtectedRoute allowedRoles={['host']}><DashboardLayout><HostEarnings /></DashboardLayout></ProtectedRoute>} />
        <Route path="/host/profile" element={<ProtectedRoute allowedRoles={['host']}><DashboardLayout><HostProfilePage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/host/settings" element={<ProtectedRoute allowedRoles={['host']}><DashboardLayout><HostSettings /></DashboardLayout></ProtectedRoute>} />

        {/* Guest Routes */}
        <Route path="/guest" element={<ProtectedRoute allowedRoles={['guest']}><DashboardLayout><GuestDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/guest/*" element={<ProtectedRoute allowedRoles={['guest']}><DashboardLayout><GuestDashboard /></DashboardLayout></ProtectedRoute>} />

        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <CMSProvider>
        <HostDataProvider>
        <CurrencyProvider>
          <WishlistProvider>
            <CompareProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AnimatedRoutes />
                  <CompareWidget />
                  <PhrasebookButton />
                  <WhatsAppWidget />
                </BrowserRouter>
              </TooltipProvider>
            </CompareProvider>
          </WishlistProvider>
        </CurrencyProvider>
        </HostDataProvider>
        </CMSProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
