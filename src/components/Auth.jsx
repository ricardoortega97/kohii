import React, { useState } from "react";
import { supabase } from "../client/supabaseClient";

const Auth = ({ onClose }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [isSignUp, setIsSignUp] = useState(true);

    const handleSignUp = async (event) => {
        event.preventDefault();
        setError(""); // Clear previous error
        const { data: { user }, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                }
            }
        });

        if (error) {
            setError(error.message);
        } else {
            console.log("Supabase user:", user); // Log user data
            if (user && user.id) {  // Check if user and user.id are defined
                const { error: insertError } = await supabase
                    .from("users")
                    .insert({
                        id: user.id,
                        email: user.email,
                        username,
                    });

                if (insertError) {
                    console.error("Insert error:", insertError); // Log any insert error
                    setError(insertError.message);
                } else {
                    console.log("User signed up and inserted:", user);
                    onClose(); // Close modal after successful sign-up
                }
            } else {
                setError("Failed to create user. Please try again.");
            }
        }
    };

    const handleSignIn = async (event) => {
        event.preventDefault();
        const { data: { user }, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            setError(error.message);
        } else {
            console.log("User signed in:", user);
            onClose();
        }
    }

    const toggleForm = () => {
        setIsSignUp((prev) => !prev);
    }

    return (
        <div className="auth-container">
            <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
            <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
                {isSignUp && (
                    <div>
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            placeholder="Username"
                            required
                        />
                    </div>
                )}
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Email"
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Password"
                        required
                    />
                </div>
                <div className="buttons">
                    <button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</button>
                    <button type="button" onClick={toggleForm}>
                        {isSignUp ? "Sign In" : "Sign Up"}
                    </button>
                    {error && <p>{error}</p>}
                    <button onClick={onClose}>Close</button>
                </div>
            </form>
        </div>
    )
}

export default Auth;