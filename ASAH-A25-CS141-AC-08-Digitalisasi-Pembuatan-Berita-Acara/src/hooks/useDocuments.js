import { useState, useEffect, useCallback } from 'react';
import { 
  bapbService, 
  bappService, 
  documentsService,
  uploadService 
} from '../services/api';
import { 
  mapBAPBFieldsToBackend, 
  mapBAPPFieldsToBackend,
  mapBAPBFieldsToFrontend,
  mapBAPPFieldsToFrontend,
  mapStatusToFrontend 
} from '../utils/fieldMapper';

/**
 * Custom hook untuk manage dokumen (BAPB & BAPP)
 */
export const useDocuments = (type = 'all', initialParams = {}) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [filters, setFilters] = useState({
    status: initialParams.status || '',
    search: initialParams.search || '',
    page: initialParams.page || 1,
    limit: initialParams.limit || 10
  });

  // Fetch documents
  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      
      if (type === 'bapb') {
        response = await bapbService.getAll(filters);
        const mappedData = response.data.data.map(doc => 
          mapBAPBFieldsToFrontend(doc)
        );
        setDocuments(mappedData);
      } else if (type === 'bapp') {
        response = await bappService.getAll(filters);
        const mappedData = response.data.data.map(doc => 
          mapBAPPFieldsToFrontend(doc)
        );
        setDocuments(mappedData);
      } else {
        // Get combined
        response = await documentsService.getCombined(filters);
        setDocuments(response.data);
      }

      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err.message || 'Gagal memuat dokumen');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [type, filters]);

  // Initial fetch
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  // Pagination handlers
  const goToPage = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const nextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setFilters(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const prevPage = () => {
    if (pagination.currentPage > 1) {
      setFilters(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };

  // Create document
  const createDocument = async (data, docType) => {
    try {
      setLoading(true);
      
      let mappedData;
      let response;
      
      if (docType === 'bapb') {
        mappedData = mapBAPBFieldsToBackend(data);
        console.log('📤 Creating BAPB with data:', mappedData);
        response = await bapbService.create(mappedData);
        console.log('✅ BAPB create response:', response);
      } else {
        mappedData = mapBAPPFieldsToBackend(data);
        console.log('📤 Creating BAPP with data:', mappedData);
        response = await bappService.create(mappedData);
        console.log('✅ BAPP create response:', response);
      }
      
      // Refresh list
      await fetchDocuments();
      
      return {
        success: true,
        data: response.data,
        id: response.data.id
      };
    } catch (err) {
      console.error('Error creating document:', err);
      console.error('Error response:', err.response?.data);
      return {
        success: false,
        error: err.message || 'Gagal membuat dokumen'
      };
    } finally {
      setLoading(false);
    }
  };

  // Update document
  const updateDocument = async (id, data, docType) => {
    try {
      setLoading(true);
      
      let mappedData;
      
      if (docType === 'bapb') {
        mappedData = mapBAPBFieldsToBackend(data);
        await bapbService.update(id, mappedData);
      } else {
        mappedData = mapBAPPFieldsToBackend(data);
        await bappService.update(id, mappedData);
      }
      
      // Refresh list
      await fetchDocuments();
      
      return { success: true };
    } catch (err) {
      console.error('Error updating document:', err);
      return {
        success: false,
        error: err.message || 'Gagal mengupdate dokumen'
      };
    } finally {
      setLoading(false);
    }
  };

  // Delete document
  const deleteDocument = async (id, docType) => {
    try {
      setLoading(true);
      
      if (docType === 'bapb') {
        await bapbService.delete(id);
      } else {
        await bappService.delete(id);
      }
      
      // Refresh list
      await fetchDocuments();
      
      return { success: true };
    } catch (err) {
      console.error('Error deleting document:', err);
      return {
        success: false,
        error: err.message || 'Gagal menghapus dokumen'
      };
    } finally {
      setLoading(false);
    }
  };

  // Submit document
  const submitDocument = async (id, docType) => {
    try {
      setLoading(true);
      
      if (docType === 'bapb') {
        await bapbService.submit(id);
      } else {
        await bappService.submit(id);
      }
      
      // Refresh list
      await fetchDocuments();
      
      return { success: true };
    } catch (err) {
      console.error('Error submitting document:', err);
      return {
        success: false,
        error: err.message || 'Gagal mengajukan dokumen'
      };
    } finally {
      setLoading(false);
    }
  };

  // Upload lampiran
  const uploadLampiran = async (docType, docId, files, keterangan = '') => {
    try {
      const response = await uploadService.upload(docType, docId, files, keterangan);
      return {
        success: true,
        data: response.data
      };
    } catch (err) {
      console.error('Error uploading files:', err);
      return {
        success: false,
        error: err.message || 'Gagal mengupload file'
      };
    }
  };

  // Get single document
  const getDocument = async (id, docType) => {
    try {
      setLoading(true);
      
      let response;
      let mappedData;
      
      if (docType === 'bapb') {
        response = await bapbService.getById(id);
        mappedData = mapBAPBFieldsToFrontend(response.data.bapb);
      } else {
        response = await bappService.getById(id);
        mappedData = mapBAPPFieldsToFrontend(response.data.bapp);
      }
      
      return {
        success: true,
        data: {
          ...mappedData,
          lampiran: response.data.lampiran || [],
          history: response.data.history || []
        }
      };
    } catch (err) {
      console.error('Error getting document:', err);
      return {
        success: false,
        error: err.message || 'Gagal mengambil data dokumen'
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    documents,
    loading,
    error,
    pagination,
    filters,
    
    // Actions
    fetchDocuments,
    updateFilters,
    goToPage,
    nextPage,
    prevPage,
    createDocument,
    updateDocument,
    deleteDocument,
    submitDocument,
    uploadLampiran,
    getDocument,
    
    // Helper
    mapStatusToFrontend
  };
};

/**
 * Hook untuk document statistics
 */
export const useDocumentStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await documentsService.getStats();
      setStats(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message || 'Gagal memuat statistik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
};

/**
 * Hook untuk document history
 */
export const useDocumentHistory = (jenis_dokumen, id_dokumen) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = async (params = {}) => {
    try {
      setLoading(true);
      const queryParams = {
        jenis_dokumen,
        id_dokumen,
        ...params
      };
      const response = await documentsService.getHistory(queryParams);
      setHistory(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError(err.message || 'Gagal memuat riwayat');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jenis_dokumen && id_dokumen) {
      fetchHistory();
    }
  }, [jenis_dokumen, id_dokumen]);

  return { history, loading, error, refetch: fetchHistory };
};

export default useDocuments;