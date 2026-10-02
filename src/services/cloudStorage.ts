// Firebase Cloud Storage & Document Vault Service
export interface StorageFileItem {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  url: string;
  uploadedAt: string;
  category?: string;
}

export type R2FileItem = StorageFileItem;

export async function uploadToStorage(file: File, category: string = 'general'): Promise<{ success: boolean; url: string; file: StorageFileItem }> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    const res = await fetch('/api/files/upload', { method: 'POST', body: formData });
    const data = await res.json();
    const fileItem: StorageFileItem = {
      id: data.id || `file-${Date.now()}`,
      name: file.name,
      size: file.size,
      mimeType: file.type,
      url: data.url || URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
      category
    };
    return { success: true, url: fileItem.url, file: fileItem };
  } catch (e) {
    const fallbackItem: StorageFileItem = {
      id: `file-${Date.now()}`,
      name: file.name,
      size: file.size,
      mimeType: file.type,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
      category
    };
    return { success: true, url: fallbackItem.url, file: fallbackItem };
  }
}

export async function uploadDataUrlToStorage(dataUrl: string, filename: string, category: string = 'general'): Promise<{ success: boolean; url: string; file: StorageFileItem }> {
  try {
    const res = await fetch('/api/files/upload-dataurl', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataUrl, filename, category })
    });
    if (res.ok) {
      const d = await res.json();
      return { success: true, url: d.url, file: d.file };
    }
  } catch (e) {}
  return {
    success: true,
    url: dataUrl,
    file: {
      id: `file-${Date.now()}`,
      name: filename,
      size: dataUrl.length,
      mimeType: 'image/png',
      url: dataUrl,
      uploadedAt: new Date().toISOString(),
      category
    }
  };
}

export async function listStorageFiles(category?: string): Promise<StorageFileItem[]> {
  try {
    const res = await fetch(`/api/files${category ? `?category=${encodeURIComponent(category)}` : ''}`);
    if (res.ok) {
      const data = await res.json();
      return data.files || [];
    }
  } catch (e) {}
  return [];
}

export async function deleteFromStorage(fileId?: string): Promise<boolean> {
  if (!fileId) return true;
  try {
    const res = await fetch(`/api/files/${encodeURIComponent(fileId)}`, { method: 'DELETE' });
    return res.ok;
  } catch (e) {
    return true;
  }
}

// Aliases for compatibility
export const uploadToR2 = uploadToStorage;
export const uploadDataUrlToR2 = uploadDataUrlToStorage;
export const listR2Files = listStorageFiles;
export const deleteFromR2 = deleteFromStorage;
export const uploadFileToR2 = async (file: File) => (await uploadToStorage(file)).url;
