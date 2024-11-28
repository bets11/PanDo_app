import { supabase } from '../lib/supabase';

/**
 * @param {string} uri 
 * @param {string} userId 
 * @returns {Promise<string>} 
 */
export async function uploadImage(uri, userId) {
  try {
    const fileName = `${userId}/${Date.now()}.jpg`; 
    const response = await fetch(uri);
    const blob = await response.blob();

    const { data, error } = await supabase.storage
      .from('medicines') 
      .upload(fileName, blob, {
        contentType: 'image/jpeg',
      });

    if (error) {
      console.error('Error uploading image:', error.message);
      throw new Error(error.message);
    }

    const { publicURL, error: publicError } = supabase.storage
      .from('medicines')
      .getPublicUrl(fileName);

    if (publicError) {
      console.error('Error fetching public URL:', publicError.message);
      throw new Error(publicError.message);
    }

    return publicURL;
  } catch (error) {
    console.error('Upload failed:', error.message);
    throw error;
  }
}

export async function deleteImage(filePath) {
    const { error } = await supabase.storage
      .from('medicines')
      .remove([filePath]);
  
    if (error) {
      console.error('Error deleting image:', error.message);
      throw new Error(error.message);
    }
}
  

export async function listImages(userId) {
    const { data, error } = await supabase.storage
      .from('medicines')
      .list(userId);
  
    if (error) {
      console.error('Error listing images:', error.message);
      throw new Error(error.message);
    }
  
    return data;
}
  
