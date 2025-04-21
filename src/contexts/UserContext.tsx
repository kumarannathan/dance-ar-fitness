import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface UserContextType {
  user: User | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log('Auth state changed - user signed in:', user.email);
        // Check if user document exists in Firestore
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        console.log('Checking user document:', {
          exists: userDoc.exists(),
          userId: user.uid,
          userEmail: user.email
        });

        // If user document doesn't exist, create it with initial data
        if (!userDoc.exists()) {
          console.log('Creating new user document');
          await setDoc(userRef, {
            email: user.email?.toLowerCase(),
            friends: [],
            createdAt: new Date(),
          });
          console.log('User document created successfully');
        }
      } else {
        console.log('Auth state changed - user signed out');
      }
      setUser(user);
      setLoading(false);
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext; 