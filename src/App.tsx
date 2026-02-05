import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
 import { ThemeProvider } from "@/components/ThemeProvider";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
     <ThemeProvider>
       <TooltipProvider>
         <Toaster />
         <Sonner />
         <BrowserRouter>
           <Routes>
             <Route path="/" element={<Index />} />
             <Route path="/homestay/:id" element={<HomestayDetail />} />
             <Route path="/homestays" element={<Homestays />} />
             <Route path="/search" element={<Search />} />
             <Route path="/packages" element={<Packages />} />
             <Route path="/blogs" element={<Blogs />} />
             <Route path="/blog/:slug" element={<BlogDetail />} />
             <Route path="/about" element={<AboutUs />} />
             <Route path="/contact" element={<Contact />} />
             <Route path="/team" element={<Team />} />
             <Route path="/careers" element={<Careers />} />
             <Route path="/press" element={<Press />} />
             <Route path="/destinations" element={<Destinations />} />
             <Route path="/experiences" element={<Experiences />} />
             <Route path="/help" element={<Help />} />
             <Route path="/safety" element={<Safety />} />
             <Route path="/cancellation" element={<Cancellation />} />
             <Route path="/faqs" element={<FAQs />} />
             <Route path="/privacy" element={<Privacy />} />
             <Route path="/terms" element={<Terms />} />
             <Route path="/cookies" element={<Cookies />} />
             <Route path="/signin" element={<SignIn />} />
             <Route path="/signup" element={<SignUp />} />
             <Route path="/forgot-password" element={<ForgotPassword />} />
             <Route path="/verify-otp" element={<VerifyOTP />} />
             {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
             <Route path="*" element={<NotFound />} />
           </Routes>
         </BrowserRouter>
       </TooltipProvider>
     </ThemeProvider>
  </QueryClientProvider>
);

export default App;
