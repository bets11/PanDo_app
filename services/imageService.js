import { supabase } from "../lib/supabase";

export const uploadImage = async (uri, userId) => {
  try {
    console.log('Starting image upload...');
    const response = await fetch(uri);
    const blob = await response.blob();
    console.log('Image blob created:', blob);

    const fileName = `${userId}-${Date.now()}.jpg`;
    console.log('Generated file name:', fileName);

    const { data, error: uploadError } = await supabase.storage
      .from('medicines')
      .upload(fileName, blob, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Error uploading to Supabase Storage:', uploadError.message);
      throw uploadError;
    }

    console.log('Upload successful. File path:', data.path);

    const { publicUrl, error: publicUrlError } = supabase.storage
      .from('medicines')
      .getPublicUrl('images/' + fileName);

    if (publicUrlError || !publicUrl) {
      console.warn('Public URL generation failed, attempting signed URL...');

      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('medicines')
        .createSignedUrl(data.path, 60 * 60);

      if (signedUrlError) {
        console.error('Error generating signed URL:', signedUrlError.message);
        throw signedUrlError;
      }

      console.log('Generated Signed URL:', signedUrlData.signedUrl);
      return signedUrlData.signedUrl;
    }

    console.log('Generated Public URL:', publicUrl);
    return publicUrl;
  } catch (err) {
    console.error('Error uploading image:', err.message);
    throw err;
  }
};

export const deleteMedicine = async (imageUrl, medicineId) => {
  try {
    // Extract filename from signed URL
    const matches = imageUrl.match(/medicines\/(.*?)\?token=/);
    if (!matches || !matches[1]) {
      throw new Error('Invalid image URL format');
    }
    const fileName = matches[1];

    // Delete image from storage
    const { error: storageError } = await supabase.storage
      .from('medicines')
      .remove([fileName]);

    if (storageError) {
      console.error('Error deleting image:', storageError.message);
      throw storageError;
    }

    // Delete medicine record from database
    const { error: dbError } = await supabase
      .from('medications')
      .delete()
      .eq('id', medicineId);

    if (dbError) {
      console.error('Error deleting medicine record:', dbError.message);
      throw dbError;
    }

    return { success: true };

  } catch (error) {
    console.error('Delete operation failed:', error.message);
    throw error;
  }
};
