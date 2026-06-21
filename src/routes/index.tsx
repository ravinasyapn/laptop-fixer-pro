import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sistem Pakar Diagnosa Kerusakan Laptop" },
      { name: "description", content: "Sistem pakar berbasis Prolog untuk mendiagnosa kerusakan laptop dari gejala yang dialami." },
      { property: "og:title", content: "Sistem Pakar Kerusakan Laptop" },
      { property: "og:description", content: "Diagnosa kerusakan laptop berbasis aturan Prolog." },
    ],
  }),
  component: Index,
});

type Gejala = { kode: string; label: string; kategori: string };

const GEJALA: Gejala[] = [
  // Power & Daya
  { kode: "g1", label: "Mengeluarkan bau hangus", kategori: "Power & Daya" },
  { kode: "g2", label: "Laptop mati total & tombol power tidak berfungsi", kategori: "Power & Daya" },
  { kode: "g3", label: "Proses shutdown lama disertai bunyi bip", kategori: "Power & Daya" },
  // Boot & Tampilan Awal
  { kode: "g4", label: "Saat dihidupkan tidak ada tampilan di layar", kategori: "Boot & Tampilan Awal" },
  { kode: "g5", label: "Mengeluarkan bunyi bip berulang-ulang", kategori: "Boot & Tampilan Awal" },
  { kode: "g6", label: "Proses booting berhenti setelah POST", kategori: "Boot & Tampilan Awal" },
  { kode: "g7", label: "Sering mengalami kegagalan proses booting", kategori: "Boot & Tampilan Awal" },
  { kode: "g8", label: "Sistem hanya dapat menyala sementara waktu", kategori: "Boot & Tampilan Awal" },
  // Layar & Grafis
  { kode: "g9", label: "Monitor mati / kosong / tidak ada gambar", kategori: "Layar & Grafis" },
  { kode: "g10", label: "Monitor berkedip (flickering)", kategori: "Layar & Grafis" },
  { kode: "g11", label: "Tampilan tidak sesuai dengan aslinya", kategori: "Layar & Grafis" },
  { kode: "g12", label: "Layar bergetar", kategori: "Layar & Grafis" },
  { kode: "g13", label: "Terdapat bercak kotor (gomy) pada layar", kategori: "Layar & Grafis" },
  { kode: "g14", label: "LCD bergaris", kategori: "Layar & Grafis" },
  { kode: "g15", label: "LCD menampilkan artefak visual", kategori: "Layar & Grafis" },
  { kode: "g16", label: "Layar tidak muncul & tidak bisa akses BIOS", kategori: "Layar & Grafis" },
  { kode: "g17", label: "Muncul layar biru (Blue Screen / BSOD)", kategori: "Layar & Grafis" },
  // Performa & Sistem
  { kode: "g18", label: "Sistem operasi tidak berfungsi", kategori: "Performa & Sistem Operasi" },
  { kode: "g19", label: "Loading lama dan sering mengalami hang", kategori: "Performa & Sistem Operasi" },
  { kode: "g20", label: "Program tidak didukung & sering restart", kategori: "Performa & Sistem Operasi" },
  { kode: "g21", label: "Booting masuk ke Windows berjalan lambat", kategori: "Performa & Sistem Operasi" },
  { kode: "g22", label: "Windows Explorer dalam keadaan tidak aktif", kategori: "Performa & Sistem Operasi" },
  { kode: "g23", label: "Start menu tidak berfungsi", kategori: "Performa & Sistem Operasi" },
  { kode: "g24", label: "Prosedur shutdown tidak berjalan", kategori: "Performa & Sistem Operasi" },
  { kode: "g25", label: "Shutdown terhenti sebelum komputer benar-benar mati", kategori: "Performa & Sistem Operasi" },
  { kode: "g26", label: "Layar selalu dalam keadaan diam (freeze)", kategori: "Performa & Sistem Operasi" },
  { kode: "g27", label: "Laptop berjalan lambat / akses program lambat", kategori: "Performa & Sistem Operasi" },
  { kode: "g28", label: "Terjadi kegagalan saat membuka program", kategori: "Performa & Sistem Operasi" },
  { kode: "g29", label: "Tidak bisa dimatikan (shutdown)", kategori: "Performa & Sistem Operasi" },
  { kode: "g30", label: "Sistem selalu meminta pengaturan (setup) CMOS", kategori: "Performa & Sistem Operasi" },
  { kode: "g31", label: "Laptop tidak berfungsi sama sekali", kategori: "Performa & Sistem Operasi" },
  // Suhu & Pendinginan
  { kode: "g32", label: "Laptop cepat / mudah menjadi panas (overheat)", kategori: "Suhu & Pendinginan" },
  { kode: "g33", label: "Suhu kipas tidak dalam kondisi baik", kategori: "Suhu & Pendinginan" },
  { kode: "g34", label: "Kipas mengeluarkan suara berisik", kategori: "Suhu & Pendinginan" },
  { kode: "g35", label: "Terdapat hembusan angin pada bagian pembuangan", kategori: "Suhu & Pendinginan" },
  { kode: "g36", label: "Kipas tidak berputar / tidak bersirkulasi", kategori: "Suhu & Pendinginan" },
  { kode: "g37", label: "Laptop sering mati secara mendadak", kategori: "Suhu & Pendinginan" },
  // Penyimpanan
  { kode: "g38", label: "Sistem tidak terdeteksi (No System Detect)", kategori: "Penyimpanan" },
  { kode: "g39", label: "Tidak bisa melakukan proses fast boot", kategori: "Penyimpanan" },
  { kode: "g40", label: "Muncul kode aneh / kode error pada layar", kategori: "Penyimpanan" },
  { kode: "g41", label: "Harddisk overheat / mudah panas", kategori: "Penyimpanan" },
  { kode: "g42", label: "Data sering tidak terbaca", kategori: "Penyimpanan" },
  { kode: "g43", label: "Tidak dapat membaca, menulis, menghapus, mengedit data", kategori: "Penyimpanan" },
  // Periferal
  { kode: "g44", label: "Keyboard tidak berfungsi", kategori: "Periferal & USB" },
  { kode: "g45", label: "Driver (USB) tidak terinstal", kategori: "Periferal & USB" },
  { kode: "g46", label: "Port USB dalam keadaan longgar", kategori: "Periferal & USB" },
  { kode: "g47", label: "Port USB mengalami kerusakan fisik", kategori: "Periferal & USB" },
  { kode: "g48", label: "Jalur (stripe) USB pada PCB terputus", kategori: "Periferal & USB" },
  { kode: "g49", label: "Fungsi USB Selective dalam status disable", kategori: "Periferal & USB" },
  // Pengisian Daya
  { kode: "g50", label: "Masalah pada colokan charger", kategori: "Pengisian Daya" },
  { kode: "g51", label: "Masalah pada komponen charger laptop", kategori: "Pengisian Daya" },
  { kode: "g52", label: "Masalah pada adaptor charger", kategori: "Pengisian Daya" },
  { kode: "g53", label: "Masalah pada sambungan kabel charger", kategori: "Pengisian Daya" },
  { kode: "g54", label: "Masalah pada ujung konektor charger", kategori: "Pengisian Daya" },
  { kode: "g55", label: "Masalah pada port charger", kategori: "Pengisian Daya" },
  { kode: "g56", label: "Muncul tanda silang pada indikator baterai", kategori: "Pengisian Daya" },
];

