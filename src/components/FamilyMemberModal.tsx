import React, { useState, useEffect } from 'react';
import type { FamilyMember } from '../types';
import { addFamilyMember, updateFamilyMember } from '../firebase';

interface FamilyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberToEdit?: FamilyMember | null;
  allMembers: FamilyMember[];
  onSaved: (member: FamilyMember) => void;
}

export const FamilyMemberModal: React.FC<FamilyMemberModalProps> = ({
  isOpen,
  onClose,
  memberToEdit,
  allMembers,
  onSaved
}) => {
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [generation, setGeneration] = useState<number>(3);
  const [branch, setBranch] = useState('বড় বাড়ি');
  const [customBranch, setCustomBranch] = useState('');
  const [parentId, setParentId] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [spouseName, setSpouseName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [deathYear, setDeathYear] = useState('');
  const [isAlive, setIsAlive] = useState(true);
  const [bloodGroup, setBloodGroup] = useState('');
  const [occupation, setOccupation] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [bio, setBio] = useState('');
  const [bondhonMemberId, setBondhonMemberId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const branches = ['মূল শাখা (প্রতিষ্ঠাতা)', 'বড় বাড়ি', 'মেজো বাড়ি', 'ছোট বাড়ি', 'অন্যান্য'];

  useEffect(() => {
    if (memberToEdit) {
      setName(memberToEdit.name || '');
      setNameEn(memberToEdit.name_en || '');
      setGender(memberToEdit.gender || 'male');
      setGeneration(memberToEdit.generation || 3);
      if (branches.includes(memberToEdit.branch)) {
        setBranch(memberToEdit.branch);
        setCustomBranch('');
      } else {
        setBranch('অন্যান্য');
        setCustomBranch(memberToEdit.branch || '');
      }
      setParentId(memberToEdit.parent_id || '');
      setFatherName(memberToEdit.father_name || '');
      setMotherName(memberToEdit.mother_name || '');
      setSpouseName(memberToEdit.spouse_name || '');
      setBirthYear(memberToEdit.birth_year || '');
      setDeathYear(memberToEdit.death_year || '');
      setIsAlive(memberToEdit.is_alive !== undefined ? memberToEdit.is_alive : true);
      setBloodGroup(memberToEdit.blood_group || '');
      setOccupation(memberToEdit.occupation || '');
      setPhone(memberToEdit.phone || '');
      setEmail(memberToEdit.email || '');
      setAddress(memberToEdit.address || '');
      setPhotoUrl(memberToEdit.photo_url || '');
      setBio(memberToEdit.bio || '');
      setBondhonMemberId(memberToEdit.bondhon_member_id || '');
    } else {
      // Defaults for new member
      setName('');
      setNameEn('');
      setGender('male');
      setGeneration(3);
      setBranch('বড় বাড়ি');
      setCustomBranch('');
      setParentId('');
      setFatherName('');
      setMotherName('');
      setSpouseName('');
      setBirthYear('');
      setDeathYear('');
      setIsAlive(true);
      setBloodGroup('B+');
      setOccupation('');
      setPhone('');
      setEmail('');
      setAddress('মোল্লাপাড়া, রূপগঞ্জ');
      setPhotoUrl('');
      setBio('');
      setBondhonMemberId('');
    }
    setErrorMsg('');
  }, [memberToEdit, isOpen]);

  if (!isOpen) return null;

  const handleParentSelect = (pId: string) => {
    setParentId(pId);
    const parent = allMembers.find(m => m.id === pId);
    if (parent) {
      if (parent.gender === 'male') {
        setFatherName(parent.name);
      } else {
        setMotherName(parent.name);
      }
      if (parent.branch && branches.includes(parent.branch)) {
        setBranch(parent.branch);
      }
      setGeneration(parent.generation + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('সদস্যের নাম (বাংলায়) আবশ্যক');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');

    const finalBranch = branch === 'অন্যান্য' && customBranch.trim() ? customBranch.trim() : branch;

    const payload: Partial<FamilyMember> = {
      name: name.trim(),
      name_en: nameEn.trim() || undefined,
      gender,
      generation: Number(generation) || 1,
      branch: finalBranch,
      parent_id: parentId || undefined,
      father_name: fatherName.trim() || undefined,
      mother_name: motherName.trim() || undefined,
      spouse_name: spouseName.trim() || undefined,
      birth_year: birthYear.trim() || undefined,
      death_year: !isAlive ? deathYear.trim() || undefined : undefined,
      is_alive: isAlive,
      blood_group: bloodGroup || undefined,
      occupation: occupation.trim() || undefined,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      address: address.trim() || undefined,
      photo_url: photoUrl.trim() || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      bio: bio.trim() || undefined,
      bondhon_member_id: bondhonMemberId.trim() || undefined,
    };

    try {
      if (memberToEdit?.id) {
        const updated = await updateFamilyMember(memberToEdit.id, payload);
        onSaved({ ...memberToEdit, ...updated });
      } else {
        const created = await addFamilyMember(payload);
        onSaved(created as FamilyMember);
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Firebase এ ডাটা সংরক্ষণ ব্যর্থ হয়েছে');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto animate-fadeIn font-sans">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <i className="fa-solid fa-users text-lg"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {memberToEdit ? 'পারিবারিক সদস্য তথ্য সম্পাদনা' : 'নতুন পারিবারিক সদস্য যুক্ত করুন'}
              </h3>
              <p className="text-xs text-slate-400">মোল্লা বংশলতিকা ও ফ্যামিলি ট্রি রেকর্ড (Firebase Firestore)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <i className="fa-solid fa-circle-exclamation text-red-400"></i>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                পূর্ণ নাম (বাংলায়) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: আলহাজ্ব শামসুল হক মোল্লা"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ইংরেজি নাম (Name in English)
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Alhaj Shamsul Haque Molla"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Gender & Alive Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">লিঙ্গ (Gender)</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="male">পুরুষ (Male)</option>
                <option value="female">মহিলা (Female)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">প্রজন্ম (Generation)</label>
              <select
                value={generation}
                onChange={(e) => setGeneration(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value={1}>১ম প্রজন্ম (আদি পুরুষ / Patriarch)</option>
                <option value={2}>২য় প্রজন্ম (সন্তান সন্ততি)</option>
                <option value={3}>৩য় প্রজন্ম (নাতি-নাতনি / বর্তমান নেতৃত্ব)</option>
                <option value={4}>৪র্থ প্রজন্ম (পরবর্তী প্রজন্ম / তরুণ)</option>
                <option value={5}>৫ম প্রজন্ম (শিশু)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">জীবিত / প্রয়াত</label>
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setIsAlive(true)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    isAlive ? 'bg-emerald-600 text-white shadow' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <i className="fa-solid fa-heart-pulse"></i>
                  <span>জীবিত</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAlive(false)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    !isAlive ? 'bg-slate-700 text-amber-300 shadow' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <i className="fa-solid fa-dove"></i>
                  <span>মরহুম/প্রয়াত</span>
                </button>
              </div>
            </div>
          </div>

          {/* Branch & Lineage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">পারিবারিক শাখা (Branch)</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
              >
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              {branch === 'অন্যান্য' && (
                <input
                  type="text"
                  value={customBranch}
                  onChange={(e) => setCustomBranch(e.target.value)}
                  placeholder="শাখার নাম লিখুন..."
                  className="mt-2 w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                পিতা / অভিভাবক নির্বাচন (বংশলতিকা লিংক)
              </label>
              <select
                value={parentId}
                onChange={(e) => handleParentSelect(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">-- মূল পূর্বপুরুষ (কোনো পিতা নেই) --</option>
                {allMembers
                  .filter((m) => m.id !== memberToEdit?.id)
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      [{m.generation}ম প্রজন্ম] {m.name} ({m.branch})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Parents & Spouse */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">পিতার নাম</label>
              <input
                type="text"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                placeholder="মরহুম রহিম মোল্লা"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">মাতার নাম</label>
              <input
                type="text"
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
                placeholder="রাবেয়া খাতুন"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">স্বামী / স্ত্রীর নাম</label>
              <input
                type="text"
                value={spouseName}
                onChange={(e) => setSpouseName(e.target.value)}
                placeholder="নূরজাহান বেগম"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Birth & Death Years */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">জন্ম সাল / তারিখ</label>
              <input
                type="text"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                placeholder="যেমন: ১৯৪৭ বা 1947"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
            {!isAlive && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">মৃত্যু সাল</label>
                <input
                  type="text"
                  value={deathYear}
                  onChange={(e) => setDeathYear(e.target.value)}
                  placeholder="যেমন: ১৯৯৮ বা 1998"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">রক্তের গ্রুপ</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-blue-500 focus:outline-none"
              >
                <option value="">অজানা</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          {/* Contact & Occupation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">পেশা / কর্মক্ষেত্র</label>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="যেমন: প্রকৌশলী / ব্যবসায়ী / শিক্ষার্থী"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">মোবাইল ফোন</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1712-XXXXXX"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">বন্ধন আইডি (যদি থাকে)</label>
              <input
                type="text"
                value={bondhonMemberId}
                onChange={(e) => setBondhonMemberId(e.target.value)}
                placeholder="BOB-001"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Photo URL & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">ছবির লিংক (Photo URL)</label>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">বর্তমান ঠিকানা</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="মোল্লাপাড়া, রূপগঞ্জ, নারায়ণগঞ্জ"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">সংক্ষিপ্ত পরিচিতি / অবদান (Bio)</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="পারিবারিক স্মৃতি, সমাজসেবা বা ভূমিকা..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
            ></textarea>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i>
                  <span>সংরক্ষণ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                  <span>Firebase এ সংরক্ষণ করুন</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
