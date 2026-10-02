import React from 'react';

export const FamilyHeritageSection: React.FC = () => {
  return (
    <div className="space-y-10 font-sans">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="max-w-3xl space-y-4">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 inline-block">
            গৌরবময় ঐতিহ্য ও ইতিহাস
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            মোল্লা পরিবারের শতবর্ষের স্মৃতি ও বন্ধন
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            নারায়ণগঞ্জের রূপগঞ্জে প্রতিষ্ঠিত ঐতিহ্যবাহী মোল্লা পরিবার সততা, আতিথেয়তা, শিক্ষা বিস্তার এবং সমাজকল্যাণে শতবর্ষ ধরে নিবেদিতপ্রাণ।
          </p>
        </div>
      </div>

      {/* Patriarch Tribute */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80"
            alt="মরহুম আলহাজ্ব রহিম মোল্লা"
            className="w-full h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-[11px] text-amber-300 uppercase tracking-wider font-bold">আদি পুরুষ</span>
            <h3 className="text-xl font-bold">মরহুম আলহাজ্ব রহিম মোল্লা</h3>
            <p className="text-xs text-slate-300 font-english">১৯২০ — ১৯৯৮</p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <h3 className="text-2xl font-bold text-white">প্রতিষ্ঠাতার স্বপ্ন ও দিকনির্দেশনা</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            মরহুম আলহাজ্ব রহিম মোল্লা ছিলেন একজন দূরদর্শী মানুষ। তাঁর মূল বিশ্বাস ছিল—পরিবারের সদস্যদের ঐক্যই সবথেকে বড় সম্পদ।
            তিনি সর্বদা পরিবারের সকল শাখার মধ্যে ভ্রাতৃত্ববোধ বজায় রাখা এবং সৎ উপায়ে উপার্জিত অর্থ জমি ও শিক্ষায় বিনিয়োগের শিক্ষা দিয়ে গেছেন।
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="font-bold text-emerald-400 block mb-1">শিক্ষা ও ধর্মীয় অবদান</span>
              <p className="text-slate-400">এলাকায় মাদ্রাসা, প্রাথমিক বিদ্যালয় ও মসজিদ নির্মাণে জমি দান ও আর্থিক সহায়তা।</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="font-bold text-blue-400 block mb-1">যৌথ পারিবারিক ঐতিহ্য</span>
              <p className="text-slate-400">ঈদ ও উৎসবে যৌথ মেজবানি এবং সংকটময় মুহূর্তে পারস্পরিক সহযোগিতার অটুট শপথ।</p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Family Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center text-xl">
            <i className="fa-solid fa-people-roof"></i>
          </div>
          <h3 className="text-lg font-bold text-white">১. রক্তের বন্ধন ও সংহতি</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            দেশ ও প্রবাসে ছড়িয়ে থাকা প্রতিটি প্রজন্মের সদস্যকে একটি অভিন্ন ডিজিটাল প্ল্যাটফর্মে সংযুক্ত রাখা এবং আত্মীয়তার সম্পর্ক সতেজ রাখা।
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-xl">
            <i className="fa-solid fa-coins"></i>
          </div>
          <h3 className="text-lg font-bold text-white">২. বন্ধন ও বিনিয়োগ (BoB)</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            ক্ষুদ্র ক্ষুদ্র সঞ্চয় একত্রিত করে নিরাপদ ভূমি প্রকল্প ও লাভজনক ব্যবসায় যৌথ বিনিয়োগ, যা ভবিষ্যৎ প্রজন্মের আর্থিক সচ্ছলতা নিশ্চিত করবে।
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-pink-600/20 text-pink-400 flex items-center justify-center text-xl">
            <i className="fa-solid fa-hands-holding-child"></i>
          </div>
          <h3 className="text-lg font-bold text-white">৩. ভবিষ্যৎ প্রজন্মের কল্যাণ</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            মেধাবী সন্তানদের উচ্চশিক্ষা, কর্মসংস্থান পরামর্শ ও আপদকালীন স্বাস্থ্য সহায়তা প্রদানের মাধ্যমে সমৃদ্ধ ভবিষ্যৎ নিশ্চিতকরণ।
          </p>
        </div>
      </div>
    </div>
  );
};
