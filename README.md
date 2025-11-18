# ASAH-A25-CS141-AC-08-Digitalisasi-Pembuatan-Berita-Acara

# Project Plan

https://drive.google.com/file/d/1m2Aoqn6lBs1AT18sp8XYg5QxbSvZEvVd/view

# Desain UI Di Figma

https://www.figma.com/design/UOpytjFV5lGxTvxwwmqXSe/Capstone?node-id=2-2&p=f&t=kkKcz6MFLTPkzkOu-0

# Gambar Flowchart 

![WhatsApp Image 2025-11-18 at 20 42 32_b26b7a3e](https://github.com/user-attachments/assets/f35de1c1-6a97-4d25-9312-d0581a07c17a)

***Penjelasan Flowchart***

1. Start dan Login

    Proses dimulai dari halaman Start, kemudian pengguna diarahkan menuju halaman Login. Pada tahap ini, sistem melakukan autentikasi terhadap identitas pengguna   untuk   memastikan bahwa hanya pengguna yang berhak yang dapat mengakses sistem. Proses autentikasi ini juga berfungsi untuk menentukan role pengguna sehingga fitur yang muncul sesuai dengan tingkat kewenangan masing-masing.

2. Autentikasi dan Penentuan Role Pengguna

    Setelah proses login berhasil, sistem secara otomatis mengidentifikasi role pengguna, yaitu apakah sebagai Vendor, PIC Gudang, atau Direksi. Penentuan role ini penting karena setiap role memiliki alur proses, tugas, serta hak akses yang berbeda. Alur selanjutnya bergantung pada role yang terdeteksi oleh sistem.

3. Proses oleh Vendor

    Jika pengguna terdeteksi sebagai Vendor, sistem akan menampilkan Dashboard Vendor. Dari dashboard ini, Vendor dapat memilih menu untuk membuat dokumen baru. Pada tahap pembuatan dokumen, Vendor diwajibkan memilih jenis dokumen, yaitu BA/BPE atau BA/BPP, di mana masing-masing jenis memiliki format dan informasi yang berbeda.

    Setelah memilih jenis dokumen, Vendor mengisi form sesuai format dokumen tersebut. Vendor juga dapat memilih salah satu dari dua tindakan berikut:

    - Save as Draft, jika data belum lengkap atau masih perlu diperbaiki.

    - Submit untuk Approval, jika seluruh data telah lengkap dan siap diajukan.

    Ketika Vendor melakukan submit, sistem secara otomatis mengirimkan notifikasi kepada PIC Gudang sebagai pemberitahuan bahwa terdapat dokumen baru yang perlu direview.

4. Proses oleh PIC Gudang

    PIC Gudang akan membuka dokumen yang masuk melalui Dashboard PIC Gudang. Pada tahap ini, PIC Gudang melakukan review dokumen yang dikirim oleh Vendor. Proses review mencakup verifikasi kelengkapan data, validitas informasi, serta kesesuaian dokumen dengan kebutuhan yang berlaku.

    Hasil review dapat berupa dua kemungkinan:

    - Ditolak
      Sistem akan mengirimkan notifikasi penolakan kepada Vendor. Proses berhenti sementara sampai Vendor memperbaiki dokumen dan mengajukannya kembali.

    - Diterima
      Jika dokumen sesuai dan lengkap, PIC Gudang melanjutkan proses dengan:

      a. Menyusun laporan dokumen untuk Direksi,
    
      b. Menyiapkan dokumen pendukung,
    
      c. Melakukan Submit ke Direksi,
    
      d. Mengirimkan notifikasi ke Direksi bahwa terdapat dokumen baru yang perlu direview.

5. Proses oleh Direksi

    Setelah menerima notifikasi, Direksi membuka dokumen melalui Dashboard Direksi. Direksi kemudian melakukan review akhir terhadap dokumen beserta laporan yang telah disusun oleh PIC Gudang. Jika dokumen dinilai memenuhi seluruh persyaratan, Direksi memberikan TTD & Approval Dokumen sebagai bentuk persetujuan final.

    Setelah dokumen disetujui, sistem mengirimkan notifikasi kepada Vendor bahwa proses pengajuan dokumen telah sepenuhnya diselesaikan.
Apabila Direksi tidak menyetujui dokumen, maka dokumen dapat dikembalikan kepada PIC Gudang untuk direview ulang, meskipun alur ini tidak digambarkan secara eksplisit pada flowchart.

6. End

    Proses berakhir setelah Direksi memberikan persetujuan dan Vendor menerima notifikasi bahwa dokumen telah selesai diproses.





