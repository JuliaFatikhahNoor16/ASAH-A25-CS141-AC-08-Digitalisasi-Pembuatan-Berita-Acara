/**
 * Approvals API
 * Mock API untuk approval/verifikasi dokumen
 * TODO: Replace dengan actual API calls ke backend PHP
 */

class ApprovalsAPI {
    constructor() {
        this.baseURL = '/api/approvals';
        this.mockApprovals = this.initializeMockData();
    }

    /**
     * Initialize mock approvals data
     */
    initializeMockData() {
        return [
            {
                id: 'approval_001',
                documentId: 'doc_001',
                documentNo: 'BAPB-2024-001',
                documentType: 'BAPB',
                approverId: 'pic_001',
                approverName: 'Ahmad Wirawan',
                approverRole: 'pic',
                status: 'pending',
                comments: null,
                approvedAt: null,
                createdAt: '2024-03-15T08:30:00'
            },
            {
                id: 'approval_002',
                documentId: 'doc_002',
                documentNo: 'BAPP-2024-002',
                documentType: 'BAPP',
                approverId: 'direksi_001',
                approverName: 'Ir. Budi Santoso',
                approverRole: 'direksi',
                status: 'pending',
                comments: null,
                approvedAt: null,
                createdAt: '2024-03-14T10:15:00'
            },
            {
                id: 'approval_003',
                documentId: 'doc_003',
                documentNo: 'BAPB-2024-003',
                documentType: 'BAPB',
                approverId: 'pic_001',
                approverName: 'Ahmad Wirawan',
                approverRole: 'pic',
                status: 'approved',
                comments: 'Dokumen telah sesuai dan disetujui',
                approvedAt: '2024-03-14T16:00:00',
                createdAt: '2024-03-13T09:00:00'
            },
            {
                id: 'approval_004',
                documentId: 'doc_004',
                documentNo: 'BAPB-2024-004',
                documentType: 'BAPB',
                approverId: 'pic_001',
                approverName: 'Ahmad Wirawan',
                approverRole: 'pic',
                status: 'rejected',
                comments: 'Jumlah barang tidak sesuai dengan PO. Harap perbaiki data.',
                approvedAt: '2024-03-13T15:30:00',
                createdAt: '2024-03-12T11:00:00'
            }
        ];
    }

