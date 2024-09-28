import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

const stats = [
  { id: 1, name: 'Total Events', value: 12, description: 'All events created by you.' },
  { id: 2, name: 'Upcoming Events', value: 5, description: 'Events happening in the future.' },
  { id: 3, name: 'Attendees', value: 150, description: 'Total number of attendees across all events.' },
  { id: 4, name: 'Past Events', value: 7, description: 'Events that have already occurred.' },
  { id: 5, name: 'Revenue', value: '$12,000', description: 'Total revenue generated from ticket sales.' },
];

const eventData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      label: 'Events',
      data: [2, 3, 4, 5, 6, 7],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    },
  ],
};

const attendeeData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      label: 'Attendees',
      data: [20, 30, 40, 50, 60, 70],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
    },
  ],
};

const DashboardHome = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.id} className="p-4 bg-white shadow rounded text-center">
            <h2 className="text-xl font-bold text-gray-900">{stat.value}</h2>
            <p className="text-md text-gray-600 mt-1">{stat.name}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Events Over Time</h2>
          <div className="h-64">
            <Bar data={eventData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Attendees Over Time</h2>
          <div className="h-64">
            <Line data={attendeeData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;