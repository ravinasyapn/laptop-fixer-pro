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

type Gejala = { kode: string; label: string };

const GEJALA: Gejala[] = [
  { kode: "g1", label: "Laptop tidak menyala sama sekali" },
  { kode: "g2", label: "Lampu indikator power menyala tapi layar gelap" },
  { kode: "g3", label: "Layar berkedip atau bergaris" },
  { kode: "g4", label: "Laptop cepat panas (overheat)" },
  { kode: "g5", label: "Kipas berisik atau berputar sangat kencang" },
  { kode: "g6", label: "Laptop mati sendiri secara tiba-tiba" },
  { kode: "g7", label: "Baterai cepat habis / tidak bisa mengisi" },
  { kode: "g8", label: "Keyboard tidak berfungsi sebagian / seluruhnya" },
  { kode: "g9", label: "Touchpad tidak responsif" },
  { kode: "g10", label: "Tidak ada suara dari speaker" },
  { kode: "g11", label: "Tidak bisa terhubung ke WiFi" },
  { kode: "g12", label: "Laptop sangat lambat / sering hang" },
  { kode: "g13", label: "Muncul blue screen (BSOD)" },
  { kode: "g14", label: "Bunyi 'klik-klik' dari dalam laptop" },
  { kode: "g15", label: "Port USB tidak mendeteksi perangkat" },
  { kode: "g16", label: "Booting gagal / stuck di logo" },
];

// Basis pengetahuan dalam bahasa Prolog (Tau-Prolog).
const PROLOG_KB = `
:- dynamic(gejala/1).

kerusakan(motherboard_rusak, 'Motherboard / Mainboard bermasalah',
  'Bawa ke teknisi untuk pengecekan jalur power dan chipset. Kemungkinan perlu reball / penggantian komponen pada motherboard.') :-
  gejala(g1), gejala(g2).

kerusakan(adaptor_baterai, 'Adaptor / Baterai bermasalah',
  'Coba lepas baterai dan colok langsung ke adaptor. Jika hidup, ganti baterai. Jika tidak, ganti adaptor charger.') :-
  gejala(g1), gejala(g7).

kerusakan(lcd_rusak, 'LCD / Layar laptop rusak',
  'Tes dengan monitor eksternal melalui HDMI. Jika monitor eksternal normal, kemungkinan LCD atau kabel fleksibel layar harus diganti.') :-
  gejala(g3).

kerusakan(vga_rusak, 'VGA / Chipset grafis bermasalah',
  'Jika monitor eksternal juga bergaris/berkedip, kemungkinan VGA rusak. Perlu reball atau penggantian chip VGA oleh teknisi.') :-
  gejala(g3), gejala(g13).

kerusakan(overheating, 'Sistem pendingin bermasalah (Overheat)',
  'Bersihkan kipas dan heatsink dari debu, ganti thermal paste prosesor. Jika kipas berisik, kemungkinan bearing kipas aus dan perlu diganti.') :-
  gejala(g4), gejala(g5).

kerusakan(overheat_shutdown, 'Overheat menyebabkan auto shutdown',
  'Laptop melakukan proteksi otomatis karena suhu CPU/GPU terlalu tinggi. Bersihkan pendingin dan ganti thermal paste segera.') :-
  gejala(g4), gejala(g6).

kerusakan(baterai_drop, 'Baterai drop / rusak',
  'Kapasitas baterai sudah menurun. Ganti baterai dengan yang baru dan original.') :-
  gejala(g7).

kerusakan(keyboard_rusak, 'Keyboard rusak',
  'Coba gunakan keyboard eksternal USB untuk memastikan. Jika eksternal normal, ganti modul keyboard internal.') :-
  gejala(g8).

kerusakan(touchpad_rusak, 'Touchpad rusak atau driver bermasalah',
  'Cek pengaturan touchpad dan update driver. Jika tetap, kabel fleksibel touchpad mungkin lepas atau modul rusak.') :-
  gejala(g9).

kerusakan(audio_rusak, 'Speaker / Driver audio bermasalah',
  'Update / install ulang driver audio. Jika tetap tidak bunyi, speaker internal kemungkinan putus dan harus diganti.') :-
  gejala(g10).

kerusakan(wifi_rusak, 'Modul WiFi bermasalah',
  'Restart, lupakan jaringan lalu sambung ulang. Jika gagal, install ulang driver WiFi atau ganti modul WiFi card.') :-
  gejala(g11).

kerusakan(hardisk_rusak, 'Hardisk / HDD rusak (Bad Sector)',
  'Bunyi klik dan lambat menandakan HDD rusak. Backup data segera dan ganti HDD ke SSD untuk performa lebih baik.') :-
  gejala(g12), gejala(g14).

kerusakan(hardisk_klik, 'Hardisk rusak fisik',
  'Suara klik dari dalam laptop adalah ciri khas head HDD rusak. Segera ganti HDD sebelum data hilang total.') :-
  gejala(g14).

kerusakan(ram_rusak, 'RAM bermasalah',
  'Lepas dan bersihkan kuningan RAM dengan penghapus karet. Jika BSOD tetap muncul, ganti modul RAM.') :-
  gejala(g12), gejala(g13).

kerusakan(os_corrupt, 'Sistem Operasi corrupt',
  'Coba safe mode atau startup repair. Jika gagal, install ulang sistem operasi (Windows / Linux).') :-
  gejala(g13), gejala(g16).

kerusakan(boot_gagal, 'Bootloader / Storage bermasalah',
  'Cek urutan boot di BIOS. Kemungkinan bootloader rusak atau storage tidak terdeteksi, perlu repair boot atau ganti storage.') :-
  gejala(g16).

kerusakan(usb_rusak, 'Port USB rusak',
  'Coba di port USB lain. Jika semua port mati, kemungkinan controller USB pada motherboard rusak.') :-
  gejala(g15).

kerusakan(performa_lambat, 'Performa lambat (RAM/Storage penuh)',
  'Tutup aplikasi yang tidak perlu, scan virus, upgrade RAM, atau ganti HDD ke SSD.') :-
  gejala(g12).

diagnosa(Kode, Nama, Solusi) :- kerusakan(Kode, Nama, Solusi).
`;

