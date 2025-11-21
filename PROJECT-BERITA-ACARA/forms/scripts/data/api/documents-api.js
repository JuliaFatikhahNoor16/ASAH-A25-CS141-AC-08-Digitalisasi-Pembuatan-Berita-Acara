/**
 * Documents API
 * Mock API untuk mengelola dokumen Berita Acara (BAPB & BAPP)
 * TODO: Replace dengan actual API calls ke backend PHP
 */

class DocumentsAPI {
    constructor() {
        this.baseURL = '/api/documents';
        this.mockDocuments = this.initializeMockData();
    }

    /**
     * Initialize mock data untuk testing
     */
    initializeMockData() {
        return [
            {
                id: 'doc_001',
                documentNo: 'BAPB-2024-001',
                type: 'BAPB',
                contractNo: 'K-2024-001',
                vendorName: 'PT. Jaya Abadi',
                vendorId: 'vendor_001',
                picName: 'Ahmad Wirawan',
                picId: 'pic_001',
                nominal: 50000000,
                description: 'Pemeriksaan barang elektronik sesuai PO-2024-001',
                status: 'pending',
                createdAt: '2024-03-15T08:30:00',
                updatedAt: '2024-03-15T08:30:00',
                createdBy: 'vendor_001',
                approvedBy: null,
                approvedAt: null,
                rejectedReason: null,
                attachments: [],
                items: [
                    {
                        itemName: 'Laptop Dell XPS 15',
                        quantity: 10,
                        unit: 'unit',
                        condition: 'Baik'
                    },
                    {
                        itemName: 'Monitor LG 27 inch',
                        quantity: 10,
                        unit: 'unit',
                        condition: 'Baik'
                    }
                ]
            },
            {
                id: 'doc_002',
                documentNo: 'BAPP-2024-002',
                type: 'BAPP',
                contractNo: 'K-2024-002',
                vendorName: 'PT. Sukses Mandiri',
                vendorId: 'vendor_002',
                direksiName: 'Ir. Budi Santoso',
                direksiId: 'direksi_001',
                nominal: 75000000,
                description: 'Pemeriksaan pekerjaan instalasi jaringan kantor cabang',
                status: 'draft',
                createdAt: '2024-03-14T10:15:00',
                updatedAt: '2024-03-14T14:20:00',
                createdBy: 'vendor_002',
                approvedBy: null,
                approvedAt: null,
                rejectedReason: null,
                attachments: [],
                workDetails: [
                    {
                        workItem: 'Instalasi kabel UTP Cat6',
                        specification: '100 meter',
                        completionDate: '2024-03-10',
                        status: 'Selesai'
                    },
                    {
                        workItem: 'Instalasi switch 24 port',
                        specification: '2 unit',
                        completionDate: '2024-03-12',
                        status: 'Selesai'
                    }
                ]
            },
            {
                id: 'doc_003',
                documentNo: 'BAPB-2024-003',
                type: 'BAPB',
                contractNo: 'K-2024-003',
                vendorName: 'PT. Vendor Sukses',
                vendorId: 'vendor_001',
                picName: 'Ahmad Wirawan',
                picId: 'pic_001',
                nominal: 30000000,
                description: 'Pemeriksaan peralatan kantor sesuai PO-2024-003',
                status: 'approved',
                createdAt: '2024-03-13T09:00:00',
                updatedAt: '2024-03-14T16:00:00',
                createdBy: 'vendor_001',
                approvedBy: 'pic_001',
                approvedAt: '2024-03-14T16:00:00',
                rejectedReason: null,
                attachments: [],
                items: [
                    {
                        itemName: 'Kursi kantor ergonomis',
                        quantity: 20,
                        unit: 'unit',
                        condition: 'Baik'
                    }
                ]
            },
            {
                id: 'doc_004',
                documentNo: 'BAPB-2024-004',
                type: 'BAPB',
                contractNo: 'K-2024-004',
                vendorName: 'PT. Indo Supplies',
                vendorId: 'vendor_003',
                picName: 'Ahmad Wirawan',
                picId: 'pic_001',
                nominal: 15000000,
                description: 'Pemeriksaan alat tulis kantor',
                status: 'rejected',
                createdAt: '2024-03-12T11:00:00',
                updatedAt: '2024-03-13T15:30:00',
                createdBy: 'vendor_003',
                approvedBy: null,
                approvedAt: null,
                rejectedReason: 'Jumlah barang tidak sesuai dengan PO. Harap perbaiki data.',
                attachments: [],
                items: []
            },
            {
                id: 'doc_005',
                documentNo: 'BAPP-2024-005',
                type: 'BAPP',
                contractNo: 'K-2024-005',
                vendorName: 'PT. Build Construction',
                vendorId: 'vendor_004',
                direksiName: 'Ir. Budi Santoso',
                direksiId: 'direksi_001',
                nominal: 250000000,
                description: 'Pemeriksaan pekerjaan renovasi gedung',
                status: 'approved',
                createdAt: '2024-03-10T08:00:00',
                updatedAt: '2024-03-11T17:00:00',
                createdBy: 'vendor_004',
                approvedBy: 'direksi_001',
                approvedAt: '2024-03-11T17:00:00',
                rejectedReason: null,
                attachments: [],
                workDetails: []
            }
        ];
    }

