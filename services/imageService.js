import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../lib/supabase';

export const uploadImage = async (uri, userId) => {
  try {
    console.log('Starting image upload...', uri);

    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      throw new Error('File does not exist');
    }

    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1024 } }], 
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );

    console.log('Manipulated Image:', manipulatedImage);

    const fileName = `${userId}-${Date.now()}.jpg`;
    const formData = new FormData();

    formData.append('file', {
      uri: manipulatedImage.uri,
      name: fileName,
      type: 'image/jpeg',
    });

    console.log('Uploading file using FormData:', fileName);

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

    const { data: publicUrl, error: publicUrlError } = supabase.storage
      .from('medicines')
      .getPublicUrl(fileName);

    if (publicUrlError) {
      console.error('Error getting public URL:', publicUrlError.message);
      throw publicUrlError;
    }

    console.log('Public URL:', publicUrl);
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

    const { data, error } = await supabase
      .from('medications')
      .delete()
      .eq('id', medicineId);

    if (error) {
      console.error('Error deleting medicine:', error.message);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteMedicine:', error.message);
    throw error;
  }
};
