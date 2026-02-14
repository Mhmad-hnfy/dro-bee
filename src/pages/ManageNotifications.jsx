import React from 'react';
import { useShop } from '../context/ShopContext';

function ManageNotifications() {
    // In a real app, this would be a separate list of events. 
    // Here we can generate some notifications based on recent activity.
    const { orders, users } = useShop();

    const notifications = [
        ...orders.map(o => ({
            id: 'ord' + o.id,
            type: 'Order',
            message: `New Order #${o.id} placed by ${o.details.name}`,
            date: o.date,
            read: false
        })),
        ...users.map(u => ({
            id: 'usr' + u.id,
            type: 'User',
            message: `New User Registered: ${u.name}`,
            date: new Date(u.id).toISOString(),
            read: true
        })),
        {
            id: 'sys_welcome',
            type: 'System',
            message: "Welcome to your new E-commerce Dashboard! Events will appear here.",
            date: new Date().toISOString(),
            read: true
        }
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Notifications</h2>
            <div className="bg-white rounded shadow divide-y">
                {notifications.map((note) => (
                    <div key={note.id} className={`p-4 ${!note.read ? 'bg-blue-50' : ''}`}>
                        <div className="flex justify-between">
                            <h4 className="font-semibold text-gray-800">{note.type} Alert</h4>
                            <span className="text-xs text-gray-500">{new Date(note.date).toLocaleString()}</span>
                        </div>
                        <p className="text-gray-600">{note.message}</p>
                    </div>
                ))}
                {notifications.length === 0 && (
                    <div className="p-4 text-center text-gray-500">No notifications</div>
                )}
            </div>
        </div>
    );
}

export default ManageNotifications;
