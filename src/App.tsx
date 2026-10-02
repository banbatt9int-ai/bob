import React, { useState, useEffect, useCallback, useRef } from 'react';
import type {
  SystemSettings,
  Member,
  MonthlyDeposit,
  LumpsumDeposit,
  LandInvestment,
  Director,
  GalleryItem,
  DashboardStats,
  AppNotification,
  FamilyMember,
  FamilyInvestment,
} from './types';
import { SplashScreen } from './components/SplashScreen';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { NoticeTicker } from './components/NoticeTicker';
import { HomePage } from './components/HomePage';
import { UserDashboard } from './components/UserDashboard';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { TermsModal } from './components/TermsModal';
import { RoiCalculator } from './components/RoiCalculator';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { FamilyTreeVisualizer } from './components/FamilyTreeVisualizer';
import { FamilyMemberModal } from './components/FamilyMemberModal';
import { BondhonBiniyogSection } from './components/BondhonBiniyogSection';
import { FamilyHeritageSection } from './components/FamilyHeritageSection';
import {
  initialFamilyMembers,
  initialFamilyInvestments,
} from './data/initialFamilyData';
import {
  subscribeFamilyMembers,
  subscribeInvestments,
  addFamilyMember,
  deleteFamilyMember,
  addInvestment,
} from './firebase';
import { initialSystemSettings } from './services/initialData';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentTab, setCurrentTab] = useState<string>('tree'); // Default landing: Family Tree
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [settings, setSettings] = useState<SystemSettings>({
    ...initialSystemSettings,
    project_title: 'মোল্লা ফ্যামিলি ট্রি ও বন্ধন ও বিনিয়োগ',
    slogan_bengali: 'রক্তের বন্ধন • যৌথ কল্যাণ ও বিনিয়োগ',
    notice_bengali: 'স্বাগতম! মরহুম আলহাজ্ব রহিম মোল্লা পরিবারের ডিজিটাল বংশলতিকা ও বন্ধন ও বিনিয়োগ পোর্টাল।',
  });
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [monthlyDeposits, setMonthlyDeposits] = useState<MonthlyDeposit[]>([]);
  const [lumpsumDeposits, setLumpsumDeposits] = useState<LumpsumDeposit[]>([]);
  const [lands, setLands] = useState<LandInvestment[]>([]);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  // Molla Family Tree & Bondhon State (Firebase Firestore)
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(initialFamilyMembers);
  const [familyInvestments, setFamilyInvestments] = useState<FamilyInvestment[]>(initialFamilyInvestments);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<FamilyMember | null>(null);

  const currentUserRef = useRef<Member | null>(null);
  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (window.location.pathname === '/admin') setCurrentTab('admin');
  }, []);

  // --- Real-time Firebase Firestore Listeners ---
  useEffect(() => {
    // 1. Subscribe to family members in Firestore
    const unsubFamily = subscribeFamilyMembers((remoteMembers) => {
      if (remoteMembers && remoteMembers.length > 0) {
        setFamilyMembers(remoteMembers);
      } else {
        // Auto-seed initial members to Firestore if collection is empty
        initialFamilyMembers.forEach(async (m) => {
          try {
            await addFamilyMember(m);
          } catch (e) {
            // Ignore offline fallback
          }
        });
        setFamilyMembers(initialFamilyMembers);
      }
    });

    // 2. Subscribe to investments in Firestore
    const unsubInv = subscribeInvestments((remoteInv) => {
      if (remoteInv && remoteInv.length > 0) {
        setFamilyInvestments(remoteInv);
      } else {
        initialFamilyInvestments.forEach(async (inv) => {
          try {
            await addInvestment(inv);
          } catch (e) {}
        });
        setFamilyInvestments(initialFamilyInvestments);
      }
    });

    return () => {
      unsubFamily();
      unsubInv();
    };
  }, []);

  const safeFetch = async (url: string) => {
    try {
      const res = await fetch(url);
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  };

  const fetchAppData = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const user = currentUserRef.current;
      const [
        settingsRes,
        statsRes,
        membersRes,
        monthlyRes,
        lumpsumRes,
        landsRes,
        directorsRes,
        galleryRes,
        notifRes,
      ] = await Promise.all([
        safeFetch('/api/settings'),
        safeFetch('/api/stats'),
        safeFetch('/api/members'),
        safeFetch('/api/deposits/monthly'),
        safeFetch('/api/deposits/lumpsum'),
        safeFetch('/api/lands'),
        safeFetch('/api/directors'),
        safeFetch('/api/gallery'),
        safeFetch(`/api/notifications${user ? `?member_id=${user.member_id}` : ''}`),
      ]);

      if (settingsRes?.success && settingsRes.settings) setSettings(settingsRes.settings);
      if (statsRes?.success && statsRes.stats) setStats(statsRes.stats);
      if (membersRes?.success && membersRes.members) setMembers(membersRes.members);
      if (monthlyRes?.success && monthlyRes.deposits) setMonthlyDeposits(monthlyRes.deposits);
      if (lumpsumRes?.success && lumpsumRes.deposits) setLumpsumDeposits(lumpsumRes.deposits);
      if (landsRes?.success && landsRes.lands) setLands(landsRes.lands);
      if (directorsRes?.success && directorsRes.directors) setDirectors(directorsRes.directors);
      if (galleryRes?.success && galleryRes.gallery) setGallery(galleryRes.gallery);
      if (notifRes?.success && notifRes.notifications) setNotifications(notifRes.notifications);
    } catch (err) {
      console.error('Error fetching app data:', err);
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    const cached = localStorage.getItem('bob_logged_user');
    if (cached) {
      try {
        const user = JSON.parse(cached);
        setCurrentUser(user);
        if (!user.has_accepted_terms) setShowTermsModal(true);
      } catch (e) {
        localStorage.removeItem('bob_logged_user');
      }
    }
    fetchAppData();
  }, [fetchAppData]);

  const handleLoginSuccess = (member: Member) => {
    setCurrentUser(member);
    localStorage.setItem('bob_logged_user', JSON.stringify(member));
    if (!member.has_accepted_terms) setShowTermsModal(true);
    if (member.role === 'Admin') setCurrentTab('admin');
    else setCurrentTab('tree');
  };

  const handleLogout = async () => {
    setCurrentUser(null);
    localStorage.removeItem('bob_logged_user');
    setCurrentTab('tree');
  };

  const handleTermsAccepted = () => {
    if (currentUser) {
      const updated = { ...currentUser, has_accepted_terms: true };
      setCurrentUser(updated);
      localStorage.setItem('bob_logged_user', JSON.stringify(updated));
    }
    setShowTermsModal(false);
  };

  const handleNavigateTab = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Family Member Handlers ---
  const handleOpenAddMember = () => {
    setMemberToEdit(null);
    setIsMemberModalOpen(true);
  };

  const handleOpenEditMember = (member: FamilyMember) => {
    setMemberToEdit(member);
    setIsMemberModalOpen(true);
  };

  const handleDeleteMember = async (id: string, name: string) => {
    if (!window.confirm(`আপনি কি নিশ্চিত "${name}"-কে বংশলতিকা থেকে মুছে ফেলতে চান?`)) {
      return;
    }
    try {
      await deleteFamilyMember(id);
      setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (err: any) {
      alert(`মুছে ফেলা সম্ভব হয়নি: ${err.message || 'ত্রুটি'}`);
    }
  };

  const handleMemberSaved = (savedMember: FamilyMember) => {
    setFamilyMembers((prev) => {
      const idx = prev.findIndex((m) => m.id === savedMember.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = savedMember;
        return updated;
      }
      return [savedMember, ...prev];
    });
  };

  const handleInvestmentAdded = (inv: FamilyInvestment) => {
    setFamilyInvestments((prev) => [inv, ...prev]);
  };

  const pendingCount = (stats?.pending_monthly_deposits || 0) + (stats?.pending_lumpsum_deposits || 0);
  const unreadNotificationsCount = notifications.filter(
    (n) => currentUser && (!n.read_by || !n.read_by.includes(currentUser.member_id))
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} settings={settings} />}

      <Header
        currentTab={currentTab}
        setCurrentTab={handleNavigateTab}
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        settings={settings}
        pendingApprovalsCount={pendingCount}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotifications={() => setShowNotificationCenter(true)}
      />

      <NoticeTicker notice={settings?.notice_bengali || ''} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* TAB 1: FAMILY TREE (বংশবৃক্ষ) */}
        {currentTab === 'tree' && (
          <FamilyTreeVisualizer
            members={familyMembers}
            onAddMember={handleOpenAddMember}
            onEditMember={handleOpenEditMember}
            onDeleteMember={handleDeleteMember}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {/* TAB 2: MEMBERS DIRECTORY */}
        {currentTab === 'members' && (
          <FamilyTreeVisualizer
            members={familyMembers}
            onAddMember={handleOpenAddMember}
            onEditMember={handleOpenEditMember}
            onDeleteMember={handleDeleteMember}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {/* TAB 3: BONDHON O BINIYOG (যৌথ সঞ্চয় ও বিনিয়োগ) */}
        {currentTab === 'bondhon' && (
          <BondhonBiniyogSection
            investments={familyInvestments}
            familyMembers={familyMembers}
            lands={lands}
            onInvestmentAdded={handleInvestmentAdded}
          />
        )}

        {/* TAB 4: LAND PROJECTS */}
        {currentTab === 'projects' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider inline-block mb-2">
                পারিবারিক যৌথ ভূমি উদ্যোগ
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white">আমাদের চলমান ভূমি প্রকল্পসমূহ</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                নিরাপদ দলিল, সীমানা প্রাচীর ও যৌথ মালিকানাভিত্তিক লাভজনক পারিবারিক ভূমি বিনিয়োগ
              </p>
            </div>
            <BondhonBiniyogSection
              investments={familyInvestments}
              familyMembers={familyMembers}
              lands={lands}
              onInvestmentAdded={handleInvestmentAdded}
            />
          </div>
        )}

        {/* TAB 5: HERITAGE & HISTORY */}
        {currentTab === 'about' && <FamilyHeritageSection />}

        {/* TAB 6: ROI CALCULATOR */}
        {currentTab === 'calculator' && (
          <div className="py-6">
            <RoiCalculator
              lands={lands}
              onBookShare={(_land) => {
                handleNavigateTab('bondhon');
              }}
            />
          </div>
        )}

        {/* USER DASHBOARD */}
        {currentTab === 'dashboard' && currentUser && (
          <UserDashboard
            currentUser={currentUser}
            monthlyDeposits={monthlyDeposits}
            lumpsumDeposits={lumpsumDeposits}
            lands={lands}
            settings={settings}
            notifications={notifications}
            onOpenNotifications={() => setShowNotificationCenter(true)}
            onRefreshData={fetchAppData}
            onUpdateUser={setCurrentUser}
          />
        )}

        {/* ADMIN CONTROL PANEL */}
        {currentTab === 'admin' && (
          <AdminPanel
            currentUser={currentUser}
            stats={stats}
            settings={settings}
            members={members}
            monthlyDeposits={monthlyDeposits}
            lumpsumDeposits={lumpsumDeposits}
            lands={lands}
            directors={directors}
            onRefreshData={fetchAppData}
            onOpenAuth={() => setShowAuthModal(true)}
          />
        )}
      </main>

      <Footer settings={settings} onNavigate={handleNavigateTab} />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
        settings={settings}
      />

      {showTermsModal && currentUser && (
        <TermsModal
          member={currentUser}
          onAccept={handleTermsAccepted}
          onClose={() => setShowTermsModal(false)}
        />
      )}

      <NotificationCenterModal
        isOpen={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
        notifications={notifications}
        currentMemberId={currentUser?.member_id}
        onMarkRead={async (id) => {
          if (!currentUser) return;
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === id ? { ...n, read_by: [...(n.read_by || []), currentUser.member_id] } : n
            )
          );
        }}
        onNavigateTab={handleNavigateTab}
      />

      {/* Add / Edit Family Member Modal */}
      <FamilyMemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        memberToEdit={memberToEdit}
        allMembers={familyMembers}
        onSaved={handleMemberSaved}
      />
    </div>
  );
}
