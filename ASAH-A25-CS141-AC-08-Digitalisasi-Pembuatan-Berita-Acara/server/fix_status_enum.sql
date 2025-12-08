-- Perbaiki ENUM untuk tabel bapb
ALTER TABLE bapb 
MODIFY COLUMN status ENUM(
  'draft', 
  'submitted', 
  'reviewed', 
  'approved_pic', 
  'approved_direksi', 
  'rejected'
) DEFAULT 'draft';

-- Perbaiki ENUM untuk tabel bapp  
ALTER TABLE bapp 
MODIFY COLUMN status ENUM(
  'draft', 
  'submitted', 
  'reviewed_pic', 
  'approved_direksi', 
  'rejected'
) DEFAULT 'draft';

-- Perbaiki ENUM untuk document_history
ALTER TABLE document_history 
MODIFY COLUMN jenis_dokumen ENUM('bapb', 'bapp') NOT NULL,
MODIFY COLUMN actor_role ENUM('vendor', 'pic', 'direksi', 'system') NOT NULL,
MODIFY COLUMN aktivitas ENUM(
  'created', 
  'updated', 
  'submitted', 
  'reviewed', 
  'approved', 
  'rejected',
  'upload_lampiran',
  'delete_lampiran'
) NOT NULL;