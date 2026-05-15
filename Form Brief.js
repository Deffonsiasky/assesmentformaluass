import React, { useState, useEffect } from 'react';
import { User, Lock, CheckCircle, FileDown, LogOut, ClipboardList, AlertCircle, ChevronDown } from 'lucide-react';

// --- 1. CREDENTIALS & ROLE DEFINITIONS ---
const USERS = {
  // PT. Alu Cinta Padamu - Back Office & Management
  'Adminonline': { pass: 'Onlineadmin23', roleId: 'admin_online', company: 'PT. Alu Cinta Padamu', name: 'Admin Penjualan Online' },
  'SKUE2026': { pass: 'skueue2026', roleId: 'staff_keuangan', company: 'PT. Alu Cinta Padamu', name: 'Staff Keuangan' },
  'SMOALU2026': { pass: 'smoalualu2026', roleId: 'staff_manajer_ops', company: 'PT. Alu Cinta Padamu', name: 'Staff Manajer Operasional' },
  'MBA2026': { pass: 'mbaalu2026', roleId: 'marketing_brand', company: 'PT. Alu Cinta Padamu', name: 'Marketing - Brand Activation' },
  'MDA2026': { pass: 'mdaalu2026', roleId: 'marketing_data', company: 'PT. Alu Cinta Padamu', name: 'Marketing - Data & Ads' },
  'FPKJS2026': { pass: 'fpkjsalu2026', roleId: 'spv_kenaikan_gaji', company: 'PT. Alu Cinta Padamu', name: 'Penilaian Kenaikan Gaji (Supervisor)' },
  
  // PT. Alu Cinta Padamu - F&B Operator Assessments (Outlet Staff)
  'FBOAWAITERS2026': { pass: 'fboaaluwat2026', roleId: 'op_waiters', company: 'PT. Alu Cinta Padamu', name: 'Waiters (Frontline)' },
  'FBOAKASIR2026': { pass: 'fboaalukasa2026', roleId: 'op_kasir', company: 'PT. Alu Cinta Padamu', name: 'Kasir (Cashier)' },
  'FBOAGUDANG2026': { pass: 'fboaalugdg2026', roleId: 'op_gudang', company: 'PT. Alu Cinta Padamu', name: 'Gudang (Warehouse)' },
  'FBOASERV2026': { pass: 'fboaaluserv2026', roleId: 'op_serving', company: 'PT. Alu Cinta Padamu', name: 'Serving (Penyajian)' },
  'FBOABARTA2026': { pass: 'fboaalubarta2026', roleId: 'op_barta', company: 'PT. Alu Cinta Padamu', name: 'Barta (Barista & Takeaway)' },
  'FBOAPKO2026': { pass: 'fboaalupko2026', roleId: 'op_produksi', company: 'PT. Alu Cinta Padamu', name: 'Produksi (Kitchen Outlet)' },
  'FPSO2026': { pass: 'fpsoa2026', roleId: 'atasan_fb', company: 'PT. Alu Cinta Padamu', name: 'Penilaian Atasan F&B' },

  // PT. Alu Suportindo Sejahtera (ASS)
  'ProductionHead': { pass: 'Produksi2026', roleId: 'ass_kepala_produksi', company: 'PT. Alu Suportindo Sejahtera', name: 'Kepala Produksi' },
  'STCK2026': { pass: 'staffck2026', roleId: 'ass_staff_ck', company: 'PT. Alu Suportindo Sejahtera', name: 'Staff Gudang - Central Kitchen' },
};

// --- 2. ASSESSMENT FORM DATA ---
// Helper to generate generic 1-5 scale categories
const cat = (name, questions) => ({ name, questions: questions.map((q, i) => ({ id: `q_${i}`, text: q, type: 'scale' })) });