// Peta aturan -> gejala terkait (untuk perhitungan tingkat keyakinan & jejak inferensi)
const RULE_REQS: Record<string, string[]> = {
  power_supply: ["g1", "g2", "g3"],
  memori: ["g4", "g5", "g17", "g18"],
  monitor: ["g9", "g10", "g11", "g12", "g13", "g14", "g15"],
  vga: ["g16", "g19", "g20"],
  harddisk: ["g17", "g27", "g38", "g39", "g40", "g41", "g42"],
  optical_drive: ["g27", "g43"],
  motherboard: ["g27", "g29", "g30", "g32"],
  kipas: ["g19", "g32", "g33", "g34", "g35", "g36", "g37", "g44"],
  prosesor: ["g7", "g8", "g17", "g19", "g28", "g31", "g32", "g37"],
  operating_system: ["g6", "g21", "g22", "g23", "g24", "g25", "g26"],
  usb: ["g45", "g46", "g47", "g48", "g49"],
  pengisian_daya: ["g32", "g50", "g51", "g52", "g53", "g54", "g55", "g56"],
};

// Basis pengetahuan dalam Prolog (Tau-Prolog). Aturan menggunakan disjungsi (;)
// sehingga diagnosa muncul bila MINIMAL satu gejala terkait terpenuhi. Tingkat
// keyakinan dihitung di sisi aplikasi berdasarkan jumlah gejala yang cocok.
const PROLOG_KB = `
:- dynamic(gejala/1).

kerusakan(power_supply, 'Kerusakan Power Supply',
  'Periksa adaptor, kabel power, dan jalur power pada motherboard. Hentikan pemakaian jika ada bau hangus; bawa ke teknisi untuk pengecekan dan penggantian power supply / komponen yang terbakar.') :-
  ( gejala(g1) ; gejala(g2) ; gejala(g3) ).

kerusakan(memori, 'Kerusakan Memori (RAM)',
  'Lepas modul RAM, bersihkan pin kuningan dengan penghapus karet, pasang kembali dengan benar. Jika bunyi bip berulang atau BSOD tetap muncul, ganti modul RAM dengan tipe yang sesuai.') :-
  ( gejala(g4) ; gejala(g5) ; gejala(g17) ; gejala(g18) ).

kerusakan(monitor, 'Kerusakan Monitor / Layar (LCD)',
  'Tes dengan monitor eksternal melalui HDMI/VGA. Bila monitor eksternal normal, kerusakan ada di LCD atau kabel fleksibel; ganti panel LCD atau kabel fleksibel layar.') :-
  ( gejala(g9) ; gejala(g10) ; gejala(g11) ; gejala(g12) ; gejala(g13) ; gejala(g14) ; gejala(g15) ).

kerusakan(vga, 'Kerusakan VGA / Chipset Grafis',
  'Update driver VGA terbaru. Jika tetap hang/restart atau layar tidak muncul saat BIOS, kemungkinan chip VGA bermasalah dan perlu di-reball atau diganti oleh teknisi.') :-
  ( gejala(g16) ; gejala(g19) ; gejala(g20) ).

kerusakan(harddisk, 'Kerusakan Hard Drive / Harddisk',
  'Backup data segera. Jalankan CHKDSK / pemeriksaan SMART. Jika bad sector banyak, harddisk overheat, atau data tidak terbaca, ganti HDD dengan SSD baru.') :-
  ( gejala(g17) ; gejala(g27) ; gejala(g38) ; gejala(g39) ; gejala(g40) ; gejala(g41) ; gejala(g42) ).

kerusakan(optical_drive, 'Kerusakan Optical Drive (DVD/CD)',
  'Bersihkan lensa optik dengan cleaner disc. Jika tetap tidak bisa membaca/menulis, ganti modul optical drive atau gunakan optical drive eksternal USB.') :-
  ( gejala(g27) ; gejala(g43) ).

kerusakan(motherboard, 'Kerusakan Motherboard',
  'Reset BIOS / ganti baterai CMOS. Jika sistem tetap meminta setup CMOS, lambat, atau tidak bisa shutdown, bawa ke teknisi untuk pengecekan jalur dan chipset motherboard.') :-
  ( gejala(g27) ; gejala(g29) ; gejala(g30) ; gejala(g32) ).

kerusakan(kipas, 'Kerusakan Kipas (Fan)',
  'Bersihkan kipas & heatsink dari debu, ganti thermal paste prosesor. Jika kipas berisik atau tidak berputar, ganti modul kipas pendingin dengan yang baru.') :-
  ( gejala(g19) ; gejala(g32) ; gejala(g33) ; gejala(g34) ; gejala(g35) ; gejala(g36) ; gejala(g37) ; gejala(g44) ).

kerusakan(prosesor, 'Kerusakan Prosesor (Processor)',
  'Cek suhu CPU dengan aplikasi monitoring. Ganti thermal paste. Jika sering mati mendadak, gagal booting, atau hanya menyala sebentar, prosesor kemungkinan rusak dan perlu diganti.') :-
  ( gejala(g7) ; gejala(g8) ; gejala(g17) ; gejala(g19) ; gejala(g28) ; gejala(g31) ; gejala(g32) ; gejala(g37) ).

kerusakan(operating_system, 'Kerusakan Sistem Operasi (Operating System)',
  'Coba Safe Mode lalu jalankan Startup Repair / SFC /scannow. Jika Explorer/Start menu tetap rusak atau shutdown bermasalah, lakukan install ulang sistem operasi.') :-
  ( gejala(g6) ; gejala(g21) ; gejala(g22) ; gejala(g23) ; gejala(g24) ; gejala(g25) ; gejala(g26) ).

kerusakan(usb, 'Kerusakan USB',
  'Install ulang driver USB pada Device Manager dan aktifkan kembali USB Selective Suspend. Jika port longgar atau jalur PCB putus, perlu penyolderan ulang atau penggantian port USB.') :-
  ( gejala(g45) ; gejala(g46) ; gejala(g47) ; gejala(g48) ; gejala(g49) ).

kerusakan(pengisian_daya, 'Kerusakan Pengisian Daya (Charging)',
  'Periksa adaptor, kabel, dan port charger secara berurutan. Ganti adaptor / kabel / konektor yang bermasalah. Jika muncul tanda silang pada indikator baterai, ganti baterai atau perbaiki port charger.') :-
  ( gejala(g32) ; gejala(g50) ; gejala(g51) ; gejala(g52) ; gejala(g53) ; gejala(g54) ; gejala(g55) ; gejala(g56) ).

diagnosa(Kode, Nama, Solusi) :- kerusakan(Kode, Nama, Solusi).
`;

