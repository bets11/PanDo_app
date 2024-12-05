import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../lib/supabase';

export const uploadImage = async (uri, userId) => {
  try {
    console.log('Starting image upload...', uri);

    // Verify the file exists
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      throw new Error('File does not exist');
    }

    // Resize and compress the image
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1024 } }], // Resize to reduce file size
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );

    console.log('Manipulated Image:', manipulatedImage);

    // Prepare file for upload
    const fileName = `${userId}-${Date.now()}.jpg`;
    const formData = new FormData();

    formData.append('file', {
      uri: manipulatedImage.uri,
      name: fileName,
      type: 'image/jpeg',
    });

    console.log('Uploading file using FormData:', fileName);

    // Upload using Supabase storage
    const { data, error } = await supabase.storage
      .from('medicines')
      .upload(fileName, formData, {
        contentType: 'image/jpeg',
      });

    if (error) {
      console.error('Upload error:', error.message);
      throw error;
    }

    console.log('Upload successful:', data);

    // Get public URL
    const { data: publicUrl, error: publicUrlError } = supabase.storage
      .from('medicines')
      .getPublicUrl(fileName);

    if (publicUrlError) {
      console.error('Error getting public URL:', publicUrlError.message);
      throw publicUrlError;
    }

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error.message);
    throw error;
  }
};


export const deleteMedicine = async (imageUrl, medicineId) => {
  try {
    if (imageUrl) {
      const fileNameMatch = imageUrl.match(/medicines\/(.+)$/);
      if (!fileNameMatch || !fileNameMatch[1]) {
        throw new Error('Invalid image URL format');
      }
      const fileName = fileNameMatch[1];

      const { error: storageError } = await supabase.storage
        .from('medicines')
        .remove([fileName]);

      if (storageError) {
        console.error('Error deleting image:', storageError.message);
        throw storageError;
      }
    }

    return true;
  } catch (error) {
    console.error('Error in deleteMedicine:', error.message);
    throw error;
  }
};