    /**
     * Get all documents with optional filters
     */
    async getDocuments(filters = {}) {
        try {
            await this.simulateNetworkDelay();

            let documents = [...this.mockDocuments];

            // Apply filters
            if (filters.type) {
                documents = documents.filter(doc => doc.type === filters.type);
            }

            if (filters.status) {
                documents = documents.filter(doc => doc.status === filters.status);
            }

            if (filters.vendorId) {
                documents = documents.filter(doc => doc.vendorId === filters.vendorId);
            }

            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                documents = documents.filter(doc =>
                    doc.documentNo.toLowerCase().includes(searchLower) ||
                    doc.vendorName.toLowerCase().includes(searchLower) ||
                    doc.description.toLowerCase().includes(searchLower)
                );
            }

            // Sort by date (newest first)
            documents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            return {
                success: true,
                data: documents,
                count: documents.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get document by ID
     */
    async getDocumentById(documentId) {
        try {
            await this.simulateNetworkDelay();

            const document = this.mockDocuments.find(doc => doc.id === documentId);

            if (!document) {
                throw new Error('Dokumen tidak ditemukan');
            }

            return {
                success: true,
                data: document
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create new document (BAPB or BAPP)
     */
    async createDocument(documentData) {
        try {
            await this.simulateNetworkDelay();

            const newDocument = {
                id: `doc_${Date.now()}`,
                documentNo: this.generateDocumentNumber(documentData.type),
                ...documentData,
                status: 'draft',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                approvedBy: null,
                approvedAt: null,
                rejectedReason: null
            };

            this.mockDocuments.push(newDocument);

            return {
                success: true,
                data: newDocument,
                message: 'Dokumen berhasil dibuat'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Update document
     */
    async updateDocument(documentId, updateData) {
        try {
            await this.simulateNetworkDelay();

            const docIndex = this.mockDocuments.findIndex(doc => doc.id === documentId);

            if (docIndex === -1) {
                throw new Error('Dokumen tidak ditemukan');
            }

            this.mockDocuments[docIndex] = {
                ...this.mockDocuments[docIndex],
                ...updateData,
                updatedAt: new Date().toISOString()
            };

            return {
                success: true,
                data: this.mockDocuments[docIndex],
                message: 'Dokumen berhasil diupdate'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Delete document
     */
    async deleteDocument(documentId) {
        try {
            await this.simulateNetworkDelay();

            const docIndex = this.mockDocuments.findIndex(doc => doc.id === documentId);

            if (docIndex === -1) {
                throw new Error('Dokumen tidak ditemukan');
            }

            // Only allow deletion of draft documents
            if (this.mockDocuments[docIndex].status !== 'draft') {
                throw new Error('Hanya dokumen draft yang dapat dihapus');
            }

            this.mockDocuments.splice(docIndex, 1);

            return {
                success: true,
                message: 'Dokumen berhasil dihapus'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Submit document for approval
     */
    async submitDocument(documentId) {
        try {
            await this.simulateNetworkDelay();

            const docIndex = this.mockDocuments.findIndex(doc => doc.id === documentId);

            if (docIndex === -1) {
                throw new Error('Dokumen tidak ditemukan');
            }

            if (this.mockDocuments[docIndex].status !== 'draft') {
                throw new Error('Hanya dokumen draft yang dapat disubmit');
            }

            this.mockDocuments[docIndex].status = 'pending';
            this.mockDocuments[docIndex].updatedAt = new Date().toISOString();

            return {
                success: true,
                data: this.mockDocuments[docIndex],
                message: 'Dokumen berhasil disubmit untuk approval'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get statistics
     */
    async getStatistics(filters = {}) {
        try {
            await this.simulateNetworkDelay();

            let documents = [...this.mockDocuments];

            // Apply vendor filter if present
            if (filters.vendorId) {
                documents = documents.filter(doc => doc.vendorId === filters.vendorId);
            }

            const stats = {
                total: documents.length,
                draft: documents.filter(doc => doc.status === 'draft').length,
                pending: documents.filter(doc => doc.status === 'pending').length,
                approved: documents.filter(doc => doc.status === 'approved').length,
                rejected: documents.filter(doc => doc.status === 'rejected').length,
                bapb: documents.filter(doc => doc.type === 'BAPB').length,
                bapp: documents.filter(doc => doc.type === 'BAPP').length
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
     * Generate document number
     */
    generateDocumentNumber(type) {
        const year = new Date().getFullYear();
        const existingDocs = this.mockDocuments.filter(doc => doc.type === type);
        const nextNumber = String(existingDocs.length + 1).padStart(3, '0');
        return `${type}-${year}-${nextNumber}`;
    }

    /**
     * Simulate network delay
     */
    simulateNetworkDelay(ms = 500) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Create singleton instance
const documentsAPI = new DocumentsAPI();

// Export both the class and instance
export { DocumentsAPI };
export default documentsAPI;