type Hasil = { kode: string; nama: string; solusi: string };
type HasilLengkap = Hasil & { gejalaCocok: string[]; keyakinan: number };

declare global {
  interface Window {
    pl?: any;
  }
}

function loadTauProlog(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("SSR"));
    if (window.pl) return resolve(window.pl);
    const urls = [
      "https://cdn.jsdelivr.net/npm/tau-prolog@0.3.4/modules/core.js",
      "https://cdn.jsdelivr.net/npm/tau-prolog@0.3.4/modules/lists.js",
    ];
    let loaded = 0;
    urls.forEach((src) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = false;
      s.onload = () => {
        loaded++;
        if (loaded === urls.length) resolve(window.pl);
      };
      s.onerror = () => reject(new Error("Gagal memuat Tau Prolog"));
      document.head.appendChild(s);
    });
  });
}

function Index() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [hasil, setHasil] = useState<HasilLengkap[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prologReady, setPrologReady] = useState(false);
  const [showKB, setShowKB] = useState(false);

  useEffect(() => {
    loadTauProlog()
      .then(() => setPrologReady(true))
      .catch((e) => setError(e.message));
  }, []);

  const toggle = (kode: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(kode)) next.delete(kode);
      else next.add(kode);
      return next;
    });
  };

  const reset = () => {
    setSelected(new Set());
    setHasil(null);
    setError(null);
  };

  const diagnosa = async () => {
    setError(null);
    setHasil(null);
    if (selected.size === 0) {
      setError("Pilih minimal satu gejala terlebih dahulu.");
      return;
    }
    if (!window.pl) {
      setError("Mesin Prolog belum siap, coba lagi sebentar.");
      return;
    }
    setLoading(true);
    try {
      const pl = window.pl;
      const session = pl.create(1000);
      const fakta = Array.from(selected)
        .map((g) => `gejala(${g}).`)
        .join("\n");
      const program = PROLOG_KB + "\n" + fakta;

      await new Promise<void>((resolve, reject) => {
        session.consult(program, {
          success: () => resolve(),
          error: (err: any) => reject(new Error("Error KB: " + pl.format_error(err))),
        });
      });

      await new Promise<void>((resolve, reject) => {
        session.query("diagnosa(K, N, S).", {
          success: () => resolve(),
          error: (err: any) => reject(new Error("Error Query: " + pl.format_error(err))),
        });
      });

      const results: Hasil[] = [];
      const seen = new Set<string>();

      const fetchAll = (): Promise<void> =>
        new Promise((resolve) => {
          session.answer({
            success: (ans: any) => {
              const kode = pl.format_answer(ans).match(/K = (\w+)/)?.[1] ?? "";
              const nama =
                pl.format_answer(ans).match(/N = '([^']+)'/)?.[1] ??
                pl.format_answer(ans).match(/N = ([^,]+),/)?.[1] ??
                "";
              const solusi =
                pl.format_answer(ans).match(/S = '([^']+)'/)?.[1] ?? "";
              if (kode && !seen.has(kode)) {
                seen.add(kode);
                results.push({ kode, nama, solusi });
              }
              fetchAll().then(resolve);
            },
            fail: () => resolve(),
            error: () => resolve(),
            limit: () => resolve(),
          });
        });

      await fetchAll();
      const lengkap: HasilLengkap[] = results
        .map((r) => {
          const req = RULE_REQS[r.kode] ?? [];
          const cocok = req.filter((g) => selected.has(g));
          const keyakinan = req.length
            ? Math.round((cocok.length / req.length) * 100)
            : 0;
          return { ...r, gejalaCocok: cocok, keyakinan };
        })
        .sort((a, b) => b.gejalaCocok.length - a.gejalaCocok.length || b.keyakinan - a.keyakinan);
      setHasil(lengkap);
    } catch (e: any) {
      setError(e.message ?? "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const totalDipilih = useMemo(() => selected.size, [selected]);
  const grouped = useMemo(() => {
    const map = new Map<string, Gejala[]>();
    for (const g of GEJALA) {
      if (!map.has(g.kategori)) map.set(g.kategori, []);
      map.get(g.kategori)!.push(g);
    }
    return Array.from(map.entries());
  }, []);
  const labelOf = (kode: string) =>
    GEJALA.find((g) => g.kode === kode)?.label ?? kode;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-indigo-600 to-blue-500 text-lg text-white shadow">
              🩺
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-base font-bold sm:text-lg">
                LaptopDx — Sistem Pakar Diagnosa Kerusakan Laptop
              </h1>
              <p className="truncate text-xs text-slate-500">
                Forward chaining inference engine · Tau-Prolog
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                prologReady
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                  : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  prologReady ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                }`}
              />
              {prologReady ? "Engine Siap" : "Memuat Engine..."}
            </span>
          </div>
        </div>
      </header>

      {/* Hero / intro */}
      <section className="border-b border-slate-200 bg-gradient-to-br from-indigo-700 via-blue-700 to-cyan-600 text-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wider backdrop-blur">
            Knowledge Based System
          </span>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
            Diagnosa kerusakan laptop Anda dalam 3 langkah
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-white/80 sm:text-base">
            Pilih gejala yang dialami, sistem akan menjalankan aturan Prolog,
            lalu menampilkan kemungkinan kerusakan beserta solusi yang
            disarankan oleh basis pengetahuan pakar.
          </p>

          {/* Stepper */}
          <ol className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { n: 1, t: "Input Gejala", d: "Centang gejala yang dialami" },
              { n: 2, t: "Inferensi", d: "Mesin Prolog mencocokkan aturan" },
              { n: 3, t: "Diagnosa & Solusi", d: "Lihat hasil dan rekomendasi" },
            ].map((s) => (
              <li
                key={s.n}
                className="flex items-center gap-3 rounded-lg bg-white/10 p-3 ring-1 ring-white/15 backdrop-blur"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-sm font-bold text-indigo-700">
                  {s.n}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{s.t}</div>
                  <div className="truncate text-xs text-white/75">{s.d}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-3">
        {/* Left: input panel */}
        <section className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-md bg-indigo-600 text-xs font-bold text-white">
                  1
                </span>
                <h3 className="text-sm font-semibold text-slate-800">
                  Konsultasi: Pilih Gejala
                </h3>
              </div>
              <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200">
                {totalDipilih} gejala dipilih
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {grouped.map(([kategori, items]) => (
                <div key={kategori} className="px-5 py-4">
                  <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                    {kategori}
                  </h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {items.map((g) => {
                      const checked = selected.has(g.kode);
                      return (
                        <label
                          key={g.kode}
                          className={`group flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition ${
                            checked
                              ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-300"
                              : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggle(g.kode)}
                            className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="min-w-0">
                            <span className="font-mono text-[10px] font-semibold text-slate-400">
                              {g.kode.toUpperCase()}
                            </span>
                            <span className="ml-1.5 text-slate-800">
                              {g.label}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4">
              <button
                onClick={diagnosa}
                disabled={loading || !prologReady}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {loading ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Menjalankan inferensi...
                  </>
                ) : (
                  <>🔎 Jalankan Diagnosa</>
                )}
              </button>
              <button
                onClick={reset}
                className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                ↺ Reset
              </button>
              <span className="ml-auto text-xs text-slate-500">
                Tips: pilih beberapa gejala untuk hasil yang lebih akurat.
              </span>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              ⚠️ {error}
            </div>
          )}

          {/* Hasil */}
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-md bg-emerald-600 text-xs font-bold text-white">
                  2
                </span>
                <h3 className="text-sm font-semibold text-slate-800">
                  Hasil Analisis & Solusi
                </h3>
              </div>
              {hasil && hasil.length > 0 && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                  {hasil.length} diagnosa ditemukan
                </span>
              )}
            </div>

            <div className="p-5">
              {!hasil && !loading && (
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
                  <div className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-full bg-white text-2xl shadow-sm">
                    🧠
                  </div>
                  <p className="text-sm font-medium text-slate-700">
                    Belum ada konsultasi
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Pilih gejala di atas lalu klik “Jalankan Diagnosa”.
                  </p>
                </div>
              )}

              {hasil && hasil.length === 0 && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  Tidak ada aturan pada basis pengetahuan yang cocok dengan
                  kombinasi gejala tersebut. Coba tambahkan atau ubah gejala
                  yang dipilih.
                </div>
              )}

              {hasil && hasil.length > 0 && (
                <ul className="space-y-4">
                  {hasil.map((h, i) => {
                    const langkah = h.solusi
                      .split(/(?<=[.!?])\s+/)
                      .map((s) => s.trim())
                      .filter(Boolean);
                    const level =
                      h.keyakinan >= 80
                        ? { t: "Tinggi", text: "text-emerald-700", bar: "bg-emerald-500" }
                        : h.keyakinan >= 50
                          ? { t: "Sedang", text: "text-amber-700", bar: "bg-amber-500" }
                          : { t: "Rendah", text: "text-slate-700", bar: "bg-slate-500" };
                    return (
                      <li
                        key={h.kode}
                        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-4 py-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                              #{i + 1}
                            </span>
                            <div className="min-w-0">
                              <h4 className="truncate text-sm font-bold text-slate-900 sm:text-base">
                                {h.nama}
                              </h4>
                              <p className="font-mono text-[10px] text-slate-500">
                                rule: {h.kode}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <div className="text-[10px] uppercase tracking-wider text-slate-500">
                                Keyakinan
                              </div>
                              <div className={`text-sm font-bold ${level.text}`}>
                                {h.keyakinan}% · {level.t}
                              </div>
                            </div>
                            <div className="h-10 w-16 overflow-hidden rounded-md bg-slate-100">
                              <div
                                className={`h-full ${level.bar} transition-all`}
                                style={{ width: `${h.keyakinan}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-4 p-4 sm:grid-cols-5">
                          <div className="sm:col-span-2">
                            <h5 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                              Gejala yang cocok
                            </h5>
                            <ul className="space-y-1.5">
                              {h.gejalaCocok.map((g) => (
                                <li
                                  key={g}
                                  className="flex items-start gap-2 text-xs text-slate-700"
                                >
                                  <span className="mt-0.5 text-emerald-600">✓</span>
                                  <span>
                                    <span className="font-mono text-[10px] text-slate-400">
                                      {g.toUpperCase()}
                                    </span>{" "}
                                    {labelOf(g)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="sm:col-span-3">
                            <h5 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                              Rekomendasi Solusi
                            </h5>
                            <ol className="space-y-2">
                              {langkah.map((l, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2 text-sm text-slate-700"
                                >
                                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">
                                    {idx + 1}
                                  </span>
                                  <span>{l}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      </li>
                    );
                  })}

                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800">
                    ℹ️ <strong>Disclaimer:</strong> hasil diagnosa bersifat
                    indikatif berdasarkan basis pengetahuan. Untuk perbaikan
                    perangkat keras, konsultasikan dengan teknisi resmi.
                  </div>
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* Right: sidebar */}
        <aside className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800">
              Tentang Sistem Pakar
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Sistem pakar (<em>expert system</em>) ini meniru cara berpikir
              seorang teknisi laptop. Menggunakan{" "}
              <strong>forward chaining</strong>: fakta (gejala) dicocokkan
              dengan aturan untuk menghasilkan kesimpulan (kerusakan).
            </p>
            <dl className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-100 py-1.5">
                <dt className="text-slate-500">Total Gejala</dt>
                <dd className="font-semibold text-slate-800">
                  {GEJALA.length}
                </dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1.5">
                <dt className="text-slate-500">Aturan Pakar</dt>
                <dd className="font-semibold text-slate-800">
                  {Object.keys(RULE_REQS).length}
                </dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1.5">
                <dt className="text-slate-500">Engine</dt>
                <dd className="font-semibold text-slate-800">Tau-Prolog</dd>
              </div>
              <div className="flex justify-between py-1.5">
                <dt className="text-slate-500">Metode</dt>
                <dd className="font-semibold text-slate-800">
                  Forward Chaining
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <button
              onClick={() => setShowKB((v) => !v)}
              className="flex w-full items-center justify-between px-5 py-3 text-left"
            >
              <span className="text-sm font-bold text-slate-800">
                📜 Basis Pengetahuan (Prolog)
              </span>
              <span className="text-xs text-slate-500">
                {showKB ? "Tutup" : "Lihat"}
              </span>
            </button>
            {showKB && (
              <pre className="max-h-80 overflow-auto border-t border-slate-200 bg-slate-900 p-4 font-mono text-[11px] leading-relaxed text-emerald-200">
{PROLOG_KB.trim()}
              </pre>
            )}
          </div>

          <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-indigo-900">
              💡 Cara Penggunaan
            </h3>
            <ol className="mt-2 space-y-1.5 text-xs text-slate-700">
              <li>1. Pilih semua gejala yang Anda alami.</li>
              <li>2. Klik tombol “Jalankan Diagnosa”.</li>
              <li>3. Periksa hasil & ikuti langkah solusi.</li>
            </ol>
          </div>
        </aside>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-slate-500 sm:px-6">
          © {new Date().getFullYear()} LaptopDx · Sistem Pakar berbasis Prolog
          · Dibangun dengan React + Tau-Prolog
        </div>
      </footer>
    </div>
  );
}
