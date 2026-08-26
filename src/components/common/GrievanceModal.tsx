import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, Send, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Grievance } from '../../lib/database.types';

interface GrievanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBookingId?: string;
}

export const GrievanceModal: React.FC<GrievanceModalProps> = ({ isOpen, onClose, defaultBookingId }) => {
  const { currentUser } = useAuth();
  const { fileGrievance } = useMarketplace();

  const [category, setCategory] = useState<Grievance['category']>('quality_of_work');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    fileGrievance({
      filed_by_role: currentUser.role === 'worker' ? 'worker' : 'customer',
      filed_by_id: currentUser.id,
      filed_by_name: currentUser.name,
      booking_id: defaultBookingId,
      category,
      description,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDescription('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="bg-[#0C3B2E] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Cooperative Dispute & Grievance Desk</h3>
              <p className="text-[11px] text-stone-300">Reviewed by Independent Federation Mediation Council</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-stone-300 hover:text-white hover:bg-[#164E3F]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-stone-800">Grievance Ticket Registered</h4>
              <p className="text-xs text-stone-600 max-w-xs mx-auto">
                Your ticket has been assigned to a Federation Ombudsman. You will receive a resolution update within
                24-48 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Dispute Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-lg bg-white focus:ring-2 focus:ring-[#0C3B2E] focus:outline-none"
                >
                  <option value="quality_of_work">Quality of Work & Material Clarification</option>
                  <option value="wage_dispute">Fair Wage & Pricing Transparency Question</option>
                  <option value="behavior">Conduct & Dignity Standard Concern</option>
                  <option value="safety">Workplace Safety & Hazard Report</option>
                  <option value="welfare_delay">Welfare Fund & Insurance Claim Assistance</option>
                  <option value="other">Other Cooperative Support Request</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Detailed Description</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe the issue with relevant context..."
                  className="w-full text-xs p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#0C3B2E] focus:outline-none leading-relaxed"
                />
              </div>

              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-[11px] text-stone-600 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                <span>
                  Cooperative Promise: No worker is penalized by arbitrary automated algorithms. All disputes are
                  adjudicated with human dignity by elected guild representatives.
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-[#0C3B2E] hover:bg-[#164E3F] text-white text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Ticket</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