const FORMS = {
  admin_online: {
    title: "Asesmen Kompetensi: Admin Penjualan Online via WhatsApp",
    categories: [
      cat("A. PENERIMAAN & KONFIRMASI ORDER", ["Kecepatan Respons Pesan Masuk (≤ 5 menit)", "Akurasi Pencatatan Order (tanpa salah input)", "Konfirmasi Order & Repeat Order", "Penanganan Order Last Minute"]),
      cat("B. PENGELOLAAN REKAP ORDER HARIAN", ["Rekap Order ke Format Produksi", "Update & Sinkronisasi Data Order", "Pengelolaan Perubahan & Pembatalan Order"]),
      cat("C. KUALITAS KOMUNIKASI WA", ["Bahasa & Tone yang Ramah & Profesional", "Kejelasan Penyampaian Informasi", "Penggunaan Fitur WA Business", "Follow-up Pelanggan Aktif"]),
      cat("D. PENANGANAN KOMPLAIN & SITUASI SULIT", ["Penanganan Komplain dengan Tenang", "Eskalasi Masalah yang Tepat", "Pemulihan Kepercayaan Pelanggan"]),
      cat("E. PENGELOLAAN PEMBAYARAN", ["Verifikasi Bukti Transfer/Pembayaran", "Pencatatan Penerimaan Pembayaran", "Penanganan Selisih & Hutang Pelanggan"]),
      cat("F. ADMINISTRASI OPERASIONAL", ["Pengelolaan Data Pelanggan", "Koordinasi dengan Tim Dapur & Pengiriman", "Pengelolaan Stok Informasi Menu"]),
      cat("G. PRODUKTIVITAS & DISIPLIN", ["Kehadiran & Ketepatan Waktu Online", "Kemampuan Multitasking", "Penyelesaian Rekap Tepat Waktu"]),
      cat("H. INISIATIF & PENGEMBANGAN", ["Inisiatif Meningkatkan Penjualan (Up-selling)", "Laporan & Masukan kepada Owner/Manajer", "Adaptasi terhadap Perubahan"])
    ]
  },
  staff_keuangan: {
    title: "Asesmen Kompetensi: Staff Keuangan",
    categories: [
      cat("A. PENGGUNAAN SOFTWARE ZATECH", ["Entry Jurnal Umum", "Input Faktur Penjualan & Pembelian", "Rekonsiliasi Bank", "Input Kas Masuk & Keluar", "Generate Laporan"]),
      cat("B. AKUNTANSI DASAR", ["Pemahaman Akun COA", "Prinsip Debit-Kredit", "Dokumen Pendukung", "Pemahaman Pajak Dasar"]),
      cat("C. KETELITIAN DATA", ["Verifikasi Nominal", "Kode Akun & Departemen", "Tanggal & Periode"]),
      cat("D. AKURASI & KETELITIAN", ["Tingkat Kesalahan Input", "Konsistensi Format", "Self-Check Sebelum Submit"]),
      cat("E. KECEPATAN & PRODUKTIVITAS", ["Volume Transaksi Harian", "Penyelesaian Backlog"]),
      cat("F. MANAJEMEN DOKUMEN & ARSIP", ["Pengarsipan Dokumen Fisik", "Penamaan File Digital"]),
      cat("G. PENANGANAN MASALAH", ["Identifikasi Selisih", "Eskalasi Tepat Waktu"]),
      cat("H. KEDISIPLINAN", ["Kehadiran & Ketepatan Waktu", "Deadline & Target Harian"]),
      cat("I. INISIATIF & PENGEMBANGAN DIRI", ["Proaktif Belajar Fitur Baru", "Memberi Masukan Perbaikan", "Mandiri dalam Pekerjaan Rutin"]),
      cat("J. ETIKA & KERAHASIAAN DATA", ["Kerahasiaan Data Keuangan", "Integritas dalam Input"]),
      cat("K. KERJASAMA TIM", ["Koordinasi dengan Rekan", "Membantu Rekan yang Kesulitan"])
    ]
  },
  staff_manajer_ops: {
    title: "Asesmen Kompetensi: Staff Manajer Operasional - HO",
    categories: [
      cat("A. MONITORING & KOORDINASI OUTLET", ["Monitoring Performa Outlet Harian", "Koordinasi Antar Outlet & Kepala Outlet", "Penanganan Eskalasi dari Outlet", "Pemastian Standar Operasional Diterapkan"]),
      cat("B. PENGELOLAAN SOP & SISTEM", ["Pembaruan & Distribusi SOP", "Implementasi Kebijakan Baru dari Manajemen", "Audit & Evaluasi Kepatuhan SOP"]),
      cat("C. PERENCANAAN OPERASIONAL", ["Penyusunan Rencana Kerja Bulanan/Kuartalan", "Koordinasi Jadwal & Program Antar Departemen", "Pengelolaan Proyek Operasional"]),
      cat("D. ANALISIS & PELAPORAN", ["Analisis Data Operasional Multi-Outlet", "Penyusunan Laporan Operasional Berkala", "Penyajian Insight kepada Manajer", "Pengelolaan Dashboard & Tools Monitoring"]),
      cat("E. KOORDINASI INTERNAL HO", ["Koordinasi dengan HR terkait SDM Outlet", "Koordinasi dengan Finance & Procurement", "Koordinasi dengan Marketing terkait Program", "Koordinasi dengan Supply Chain/Logistik"]),
      cat("F. KOMUNIKASI & DOKUMENTASI", ["Komunikasi Profesional via Email & Meeting", "Dokumentasi Keputusan & Notulensi"]),
      cat("G. PROGRAM PELATIHAN & ONBOARDING", ["Koordinasi Program Pelatihan Outlet", "Penyusunan Materi Onboarding & SOP", "Evaluasi Efektivitas Pelatihan"]),
      cat("H. TALENT MONITORING", ["Identifikasi Talent & Gap Kompetensi Outlet", "Koordinasi Program Rotasi & Pengembangan Karir"]),
      cat("I. DISIPLIN, INTEGRITAS & INISIATIF", ["Kehadiran, Ketepatan Waktu & Disiplin", "Integritas & Kerahasiaan Data", "Inisiatif & Problem Solving Mandiri", "Pengembangan Diri & Update Pengetahuan", "Kesiapan Naik ke Level Manajer"])
    ]
  },
  marketing_brand: {
    title: "Asesmen Kompetensi: Marketing Brand Activation",
    categories: [
      cat("A. PEMAHAMAN BRAND", ["Penguasaan Brand Guidelines", "Pemahaman Brand Positioning", "Konsistensi Brand di Semua Touchpoint"]),
      cat("B. PENGEMBANGAN BRAND", ["Ide Kampanye Brand yang Relevan", "Storytelling & Brand Narrative", "Inovasi Visual & Konsep Kreatif"]),
      cat("C. PERENCANAAN EVENT", ["Penyusunan Proposal Event", "Manajemen Vendor & Partner", "Budget Planning & Cost Control", "Perizinan & Compliance"]),
      cat("D. EKSEKUSI & ON-GROUND ACTIVATION", ["Koordinasi Tim di Lapangan", "Problem Solving Real-Time", "Pengalaman Tamu & Brand Experience", "Dokumentasi Event"]),
      cat("E. EVALUASI & REPORTING EVENT", ["Pengukuran KPI Event", "Post-Event Report & Lesson Learned"]),
      cat("F. CONTENT STRATEGY & CREATION", ["Penyusunan Content Calendar", "Briefing Konten ke Tim Kreatif", "Pengelolaan KOL / Influencer"]),
      cat("G. COMMUNITY & ENGAGEMENT", ["Community Building", "Penanganan Komentar & DM"]),
      cat("H. KOLABORASI & PROFESIONALISME", ["Koordinasi dengan Tim Data & Ops", "Manajemen Waktu & Deadline", "Inisiatif & Kreativitas", "Kemampuan Presentasi & Pitching", "Adaptasi & Fleksibilitas"])
    ]
  },
  marketing_data: {
    title: "Asesmen Kompetensi: Marketing Data & Ads",
    categories: [
      cat("A. PENGUMPULAN & PENGELOLAAN DATA", ["Pengumpulan Data Multi-Platform", "Kebersihan & Validasi Data", "Pengelolaan Database / Spreadsheet"]),
      cat("B. ANALISIS & INSIGHT", ["Analisis Performa Kampanye", "Analisis Tren & Pola Konsumen", "Competitive Benchmarking Data", "Korelasi Data & Keputusan Marketing"]),
      cat("C. PELAPORAN & VISUALISASI", ["Penyusunan Laporan Mingguan/Bulanan", "Visualisasi Data yang Efektif", "Presentasi Insight kepada Tim"]),
      cat("D. PERENCANAAN IKLAN", ["Penyusunan Media Plan", "Riset Audience & Targeting", "Perencanaan Budget Iklan"]),
      cat("E. EKSEKUSI & SETUP IKLAN", ["Setup Kampanye Meta Ads (FB/IG)", "Setup Google Ads / GDN", "Setup Iklan di Platform F&B (GoFood/GrabFood)", "Pembuatan Creative Brief untuk Konten"]),
      cat("F. OPTIMASI & MONITORING", ["A/B Testing Iklan", "Optimasi Harian & Mingguan", "Penanganan Iklan Tidak Performa", "Manajemen Pixel / Tracking"]),
      cat("G. PENGUASAAN TOOLS", ["Meta Business Suite & Ads Manager", "Google Analytics / GA4", "Spreadsheet Lanjutan (Pivot, VLOOKUP)", "Tools Otomasi / Scheduling"]),
      cat("H. KOLABORASI & KOMUNIKASI", ["Koordinasi dengan Tim Kreatif & Brand", "Responsif terhadap Permintaan Tim", "Inisiatif & Problem Solving", "Update Pengetahuan & Tren Iklan"])
    ]
  },
  ass_kepala_produksi: {
    title: "Asesmen Kompetensi: Kepala Produksi (ASS)",
    categories: [
      cat("A. PERENCANAAN & PENJADWALAN", ["Penyusunan Rencana Produksi", "Pengelolaan Kapasitas & Beban Kerja", "Koordinasi Jadwal dengan Dept Lain"]),
      cat("B. EFISIENSI & PRODUKTIVITAS", ["Pencapaian Target Output Harian", "Pengendalian Waste & Scrap", "Overall Equipment Effectiveness (OEE)", "Pengelolaan Downtime"]),
      cat("C. PENGELOLAAN BAHAN BAKU", ["Monitoring Stok Bahan Baku", "Pengendalian Penggunaan Material"]),
      cat("D. PENGENDALIAN KUALITAS (QC)", ["Implementasi Standar Kualitas", "Penggunaan Alat QC", "Root Cause Analysis (RCA) Defect", "Penanganan Produk Reject & Rework"]),
      cat("E. KEPATUHAN SOP & STANDAR", ["Konsistensi Pelaksanaan SOP Produksi", "Pengelolaan Change Control", "Dokumentasi Proses & Non-Conformance"]),
      cat("F. CONTINUOUS IMPROVEMENT", ["Inisiatif Kaizen / Perbaikan Proses", "Tindak Lanjut Temuan Audit Internal"]),
      cat("G. MANAJEMEN SDM & OPERATOR", ["Pembagian Tugas & Delegasi", "Pengelolaan Absensi & Shift", "Penanganan Konflik Tim"]),
      cat("H. PENGEMBANGAN OPERATOR", ["On-the-Job Training (OJT)", "Identifikasi Gap Kompetensi Tim", "Budaya Kerja Disiplin & Produktif"]),
      cat("I. KOMUNIKASI & KOORDINASI", ["Briefing & Komunikasi Harian", "Pelaporan ke Manajemen"]),
      cat("J. KESELAMATAN KERJA (K3)", ["Kepatuhan & Penegakan K3", "Pencatatan & Pelaporan Insiden", "Safety Briefing & Toolbox Talk"]),
      cat("K. PERAWATAN MESIN", ["Pelaksanaan Preventive Maintenance", "Deteksi Dini Masalah Mesin", "Tanggap Darurat Mesin Rusak"]),
      cat("L. PELAPORAN PRODUKSI", ["Laporan Produksi Harian", "Analisis Tren Data Produksi"]),
      cat("M. PROBLEM SOLVING", ["Identifikasi Masalah Berulang", "Pengambilan Keputusan Produksi", "Usulan Peningkatan Berbasis Data"])
    ]
  },
  ass_staff_ck: {
    title: "Asesmen Kompetensi: Staff Gudang Central Kitchen (ASS)",
    categories: [
      cat("A. PENERIMAAN BARANG", ["Verifikasi Kesesuaian PO & Faktur", "Pengecekan Kualitas & Kondisi", "Penolakan & Pengembalian Barang", "Pencatatan Penerimaan"]),
      cat("B. PENGELUARAN BARANG", ["Proses Pengeluaran Berdasarkan Permintaan", "Akurasi Pengeluaran Barang", "Penerapan Metode FIFO/FEFO", "Pencatatan Pengeluaran Barang"]),
      cat("C. STOCK OPNAME & MONITORING", ["Pelaksanaan Stock Opname Rutin", "Monitoring Stok Minimum", "Identifikasi Slow-Moving & Expired"]),
      cat("D. PENATAAN & ORGANISASI", ["Penataan Barang Sesuai Kategori", "Pengelolaan Zona Penyimpanan", "Kebersihan & Kerapian Area Gudang", "Pengelolaan Kemasan & Alat"]),
      cat("E. FOOD SAFETY & HIGIENITAS", ["Kepatuhan Standar Higienitas Personal", "Penanganan Bahan Berpotensi Kontaminasi", "Monitoring Suhu Penyimpanan", "Penanganan Produk Tidak Layak"]),
      cat("F. KESELAMATAN KERJA (K3)", ["Kepatuhan Prosedur K3 Gudang", "Penanganan Bahan Berbahaya (MSDS)", "Tanggap Darurat & Pelaporan"]),
      cat("G. PENCATATAN & DOKUMENTASI", ["Keakuratan Kartu Stok", "Pengelolaan Dokumen Gudang", "Pelaporan Stok Harian/Mingguan"]),
      cat("H. KOORDINASI DEPARTEMEN", ["Koordinasi dengan Tim Produksi/Dapur", "Koordinasi dengan Purchasing/Supplier"]),
      cat("I. DISIPLIN, KEJUJURAN & INISIATIF", ["Kehadiran & Ketepatan Waktu", "Kejujuran & Integritas Stok", "Inisiatif & Tanggap Situasi", "Kemampuan Bekerja dalam Tekanan", "Kerjasama & Komunikasi"])
    ]
  },
  // --- F&B OPERATOR SELF-ASSESSMENTS ---
  op_waiters: {
    title: "Self-Assessment: Waiters (Frontline)",
    hasRefleksi: true,
    categories: [cat("Penilaian Diri", [
      "Disiplin: Apakah saya selalu datang tepat waktu dan berpenampilan rapi?",
      "Komunikasi: Apakah saya ramah dan sopan kepada pelanggan & team?",
      "Tanggung Jawab: Apakah pesanan akurat & tersampaikan?",
      "Target Penjualan: Apakah saya mencapai target APC?",
      "Product Knowledge: Apakah saya hafal menu, harga, dan promo?",
      "Upselling: Apakah saya aktif menawarkan menu tambahan?",
      "Keluhan Pelanggan: Apakah saya menangani komplain dengan tenang?",
      "Kebersihan Area: Apakah area kerja saya rapi & bersih?",
      "Laporan Harian: Apakah checklist opening/closing lengkap?",
      "Kerja Tim: Apakah saya membantu tim lain saat sibuk?"
    ])]
  },
  op_kasir: {
    title: "Self-Assessment: Kasir (Cashier)",
    hasRefleksi: true,
    categories: [cat("Penilaian Diri", [
      "Disiplin: Apakah saya selalu siap sebelum outlet buka?",
      "Komunikasi: Apakah saya ramah menyapa pelanggan?",
      "Tanggung Jawab: Apakah saya menjaga uang dengan hati-hati?",
      "Akurasi Transaksi: Apakah kas selalu pas (tidak ada selisih)?",
      "Member: Apakah saya menawarkan member ke customer?",
      "Penguasaan Mesin: Apakah saya mahir POS, Zatech, QRIS, dll?",
      "Laporan Kas: Apakah tutup kas balance dan on-time?",
      "Inputan: Apakah saya tidak pernah salah input transaksi/promo?",
      "Kejujuran: Apakah transaksi selalu transparan?",
      "Kerja Tim: Apakah saya berkoordinasi baik saat rush hour?"
    ])]
  },
  op_gudang: {
    title: "Self-Assessment: Gudang (Warehouse)",
    hasRefleksi: true,
    categories: [cat("Penilaian Diri", [
      "Disiplin: Apakah saya datang tepat waktu sebelum buka?",
      "Komunikasi: Apakah saya proaktif lapor jika stok menipis?",
      "Tanggung Jawab: Apakah ketersediaan bahan selalu terjaga?",
      "Akurasi Stok: Apakah catatan stok sesuai barang fisik?",
      "Distribusi Bahan: Apakah pengeluaran sesuai permintaan?",
      "FIFO & FEFO: Apakah bahan lama dipakai duluan tanpa expired?",
      "Kebersihan: Apakah gudang bersih sesuai standar food safety?",
      "Pencatatan Stok: Apakah kartu stok selalu diupdate?",
      "Cek Penerimaan: Apakah saya mengecek kualitas dari supplier?",
      "Kerja Tim: Apakah saya responsif membantu team?"
    ])]
  },
  op_serving: {
    title: "Self-Assessment: Serving (Penyajian)",
    hasRefleksi: true,
    categories: [cat("Penilaian Diri", [
      "Disiplin: Apakah saya selalu siap bekerja tepat waktu?",
      "Komunikasi: Apakah saya langsung lapor gudang jika bahan habis?",
      "Tanggung Jawab: Apakah saya lapor KO jika penambahan bahan?",
      "Konsistensi Tampilan: Apakah takaran selalu sesuai SOP?",
      "Kecepatan Penyajian: Apakah saya menyajikan cepat tanpa antrian?",
      "Higienitas: Apakah saya selalu memakai APD?",
      "Pengelolaan Waste: Apakah sisa bahan terminimalisir?",
      "Penguasaan Menu: Apakah saya hafal semua menu & seasonal?",
      "Perawatan Alat: Apakah saya membersihkan alat setelah pakai?",
      "Kerja Tim: Apakah saya tenang dan koordinasi saat order menumpuk?"
    ])]
  },
  op_barta: {
    title: "Self-Assessment: Barta (Barista & Takeaway)",
    hasRefleksi: true,
    categories: [cat("Penilaian Diri", [
      "Disiplin: Apakah saya selalu hadir tepat waktu?",
      "Komunikasi: Apakah saya berkomunikasi baik ke semua tim?",
      "Tanggung Jawab: Apakah nasi kotak selesai tepat waktu?",
      "Konsistensi: Apakah takaran dan tampilan sesuai SOP?",
      "Inisiatif: Apakah saya mengusulkan perbaikan proses?",
      "Higienitas: Apakah saya memakai APD (handglove, masker)?",
      "Skill: Apakah saya bisa membuat tampahan dan tumpeng?",
      "Penguasaan Menu: Apakah saya hafal semua menu?",
      "Perawatan Alat: Apakah saya membersihkan mesin & alat?",
      "Kerja Tim: Apakah saya tenang saat order menumpuk?"
    ])]
  },
  op_produksi: {
    title: "Self-Assessment: Produksi (Kitchen)",
    hasRefleksi: true,
    categories: [cat("Penilaian Diri", [
      "Disiplin: Apakah saya datang tepat waktu agar produksi lancar?",
      "Komunikasi: Apakah saya lapor jika bahan hampir habis?",
      "Tanggung Jawab: Apakah area kerja & alat selalu bersih?",
      "Konsistensi Rasa: Apakah rasa & takaran sesuai resep?",
      "Kecepatan Produksi: Apakah selesai tepat waktu?",
      "Higienitas: Apakah saya memakai APD lengkap?",
      "Pengelolaan Waste: Apakah sisa terbuang sangat minim?",
      "Penguasaan Resep: Apakah saya hafal semua resep?",
      "Perawatan Alat: Apakah alat dibersihkan setelah dipakai?",
      "Kerja Tim: Apakah saya tenang koordinasi saat produksi banyak?"
    ])]
  },
  // --- SUPERVISOR / ATASAN EVALUATIONS (WITH WEIGHTS) ---
  atasan_fb: {
    title: "Form Penilaian Atasan / Supervisor F&B",
    isEvaluator: true,
    rolesToEvaluate: ['Waiters', 'Kasir', 'Gudang', 'Serving', 'Barta', 'Produksi'],
    questionsMap: {
      Waiters: [
        { q: "Disiplin & Kehadiran", w: 1.5 }, { q: "Komunikasi & Attitude", w: 2.0 }, { q: "Tanggung Jawab (Jaga area, lapor)", w: 1.5 },
        { q: "Target Penjualan (Realisasi vs Target APC)", w: 3.0 }, { q: "Product Knowledge", w: 2.0 }, { q: "Teknik Upselling", w: 2.0 },
        { q: "Penanganan Komplain", w: 1.5 }, { q: "Kebersihan Area", w: 1.5 }, { q: "Laporan Harian (Akurasi)", w: 1.5 }, { q: "Kerja Tim", w: 1.0 }
      ],
      Kasir: [
        { q: "Disiplin & Kehadiran", w: 1.5 }, { q: "Komunikasi & Attitude", w: 1.5 }, { q: "Tanggung Jawab (Kelola laci/uang)", w: 1.5 },
        { q: "Akurasi Transaksi (0 selisih)", w: 3.0 }, { q: "Member (Menawarkan member)", w: 2.0 }, { q: "Penguasaan Mesin Kasir", w: 2.0 },
        { q: "Laporan Kas Harian", w: 2.5 }, { q: "Inputan (Tidak salah input)", w: 1.5 }, { q: "Kejujuran & Integritas", w: 3.0 }, { q: "Kerja Tim", w: 1.0 }
      ],
      Gudang: [
        { q: "Disiplin & Kehadiran", w: 1.5 }, { q: "Komunikasi (Koordinasi divisi)", w: 1.0 }, { q: "Tanggung Jawab", w: 1.5 },
        { q: "Akurasi Stok (Fisik vs Catatan)", w: 2.5 }, { q: "Distribusi Bahan", w: 2.0 }, { q: "FIFO & FEFO (Masa Kedaluwarsa)", w: 2.5 },
        { q: "Kebersihan & Sanitasi", w: 2.0 }, { q: "Pencatatan Keluar-Masuk", w: 1.5 }, { q: "Penerimaan & Pengecekan", w: 1.5 }, { q: "Kerja Tim", w: 1.0 }
      ],
      Serving: [
        { q: "Disiplin & Kehadiran", w: 2.0 }, { q: "Komunikasi", w: 1.0 }, { q: "Tanggung Jawab (Kebersihan alat/area)", w: 1.5 },
        { q: "Konsistensi Tampilan", w: 3.0 }, { q: "Kecepatan Penyajian", w: 2.5 }, { q: "Higienitas & Food Safety", w: 2.5 },
        { q: "Pengelolaan Waste", w: 1.5 }, { q: "Penguasaan Menu & Variasi", w: 1.5 }, { q: "Perawatan Alat", w: 1.5 }, { q: "Kerja Tim Rush Hour", w: 1.5 }
      ],
      Barta: [
        { q: "Disiplin & Kehadiran", w: 1.5 }, { q: "Komunikasi", w: 1.5 }, { q: "Tanggung Jawab", w: 1.5 }, { q: "Konsisten Tampilan", w: 2.5 },
        { q: "Inisiatif", w: 2.0 }, { q: "Higienitas", w: 1.5 }, { q: "Skill (Tampahan/Tumpeng)", w: 2.0 }, { q: "Penguasaan Menu", w: 2.0 },
        { q: "Perawatan Alat", w: 1.5 }, { q: "Kerja Tim Rush Hour", w: 1.0 }
      ],
      Produksi: [
        { q: "Disiplin & Kehadiran", w: 1.5 }, { q: "Komunikasi", w: 1.5 }, { q: "Tanggung Jawab", w: 1.5 }, { q: "Konsisten Rasa", w: 2.5 },
        { q: "Kecepatan Produksi", w: 2.0 }, { q: "Higienitas", w: 1.5 }, { q: "Pengelolaan Waste", w: 2.0 }, { q: "Penguasaan Resep", w: 2.0 },
        { q: "Perawatan Alat", w: 1.5 }, { q: "Kerja Tim Rush Hour", w: 1.0 }
      ]
    }
  },
  spv_kenaikan_gaji: {
    title: "Form Penilaian Kenaikan Gaji - Level Supervisor",
    isEvaluator: true,
    rolesToEvaluate: ['Supervisor Outlet', 'Supervisor HO', 'Supervisor Central Kitchen'], // Generic
    sectionsWithWeights: [
      {
        name: "PERFORMA OPERASIONAL (Bobot 35%)", sectionWeight: 0.35,
        questions: [{ q: "Pencapaian Target Harian/Mingguan", w: 3 }, { q: "Kualitas Output Tim", w: 3 }, { q: "Kepatuhan SOP & Standar", w: 2 }, { q: "Laporan Harian & Dokumentasi", w: 2 }]
      },
      {
        name: "KEPEMIMPINAN TIM (Bobot 30%)", sectionWeight: 0.30,
        questions: [{ q: "Tim Bisa Jalan Mandiri", w: 3 }, { q: "Disiplin & Absensi Tim", w: 2 }, { q: "Onboarding & Training Baru", w: 2 }, { q: "Penanganan Konflik Tim", w: 2 }, { q: "Motivasi & Semangat Tim", w: 1 }]
      },
      {
        name: "SKILL & PENGETAHUAN (Bobot 20%)", sectionWeight: 0.20,
        questions: [{ q: "Penguasaan Proses", w: 2 }, { q: "Kemampuan Mengajarkan Skill", w: 2 }, { q: "Pemahaman Data & Laporan", w: 2 }, { q: "Adaptasi Sistem & Tools Baru", w: 1 }]
      },
      {
        name: "SIKAP & KARAKTER (Bobot 15%)", sectionWeight: 0.15,
        questions: [{ q: "Disiplin & Keteladanan", w: 2 }, { q: "Komunikasi ke Atas & Bawah", w: 2 }, { q: "Proaktif Lapor Masalah + Solusi", w: 2 }, { q: "Fokus Solusi, Bukan Drama", w: 1 }]
      }
    ]
  }
};


