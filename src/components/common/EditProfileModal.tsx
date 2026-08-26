import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Mail,
  Camera,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Shield,
  Loader2,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
];

export const EditProfileModal: React.FC = () => {
  const {
    currentUser,
    isEditProfileOpen,
    closeEditProfileModal,
    updateUserProfile,
    openChangePasswordModal,
    loadingAuth,
  } = useAuth();

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setContact(currentUser.contact || '');
      setAvatarUrl(currentUser.avatar_url || PRESET_AVATARS[0]);
    }
  }, [currentUser, isEditProfileOpen]);

  if (!isEditProfileOpen || !currentUser) return null;

  const handleClose = () => {
    setSuccessMsg('');
    setErrorMsg('');
    closeEditProfileModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Full name cannot be empty.');
      return;
    }

    const res = await updateUserProfile({
      name: name.trim(),
      contact: contact.trim(),
      avatar_url: avatarUrl.trim(),
    });

    if (res.success) {
      setSuccessMsg('Profile details & photo updated successfully!');
      setTimeout(() => {
        handleClose();
      }, 1500);
    } else {
      setErrorMsg(res.error || 'Failed to update profile details.');
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const tempUrl = URL.createObjectURL(file);
      setAvatarUrl(tempUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0C3B2E] via-[#144537] to-[#1D5C4B] px-5 sm:px-6 py-4 sm:py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#D4A373]/20 text-[#D4A373] border border-[#D4A373]/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base font-['Outfit']">Edit Account Details & Photo</h3>
              <p className="text-[10px] sm:text-[11px] text-emerald-200">Update your profile & credentials</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition-colors text-xs"
          >
            ✕
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs text-stone-700">
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Profile Photo Preview & Upload */}
          <div className="flex flex-col items-center justify-center space-y-3 pb-2 border-b border-stone-100">
            <div className="relative group">
              <img
                src={avatarUrl || PRESET_AVATARS[0]}
                alt={name || 'Profile'}
                className="w-20 h-20 rounded-full object-cover border-3 border-[#D4A373] shadow-md"
              />
              <label
                htmlFor="avatar-file-input"
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#0C3B2E] text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-[#164E3F] transition-colors"
                title="Upload Photo"
              >
                <Camera className="w-3.5 h-3.5 text-[#D4A373]" />
              </label>
              <input
                id="avatar-file-input"
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />
            </div>

            {/* Quick Avatar Presets */}
            <div className="text-center space-y-1.5">
              <span className="text-[11px] font-bold text-stone-500 block">Choose Avatar Preset or Upload</span>
              <div className="flex items-center gap-2 justify-center">
                {PRESET_AVATARS.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAvatarUrl(url)}
                    className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-transform ${
                      avatarUrl === url ? 'border-[#0C3B2E] scale-110 shadow-sm' : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt="preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-stone-900 mb-1">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0C3B2E] focus:outline-none bg-stone-50/50 font-medium"
              />
            </div>
          </div>

          {/* Email (Readonly) */}
          <div>
            <label className="block text-xs font-bold text-stone-900 mb-1">Email Address (Registered)</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-stone-200 rounded-xl bg-stone-100 font-mono text-stone-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-xs font-bold text-stone-900 mb-1">Phone / WhatsApp Contact</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="tel"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0C3B2E] focus:outline-none bg-stone-50/50 font-medium"
              />
            </div>
          </div>

          {/* Custom Avatar Photo URL */}
          <div>
            <label className="block text-xs font-bold text-stone-900 mb-1">Avatar Photo URL (Optional)</label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#0C3B2E] focus:outline-none bg-stone-50/50 font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Password Change Shortcut Box */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#0C3B2E]" />
              <div>
                <p className="font-bold text-stone-900 text-[11px]">Account Password</p>
                <p className="text-[10px] text-stone-500">Update login password or recovery</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                closeEditProfileModal();
                openChangePasswordModal();
              }}
              className="px-3 py-1.5 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 font-bold text-[11px] shadow-xs"
            >
              Change Password
            </button>
          </div>

          {/* Submit Action */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loadingAuth}
              className="flex-1 py-2.5 rounded-xl bg-[#0C3B2E] hover:bg-[#164E3F] text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5"
            >
              {loadingAuth ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
