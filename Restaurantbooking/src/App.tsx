import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { Layout } from "./components/layout/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { BookingsProvider } from "./contexts/BookingsContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { BookingConfirmationPage } from "./pages/BookingConfirmationPage";
import { BookingPage } from "./pages/BookingPage";
import { DestinationDetailsPage } from "./pages/DestinationDetailsPage";
import { DestinationsPage } from "./pages/DestinationsPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { HomePage } from "./pages/HomePage";
import { HotelDetailsPage } from "./pages/HotelDetailsPage";
import { HotelListingPage } from "./pages/HotelListingPage";
import { MyBookingsPage } from "./pages/MyBookingsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { OffersPage } from "./pages/OffersPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { SignInPage } from "./pages/auth/SignInPage";
import { SignUpPage } from "./pages/auth/SignUpPage";
import { AboutPage } from "./pages/info/AboutPage";
import { ContactPage } from "./pages/info/ContactPage";
import { FaqPage } from "./pages/info/FaqPage";
import { LegalPage } from "./pages/info/LegalPage";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <BookingsProvider>
            <Toaster position="top-center" richColors closeButton />
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/hotels" element={<HotelListingPage />} />
                <Route path="/hotels/:hotelId" element={<HotelDetailsPage />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/booking/confirmation/:reference" element={<BookingConfirmationPage />} />
                <Route path="/bookings" element={<MyBookingsPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/destinations" element={<DestinationsPage />} />
                <Route path="/destinations/:destinationId" element={<DestinationDetailsPage />} />
                <Route path="/offers" element={<OffersPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/legal/:slug" element={<LegalPage />} />
                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BookingsProvider>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>);

}