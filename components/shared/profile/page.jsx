"use client";
import React, { useState } from 'react';
import { Button, TextField, Typography, List, ListItem, ListItemText } from '@mui/material';

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(true); // Start in edit mode since there's no data
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [events, setEvents] = useState([]);

    const [editData, setEditData] = useState({ ...userData });

    const handleSaveClick = () => {
        setUserData(editData);
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded">
            <Typography variant="h4" component="h1" gutterBottom>
                Profile Page
            </Typography>

            <div className="mb-6">
                <Typography variant="h6" gutterBottom>
                    Personal Information
                </Typography>
                <div className="flex flex-col gap-3">
                    <TextField
                        label="Full Name"
                        name="name"
                        value={editData.name}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                    />
                    <TextField
                        label="Email"
                        name="email"
                        value={editData.email}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                    />
                    <TextField
                        label="Phone"
                        name="phone"
                        value={editData.phone}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                    />
                    <Button variant="contained" color="primary" onClick={handleSaveClick}>
                        Save Profile
                    </Button>
                </div>
            </div>

            <div>
                <Typography variant="h6" gutterBottom>
                    Registered Events
                </Typography>
                {events.length === 0 ? (
                    <Typography>No events registered yet.</Typography>
                ) : (
                    <List>
                        {events.map((event) => (
                            <ListItem key={event.id} className="border-b">
                                <ListItemText primary={event.title} secondary={`Date: ${event.date}`} />
                            </ListItem>
                        ))}
                    </List>
                )}
            </div>
        </div>
    );
}
