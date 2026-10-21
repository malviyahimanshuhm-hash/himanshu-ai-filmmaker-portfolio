/**
 * Cloudinary upload integration.
 *
 * In production, uploads should be authorized via a Supabase Edge Function
 * that signs the upload using the Cloudinary API secret (server-side only).
 * This client module only handles the UI flow and calls the Edge Function.
 *
 * NEVER store Cloudinary API secret in client code.
 */

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  resource_type: 'image' | 'video';
}

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

export const getCloudinaryConfig = (): CloudinaryConfig | null => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || cloudName === 'your-cloud-name' || !uploadPreset || uploadPreset === 'your-upload-preset') {
    return null;
  }

  return { cloudName, uploadPreset };
};

export const isCloudinaryConfigured = (): boolean => {
  return getCloudinaryConfig() !== null;
};

/**
 * Upload a file to Cloudinary using the unsigned upload preset.
 * For production, prefer going through a Supabase Edge Function for auth.
 */
export const uploadToCloudinary = async (
  file: File,
  resourceType: 'image' | 'video' = 'image'
): Promise<CloudinaryUploadResult> => {
  const config = getCloudinaryConfig();

  if (!config) {
    throw new Error(
      'Cloudinary not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', config.uploadPreset);

  const endpoint = `https://api.cloudinary.com/v1_1/${config.cloudName}/${resourceType}/upload`;

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `Upload failed: ${response.status}`);
  }

  return response.json();
};

/**
 * Upload via Supabase Edge Function (recommended for production).
 * The Edge Function handles signing and authorization server-side.
 */
export const uploadViaEdgeFunction = async (
  file: File,
  resourceType: 'image' | 'video' = 'image',
  folder?: string
): Promise<CloudinaryUploadResult> => {
  const { getSupabase } = await import('./supabase');
  const supabase = getSupabase();

  // Get current session for auth
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated. Please log in first.');
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const functionUrl = `${supabaseUrl}/functions/v1/cloudinary-upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('resourceType', resourceType);
  if (folder) formData.append('folder', folder);

  const response = await fetch(functionUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Upload failed: ${response.status}`);
  }

  return response.json();
};