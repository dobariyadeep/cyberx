import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import TipPopup from "@/components/TipPopup";

import Home from "@/pages/Home";
import Malware from "@/pages/Malware";
import Phishing from "@/pages/Phishing";
import DDoS from "@/pages/DDoS";
import Simulation from "@/pages/Simulation";
import Tools from "@/pages/Tools";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/malware" component={Malware} />
      <Route path="/phishing" component={Phishing} />
      <Route path="/ddos" component={DDoS} />
      <Route path="/simulation" component={Simulation} />
      <Route path="/tools" component={Tools} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <div className="min-h-screen flex flex-col bg-background text-foreground dark">
            <Navbar />
            <main className="flex-grow">
              <Router />
            </main>
            <Footer />
            <BackToTop />
            <TipPopup />
          </div>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
