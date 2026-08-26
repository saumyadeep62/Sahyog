import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ServiceCategory,
  Cooperative,
  Worker,
  WorkerCertification,
  Booking,
  PaymentInvoice,
  RatingReview,
  WorkerWelfare,
  Grievance,
  DemandForecast,
  NotificationItem,
  BookingStatus,
} from '../lib/database.types';
import {
  SEED_SERVICE_CATEGORIES,
  SEED_COOPERATIVES,
  SEED_WORKERS,
  SEED_CERTIFICATIONS,
  SEED_BOOKINGS,
  SEED_INVOICES,
  SEED_RATINGS,
  SEED_WELFARE,
  SEED_GRIEVANCES,
  SEED_DEMAND_FORECASTS,
  SEED_NOTIFICATIONS,
} from '../lib/seedData';
import * as api from '../lib/queries';
import { useAuth } from './AuthContext';

interface MarketplaceContextType {
  categories: ServiceCategory[];
  cooperatives: Cooperative[];
  workers: Worker[];
  certifications: WorkerCertification[];
  bookings: Booking[];
  invoices: PaymentInvoice[];
  reviews: RatingReview[];
  welfareList: WorkerWelfare[];
  grievances: Grievance[];
  forecasts: DemandForecast[];
  notifications: NotificationItem[];
  loadingData: boolean;
  refreshData: () => Promise<void>;
  
  // Modals & UI Selection States
  selectedWorkerForModal: Worker | null;
  openWorkerModal: (worker: Worker) => void;
  closeWorkerModal: () => void;
  
  selectedBookingForInvoice: Booking | null;
  openInvoiceModal: (booking: Booking) => void;
  closeInvoiceModal: () => void;

  isEmergencyModalOpen: boolean;
  openEmergencyModal: () => void;
  closeEmergencyModal: () => void;

  isBookingFlowOpen: boolean;
  bookingTargetCategory: ServiceCategory | null;
  bookingTargetWorker: Worker | null;
  openBookingFlow: (category?: ServiceCategory, worker?: Worker) => void;
  closeBookingFlow: () => void;

  // Actions
  createBooking: (newBooking: Partial<Booking>) => Promise<Booking>;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => Promise<void>;
  updateWorkerAvailability: (workerId: string, availability: Worker['availability']) => Promise<void>;
  createEmergencyBooking: (categoryId: string, address: string, task: string) => Promise<Booking>;
  addRatingReview: (review: Omit<RatingReview, 'id' | 'created_at'>) => Promise<void>;
  fileGrievance: (grievance: Omit<Grievance, 'id' | 'ticket_number' | 'status' | 'created_at'>) => Promise<void>;
  resolveGrievance: (grievanceId: string, resolutionNotes: string) => Promise<void>;
  verifyWorkerKyc: (workerId: string, verified: boolean) => Promise<void>;
  addWorker: (newWorkerData: Omit<Worker, 'id' | 'rating' | 'total_ratings_count' | 'total_jobs_completed'>) => Promise<Worker>;
  updateWorker: (workerId: string, updates: Partial<Worker>) => Promise<void>;
  uploadCertificationFile: (workerId: string, file: File, meta: { certificate_name: string; issuing_body: string; issue_date?: string }) => Promise<string>;
  uploadCertification: (workerId: string, certName: string, issuingBody: string, fileUrl: string) => void;
  claimWelfareEmergency: (workerId: string, amount: number, notes: string) => void;
  markNotificationRead: (notificationId: string) => Promise<void>;
  getWorkerById: (workerId: string) => Worker | undefined;
  getCategoryById: (categoryId: string) => ServiceCategory | undefined;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [categories, setCategories] = useState<ServiceCategory[]>(SEED_SERVICE_CATEGORIES);
  const [cooperatives, setCooperatives] = useState<Cooperative[]>(() => {
    const saved = localStorage.getItem('sahyog_cooperatives');
    return saved ? JSON.parse(saved) : SEED_COOPERATIVES;
  });

  const [workers, setWorkers] = useState<Worker[]>(() => {
    const saved = localStorage.getItem('sahyog_workers');
    return saved ? JSON.parse(saved) : SEED_WORKERS;
  });

  const [certifications, setCertifications] = useState<WorkerCertification[]>(() => {
    const saved = localStorage.getItem('sahyog_certifications');
    return saved ? JSON.parse(saved) : SEED_CERTIFICATIONS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('sahyog_bookings');
    return saved ? JSON.parse(saved) : SEED_BOOKINGS;
  });

