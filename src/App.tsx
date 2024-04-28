import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage/LandingPage";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./themes/Theme";
import { DuckieApp } from "./pages/DuckieApp/DuckieApp";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();  // Destructure loading from useAuth
  if (loading) {
    return null; // Or return a loading spinner
  }
  return user ? <>{children}</> : <Navigate to="/" />;
};

export const App = () => {
  
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/* <Route path="/app" element={<DuckieApp />} /> */}
          <Route path='/app' element={<ProtectedRoute><DuckieApp /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
    
  );
}