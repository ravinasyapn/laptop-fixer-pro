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
  { kode: "g1", label: "Laptop tidak menyala sama sekali", kategori: "Power & Daya" },
  { kode: "g2", label: "Lampu indikator power menyala tapi layar gelap", kategori: "Power & Daya" },
  { kode: "g7", label: "Baterai cepat habis / tidak bisa mengisi", kategori: "Power & Daya" },
  { kode: "g6", label: "Laptop mati sendiri secara tiba-tiba", kategori: "Power & Daya" },
  { kode: "g3", label: "Layar berkedip atau bergaris", kategori: "Layar & Grafis" },
  { kode: "g13", label: "Muncul blue screen (BSOD)", kategori: "Layar & Grafis" },
  { kode: "g4", label: "Laptop cepat panas (overheat)", kategori: "Suhu & Pendingin" },
  { kode: "g5", label: "Kipas berisik atau berputar sangat kencang", kategori: "Suhu & Pendingin" },
  { kode: "g12", label: "Laptop sangat lambat / sering hang", kategori: "Performa & Sistem" },
  { kode: "g16", label: "Booting gagal / stuck di logo", kategori: "Performa & Sistem" },
  { kode: "g14", label: "Bunyi 'klik-klik' dari dalam laptop", kategori: "Penyimpanan" },
  { kode: "g8", label: "Keyboard tidak berfungsi sebagian / seluruhnya", kategori: "Periferal" },
  { kode: "g9", label: "Touchpad tidak responsif", kategori: "Periferal" },
  { kode: "g10", label: "Tidak ada suara dari speaker", kategori: "Periferal" },
  { kode: "g11", label: "Tidak bisa terhubung ke WiFi", kategori: "Konektivitas" },
  { kode: "g15", label: "Port USB tidak mendeteksi perangkat", kategori: "Konektivitas" },
];

// Peta aturan -> gejala yang dibutuhkan (untuk perhitungan keyakinan & jejak inferensi)
const RULE_REQS: Record<string, string[]> = {
  motherboard_rusak: ["g1", "g2"],
  adaptor_baterai: ["g1", "g7"],
  lcd_rusak: ["g3"],
  vga_rusak: ["g3", "g13"],
  overheating: ["g4", "g5"],
  overheat_shutdown: ["g4", "g6"],
  baterai_drop: ["g7"],
  keyboard_rusak: ["g8"],
  touchpad_rusak: ["g9"],
  audio_rusak: ["g10"],
  wifi_rusak: ["g11"],
  hardisk_rusak: ["g12", "g14"],
  hardisk_klik: ["g14"],
  ram_rusak: ["g12", "g13"],
  os_corrupt: ["g13", "g16"],
  boot_gagal: ["g16"],
  usb_rusak: ["g15"],
  performa_lambat: ["g12"],
};

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
                        ? { t: "Tinggi", c: "emerald" }
                        : h.keyakinan >= 50
                          ? { t: "Sedang", c: "amber" }
                          : { t: "Rendah", c: "slate" };
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
                              <div
                                className={`text-sm font-bold text-${level.c}-700`}
                              >
                                {h.keyakinan}% · {level.t}
                              </div>
                            </div>
                            <div className="h-10 w-16 overflow-hidden rounded-md bg-slate-100">
                              <div
                                className={`h-full bg-${level.c}-500 transition-all`}
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
