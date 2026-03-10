import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Analysis from "./pages/Analysis";
import Summary from "./pages/Summary";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <div className="min-h-screen bg-background text-foreground font-sans w-full custom-layout">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/analysis" element={<Analysis />} />
                    <Route path="/summary" element={<Summary />} />
                </Routes>
            </div>
        </BrowserRouter>
    </QueryClientProvider>
);

export default App;