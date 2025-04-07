import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function uploadVideo(file: File, userId: string): Promise<string> {
  try {
    // Create a unique filename using timestamp and user ID
    const timestamp = Date.now();
    const filename = `${userId}_${timestamp}_${file.name}`;
    
    // Create a reference to the file location
    const storageRef = ref(storage, `dance-videos/${filename}`);
    
    // Upload the file
    await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw new Error('Failed to upload video');
  }
} 