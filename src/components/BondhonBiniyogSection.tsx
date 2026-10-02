import React, { useState } from 'react';
import type { FamilyInvestment, FamilyMember, LandInvestment } from '../types';
import { addInvestment } from '../firebase';

interface BondhonBiniyogSectionProps {
  investments: FamilyInvestment[];
  familyMembers: FamilyMember[];
  lands: LandInvestment[];
  onInvestmentAdded: (inv: FamilyInvestment) => void;
}

export const BondhonBiniyogSection: React.FC<BondhonBiniyogSectionProps> = ({
  investments,
  familyMembers,
  lands,
  onInvestmentAdded,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'investments' | 'lands' | 'welfare'>('overview');
  const [showAddModal, setShowAddModal] = useState(false);

  // New investment form states
  const [memberId, setMemberId] = useState('');
  const [invType, setInvType] = useState<'monthly' | 'lumpsum' | 'welfare'>('monthly');
  const [amount, setAmount] = useState<number>(5000);
  const [purpose, setPurpose] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bKash');
  const [trxId, setTrxId] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Financial calculations
  const totalAmount = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const monthlyTotal = investments
    .filter((inv) => inv.type === 'monthly')
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const lumpsumTotal = investments
    .filter((inv) => inv.type === 'lumpsum')
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const welfareTotal = investments
    .filter((inv) => inv.type === 'welfare')
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);

  const handleSubmitInvestment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId) {
      setErrorMsg('অনুগ্রহ করে পারিবারিক সদস্য নির্বাচন করুন');
      return;
    }
    if (!amount || amount <= 0) {
      setErrorMsg('সঠিক টাকার অঙ্ক দিন');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');

    const member = familyMembers.find((m) => m.id === memberId);
    const memberName = member ? member.name : 'পারিবারিক সদস্য';
    const branchName = member ? member.branch : 'মোল্লা পরিবার';

    const defaultPurpose =
      invType === 'monthly'
        ? 'মাসিক পারিবারিক সঞ্চয় কিস্তি'
        : invType === 'lumpsum'
        ? 'যৌথ ভূমি প্রকল্পে এককালীন অংশীদারি'
        : 'পারিবারিক চিকিৎসা ও জরুরি কল্যাণ তহবিল';

    const payload: Partial<FamilyInvestment> = {
      member_id: memberId,
      member_name: memberName,
      family_branch: branchName,
      type: invType,
      amount: Number(amount),
      month_year: invType === 'monthly' ? new Date().toISOString().slice(0, 7) : undefined,
      purpose: purpose.trim() || defaultPurpose,
      payment_method: paymentMethod,
      trx_id: trxId.trim() || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().slice(0, 10),
      status: 'Approved',
      notes: notes.trim() || undefined,
    };

    try {
      const created = await addInvestment(payload);
      onInvestmentAdded(created as FamilyInvestment);
      setShowAddModal(false);
      // Reset
      setAmount(5000);
      setPurpose('');
      setTrxId('');
      setNotes('');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Firebase এ ডাটা সংরক্ষণ ব্যর্থ হয়েছে');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-blue-950/80 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                বন্ধন ও বিনিয়োগ (BoB)
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                যৌথ স্বপ্ন • নিশ্চিত ভবিষ্যৎ
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              মোল্লা পরিবার যৌথ সঞ্চয় ও ভূমি বিনিয়োগ তহবিল
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              পারিবারিক ঐক্য, আর্থিক নিরাপত্তা ও প্রজন্মের ভবিষ্যতের জন্য যৌথ ভূমি ক্রয় এবং কল্যাণ তহবিলের সম্পূর্ণ ডিজিটাল হিসাব সংরক্ষণ।
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="cursor-pointer px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition flex items-center gap-2 self-start lg:self-auto"
          >
            <i className="fa-solid fa-hand-holding-dollar text-base"></i>
            <span>নতুন কিস্তি / বিনিয়োগ জমা দিন</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">সর্বমোট পারিবারিক তহবিল</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-english">
              ৳ {totalAmount.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">সর্বমোট সংগৃহীত মূলধন</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">মাসিক কিস্তি সঞ্চয়</span>
            <span className="text-2xl sm:text-3xl font-black text-blue-400 font-english">
              ৳ {monthlyTotal.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">পারিবারিক সঞ্চয় স্কিম</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">এককালীন ভূমি বিনিয়োগ</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-english">
              ৳ {lumpsumTotal.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">জমি ক্রয় অংশীদারি</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">জরুরি কল্যাণ তহবিল</span>
            <span className="text-2xl sm:text-3xl font-black text-pink-400 font-english">
              ৳ {welfareTotal.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">চিকিৎসা ও জরুরি সাহায্য</span>
          </div>
        </div>

        {/* Sub Tabs */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`cursor-pointer px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeSubTab === 'overview'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <i className="fa-solid fa-chart-pie"></i>
            <span>সামগ্রিক বিবরণী (Overview)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('investments')}
            className={`cursor-pointer px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeSubTab === 'investments'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <i className="fa-solid fa-list-check"></i>
            <span>জমা ও কিস্তির হিসাব ({investments.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('lands')}
            className={`cursor-pointer px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeSubTab === 'lands'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <i className="fa-solid fa-map-location-dot"></i>
            <span>ভূমি প্রকল্পসমূহ ({lands.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('welfare')}
            className={`cursor-pointer px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeSubTab === 'welfare'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <i className="fa-solid fa-hand-holding-heart"></i>
            <span>পারিবারিক কল্যাণ সেবা</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* SUB TAB: OVERVIEW & HIGHLIGHTS                       */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Deposits Feed */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-clock-rotate-left text-emerald-400"></i>
                <span>সাম্প্রতিক জমার তালিকা (Firebase Realtime)</span>
              </h3>
              <button
                onClick={() => setActiveSubTab('investments')}
                className="text-xs text-blue-400 hover:underline"
              >
                সবগুলো দেখুন ({investments.length})
              </button>
            </div>

            <div className="divide-y divide-slate-800/80">
              {investments.slice(0, 6).map((inv) => (
                <div key={inv.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                        inv.type === 'monthly'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : inv.type === 'lumpsum'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                      }`}
                    >
                      <i
                        className={`fa-solid ${
                          inv.type === 'monthly'
                            ? 'fa-calendar-check'
                            : inv.type === 'lumpsum'
                            ? 'fa-landmark'
                            : 'fa-heart-pulse'
                        }`}
                      ></i>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">{inv.member_name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {inv.purpose} • <span className="font-english">{inv.date}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-extrabold text-emerald-400 font-english block">
                      + ৳ {inv.amount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Info & Guidelines */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-bullseye text-blue-400"></i>
                <span>বন্ধন ও বিনিয়োগের নিয়মাবলী</span>
              </h3>
              <ul className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-circle-check text-emerald-400 mt-0.5"></i>
                  <span>সকল সদস্য প্রতি মাসের ১০ তারিখের মধ্যে মাসিক কিস্তি জমা প্রদান করবেন।</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-circle-check text-emerald-400 mt-0.5"></i>
                  <span>ভূমি ক্রয়ে এককালীন অংশীদাররা শেয়ার সনদ ও দলিল কপি পাবেন।</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-circle-check text-emerald-400 mt-0.5"></i>
                  <span>কল্যাণ তহবিল থেকে যেকোনো পরিবারের জরুরি চিকিৎসা বা শিক্ষায় সহায়তা প্রদান করা হয়।</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-950/60 to-slate-900 border border-blue-500/30 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/30 text-blue-300 flex items-center justify-center text-xl">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">স্বচ্ছতা ও জবাবদিহিতা</h4>
                  <p className="text-xs text-slate-400">Firebase ক্লাউডে সংরক্ষিত রিয়েল-টাইম ডাটা</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                প্রতিটি জমা সরাসরি ফায়ারবেস ফায়ারস্টোর ডাটাবেজে রেকর্ড করা হয়। পরিবারের সকল সদস্য যেকোনো সময় তাদের হিসাব ও জমার ইতিহাস যাচাই করতে পারেন।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* SUB TAB: ALL INVESTMENTS TABLE                       */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'investments' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-receipt text-emerald-400"></i>
              <span>সকল জমার হিসাব বিবরণী (Ledger)</span>
            </h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <i className="fa-solid fa-plus"></i>
              <span>জমা এন্ট্রি করুন</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">সদস্যের নাম</th>
                  <th className="py-3 px-4">শাখা</th>
                  <th className="py-3 px-4">জমার ধরন</th>
                  <th className="py-3 px-4">বিবরণ / উদ্দেশ্য</th>
                  <th className="py-3 px-4">তারিখ</th>
                  <th className="py-3 px-4">মাধ্যম ও TrxID</th>
                  <th className="py-3 px-4 text-right">পরিমাণ (টাকা)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {investments.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/50 transition">
                    <td className="py-3 px-4 font-bold text-white">{inv.member_name}</td>
                    <td className="py-3 px-4 text-slate-400">{inv.family_branch || 'মোল্লা পরিবার'}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.type === 'monthly'
                            ? 'bg-blue-500/20 text-blue-300'
                            : inv.type === 'lumpsum'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-pink-500/20 text-pink-300'
                        }`}
                      >
                        {inv.type === 'monthly'
                          ? 'মাসিক কিস্তি'
                          : inv.type === 'lumpsum'
                          ? 'এককালীন বিনিয়োগ'
                          : 'জরুরি কল্যাণ'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 max-w-xs truncate">{inv.purpose}</td>
                    <td className="py-3 px-4 font-english">{inv.date}</td>
                    <td className="py-3 px-4 font-english text-slate-400">
                      {inv.payment_method || 'bKash'} • {inv.trx_id || '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-400 font-english text-sm">
                      ৳ {inv.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* SUB TAB: LAND PROJECTS SHOWCASE                      */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'lands' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lands.map((land) => (
            <div
              key={land.land_id}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-emerald-500/50 transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={land.images?.[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80'}
                    alt={land.land_name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-slate-950/80 text-emerald-400 border border-emerald-500/30">
                    {land.status}
                  </span>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-xs text-amber-300 font-semibold block">{land.location}</span>
                    <h4 className="text-lg font-bold">{land.land_name}</h4>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <p className="text-xs text-slate-300 leading-relaxed">{land.description}</p>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">জমির পরিমাণ:</span>
                      <span className="text-white font-bold">{land.area_size}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">প্রতি শেয়ার মূল্য:</span>
                      <span className="text-emerald-400 font-bold font-english">
                        ৳ {land.share_price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">মোট শেয়ার:</span>
                      <span className="text-white font-bold font-english">{land.total_shares} টি</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">বরাদ্দকৃত শেয়ার:</span>
                      <span className="text-amber-400 font-bold font-english">{land.sold_shares} টি</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="cursor-pointer w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-hand-holding-dollar"></i>
                  <span>এই প্রকল্পে শেয়ার বুকিং দিন</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* SUB TAB: WELFARE ASSISTANCE                          */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'welfare' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="max-w-2xl">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-pink-500/20 text-pink-300 border border-pink-500/40">
              পারিবারিক কল্যাণ ও আপদকালীন তহবিল
            </span>
            <h3 className="text-2xl font-bold text-white mt-2">
              মোল্লা পরিবারের আপদকালীন সহায়তা ও স্বাস্থ্য সেবা
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
              পরিবারের যেকোনো সদস্যের গুরুতর অসুস্থতা, চিকিৎসা ব্যয়, উচ্চশিক্ষায় সহায়তা বা আপদকালীন সংকটে এই তহবিল থেকে সুদবিহীন এককালীন অনুদান প্রদান করা হয়।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center text-lg">
                <i className="fa-solid fa-stethoscope"></i>
              </div>
              <h4 className="text-base font-bold text-white">জরুরি চিকিৎসা সহায়তা</h4>
              <p className="text-xs text-slate-400">
                হাসপাতালে ভর্তি, অপারেশন বা দীর্ঘমেয়াদী চিকিৎসার জন্য জরুরি অনুদান।
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-lg">
                <i className="fa-solid fa-graduation-cap"></i>
              </div>
              <h4 className="text-base font-bold text-white">শিক্ষাবৃত্তি ও সহায়তা</h4>
              <p className="text-xs text-slate-400">
                মেধাবী সন্তানদের স্কুল, কলেজ ও বিশ্ববিদ্যালয়ের সেমিস্টার ফি অনুদান।
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg">
                <i className="fa-solid fa-hand-holding-heart"></i>
              </div>
              <h4 className="text-base font-bold text-white">পারিবারিক মিলনমেলা</h4>
              <p className="text-xs text-slate-400">
                প্রতি বছর ঈদ পুনর্মিলনী ও বার্ষিক পারিবারিক সাধারণ সভার ব্যয় নির্বাহ।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: ADD NEW INVESTMENT DEPOSIT                    */}
      {/* ---------------------------------------------------- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-hand-holding-dollar text-emerald-400"></i>
                <span>পারিবারিক তহবিলে নতুন জমা এন্ট্রি</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSubmitInvestment} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  পারিবারিক সদস্য নির্বাচন করুন <span className="text-red-400">*</span>
                </label>
                <select
                  required
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="">-- সদস্য বাছাই করুন --</option>
                  {familyMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.branch})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">জমার ধরন</label>
                  <select
                    value={invType}
                    onChange={(e) => setInvType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-blue-500 focus:outline-none"
                  >
                    <option value="monthly">মাসিক কিস্তি</option>
                    <option value="lumpsum">এককালীন বিনিয়োগ</option>
                    <option value="welfare">জরুরি কল্যাণ তহবিল</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    টাকার পরিমাণ (BDT) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-blue-500 focus:outline-none font-english"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">উদ্দেশ্য / প্রকল্প</label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="যেমন: সেপ্টেম্বর মাসের কিস্তি / রূপগঞ্জ জমি"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">পেমেন্ট মাধ্যম</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-blue-500 focus:outline-none"
                  >
                    <option value="bKash">bKash (বিকাশ)</option>
                    <option value="Nagad">Nagad (নগদ)</option>
                    <option value="Rocket">Rocket (রকেট)</option>
                    <option value="Bank Transfer">Bank Transfer (ব্যাংক)</option>
                    <option value="Cash">Cash (নগদ গ্রহণ)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">TrxID / রেফারেন্স</label>
                  <input
                    type="text"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    placeholder="TXN9928..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-blue-500 focus:outline-none font-english"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
                >
                  {isSaving ? (
                    <>
                      <i className="fa-solid fa-spinner animate-spin"></i>
                      <span>সংরক্ষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-check"></i>
                      <span>Firebase এ সেভ করুন</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
