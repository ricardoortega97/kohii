import '../styles/Header.css';
import AuthModal from './AuthModal';
import React, { useEffect, useState } from 'react';
import Auth from './Auth';
import { supabase } from '../client/supabaseClient';

const Header = () => {
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        };
        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            subscription?.unsubscribe();

        };
    }, []);   

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        console.log("User signed out");
        setUser(null); // Clear user state after sign out
    };

    return (
        <div className="header">
            <div className="inner-header">
                <h2>Kohii</h2>
                <div className="header-options">
                    {user ? (
                        <button onClick={handleSignOut}>Sign Out</button>
                    ) : (
                        <button onClick={handleOpenModal}>Sign In</button>
                    )}
                    <AuthModal isOpen={isModalOpen} onClose={handleCloseModal}>
                        <Auth onClose={handleCloseModal} />
                    </AuthModal>
                </div>
            </div>
        </div>
    );
}

export default Header;