// --- COMPONENTS ---

const App = () => {
  const [user, setUser] = useState(null);
  const [targetName, setTargetName] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [responses, setResponses] = useState({});
  const [texts, setTexts] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [scoreData, setScoreData] = useState(null);

  // Auto-login logic for testing (Optional)
  useEffect(() => {
    // setUser(USERS['Adminonline']);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const u = e.target.username.value.trim();
    const p = e.target.password.value.trim();
    if (USERS[u] && USERS[u].pass === p) {
      setUser(USERS[u]);
      setResponses({});
      setTexts({});
      setSubmitted(false);
      setTargetName("");
      setSelectedRole("");
      window.scrollTo(0, 0);
    } else {
      alert("Username atau Password salah.");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Yakin ingin keluar?")) {
      setUser(null);
      setSubmitted(false);
    }
  };

  const calculateScore = (formData) => {
    let totalScore = 0;
    let maxPossible = 0;

    if (formData.sectionsWithWeights) {
      // Logic for SPV Form
      let finalWeightedScore = 0;
      formData.sectionsWithWeights.forEach((sec, sIdx) => {
        let sectionSum = 0;
        let sectionWeightSum = 0;
        sec.questions.forEach((q, qIdx) => {
          const val = parseInt(responses[`${sIdx}_${qIdx}`] || 0);
          sectionSum += (val * q.w);
          sectionWeightSum += (5 * q.w);
        });
        const sectionScore = (sectionSum / sectionWeightSum) * 5.0; // Scaled to 5.0
        finalWeightedScore += (sectionScore * sec.sectionWeight);
      });
      return { score: finalWeightedScore.toFixed(2), max: 5.0, isWeighted: true };
    } 
    else if (formData.isEvaluator && formData.questionsMap) {
      // Logic for Atasan F&B Form
      const questions = formData.questionsMap[selectedRole] || [];
      let weightedSum = 0;
      let totalWeight = 0;
      questions.forEach((q, i) => {
        const val = parseInt(responses[`eval_${i}`] || 0);
        weightedSum += (val * q.w);
        totalWeight += q.w;
      });
      const maxWeightedSum = totalWeight * 5;
      const finalScore = (weightedSum / maxWeightedSum) * 5.0;
      return { score: finalScore.toFixed(2), max: 5.0, isWeighted: true };
    } 
    else {
      // Standard 1-5 Scale Logic
      formData.categories.forEach(cat => {
        cat.questions.forEach(q => {
          totalScore += parseInt(responses[q.id] || 0);
          maxPossible += 5;
        });
      });
      return { score: totalScore, max: maxPossible, isWeighted: false };
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = FORMS[user.roleId];
    
    // Simple validation
    if (formData.isEvaluator && !targetName) {
      alert("Harap masukkan nama karyawan yang dinilai.");
      return;
    }
    if (formData.isEvaluator && formData.questionsMap && !selectedRole) {
      alert("Harap pilih posisi karyawan.");
      return;
    }

    setScoreData(calculateScore(formData));
    setSubmitted(true);
    window.scrollTo(0, 0);
  };

  const renderEvaluatorForm = (formData) => {
    if (formData.sectionsWithWeights) {
      return formData.sectionsWithWeights.map((sec, sIdx) => (
        <div key={sIdx} className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200 print:shadow-none print:border-gray-300">
          <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">{sec.name}</h3>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 print:bg-gray-100">
                <th className="p-3 w-1/2">Indikator</th>
                <th className="p-3 text-center">Bobot</th>
                <th className="p-3 text-center">Skor (1-5)</th>
              </tr>
            </thead>
            <tbody>
              {sec.questions.map((q, qIdx) => (
                <tr key={qIdx} className="border-b">
                  <td className="p-3">{q.q}</td>
                  <td className="p-3 text-center text-gray-600 font-semibold">x{q.w}</td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center space-x-2">
                      {[1, 2, 3, 4, 5].map(val => (
                        <label key={val} className="flex flex-col items-center cursor-pointer">
                          <input required type="radio" name={`${sIdx}_${qIdx}`} value={val} onChange={(e) => setResponses({ ...responses, [e.target.name]: e.target.value })} disabled={submitted} className="w-4 h-4 text-green-600 focus:ring-green-500 print:hidden"/>
                          <span className={`text-xs mt-1 ${submitted && responses[`${sIdx}_${qIdx}`] == val ? 'font-bold text-green-600 bg-green-100 px-2 rounded-full print:block' : 'print:hidden'}`}>{val}</span>
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ));
    }

    const activeQuestions = formData.questionsMap[selectedRole] || [];
    if (!selectedRole) return <div className="text-gray-500 italic p-6">Silakan pilih posisi karyawan di atas untuk memuat indikator penilaian.</div>;

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 print:shadow-none print:border-gray-300">
         <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">Indikator Penilaian ({selectedRole})</h3>
         <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 print:bg-gray-100">
                <th className="p-3 w-1/2">Indikator</th>
                <th className="p-3 text-center">Bobot</th>
                <th className="p-3 text-center">Skor (1-5)</th>
              </tr>
            </thead>
            <tbody>
              {activeQuestions.map((q, i) => (
                <tr key={i} className="border-b">
                  <td className="p-3 font-medium">{q.q}</td>
                  <td className="p-3 text-center text-gray-600">x{q.w.toFixed(1)}</td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center space-x-2">
                      {[1, 2, 3, 4, 5].map(val => (
                        <label key={val} className="flex flex-col items-center cursor-pointer">
                          <input required type="radio" name={`eval_${i}`} value={val} onChange={(e) => setResponses({ ...responses, [e.target.name]: e.target.value })} disabled={submitted} className="w-4 h-4 text-green-600 print:hidden"/>
                          <span className={`text-xs mt-1 ${submitted && responses[`eval_${i}`] == val ? 'font-bold text-green-600 bg-green-100 px-2 rounded-full print:block' : 'print:hidden'}`}>{val}</span>
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
         </table>
      </div>
    );
  };

  const renderStandardForm = (formData) => {
    return formData.categories.map((cat, i) => (
      <div key={i} className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200 print:shadow-none print:border-gray-300 print:mb-4">
        <h3 className="font-bold text-lg mb-4 text-green-700 border-b pb-2">{cat.name}</h3>
        <div className="space-y-6 print:space-y-3">
          {cat.questions.map((q) => (
            <div key={q.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <label className="text-gray-800 font-medium w-full sm:w-2/3 mb-3 sm:mb-0 pr-4">{q.text}</label>
              <div className="flex space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                {[1, 2, 3, 4, 5].map(val => (
                  <label key={val} className="flex flex-col items-center cursor-pointer group">
                    <input 
                      required 
                      type="radio" 
                      name={q.id} 
                      value={val} 
                      disabled={submitted}
                      onChange={(e) => setResponses({ ...responses, [e.target.name]: e.target.value })}
                      className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500 print:hidden"
                    />
                    <span className={`text-sm mt-1 text-gray-500 group-hover:text-green-600 ${submitted && responses[q.id] == val ? 'font-bold text-green-600 bg-green-100 px-2 rounded-full print:block' : 'print:hidden'}`}>
                      {val}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ));
  };


  // Views
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center text-green-600">
            <ClipboardList size={48} />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Portal Asesmen Karyawan
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            PT. Alu Cinta Padamu & PT. ASS
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border-t-4 border-green-600">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input name="username" type="text" required className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border" placeholder="Masukkan Username" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input name="password" type="password" required className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border" placeholder="••••••••" />
                </div>
              </div>

              <div>
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                  Login ke Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const formData = FORMS[user.roleId];

  return (
    <div className="min-h-screen bg-gray-100 pb-12 print:bg-white print:pb-0">
      {/* Header */}
      <header className="bg-white shadow print:shadow-none print:border-b-2 print:border-green-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ClipboardList className="text-green-600" /> 
              {user.company}
            </h1>
            <p className="text-sm text-gray-500 font-medium">{formData.title}</p>
          </div>
          {!submitted && (
            <button onClick={handleLogout} className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors print:hidden">
              <LogOut size={18} /> <span className="hidden sm:inline">Keluar</span>
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Results Banner */}
        {submitted && scoreData && (
          <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg shadow-sm mb-8 print:border-l-0 print:border-y-2 print:rounded-none">
            <div className="flex justify-between items-start sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-green-800 flex items-center gap-2">
                  <CheckCircle /> Asesmen Selesai
                </h2>
                <p className="text-green-700 mt-1">Data telah direkam pada sistem. Laporan dapat diunduh.</p>
              </div>
              <div className="text-right mt-4 sm:mt-0">
                <p className="text-sm text-green-600 uppercase font-bold tracking-wide">Total Skor</p>
                <p className="text-4xl font-extrabold text-green-800">
                  {scoreData.score} <span className="text-xl text-green-600">/ {scoreData.max}</span>
                </p>
              </div>
            </div>
            <div className="mt-6 flex gap-4 print:hidden">
              <button onClick={() => window.print()} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
                <FileDown size={18} /> Unduh PDF
              </button>
              <button onClick={() => { setSubmitted(false); setResponses({}); setTexts({}); setTargetName(""); setSelectedRole(""); }} className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition">
                Asesmen Baru
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Identity Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 print:shadow-none print:border-gray-300">
            <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">Informasi Form</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Penilai / Peserta</label>
                <p className="font-semibold text-gray-900">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Tanggal Asesmen</label>
                <p className="font-semibold text-gray-900">{new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              
              {formData.isEvaluator && (
                <>
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">Nama Karyawan yang Dinilai <span className="text-red-500">*</span></label>
                    {submitted ? (
                      <p className="font-semibold text-gray-900">{targetName}</p>
                    ) : (
                      <input type="text" required value={targetName} onChange={(e) => setTargetName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border" placeholder="Nama Lengkap"/>
                    )}
                  </div>
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">Posisi / Jabatan <span className="text-red-500">*</span></label>
                    {submitted ? (
                      <p className="font-semibold text-gray-900">{selectedRole}</p>
                    ) : (
                      <select required value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border bg-white">
                        <option value="">-- Pilih Posisi --</option>
                        {formData.rolesToEvaluate.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Scoring Instructions */}
          {!submitted && (
             <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start gap-3 print:hidden">
               <AlertCircle className="mt-0.5 flex-shrink-0" size={20} />
               <div className="text-sm">
                 <p className="font-bold mb-1">Panduan Pengisian Skor:</p>
                 <ul className="list-disc ml-4 space-y-1">
                   <li><strong>5</strong> = Sangat Baik / Selalu Konsisten</li>
                   <li><strong>4</strong> = Baik / Sering Konsisten</li>
                   <li><strong>3</strong> = Cukup / Kadang Perlu Diingatkan</li>
                   <li><strong>2</strong> = Kurang / Sering Diingatkan</li>
                   <li><strong>1</strong> = Sangat Kurang / Tidak Sesuai Standar</li>
                 </ul>
               </div>
             </div>
          )}

          {/* Questions Container */}
          <div className="form-content">
            {formData.isEvaluator ? renderEvaluatorForm(formData) : renderStandardForm(formData)}
          </div>

          {/* Refleksi Diri (Only for Self Assessments) */}
          {formData.hasRefleksi && (
            <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200 print:shadow-none print:border-gray-300 print:break-inside-avoid">
              <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">Refleksi Diri</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apa yang menurutmu sudah kamu lakukan dengan baik bulan ini?</label>
                  {submitted ? (
                    <p className="p-3 bg-gray-50 rounded border text-sm">{texts.t1 || "-"}</p>
                  ) : (
                    <textarea rows="2" className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border text-sm" value={texts.t1 || ""} onChange={e => setTexts({...texts, t1: e.target.value})}></textarea>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apa yang ingin kamu tingkatkan bulan depan?</label>
                  {submitted ? (
                    <p className="p-3 bg-gray-50 rounded border text-sm">{texts.t2 || "-"}</p>
                  ) : (
                    <textarea rows="2" className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border text-sm" value={texts.t2 || ""} onChange={e => setTexts({...texts, t2: e.target.value})}></textarea>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skill apa yang kamu punya di luar pekerjaanmu?</label>
                  {submitted ? (
                    <p className="p-3 bg-gray-50 rounded border text-sm">{texts.t3 || "-"}</p>
                  ) : (
                    <textarea rows="2" className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border text-sm" value={texts.t3 || ""} onChange={e => setTexts({...texts, t3: e.target.value})}></textarea>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Additional Notes for Evaluators */}
          {formData.isEvaluator && (
            <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200 print:shadow-none print:border-gray-300 print:break-inside-avoid">
               <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">Rencana Pengembangan</h3>
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Kekuatan yang perlu dipertahankan / Catatan Khusus:</label>
                   {submitted ? (
                     <p className="p-3 bg-gray-50 rounded border text-sm">{texts.n1 || "-"}</p>
                   ) : (
                     <textarea rows="2" className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border text-sm" value={texts.n1 || ""} onChange={e => setTexts({...texts, n1: e.target.value})}></textarea>
                   )}
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Area yang perlu ditingkatkan:</label>
                   {submitted ? (
                     <p className="p-3 bg-gray-50 rounded border text-sm">{texts.n2 || "-"}</p>
                   ) : (
                     <textarea rows="2" className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border text-sm" value={texts.n2 || ""} onChange={e => setTexts({...texts, n2: e.target.value})}></textarea>
                   )}
                 </div>
               </div>
            </div>
          )}

          {/* Submit Button */}
          {!submitted && (
            <div className="pt-4 pb-12 print:hidden">
              <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 hover:shadow-xl transition-all">
                Kirim Penilaian & Hitung Skor
              </button>
            </div>
          )}

          {/* Print Signatures */}
          {submitted && (
            <div className="hidden print:flex justify-between mt-16 pt-8 px-8">
              <div className="text-center">
                <p className="mb-20 font-medium">Yang Dinilai</p>
                <p className="font-bold border-t border-black pt-2 px-8">{formData.isEvaluator ? (targetName || 'Karyawan') : user.name}</p>
              </div>
              <div className="text-center">
                <p className="mb-20 font-medium">{formData.isEvaluator ? 'Penilai / Atasan' : 'Diketahui Oleh'}</p>
                <p className="font-bold border-t border-black pt-2 px-8">{formData.isEvaluator ? user.name : 'Atasan Langsung'}</p>
              </div>
            </div>
          )}
        </form>
      </main>

      <style>{`
        @media print {
          @page { margin: 1cm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: white !important; }
        }
      `}</style>
    </div>
  );
};

export default App;