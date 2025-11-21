/**
 * Notifications API
 * Mock API untuk mengelola notifikasi
 * TODO: Replace dengan actual API calls ke backend PHP
 */

class NotificationsAPI {
    constructor() {
        this.baseURL = '/api/notifications';
        this.mockNotifications = this.initializeMockData();
    }

    /**
     * Initialize mock notifications
     */
    initializeMockData() {
        return [
            {
                id: 'notif_001',
                userId: 'vendor_001',
                type: 'document_approved',
                title: 'Dokumen Disetujui',
                message: 'BAPB-2024-005 telah disetujui oleh PIC Gudang',
                documentId: 'doc_005',
                documentNo: 'BAPB-2024-005',
                isRead: false,
                createdAt: '2024-03-15T14:30:00',
                link: '/document/doc_005'
            },
            {
                id: 'notif_002',
                userId: 'vendor_001',
                type: 'document_rejected',
                title: 'Dokumen Ditolak',
                message: 'BAPP-2024-003 ditolak. Alasan: Data pekerjaan tidak lengkap',
                documentId: 'doc_003',
                documentNo: 'BAPP-2024-003',
                isRead: false,
                createdAt: '2024-03-15T10:15:00',
                link: '/document/doc_003'
            },
            {
                id: 'notif_003',
                userId: 'vendor_001',
                type: 'reminder',
                title: 'Pengingat Dokumen',
                message: 'Anda memiliki 2 dokumen draft yang belum disubmit',
                documentId: null,
                documentNo: null,
                isRead: true,
                createdAt: '2024-03-14T09:00:00',
                link: '/documents?status=draft'
            },
            {
                id: 'notif_004',
                userId: 'pic_001',
                type: 'new_document',
                title: 'Dokumen Baru',
                message: 'BAPB-2024-006 dari PT. Indo Supplies membutuhkan verifikasi',
                documentId: 'doc_006',
                documentNo: 'BAPB-2024-006',
                isRead: false,
                createdAt: '2024-03-15T16:00:00',
                link: '/verify/doc_006'
            },
            {
                id: 'notif_005',
                userId: 'pic_001',
                type: 'new_document',
                title: 'Dokumen Baru',
                message: 'BAPB-2024-007 dari PT. Vendor Sukses membutuhkan verifikasi',
                documentId: 'doc_007',
                documentNo: 'BAPB-2024-007',
                isRead: false,
                createdAt: '2024-03-15T11:30:00',
                link: '/verify/doc_007'
            },
            {
                id: 'notif_006',
                userId: 'direksi_001',
                type: 'signature_required',
                title: 'TTD Digital Diperlukan',
                message: 'BAPP-2024-008 memerlukan tanda tangan digital Anda',
                documentId: 'doc_008',
                documentNo: 'BAPP-2024-008',
                isRead: false,
                createdAt: '2024-03-15T15:45:00',
                link: '/sign/doc_008'
            }
        ];
    }

    /**
     * Get all notifications for a user
     */
    async getNotifications(userId, filters = {}) {
        try {
            await this.simulateNetworkDelay();

            let notifications = this.mockNotifications.filter(n => n.userId === userId);

            // Apply filters
            if (filters.isRead !== undefined) {
                notifications = notifications.filter(n => n.isRead === filters.isRead);
            }

            if (filters.type) {
                notifications = notifications.filter(n => n.type === filters.type);
            }

            // Sort by date (newest first)
            notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            return {
                success: true,
                data: notifications,
                count: notifications.length,
                unreadCount: notifications.filter(n => !n.isRead).length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get unread notifications count
     */
    async getUnreadCount(userId) {
        try {
            await this.simulateNetworkDelay(200);

            const unreadCount = this.mockNotifications.filter(
                n => n.userId === userId && !n.isRead
            ).length;

            return {
                success: true,
                data: { count: unreadCount }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Mark notification as read
     */
    async markAsRead(notificationId) {
        try {
            await this.simulateNetworkDelay(200);

            const notifIndex = this.mockNotifications.findIndex(n => n.id === notificationId);

            if (notifIndex === -1) {
                throw new Error('Notifikasi tidak ditemukan');
            }

            this.mockNotifications[notifIndex].isRead = true;

            return {
                success: true,
                data: this.mockNotifications[notifIndex],
                message: 'Notifikasi ditandai telah dibaca'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(userId) {
        try {
            await this.simulateNetworkDelay();

            this.mockNotifications = this.mockNotifications.map(notif => {
                if (notif.userId === userId) {
                    return { ...notif, isRead: true };
                }
                return notif;
            });

            return {
                success: true,
                message: 'Semua notifikasi ditandai telah dibaca'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Delete notification
     */
    async deleteNotification(notificationId) {
        try {
            await this.simulateNetworkDelay(200);

            const notifIndex = this.mockNotifications.findIndex(n => n.id === notificationId);

            if (notifIndex === -1) {
                throw new Error('Notifikasi tidak ditemukan');
            }

            this.mockNotifications.splice(notifIndex, 1);

            return {
                success: true,
                message: 'Notifikasi berhasil dihapus'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create new notification
     */
    async createNotification(notificationData) {
        try {
            await this.simulateNetworkDelay(200);

            const newNotification = {
                id: `notif_${Date.now()}`,
                ...notificationData,
                isRead: false,
                createdAt: new Date().toISOString()
            };

            this.mockNotifications.push(newNotification);

            // In real app, this would trigger push notification or email
            this.triggerNotificationEvent(newNotification);

            return {
                success: true,
                data: newNotification,
                message: 'Notifikasi berhasil dibuat'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Trigger notification event (for real-time updates)
     */
    triggerNotificationEvent(notification) {
        // Dispatch custom event for real-time notification
        const event = new CustomEvent('newNotification', {
            detail: notification
        });
        window.dispatchEvent(event);
    }

    /**
     * Get notification by ID
     */
    async getNotificationById(notificationId) {
        try {
            await this.simulateNetworkDelay(200);

            const notification = this.mockNotifications.find(n => n.id === notificationId);

            if (!notification) {
                throw new Error('Notifikasi tidak ditemukan');
            }

            return {
                success: true,
                data: notification
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Simulate network delay
     */
    simulateNetworkDelay(ms = 300) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Create singleton instance
const notificationsAPI = new NotificationsAPI();

// Export both class and instance
export { NotificationsAPI };
export default notificationsAPI;