'use client';

import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/sections/HeroSection';
import MarqueeTicker from '../components/sections/MarqueeTicker';
import ArtistsCarousel from '../components/sections/ArtistsCarousel';
import TicketingSection from '../components/sections/TicketingSection';
import VenueFaqSection from '../components/sections/VenueFaqSection';
import ReelModal from '../components/modals/ReelModal';
import TicketQrModal from '../components/modals/TicketQrModal';
import MusicPlayer from '../components/player/MusicPlayer';
import { TicketOrder } from '../types/ticket';

export default function Home() {
  const [isReelOpen, setIsReelOpen] = useState(false);
  const [ticketOrder, setTicketOrder] = useState<TicketOrder | null>(null);

  return (
    <>
      <Navbar />

      <main>
        <HeroSection onOpenReel={() => setIsReelOpen(true)} />
        <MarqueeTicker />
        <ArtistsCarousel />
        <TicketingSection onGenerateTicket={(order) => setTicketOrder(order)} />
        <VenueFaqSection />
      </main>

      <Footer />

      {/* Floating Music Player Dock */}
      <MusicPlayer />

      {/* Fullscreen Instagram Reel Story Mode Modal */}
      <ReelModal isOpen={isReelOpen} onClose={() => setIsReelOpen(false)} />

      {/* Generated Digital Ticket QR Modal */}
      {ticketOrder && (
        <TicketQrModal
          order={ticketOrder}
          onClose={() => setTicketOrder(null)}
          onOrderUpdated={(updated) => setTicketOrder(updated)}
        />
      )}
    </>
  );
}
