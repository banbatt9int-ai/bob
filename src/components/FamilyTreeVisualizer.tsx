import React, { useState, useRef } from 'react';
import type { FamilyMember } from '../types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface FamilyTreeVisualizerProps {
  members: FamilyMember[];
  onAddMember: () => void;
  onEditMember: (member: FamilyMember) => void;
  onDeleteMember: (id: string, name: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const FamilyTreeVisualizer: React.FC<FamilyTreeVisualizerProps> = ({
  members,
  onAddMember,
  onEditMember,
  onDeleteMember,
  searchQuery,
  setSearchQuery,
}) => {
  const [viewMode, setViewMode] = useState<'hierarchical' | 'generations' | 'branches' | 'grid'>('hierarchical');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Filter members based on search and branch
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      !searchQuery.trim() ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.name_en && m.name_en.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.occupation && m.occupation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.phone && m.phone.includes(searchQuery)) ||
      (m.address && m.address.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesBranch = selectedBranch === 'all' || m.branch === selectedBranch;

    return matchesSearch && matchesBranch;
  });

  // Unique branches
  const branches = Array.from(new Set(members.map((m) => m.branch).filter(Boolean)));

  // Generations
  const gen1 = filteredMembers.filter((m) => m.generation === 1);
  const gen2 = filteredMembers.filter((m) => m.generation === 2);
  const gen3 = filteredMembers.filter((m) => m.generation === 3);
  const gen4 = filteredMembers.filter((m) => m.generation >= 4);

  // Download Tree as PDF
  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setIsDownloading(true);
    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#090d16',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Molla_Family_Tree_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner & Control Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Header Title */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1.5">
                <i className="fa-solid fa-sitemap"></i>
                পারিবারিক বংশলতিকা ও স্মৃতিচিহ্ন
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                মোট সদস্য: {members.length} জন
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              মরহুম আলহাজ্ব রহিম মোল্লা পরিবারের বংশলতিকা
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              বংশপরম্পরা, আত্মীয়তার বন্ধন ও যৌথ সহযোগিতার এক অনন্য দলিল। প্রজন্ম থেকে প্রজন্মে ছড়িয়ে থাকা সদস্যদের পরিচিতি ও ইতিহাস।
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onAddMember}
              className="cursor-pointer px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
            >
              <i className="fa-solid fa-user-plus"></i>
              <span>সদস্য যোগ করুন</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="cursor-pointer px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm shadow-md transition flex items-center gap-2"
              title="বংশলতিকা PDF হিসেবে ডাউনলোড করুন"
            >
              <i className="fa-solid fa-file-pdf text-red-400"></i>
              <span>{isDownloading ? 'ডাউনলোড হচ্ছে...' : 'PDF ডাউনলোড'}</span>
            </button>
          </div>
        </div>

        {/* Search & View Mode Filters */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Live Search Input */}
          <div className="relative w-full md:w-96">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="নাম, ফোন, পেশা বা ঠিকানা দিয়ে খুঁজুন..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none placeholder:text-slate-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <i className="fa-solid fa-circle-xmark"></i>
              </button>
            )}
          </div>

          {/* View Mode Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 self-stretch md:self-auto">
            <button
              onClick={() => setViewMode('hierarchical')}
              className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                viewMode === 'hierarchical'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <i className="fa-solid fa-diagram-project"></i>
              <span>বংশবৃক্ষ (Tree)</span>
            </button>

            <button
              onClick={() => setViewMode('generations')}
              className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                viewMode === 'generations'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <i className="fa-solid fa-layer-group"></i>
              <span>প্রজন্ম ভিত্তিক</span>
            </button>

            <button
              onClick={() => setViewMode('branches')}
              className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                viewMode === 'branches'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <i className="fa-solid fa-house-chimney-user"></i>
              <span>বাড়ি / শাখা অনুযায়ী</span>
            </button>

            <button
              onClick={() => setViewMode('grid')}
              className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <i className="fa-solid fa-address-book"></i>
              <span>ডিরেক্টরি</span>
            </button>
          </div>
        </div>

        {/* Branch Filter Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold mr-1">শাখা ফিল্টার:</span>
          <button
            onClick={() => setSelectedBranch('all')}
            className={`cursor-pointer px-3 py-1 rounded-full text-xs font-semibold transition ${
              selectedBranch === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            সকল শাখা ({members.length})
          </button>
          {branches.map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBranch(b)}
              className={`cursor-pointer px-3 py-1 rounded-full text-xs font-semibold transition ${
                selectedBranch === b
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {b} ({members.filter((m) => m.branch === b).length})
            </button>
          ))}
        </div>
      </div>

      {/* Main Printable / Renderable Container */}
      <div ref={printRef} className="p-2 sm:p-6 bg-slate-950/60 rounded-3xl border border-slate-800/60">
        {/* Printable Header Notice (for PDF output) */}
        <div className="hidden print:block text-center py-4 mb-4 border-b border-slate-700">
          <h1 className="text-2xl font-bold text-white">মরহুম আলহাজ্ব রহিম মোল্লা পরিবারের বংশলতিকা</h1>
          <p className="text-sm text-slate-300">মোল্লাপাড়া, রূপগঞ্জ, নারায়ণগঞ্জ • বন্ধন ও বিনিয়োগ</p>
        </div>

        {/* ---------------------------------------------------- */}
        {/* VIEW 1: HIERARCHICAL TREE VIEW                       */}
        {/* ---------------------------------------------------- */}
        {viewMode === 'hierarchical' && (
          <div className="space-y-12">
            {/* Generation 1: Root Ancestor */}
            <div className="flex flex-col items-center">
              <span className="px-4 py-1.5 rounded-full text-xs font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg mb-4">
                👑 ১ম প্রজন্ম (আদি পুরুষ / Patriarch)
              </span>
              <div className="flex justify-center flex-wrap gap-6">
                {gen1.map((member) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    onSelect={() => setSelectedMember(member)}
                    onEdit={() => onEditMember(member)}
                    onDelete={() => onDeleteMember(member.id, member.name)}
                    isRoot
                  />
                ))}
              </div>
              <div className="w-0.5 h-8 bg-blue-500/50 my-2"></div>
            </div>

            {/* Generation 2 */}
            <div className="flex flex-col items-center">
              <span className="px-4 py-1.5 rounded-full text-xs font-extrabold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-lg mb-4">
                🌿 ২য় প্রজন্ম (সন্তান সন্ততি)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
                {gen2.map((member) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    onSelect={() => setSelectedMember(member)}
                    onEdit={() => onEditMember(member)}
                    onDelete={() => onDeleteMember(member.id, member.name)}
                  />
                ))}
              </div>
              <div className="w-0.5 h-8 bg-blue-500/50 my-2"></div>
            </div>

            {/* Generation 3 */}
            <div className="flex flex-col items-center">
              <span className="px-4 py-1.5 rounded-full text-xs font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg mb-4">
                🌱 ৩য় প্রজন্ম (নাতি-নাতনি / বর্তমান বিনিয়োগ ও সমন্বয়কারী)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                {gen3.map((member) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    onSelect={() => setSelectedMember(member)}
                    onEdit={() => onEditMember(member)}
                    onDelete={() => onDeleteMember(member.id, member.name)}
                  />
                ))}
              </div>
              {gen4.length > 0 && <div className="w-0.5 h-8 bg-blue-500/50 my-2"></div>}
            </div>

            {/* Generation 4: Next Gen Youth */}
            {gen4.length > 0 && (
              <div className="flex flex-col items-center">
                <span className="px-4 py-1.5 rounded-full text-xs font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-lg mb-4">
                  🌸 ৪র্থ প্রজন্ম (তরুণ ও ভবিষ্যৎ প্রজন্ম)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
                  {gen4.map((member) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      onSelect={() => setSelectedMember(member)}
                      onEdit={() => onEditMember(member)}
                      onDelete={() => onDeleteMember(member.id, member.name)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* VIEW 2: GROUPED BY GENERATIONS                       */}
        {/* ---------------------------------------------------- */}
        {viewMode === 'generations' && (
          <div className="space-y-8">
            {[1, 2, 3, 4].map((genNumber) => {
              const genMembers = filteredMembers.filter((m) =>
                genNumber === 4 ? m.generation >= 4 : m.generation === genNumber
              );
              if (genMembers.length === 0) return null;

              return (
                <div key={genNumber} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-lg">
                        {genNumber}
                      </span>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {genNumber === 1 && '১ম প্রজন্ম — আদি পুরুষ'}
                          {genNumber === 2 && '২য় প্রজন্ম — সন্তানগণ'}
                          {genNumber === 3 && '৩য় প্রজন্ম — নাতি-নাতনি'}
                          {genNumber >= 4 && '৪র্থ ও পরবর্তী প্রজন্ম — তরুণ বংশধর'}
                        </h3>
                        <p className="text-xs text-slate-400">মোট সদস্য: {genMembers.length} জন</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {genMembers.map((member) => (
                      <MemberCard
                        key={member.id}
                        member={member}
                        onSelect={() => setSelectedMember(member)}
                        onEdit={() => onEditMember(member)}
                        onDelete={() => onDeleteMember(member.id, member.name)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* VIEW 3: GROUPED BY BRANCHES                          */}
        {/* ---------------------------------------------------- */}
        {viewMode === 'branches' && (
          <div className="space-y-8">
            {branches.map((bName) => {
              const branchMembers = filteredMembers.filter((m) => m.branch === bName);
              if (branchMembers.length === 0) return null;

              return (
                <div key={bName} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-lg">
                        <i className="fa-solid fa-house-chimney"></i>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{bName}</h3>
                        <p className="text-xs text-slate-400">শাখায় অন্তর্ভুক্ত সদস্য: {branchMembers.length} জন</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {branchMembers.map((member) => (
                      <MemberCard
                        key={member.id}
                        member={member}
                        onSelect={() => setSelectedMember(member)}
                        onEdit={() => onEditMember(member)}
                        onDelete={() => onDeleteMember(member.id, member.name)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* VIEW 4: DIRECTORY GRID VIEW                          */}
        {/* ---------------------------------------------------- */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                onSelect={() => setSelectedMember(member)}
                onEdit={() => onEditMember(member)}
                onDelete={() => onDeleteMember(member.id, member.name)}
              />
            ))}
          </div>
        )}

        {filteredMembers.length === 0 && (
          <div className="py-16 text-center text-slate-400">
            <i className="fa-solid fa-user-slash text-4xl text-slate-600 mb-3"></i>
            <p className="text-lg font-bold text-slate-300">কোনো সদস্য পাওয়া যায়নি</p>
            <p className="text-xs mt-1">অনুসন্ধানের কি-ওয়ার্ড পরিবর্তন করুন অথবা নতুন সদস্য যুক্ত করুন।</p>
          </div>
        )}
      </div>

      {/* Member Details Modal */}
      {selectedMember && (
        <MemberDetailsModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          onEdit={() => {
            onEditMember(selectedMember);
            setSelectedMember(null);
          }}
        />
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// Component: Member Card (Individual family node)
// -----------------------------------------------------------------------------
interface MemberCardProps {
  member: FamilyMember;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isRoot?: boolean;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onSelect, onEdit, onDelete, isRoot }) => {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer group relative bg-slate-900 border rounded-2xl p-5 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl overflow-hidden flex flex-col justify-between ${
        isRoot
          ? 'border-amber-500/60 bg-gradient-to-b from-slate-900 via-amber-950/20 to-slate-900 ring-2 ring-amber-500/30'
          : member.is_alive
          ? 'border-slate-800 hover:border-blue-500/50'
          : 'border-slate-800/80 bg-slate-900/60 opacity-95'
      }`}
    >
      {/* Top badges */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border ${
            member.is_alive
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${member.is_alive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`}></span>
          <span>{member.is_alive ? 'জীবিত' : 'মরহুম/প্রয়াত'}</span>
        </span>

        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 font-semibold truncate max-w-[130px]">
          {member.branch}
        </span>
      </div>

      {/* Member Avatar & Main info */}
      <div className="flex items-center gap-3.5 mb-3">
        <div className="relative shrink-0">
          <img
            src={
              member.photo_url ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}`
            }
            alt={member.name}
            className={`w-14 h-14 rounded-2xl object-cover border-2 shadow-md ${
              isRoot
                ? 'border-amber-400'
                : member.gender === 'female'
                ? 'border-pink-500/50'
                : 'border-blue-500/50'
            }`}
            onError={(e: any) => {
              e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}`;
            }}
          />
          <span
            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white ${
              member.gender === 'female' ? 'bg-pink-500' : 'bg-blue-600'
            }`}
          >
            <i className={`fa-solid ${member.gender === 'female' ? 'fa-venus' : 'fa-mars'}`}></i>
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-base font-bold text-white group-hover:text-blue-400 transition leading-snug truncate">
            {member.name}
          </h4>
          {member.name_en && (
            <p className="text-[11px] text-slate-400 truncate font-english">{member.name_en}</p>
          )}
          <p className="text-xs text-emerald-400 font-medium truncate mt-0.5">
            {member.occupation || 'পারিবারিক সদস্য'}
          </p>
        </div>
      </div>

      {/* Details Snapshot */}
      <div className="pt-2.5 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-400">
        {member.father_name && (
          <div className="flex items-center justify-between">
            <span className="text-slate-500">পিতা:</span>
            <span className="text-slate-300 truncate max-w-[150px]">{member.father_name}</span>
          </div>
        )}
        {member.spouse_name && (
          <div className="flex items-center justify-between">
            <span className="text-slate-500">{member.gender === 'female' ? 'স্বামী:' : 'স্ত্রী:'}</span>
            <span className="text-slate-300 truncate max-w-[150px]">{member.spouse_name}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-slate-500">জীবনকাল:</span>
          <span className="text-slate-300 font-english">
            {member.birth_year || 'অজানা'} {member.death_year ? `— ${member.death_year}` : ''}
          </span>
        </div>
      </div>

      {/* Action Hover Controls */}
      <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
        <span className="text-[10px] text-blue-400/80 font-bold group-hover:text-blue-300 flex items-center gap-1">
          <span>বিস্তারিত প্রোফাইল</span>
          <i className="fa-solid fa-arrow-right text-[9px]"></i>
        </span>

        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onEdit}
            className="cursor-pointer p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition"
            title="তথ্য সম্পাদনা"
          >
            <i className="fa-solid fa-pen text-xs"></i>
          </button>
          {!isRoot && (
            <button
              onClick={onDelete}
              className="cursor-pointer p-1.5 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white transition"
              title="মুছে ফেলুন"
            >
              <i className="fa-solid fa-trash-can text-xs"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Component: Member Details Modal
// -----------------------------------------------------------------------------
interface MemberDetailsModalProps {
  member: FamilyMember;
  onClose: () => void;
  onEdit: () => void;
}

const MemberDetailsModal: React.FC<MemberDetailsModalProps> = ({ member, onClose, onEdit }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative">
        {/* Banner with Close button */}
        <div className="h-28 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 relative p-4 flex justify-between items-start">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-950/80 text-blue-300 border border-blue-500/30">
            {member.generation}ম প্রজন্ম • {member.branch}
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-950/60 text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            <i className="fa-solid fa-xmark text-base"></i>
          </button>
        </div>

        {/* Profile Head */}
        <div className="px-6 pb-6 relative -mt-12">
          <div className="flex items-end justify-between mb-4">
            <img
              src={
                member.photo_url ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}`
              }
              alt={member.name}
              className="w-24 h-24 rounded-3xl object-cover border-4 border-slate-900 shadow-xl"
            />
            <div className="flex items-center gap-2">
              {member.phone && (
                <a
                  href={`tel:${member.phone.replace(/\s+/g, '')}`}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-phone"></i>
                  <span>কল করুন</span>
                </a>
              )}
              <button
                onClick={onEdit}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition flex items-center gap-1.5"
              >
                <i className="fa-solid fa-pen"></i>
                <span>এডিট</span>
              </button>
            </div>
          </div>

          <h3 className="text-2xl font-black text-white">{member.name}</h3>
          {member.name_en && <p className="text-xs text-slate-400 font-english mt-0.5">{member.name_en}</p>}
          <p className="text-sm font-semibold text-emerald-400 mt-1">{member.occupation || 'পারিবারিক সদস্য'}</p>

          {/* Bio statement */}
          {member.bio && (
            <p className="mt-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed italic">
              "{member.bio}"
            </p>
          )}

          {/* Details Grid */}
          <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 block mb-1 text-[11px]">পিতা / মাতা:</span>
              <span className="text-white font-semibold">
                {member.father_name || '—'} {member.mother_name ? `/ ${member.mother_name}` : ''}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 block mb-1 text-[11px]">স্বামী / স্ত্রী:</span>
              <span className="text-white font-semibold">{member.spouse_name || '—'}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 block mb-1 text-[11px]">রক্তের গ্রুপ:</span>
              <span className="text-amber-400 font-bold font-english">{member.blood_group || 'অজানা'}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 block mb-1 text-[11px]">জীবনকাল:</span>
              <span className="text-white font-semibold font-english">
                {member.birth_year || 'অজানা'} {member.death_year ? `— ${member.death_year}` : '(জীবিত)'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 col-span-2">
              <span className="text-slate-400 block mb-1 text-[11px]">ঠিকানা:</span>
              <span className="text-white font-semibold flex items-center gap-1.5">
                <i className="fa-solid fa-location-dot text-red-400"></i>
                {member.address || 'মোল্লাপাড়া, রূপগঞ্জ, নারায়ণগঞ্জ'}
              </span>
            </div>

            {member.bondhon_member_id && (
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 col-span-2 flex items-center justify-between">
                <div>
                  <span className="text-blue-400 font-bold block text-xs">বন্ধন ও বিনিয়োগ আইডি:</span>
                  <span className="text-white font-extrabold text-sm">{member.bondhon_member_id}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                  সক্রিয় অংশীদার
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
