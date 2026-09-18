import { supabase, isSupabaseConfigured } from './supabase';
import { EventSettings, DEFAULT_EVENT_SETTINGS } from '../types/settings';
import { Track } from '../types/track';

const LOCAL_STORAGE_KEY = 'quilombo_event_settings_v1';

export async function getEventSettings(): Promise<EventSettings> {
  // 1. Try fetching from Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('event_settings')
        .select('*')
        .eq('id', 'default_config')
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          eventDate: data.event_date || DEFAULT_EVENT_SETTINGS.eventDate,
          venueName: data.venue_name || DEFAULT_EVENT_SETTINGS.venueName,
          venueAddress: data.venue_address || DEFAULT_EVENT_SETTINGS.venueAddress,
          officialWhatsapp: data.official_whatsapp || DEFAULT_EVENT_SETTINGS.officialWhatsapp,
          organizerPin: data.organizer_pin || DEFAULT_EVENT_SETTINGS.organizerPin,
          priceGeneral: Number(data.price_general) || DEFAULT_EVENT_SETTINGS.priceGeneral,
          priceVip: Number(data.price_vip) || DEFAULT_EVENT_SETTINGS.priceVip,
          maxCapacity: Number(data.max_capacity) || DEFAULT_EVENT_SETTINGS.maxCapacity,
          ticketSubtitle: data.ticket_subtitle || DEFAULT_EVENT_SETTINGS.ticketSubtitle,
          ticketDoorInstructions: data.ticket_door_instructions || DEFAULT_EVENT_SETTINGS.ticketDoorInstructions,
          customTracks: Array.isArray(data.custom_tracks) ? data.custom_tracks : [],
          updatedAt: data.updated_at,
        };
      }
    } catch (err) {
      console.warn('[Settings] Supabase settings query fallback:', err);
    }
  }

  // 2. Client-side local storage fallback
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_EVENT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {}
  }

  return DEFAULT_EVENT_SETTINGS;
}

export async function saveEventSettings(settings: Partial<EventSettings>): Promise<EventSettings> {
  const current = await getEventSettings();
  const updated: EventSettings = {
    ...current,
    ...settings,
    updatedAt: new Date().toISOString(),
  };

  // 1. Save to Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const payload = {
        id: 'default_config',
        updated_at: updated.updatedAt,
        event_date: updated.eventDate,
        venue_name: updated.venueName,
        venue_address: updated.venueAddress,
        official_whatsapp: updated.officialWhatsapp,
        organizer_pin: updated.organizerPin,
        price_general: updated.priceGeneral,
        price_vip: updated.priceVip,
        max_capacity: updated.maxCapacity,
        ticket_subtitle: updated.ticketSubtitle,
        ticket_door_instructions: updated.ticketDoorInstructions,
        custom_tracks: updated.customTracks,
      };

      await supabase.from('event_settings').upsert([payload]);
    } catch (err) {
      console.warn('[Settings] Error saving to Supabase event_settings:', err);
    }
  }

  // 2. Save to local storage for instant sync across tabs
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('quilombo_settings_updated', { detail: updated }));
    } catch (e) {}
  }

  return updated;
}
