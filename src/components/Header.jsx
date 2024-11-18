import '../styles/Header.css';
import AuthModal from './AuthModal';
import React, { useEffect, useState } from 'react';
import Auth from './Auth';
import { supabase } from '../client/supabaseClient';

const Header = ({allPosts, setFilteredResults }) => {
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        };
        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
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

    const handleSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearchInput(searchTerm);
        console.log("Search term:", searchTerm);

        const filtered = allPosts.filter((post) => 
            post.title.toLowerCase().includes(searchTerm)
        );
        console.log("Filtered results:", filtered);
        setFilteredResults(filtered);
    };

    return (
        <div className="header">
            <div className="inner-header">
                {/* cspell: disable-next-line */}
                <h2>Kohii</h2>
                <div className="search-container">
                    <input type="text"
                    placeholder="Search..." 
                    value={searchInput}
                    onChange={handleSearch} 
                    />
                </div>
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