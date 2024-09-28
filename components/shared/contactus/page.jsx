'use client';
import { useState } from "react";

export default function ContactUsForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !email || !message) {
            setError("All fields are required.");
            return;
        }

        console.log("Name:", name);
        console.log("Email:", email);
        console.log("Message:", message);

        // Add logic for sending the form data to the server here
        // Reset form after successful submission
        setSuccess(true);
        setError("");
        setName("");
        setEmail("");
        setMessage("");
    };

    return (
        <div className="max-w-lg mx-auto mt-10">
            <h1 className="text-3xl font-bold mb-5">Contact Us</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {error && <p className="text-red-500">{error}</p>}
                {success && (
                    <p className="text-green-500">Thank you for your message!</p>
                )}

                <div>
                    <label htmlFor="name" className="block text-lg mb-2">
                        Name
                    </label>
                    <input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        className="border border-gray-300 px-4 py-2 w-full"
                        type="text"
                        id="name"
                        placeholder="Your Name"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-lg mb-2">
                        Email
                    </label>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className="border border-gray-300 px-4 py-2 w-full"
                        type="email"
                        id="email"
                        placeholder="youremail@gmail.com"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block text-lg mb-2">
                        Message
                    </label>
                    <textarea
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                        className="border border-gray-300 px-4 py-2 w-full h-32"
                        id="message"
                        placeholder="Your message"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white font-bold py-2 px-4 mt-4"
                >
                    Send Message
                </button>
            </form>
        </div>
    );
}