    /**
     * Get pending approvals for a specific approver
     */
    async getPendingApprovals(approverId) {
        try {
            await this.simulateNetworkDelay();

            const pendingApprovals = this.mockApprovals.filter(
                approval => approval.approverId === approverId && approval.status === 'pending'
            );

            // Sort by creation date (oldest first - FIFO)
            pendingApprovals.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

            return {
                success: true,
                data: pendingApprovals,
                count: pendingApprovals.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get all approvals for a specific approver
     */
    async getApprovals(approverId, filters = {}) {
        try {
            await this.simulateNetworkDelay();

            let approvals = this.mockApprovals.filter(
                approval => approval.approverId === approverId
            );

            // Apply filters
            if (filters.status) {
                approvals = approvals.filter(a => a.status === filters.status);
            }

            if (filters.documentType) {
                approvals = approvals.filter(a => a.documentType === filters.documentType);
            }

            // Sort by date
            approvals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            return {
                success: true,
                data: approvals,
                count: approvals.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Approve document
     */
    async approveDocument(approvalId, approverId, comments = '') {
        try {
            await this.simulateNetworkDelay();

            const approvalIndex = this.mockApprovals.findIndex(a => a.id === approvalId);

            if (approvalIndex === -1) {
                throw new Error('Approval tidak ditemukan');
            }

            const approval = this.mockApprovals[approvalIndex];

            // Verify approver
            if (approval.approverId !== approverId) {
                throw new Error('Anda tidak memiliki akses untuk menyetujui dokumen ini');
            }

            if (approval.status !== 'pending') {
                throw new Error('Dokumen sudah diproses sebelumnya');
            }

            // Update approval
            this.mockApprovals[approvalIndex] = {
                ...approval,
                status: 'approved',
                comments: comments || 'Dokumen disetujui',
                approvedAt: new Date().toISOString()
            };

            // Trigger notification to vendor
            this.notifyVendor(approval.documentId, 'approved', comments);

            return {
                success: true,
                data: this.mockApprovals[approvalIndex],
                message: 'Dokumen berhasil disetujui'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Reject document
     */
    async rejectDocument(approvalId, approverId, reason) {
        try {
            await this.simulateNetworkDelay();

            if (!reason || reason.trim().length === 0) {
                throw new Error('Alasan penolakan harus diisi');
            }

            const approvalIndex = this.mockApprovals.findIndex(a => a.id === approvalId);

            if (approvalIndex === -1) {
                throw new Error('Approval tidak ditemukan');
            }

            const approval = this.mockApprovals[approvalIndex];

            // Verify approver
            if (approval.approverId !== approverId) {
                throw new Error('Anda tidak memiliki akses untuk menolak dokumen ini');
            }

            if (approval.status !== 'pending') {
                throw new Error('Dokumen sudah diproses sebelumnya');
            }

            // Update approval
            this.mockApprovals[approvalIndex] = {
                ...approval,
                status: 'rejected',
                comments: reason,
                approvedAt: new Date().toISOString()
            };

            // Trigger notification to vendor
            this.notifyVendor(approval.documentId, 'rejected', reason);

            return {
                success: true,
                data: this.mockApprovals[approvalIndex],
                message: 'Dokumen berhasil ditolak'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Request revision
     */
    async requestRevision(approvalId, approverId, revisionNotes) {
        try {
            await this.simulateNetworkDelay();

            if (!revisionNotes || revisionNotes.trim().length === 0) {
                throw new Error('Catatan revisi harus diisi');
            }

            const approvalIndex = this.mockApprovals.findIndex(a => a.id === approvalId);

            if (approvalIndex === -1) {
                throw new Error('Approval tidak ditemukan');
            }

            const approval = this.mockApprovals[approvalIndex];

            if (approval.approverId !== approverId) {
                throw new Error('Anda tidak memiliki akses untuk meminta revisi dokumen ini');
            }

            if (approval.status !== 'pending') {
                throw new Error('Dokumen sudah diproses sebelumnya');
            }

            // Update approval - set back to revision status
            this.mockApprovals[approvalIndex] = {
                ...approval,
                status: 'revision_requested',
                comments: revisionNotes,
                approvedAt: new Date().toISOString()
            };

            // Trigger notification to vendor
            this.notifyVendor(approval.documentId, 'revision_requested', revisionNotes);

            return {
                success: true,
                data: this.mockApprovals[approvalIndex],
                message: 'Permintaan revisi berhasil dikirim'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get approval statistics
     */
    async getApprovalStatistics(approverId) {
        try {
            await this.simulateNetworkDelay(200);

            const approvals = this.mockApprovals.filter(a => a.approverId === approverId);

            const stats = {
                total: approvals.length,
                pending: approvals.filter(a => a.status === 'pending').length,
                approved: approvals.filter(a => a.status === 'approved').length,
                rejected: approvals.filter(a => a.status === 'rejected').length,
                revisionRequested: approvals.filter(a => a.status === 'revision_requested').length
            };

            return {
                success: true,
                data: stats
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Notify vendor about approval status
     */
    notifyVendor(documentId, status, message) {
        // In real app, this would call NotificationsAPI or send email
        const event = new CustomEvent('approvalStatusChanged', {
            detail: { documentId, status, message }
        });
        window.dispatchEvent(event);
    }

    /**
     * Simulate network delay
     */
    simulateNetworkDelay(ms = 500) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Create singleton instance
const approvalsAPI = new ApprovalsAPI();

// Export both class and instance
export { ApprovalsAPI };
export default approvalsAPI;