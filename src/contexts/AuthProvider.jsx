import React, { useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import firebase from 'firebase/compat/app';

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const createUser = (email, password) => {
        setLoading(true);
        // Logic to create a user with email and password
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // Sign in user
    const signInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
            .finally(() => setLoading(false));
    }

    // Centralized sign out
    const signOutUser = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }


    // Observe auth state changes
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
            setLoading(false);    
            console.log('Observer inside  useEffect Auth state changed:', currentUser);       
        });
        return () => unsubscribe();

    })

    const authInfo = {
        user,
        loading,
        createUser,
        signInUser,
        signOutUser,

    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;