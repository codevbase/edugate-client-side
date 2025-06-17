import React, { useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { useState } from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, GithubAuthProvider } from 'firebase/auth';
import { auth } from '../config/firebase';
import axios from 'axios';
// import firebase from 'firebase/compat/app';

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

     // Google sign in
      const signInWithGoogle = () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider)
          .finally(() => setLoading(false));
      };

    // Github sign in
    const signInWithGithub = () => {
        setLoading(true);
        const provider = new GithubAuthProvider();
        return signInWithPopup(auth, provider)
            .finally(() => setLoading(false));
    };

    // Observe auth state changes
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
            setLoading(false);  
            if(currentUser?.email){
                const userData = {email: currentUser.email}
                axios.post('http://localhost:3000/jwt', userData, {
                    withCredentials: true
                })
                .then(res => {
                    console.log('token after jwt',res.data)
                })
                .catch(err => console.log(err));
                
            }  
            console.log('Observer inside  useEffect Auth state changed:', currentUser);       
        });
        return () => unsubscribe();

    })

    const authInfo = {
        user,
        setUser,
        loading,
        createUser,
        signInUser,
        signOutUser,
        signInWithGoogle,
        signInWithGithub,
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;