type Hasil = { kode: string; nama: string; solusi: string };

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
  const [hasil, setHasil] = useState<Hasil[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prologReady, setPrologReady] = useState(false);

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
      setHasil(results);
    } catch (e: any) {
      setError(e.message ?? "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const totalDipilih = useMemo(() => selected.size, [selected]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            🖥️ Sistem Pakar Diagnosa Kerusakan Laptop
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Berbasis bahasa pemrograman <strong>Prolog</strong> (Tau-Prolog) — pilih
            gejala yang Anda alami, lalu sistem akan menganalisis kemungkinan
            kerusakannya.
          </p>
          <div className="mt-2 text-xs text-slate-500">
            Mesin inferensi:{" "}
            <span
              className={
                prologReady ? "font-medium text-emerald-600" : "text-amber-600"
              }
            >
              {prologReady ? "siap ✓" : "memuat..."}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              1. Pilih Gejala
            </h2>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              {totalDipilih} dipilih
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {GEJALA.map((g) => {
              const checked = selected.has(g.kode);
              return (
                <label
                  key={g.kode}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-all ${
                    checked
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(g.kode)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-800">
                    <span className="font-mono text-xs text-slate-500">
                      [{g.kode.toUpperCase()}]
                    </span>{" "}
                    {g.label}
                  </span>
                </label>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={diagnosa}
              disabled={loading || !prologReady}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? "Menganalisis..." : "🔍 Analisis Kerusakan"}
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Reset
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            2. Hasil Analisis
          </h2>
          {!hasil && (
            <p className="mt-2 text-sm text-slate-500">
              Belum ada hasil. Pilih gejala lalu klik "Analisis Kerusakan".
            </p>
          )}
          {hasil && hasil.length === 0 && (
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Tidak ditemukan kerusakan yang cocok dengan kombinasi gejala
              tersebut pada basis pengetahuan. Coba tambah/ubah gejala.
            </div>
          )}
          {hasil && hasil.length > 0 && (
            <ul className="mt-4 space-y-4">
              {hasil.map((h, i) => (
                <li
                  key={h.kode}
                  className="rounded-lg border border-emerald-200 bg-emerald-50 p-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
                      #{i + 1}
                    </span>
                    <h3 className="text-base font-semibold text-emerald-900">
                      {h.nama}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    <strong className="text-slate-900">Solusi:</strong> {h.solusi}
                  </p>
                  <p className="mt-2 font-mono text-xs text-slate-500">
                    aturan: {h.kode}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-6 rounded-xl border border-slate-200 bg-slate-900 p-6 text-slate-100 shadow-sm">
          <h2 className="text-lg font-semibold">
            📜 Cuplikan Basis Pengetahuan (Prolog)
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Aturan diagnosa ditulis dalam Prolog dan dieksekusi langsung di browser
            menggunakan Tau-Prolog.
          </p>
          <pre className="mt-3 max-h-72 overflow-auto rounded-lg bg-black/40 p-4 font-mono text-xs leading-relaxed text-emerald-200">
{PROLOG_KB.trim()}
          </pre>
        </section>

        <footer className="mt-8 pb-6 text-center text-xs text-slate-500">
          Sistem Pakar Kerusakan Laptop • Dibangun dengan React + Tau-Prolog
        </footer>
      </main>
    </div>
  );
}
