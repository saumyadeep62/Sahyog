import React, { createContext, useContext, useState, useEffect } from 'react';
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
  createBooking: (newBooking: Partial<Booking>) => Booking;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  createEmergencyBooking: (categoryId: string, address: string, task: string) => Booking;
  addRatingReview: (review: Omit<RatingReview, 'id' | 'created_at'>) => void;
  fileGrievance: (grievance: Omit<Grievance, 'id' | 'ticket_number' | 'status' | 'created_at'>) => void;
  resolveGrievance: (grievanceId: string, resolutionNotes: string) => void;
  verifyWorkerKyc: (workerId: string, verified: boolean) => void;
  uploadCertification: (workerId: string, certName: string, issuingBody: string, fileUrl: string) => void;
  claimWelfareEmergency: (workerId: string, amount: number, notes: string) => void;
  markNotificationRead: (notificationId: string) => void;
  getWorkerById: (workerId: string) => Worker | undefined;
  getCategoryById: (categoryId: string) => ServiceCategory | undefined;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories] = useState<ServiceCategory[]>(SEED_SERVICE_CATEGORIES);
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

  const [forecasts] = useState<DemandForecast[]>(SEED_DEMAND_FORECASTS);

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('sahyog_notifications');
    return saved ? JSON.parse(saved) : SEED_NOTIFICATIONS;
  });

  // Modal states
  const [selectedWorkerForModal, setSelectedWorkerForModal] = useState<Worker | null>(null);
  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState<Booking | null>(null);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isBookingFlowOpen, setIsBookingFlowOpen] = useState(false);
  const [bookingTargetCategory, setBookingTargetCategory] = useState<ServiceCategory | null>(null);
  const [bookingTargetWorker, setBookingTargetWorker] = useState<Worker | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('sahyog_workers', JSON.stringify(workers));
  }, [workers]);
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

  const createBooking = (newBookingData: Partial<Booking>): Booking => {
    const bookingCode = `SHY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      booking_code: bookingCode,
      customer_id: newBookingData.customer_id || 'cust-1',
      customer_name: newBookingData.customer_name || 'Saumyadeep Sutradhar',
      customer_contact: newBookingData.customer_contact || '+91 98201 45678',
      worker_id: newBookingData.worker_id,
      worker_name: newBookingData.worker_name,
      worker_contact: newBookingData.worker_contact,
      worker_avatar: newBookingData.worker_avatar,
      cooperative_name: newBookingData.cooperative_name || 'Mumbai Shramik Sahakari Sanstha',
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
      price_breakdown: newBookingData.price_breakdown || {
        worker_wage: 450,
        welfare_contribution: 40,
        coop_admin_fee: 30,
        platform_fee: 0,
        tax_amount: 0,
        emergency_fee: 0,
        total_amount: 520,
      },
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

    // Create notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      user_id: newBooking.customer_id,
      title: 'Booking Confirmed with Fair Wages',
      message: `Your booking ${newBooking.booking_code} for ${newBooking.service_category_name} is confirmed. 100% of fair wage is locked for the artisan.`,
      type: 'booking',
      read_status: false,
      created_at: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
  };

  const createEmergencyBooking = (categoryId: string, address: string, task: string): Booking => {
    const category = categories.find((c) => c.id === categoryId) || categories[0];
    const availableWorker = workers.find(
      (w) => w.service_category_ids.includes(categoryId) && w.availability === 'online'
    ) || workers[0];

    const emergencyBooking = createBooking({
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
        lat: 19.0596,
        lng: 72.8295,
      },
      price_breakdown: {
        worker_wage: 150,
        welfare_contribution: 15,
        coop_admin_fee: 10,
        platform_fee: 0,
        tax_amount: 0,
        emergency_fee: 25, // Transparent, non-exploitative urgent allowance
        total_amount: 200,
      },
      notes: 'Priority Emergency Response dispatched. Artisan equipped with rapid-fix kit.',
    });

    return emergencyBooking;
  };

  const addRatingReview = (reviewData: Omit<RatingReview, 'id' | 'created_at'>) => {
    const newReview: RatingReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  const fileGrievance = (grievanceData: Omit<Grievance, 'id' | 'ticket_number' | 'status' | 'created_at'>) => {
    const ticketNum = `GRV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newGrievance: Grievance = {
      ...grievanceData,
      id: `grv-${Date.now()}`,
      ticket_number: ticketNum,
      status: 'open',
      created_at: new Date().toISOString(),
    };
    setGrievances((prev) => [newGrievance, ...prev]);

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

  const resolveGrievance = (grievanceId: string, resolutionNotes: string) => {
    setGrievances((prev) =>
      prev.map((g) => (g.id === grievanceId ? { ...g, status: 'resolved', resolution_notes: resolutionNotes } : g))
    );
  };

  const verifyWorkerKyc = (workerId: string, verified: boolean) => {
    setWorkers((prev) =>
      prev.map((w) =>
        w.id === workerId
          ? {
              ...w,
              verification_status: verified ? 'verified' : 'rejected',
              kyc_verified: verified,
              police_verified: verified,
            }
          : w
      )
    );
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
    // Notification to federation
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

  const markNotificationRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read_status: true } : n))
    );
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
        createEmergencyBooking,
        addRatingReview,
        fileGrievance,
        resolveGrievance,
        verifyWorkerKyc,
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
