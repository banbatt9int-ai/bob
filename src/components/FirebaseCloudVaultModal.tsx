import React, { useState, useEffect } from 'react';
import { uploadToStorage, listStorageFiles, deleteFromStorage, type StorageFileItem } from '../services/cloudStorage';

interface FirebaseCloudVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

export const FirebaseCloudVaultModal: React.FC<FirebaseCloudVaultModalProps> = ({
  isOpen,
  onClose,
  isAdmin = false,
}) => {
  const [files, setFiles] = useState<StorageFileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<'voucher' | 'nid' | 'statement' | 'land' | 'general'>('general');
  const [uploadMsg, setUploadMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const data = await listStorageFiles(selectedCategory === 'all' ? undefined : selectedCategory);
      setFiles(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFiles();
    }
  }, [isOpen, selectedCategory]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadMsg(null);
    try {
      const res = await uploadToStorage(file, uploadCategory);
      if (res.success) {
        setUploadMsg({ type: 'success', text: `"${file.name}" সফলভাবে Firebase ক্লাউড ভল্টে সংরক্ষিত হয়েছে!` });
        await fetchFiles();
      } else {
        setUploadMsg({ type: 'error', text: 'ক্লাউড আপলোড ব্যর্থ হয়েছে' });
      }
    } catch (err: any) {
      setUploadMsg({ type: 'error', text: err.message || 'আপলোড ব্যর্থ হয়েছে' });
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteFile = async (fileId: string, fileName: string) => {
    if (!window.confirm(`আপনি কি নিশ্চিত "${fileName}" ফাইলটি ক্লাউড ভল্ট থেকে মুছে ফেলতে চান?`)) {
      return;
    }
    const ok = await deleteFromStorage(fileId);
    if (ok) {
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    }
  };

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn font-bengali">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <i className="fa-solid fa-cloud text-lg"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Firebase ক্লাউড ভল্ট ও প্রজেক্ট আর্কাইভ
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Firebase Storage
                </span>
              </div>
              <p className="text-xs text-slate-400">
                জমির দলিল, ডিজিটাল রসিদ, জাতীয় পরিচয়পত্র ও অফিসিয়াল ডকুমেন্টস
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Toolbar & Filter */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'সকল ফাইল', icon: 'fa-solid fa-folder-open' },
                { id: 'land', label: 'জমির দলিল ও নকশা', icon: 'fa-solid fa-map-location-dot' },
                { id: 'voucher', label: 'পেমেন্ট ভাউচার', icon: 'fa-solid fa-receipt' },
                { id: 'statement', label: 'হিসাব বিবরণী', icon: 'fa-solid fa-file-invoice' },
                { id: 'nid', label: 'সদস্য NID', icon: 'fa-solid fa-id-card' },
                { id: 'general', label: 'সাধারণ ডকুমেন্টস', icon: 'fa-solid fa-file' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                    selectedCategory === cat.id
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                  }`}
                >
                  <i className={`${cat.icon} text-[10px]`}></i>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input
                type="text"
                placeholder="ফাইল খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-48 pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Upload Area for Admin */}
          {isAdmin && (
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <i className="fa-solid fa-cloud-arrow-up text-amber-400"></i>
                <span>নতুন ফাইল আপলোড:</span>
              </span>

              <select
                value={uploadCategory}
                onChange={(e: any) => setUploadCategory(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white"
              >
                <option value="general">সাধারণ ডকুমেন্টস</option>
                <option value="land">জমির দলিল / নকশা</option>
                <option value="voucher">পেমেন্ট ভাউচার</option>
                <option value="statement">হিসাব বিবরণী</option>
                <option value="nid">সদস্য NID</option>
              </select>

              <label className="cursor-pointer px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-600/30 transition">
                <i className="fa-solid fa-plus text-xs"></i>
                <span>{isUploading ? 'আপলোড হচ্ছে...' : 'ফাইল নির্বাচন করুন'}</span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>

              {uploadMsg && (
                <span
                  className={`text-xs px-2.5 py-1 rounded-lg ${
                    uploadMsg.type === 'success'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}
                >
                  {uploadMsg.text}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="text-center py-16 text-slate-400">
              <i className="fa-solid fa-spinner animate-spin text-2xl mb-2 text-amber-400"></i>
              <p className="text-xs">ক্লাউড ফাইল তালিকা লোড হচ্ছে...</p>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <i className="fa-solid fa-folder-open text-3xl mb-2 text-slate-600"></i>
              <p className="text-sm">এই ক্যাটাগরিতে কোনো ফাইল নেই</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 flex flex-col justify-between space-y-3 transition group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shrink-0">
                      <i
                        className={
                          file.mimeType.includes('pdf')
                            ? 'fa-solid fa-file-pdf text-red-400'
                            : file.mimeType.includes('image')
                            ? 'fa-solid fa-file-image text-emerald-400'
                            : 'fa-solid fa-file text-blue-400'
                        }
                      ></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate" title={file.name}>
                        {file.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-num mt-0.5">
                        {Math.round(file.size / 1024)} KB •{' '}
                        {new Date(file.uploadedAt).toLocaleDateString('bn-BD')}
                      </p>
                      {file.category && (
                        <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] font-semibold bg-slate-800 text-slate-300">
                          {file.category}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white flex items-center gap-1.5 transition text-[11px]"
                    >
                      <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                      <span>দেখুন / ওপেন</span>
                    </a>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={file.url}
                        download={file.name}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition"
                        title="ডাউনলোড"
                      >
                        <i className="fa-solid fa-download"></i>
                      </a>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteFile(file.id, file.name)}
                          className="cursor-pointer p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
                          title="মুছে ফেলুন"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-shield-check text-emerald-400"></i>
            <span>Firebase Cloud Storage সুরক্ষিত ও নিরাপদ</span>
          </div>
          <button
            onClick={fetchFiles}
            className="cursor-pointer hover:text-white flex items-center gap-1.5 transition"
          >
            <i className="fa-solid fa-arrows-rotate"></i>
            <span>রিফ্রেশ তালিকা</span>
          </button>
        </div>
      </div>
    </div>
  );
};