  const [invoices, setInvoices] = useState<PaymentInvoice[]>(() => {
    const saved = localStorage.getItem('sahyog_invoices');
    return saved ? JSON.parse(saved) : SEED_INVOICES;
  });

  const [reviews, setReviews] = useState<RatingReview[]>(() => {
    const saved = localStorage.getItem('sahyog_reviews');
    return saved ? JSON.parse(saved) : SEED_RATINGS;
  });

  const [welfareList, setWelfareList] = useState<WorkerWelfare[]>(() => {
    const saved = localStorage.getItem('sahyog_welfare');
    return saved ? JSON.parse(saved) : SEED_WELFARE;
  });

  const [grievances, setGrievances] = useState<Grievance[]>(() => {
    const saved = localStorage.getItem('sahyog_grievances');
    return saved ? JSON.parse(saved) : SEED_GRIEVANCES;
  });

  const [forecasts, setForecasts] = useState<DemandForecast[]>(SEED_DEMAND_FORECASTS);

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('sahyog_notifications');
    return saved ? JSON.parse(saved) : SEED_NOTIFICATIONS;
  });

  const [loadingData, setLoadingData] = useState<boolean>(false);

  // Modal states
  const [selectedWorkerForModal, setSelectedWorkerForModal] = useState<Worker | null>(null);
  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState<Booking | null>(null);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isBookingFlowOpen, setIsBookingFlowOpen] = useState(false);
  const [bookingTargetCategory, setBookingTargetCategory] = useState<ServiceCategory | null>(null);
  const [bookingTargetWorker, setBookingTargetWorker] = useState<Worker | null>(null);

  // Sync to localStorage as local cache
  useEffect(() => {
    localStorage.setItem('sahyog_cooperatives', JSON.stringify(cooperatives));
  }, [cooperatives]);
  useEffect(() => {
    localStorage.setItem('sahyog_workers', JSON.stringify(workers));
  }, [workers]);
  useEffect(() => {
    localStorage.setItem('sahyog_certifications', JSON.stringify(certifications));
  }, [certifications]);
  useEffect(() => {
    localStorage.setItem('sahyog_bookings', JSON.stringify(bookings));
  }, [bookings]);
  useEffect(() => {
    localStorage.setItem('sahyog_invoices', JSON.stringify(invoices));
  }, [invoices]);
  useEffect(() => {
    localStorage.setItem('sahyog_reviews', JSON.stringify(reviews));
  }, [reviews]);
  useEffect(() => {
    localStorage.setItem('sahyog_welfare', JSON.stringify(welfareList));
  }, [welfareList]);
  useEffect(() => {
    localStorage.setItem('sahyog_grievances', JSON.stringify(grievances));
  }, [grievances]);
  useEffect(() => {
    localStorage.setItem('sahyog_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Load live data from Supabase backend
  const refreshData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [cats, coops, wrks, fcs, grvs] = await Promise.allSettled([
        api.fetchServiceCategories(),
        api.fetchCooperatives(),
        api.fetchWorkers(),
        api.fetchDemandForecasts(),
        api.fetchGrievances(),
      ]);

      if (cats.status === 'fulfilled' && cats.value.length > 0) {
        setCategories(cats.value);
      }
      if (coops.status === 'fulfilled' && coops.value.length > 0) {
        setCooperatives(coops.value);
      }
      if (wrks.status === 'fulfilled' && wrks.value.length > 0) {
        setWorkers(wrks.value);
      }
      if (fcs.status === 'fulfilled' && fcs.value.length > 0) {
        setForecasts(fcs.value);
      }
      if (grvs.status === 'fulfilled' && grvs.value.length > 0) {
        setGrievances(grvs.value);
      }

      if (currentUser?.id) {
        const [bks, notifs, revs] = await Promise.allSettled([
          api.fetchBookingsForUser(currentUser.role, currentUser.id),
          api.fetchNotifications(currentUser.id),
          api.fetchReviewsForUser(currentUser.id),
        ]);

        if (bks.status === 'fulfilled' && bks.value.length > 0) {
          setBookings(bks.value);
        }
        if (notifs.status === 'fulfilled' && notifs.value.length > 0) {
          setNotifications(notifs.value);
        }
        if (revs.status === 'fulfilled' && revs.value.length > 0) {
          setReviews(revs.value);
        }
      }
    } catch {
      // Keep local state on error
    } finally {
      setLoadingData(false);
    }
  }, [currentUser]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Realtime subscription for notifications
  useEffect(() => {
    if (!currentUser?.id) return;
    const unsub = api.subscribeToNotifications(currentUser.id, (newNotif) => {
      setNotifications((prev) => [newNotif, ...prev.filter((n) => n.id !== newNotif.id)]);
    });
    return () => unsub();
  }, [currentUser?.id]);

  const openWorkerModal = (worker: Worker) => setSelectedWorkerForModal(worker);
  const closeWorkerModal = () => setSelectedWorkerForModal(null);

  const openInvoiceModal = (booking: Booking) => setSelectedBookingForInvoice(booking);
  const closeInvoiceModal = () => setSelectedBookingForInvoice(null);

  const openEmergencyModal = () => setIsEmergencyModalOpen(true);
  const closeEmergencyModal = () => setIsEmergencyModalOpen(false);

  const openBookingFlow = (category?: ServiceCategory, worker?: Worker) => {
    setBookingTargetCategory(category || null);
    setBookingTargetWorker(worker || null);
    setIsBookingFlowOpen(true);
  };
  const closeBookingFlow = () => {
    setIsBookingFlowOpen(false);
    setBookingTargetCategory(null);
    setBookingTargetWorker(null);
  };

  const getWorkerById = (id: string) => workers.find((w) => w.id === id);
  const getCategoryById = (id: string) => categories.find((c) => c.id === id);

  const createBooking = async (newBookingData: Partial<Booking>): Promise<Booking> => {
    const bookingCode = `SHY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const breakdown = newBookingData.price_breakdown || {
      worker_wage: 450,
      welfare_contribution: 40,
      coop_admin_fee: 30,
      platform_fee: 0,
      tax_amount: 0,
      emergency_fee: 0,
      total_amount: 520,
    };

    // Proximity & AI Auto-Assignment: If no specific worker was chosen by customer, match closest verified artisan
    let assignedWorker = newBookingData.worker_id ? getWorkerById(newBookingData.worker_id) : undefined;
    if (!assignedWorker) {
      const targetCatId = newBookingData.service_category_id;
      const candidates = workers.filter(
        (w) =>
          (!targetCatId || w.service_category_ids?.includes(targetCatId)) &&
          w.verification_status === 'verified'
      );

      if (candidates.length > 0) {
        const custLat = newBookingData.location?.lat || 19.076;
        const custLng = newBookingData.location?.lng || 72.8777;

        // Haversine distance calculation in km
        const getDistKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
          const R = 6371;
          const dLat = ((lat2 - lat1) * Math.PI) / 180;
          const dLon = ((lon2 - lon1) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
              Math.cos((lat2 * Math.PI) / 180) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return Math.round(R * c * 10) / 10;
        };

        // Weighted scoring: 60% Proximity/Distance, 20% Online Status, 15% Rating, 5% Fairness
        const scored = candidates.map((w) => {
          const wLat = w.location?.lat || 19.082;
          const wLng = w.location?.lng || 72.884;
          const distKm = getDistKm(custLat, custLng, wLat, wLng);
          const proximityScore = 1.0 / (1.0 + distKm * 0.25);
          const ratingScore = (w.rating || 4.5) / 5;
          const isOnlineScore = w.availability === 'online' ? 1.0 : 0.35;
          const fairnessScore = 1.0 / (1.0 + (w.total_jobs_completed || 0) * 0.05);

          const score =
            0.6 * proximityScore +
            0.2 * isOnlineScore +
            0.15 * ratingScore +
            0.05 * fairnessScore;

          return { worker: w, distKm, score };
        });

        scored.sort((a, b) => b.score - a.score);
        assignedWorker = scored[0].worker;
      }
    }

    let createdId = `bk-${Date.now()}`;

    try {
      const serverBookingId = await api.createBooking({
        customer_id: newBookingData.customer_id || currentUser?.id || 'cust-1',
        worker_id: assignedWorker ? assignedWorker.id : newBookingData.worker_id,
        service_category_id: newBookingData.service_category_id || 'cat-1',
        service_task: newBookingData.service_task || 'Standard Service',
        description: newBookingData.description || 'Service booked via SAHYOG cooperative portal.',
        scheduled_time: newBookingData.scheduled_time || new Date().toISOString(),
        is_emergency: newBookingData.is_emergency || false,
        location_address: newBookingData.location?.address || 'Bandra West, Mumbai',
        location_lat: newBookingData.location?.lat || 19.0596,
        location_lng: newBookingData.location?.lng || 72.8295,
        price_worker_wage: breakdown.worker_wage,
        price_welfare_contribution: breakdown.welfare_contribution,
        price_coop_admin_fee: breakdown.coop_admin_fee,
        price_platform_fee: breakdown.platform_fee,
        price_emergency_fee: breakdown.emergency_fee,
        price_tax_amount: breakdown.tax_amount,
        price_total_amount: breakdown.total_amount,
        notes: newBookingData.notes || 'Cooperative-backed service guarantee.',
      });
      if (serverBookingId) {
        createdId = serverBookingId;
      }
    } catch {
      // fallback to generated id
    }

    const newBooking: Booking = {
      id: createdId,
      booking_code: bookingCode,
      customer_id: newBookingData.customer_id || currentUser?.id || 'cust-1',
      customer_name: newBookingData.customer_name || currentUser?.name || 'Customer',
      customer_contact: newBookingData.customer_contact || currentUser?.contact || '+91 98201 45678',
      worker_id: assignedWorker ? assignedWorker.id : newBookingData.worker_id,
      worker_name: assignedWorker ? assignedWorker.full_name : newBookingData.worker_name,
      worker_contact: newBookingData.worker_contact || '+91 98201 45678',
      worker_avatar: assignedWorker ? assignedWorker.avatar_url : newBookingData.worker_avatar,
      cooperative_name: assignedWorker?.cooperative_name || newBookingData.cooperative_name || 'Mumbai Shramik Sahakari Sanstha',
      service_category_id: newBookingData.service_category_id || 'cat-1',
      service_category_name: newBookingData.service_category_name || 'Electricians & Wiring',
      service_task: newBookingData.service_task || 'Standard Maintenance & Diagnosis',
      description: newBookingData.description || 'Service booked via SAHYOG cooperative portal.',
      status: 'confirmed',
      scheduled_time: newBookingData.scheduled_time || new Date().toISOString(),
      is_emergency: newBookingData.is_emergency || false,
      location: newBookingData.location || {
        address: 'Bandra West, Mumbai',
        lat: 19.0596,
        lng: 72.8295,
      },
      price_breakdown: breakdown,
      notes: newBookingData.notes || 'Cooperative-backed service guarantee.',
      created_at: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Create auto invoice
    const newInvoice: PaymentInvoice = {
      id: `inv-${Date.now()}`,
      booking_id: newBooking.id,
      booking_code: newBooking.booking_code,
      customer_name: newBooking.customer_name,
      worker_name: newBooking.worker_name || 'Assigned Artisan',
      cooperative_name: newBooking.cooperative_name || 'Cooperative Society',
      amount: newBooking.price_breakdown.total_amount,
      payment_status: 'completed',
      payment_method: 'UPI',
      gateway_reference: `UPI/COOP/${Date.now().toString().slice(-8)}`,
      invoice_number: `COOP-INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      created_at: new Date().toISOString(),
    };
    setInvoices((prev) => [newInvoice, ...prev]);

    // Create notification for Customer
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      user_id: newBooking.customer_id,
      title: 'Booking Confirmed with Fair Wages',
      message: `Your booking ${newBooking.booking_code} for ${newBooking.service_category_name} is confirmed with ${newBooking.worker_name || 'matched artisan'}. 100% of fair wage is locked.`,
      type: 'booking',
      read_status: false,
      created_at: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // If worker assigned, create notification for Worker
    if (assignedWorker) {
      const workerNotif: NotificationItem = {
        id: `notif-w-${Date.now()}`,
        user_id: assignedWorker.user_id,
        title: '⚡ New Job Matched & Dispatched!',
        message: `You have been auto-assigned to booking ${newBooking.booking_code} (${newBooking.service_task}). Guaranteed Fair Wage: ₹${breakdown.worker_wage}.`,
        type: 'booking',
        read_status: false,
        created_at: new Date().toISOString(),
      };
      setNotifications((prev) => [workerNotif, ...prev]);
    }

    return newBooking;
  };

  const updateWorkerAvailability = async (workerId: string, availability: Worker['availability']) => {
    setWorkers((prev) => prev.map((w) => (w.id === workerId ? { ...w, availability } : w)));
    try {
      await api.updateWorkerAvailability(workerId, availability);
    } catch {
      // handled
    }
  };

  const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
    try {
      await api.updateBookingStatus(bookingId, status);
    } catch {
      // handled
    }
  };

  const createEmergencyBooking = async (categoryId: string, address: string, task: string): Promise<Booking> => {
    const category = categories.find((c) => c.id === categoryId) || categories[0];
    
    // Auto-calculate nearest online/free worker in category
    const custLat = 19.0596;
    const custLng = 72.8295;

    const matchingWorkers = workers
      .filter((w) => w.service_category_ids.includes(categoryId))
      .map((w) => {
        const wLat = w.location?.lat || 19.082;
        const wLng = w.location?.lng || 72.884;
        const dLat = ((wLat - custLat) * Math.PI) / 180;
        const dLon = ((wLng - custLng) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((custLat * Math.PI) / 180) *
            Math.cos((wLat * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const distKm = Math.round(6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
        return { ...w, distKm };
      })
      .sort((a, b) => {
        // 1. Free/Online workers first
        if (a.availability === 'online' && b.availability !== 'online') return -1;
        if (b.availability === 'online' && a.availability !== 'online') return 1;
        // 2. Nearest distance
        return a.distKm - b.distKm;
      });

    const availableWorker = matchingWorkers[0] || workers[0];

    const emergencyBooking = await createBooking({
      service_category_id: category.id,
      service_category_name: category.name,
      service_task: `[EMERGENCY SOS] ${task}`,
      is_emergency: true,
      worker_id: availableWorker.id,
      worker_name: availableWorker.full_name,
      worker_contact: '+91 98199 87654',
      worker_avatar: availableWorker.avatar_url,
      cooperative_name: availableWorker.cooperative_name || 'Mumbai Shramik Sahakari Sanstha',
      location: {
        address,
        lat: custLat,
        lng: custLng,
      },
      price_breakdown: {
        worker_wage: 150,
        welfare_contribution: 15,
        coop_admin_fee: 10,
        platform_fee: 0,
        tax_amount: 0,
        emergency_fee: 25,
        total_amount: 200,
      },
      notes: 'Priority Emergency Response dispatched. Artisan equipped with rapid-fix kit.',
    });

    return emergencyBooking;
  };

  const addRatingReview = async (reviewData: Omit<RatingReview, 'id' | 'created_at'>) => {
    const newReview: RatingReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setReviews((prev) => [newReview, ...prev]);

    try {
      await api.submitReview(reviewData);
    } catch {
      // handled
    }
  };

  const fileGrievance = async (grievanceData: Omit<Grievance, 'id' | 'ticket_number' | 'status' | 'created_at'>) => {
    const ticketNum = `GRV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newGrievance: Grievance = {
      ...grievanceData,
      id: `grv-${Date.now()}`,
      ticket_number: ticketNum,
      status: 'open',
      created_at: new Date().toISOString(),
    };
    setGrievances((prev) => [newGrievance, ...prev]);

    try {
      await api.fileGrievance({
        filed_by_role: grievanceData.filed_by_role,
        filed_by_id: grievanceData.filed_by_id,
        booking_id: grievanceData.booking_id,
        category: grievanceData.category,
        description: grievanceData.description,
      });
    } catch {
      // handled
    }

    // Notify user
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      user_id: grievanceData.filed_by_id,
      title: 'Grievance Ticket Registered',
      message: `Your grievance ${ticketNum} has been routed to the Cooperative Federation dispute committee.`,
      type: 'welfare',
      read_status: false,
      created_at: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const resolveGrievance = async (grievanceId: string, resolutionNotes: string) => {
    setGrievances((prev) =>
      prev.map((g) => (g.id === grievanceId ? { ...g, status: 'resolved', resolution_notes: resolutionNotes } : g))
    );
    try {
      await api.resolveGrievance(grievanceId, resolutionNotes, currentUser?.name || 'Federation Admin');
    } catch {
      // handled
    }
  };

  const verifyWorkerKyc = async (workerId: string, verified: boolean) => {
    const newStatus = verified ? 'verified' : 'rejected';
    setWorkers((prev) =>
      prev.map((w) =>
        w.id === workerId
          ? {
              ...w,
              verification_status: newStatus,
              kyc_verified: verified,
              police_verified: verified,
            }
          : w
      )
    );
    try {
      await api.updateWorkerVerification(workerId, newStatus);
    } catch {
      // handled
    }
  };

  const addWorker = async (
    newWorkerData: Omit<Worker, 'id' | 'rating' | 'total_ratings_count' | 'total_jobs_completed'>
  ): Promise<Worker> => {
    const newId = `wrk-${Date.now()}`;
    const newWorker: Worker = {
      ...newWorkerData,
      id: newId,
      rating: 5.0,
      total_ratings_count: 1,
      total_jobs_completed: 0,
    };

    setWorkers((prev) => [newWorker, ...prev]);

    try {
      await api.createWorkerProfile({
        user_id: newWorker.user_id,
        cooperative_id: newWorker.cooperative_id,
        skills: newWorker.skills,
        experience_years: newWorker.experience_years,
        hourly_rate: newWorker.hourly_rate,
        base_visit_fee: newWorker.base_visit_fee,
        bio: newWorker.bio,
      });
    } catch {
      // handled
    }

    return newWorker;
  };

  const updateWorker = async (workerId: string, updates: Partial<Worker>) => {
    setWorkers((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, ...updates } : w))
    );
    try {
      await api.updateWorkerProfile(workerId, updates);
    } catch {
      // handled
    }
  };

  const uploadCertificationFile = async (
    workerId: string,
    file: File,
    meta: { certificate_name: string; issuing_body: string; issue_date?: string }
  ): Promise<string> => {
    let fileUrl = URL.createObjectURL(file);
    try {
      fileUrl = await api.uploadCertification(workerId, file, meta);
    } catch {
      // fallback
    }

    const newCert: WorkerCertification = {
      id: `cert-${Date.now()}`,
      worker_id: workerId,
      certificate_name: meta.certificate_name,
      issuing_body: meta.issuing_body,
      file_url: fileUrl,
      verified: true,
      issue_date: meta.issue_date || new Date().toISOString().split('T')[0],
      expiry_date: '2030-12-31',
    };
    setCertifications((prev) => [newCert, ...prev]);
    return fileUrl;
  };

  const uploadCertification = (
    workerId: string,
    certName: string,
    issuingBody: string,
    fileUrl: string
  ) => {
    const newCert: WorkerCertification = {
      id: `cert-${Date.now()}`,
      worker_id: workerId,
      certificate_name: certName,
      issuing_body: issuingBody,
      file_url: fileUrl,
      verified: true,
      issue_date: new Date().toISOString().split('T')[0],
      expiry_date: '2030-12-31',
    };
    setCertifications((prev) => [newCert, ...prev]);
  };

  const claimWelfareEmergency = (workerId: string, amount: number, notes: string) => {
    setWelfareList((prev) =>
      prev.map((w) =>
        w.worker_id === workerId
          ? {
              ...w,
              emergency_claim_status: 'applied',
            }
          : w
      )
    );
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      user_id: 'usr-admin-1',
      title: 'Emergency Welfare Claim Submitted',
      message: `Worker ID ${workerId} applied for ₹${amount} mutual emergency assistance: ${notes}`,
      type: 'welfare',
      read_status: false,
      created_at: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const markNotificationRead = async (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read_status: true } : n))
    );
    try {
      await api.markNotificationRead(notificationId);
    } catch {
      // handled
    }
  };

  return (
    <MarketplaceContext.Provider
      value={{
        categories,
        cooperatives,
        workers,
        certifications,
        bookings,
        invoices,
        reviews,
        welfareList,
        grievances,
        forecasts,
        notifications,
        loadingData,
        refreshData,
        selectedWorkerForModal,
        openWorkerModal,
        closeWorkerModal,
        selectedBookingForInvoice,
        openInvoiceModal,
        closeInvoiceModal,
        isEmergencyModalOpen,
        openEmergencyModal,
        closeEmergencyModal,
        isBookingFlowOpen,
        bookingTargetCategory,
        bookingTargetWorker,
        openBookingFlow,
        closeBookingFlow,
        createBooking,
        updateBookingStatus,
        updateWorkerAvailability,
        createEmergencyBooking,
        addRatingReview,
        fileGrievance,
        resolveGrievance,
        verifyWorkerKyc,
        addWorker,
        updateWorker,
        uploadCertificationFile,
        uploadCertification,
        claimWelfareEmergency,
        markNotificationRead,
        getWorkerById,
        getCategoryById,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = (): MarketplaceContextType => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
