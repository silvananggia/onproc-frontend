export const MODULE_CATEGORIES = [
  { id: "kebencanaan", label: "Kebencanaan" },
  { id: "kehutanan", label: "Kehutanan" },
  { id: "perikanan", label: "Perikanan" },
  { id: "pertanian", label: "Pertanian" },
  { id: "lingkungan", label: "Lingkungan" },
];

const DATASET_ICON =
  "https://cdn.builder.io/api/v1/image/assets/TEMP/18be0e4c2c7964d619cb063d3b64f0f6fad52187?placeholderIfAbsent=true&apiKey=c794d0341bde47ac8d2a26f34a39214e";
const SATELLITE_ICON =
  "https://cdn.builder.io/api/v1/image/assets/TEMP/26d491c1fe71ad3856bc02054b6aae605efec76a?placeholderIfAbsent=true&apiKey=c794d0341bde47ac8d2a26f34a39214e";
const HOTSPOT_ICON =
  "https://cdn.builder.io/api/v1/image/assets/TEMP/9e0eb0f166f711be45824a1ac1e055d497412cc7?placeholderIfAbsent=true&apiKey=c794d0341bde47ac8d2a26f34a39214e";

export function getCatalogModules(user) {
  return [
    {
      id: 1,
      title: "Deteksi Area Kebakaran",
      subtitle: user ? "" : "(Akses Memerlukan Login)",
      url: user ? "/map" : "/signin-app",
      description:
        "Modul pemetaan geospasial yang dirancang untuk mendeteksi dan memetakan area lahan terbakar berdasarkan data penginderaan jauh. Hasil dari modul ini berguna untuk mendukung kegiatan pemantauan kebakaran hutan dan lahan, perencanaan pemulihan, serta pengambilan keputusan dalam mitigasi bencana lingkungan.",
      datasets: "Sentinel-2, Landsat 8/9",
      datasetTags: ["Sentinel-2", "Landsat 8/9"],
      category: "kebencanaan",
      requiresLogin: true,
      iconUrl: SATELLITE_ICON,
    },
    {
      id: 2,
      title: "Hotspot",
      url: "/info-hotspot",
      description:
        "Modul pemetaan geospasial yang digunakan untuk mendeteksi dan memvisualisasikan titik-titik panas (hotspot) yang mengindikasikan potensi kejadian kebakaran di suatu wilayah. Hasil dari modul ini dapat digunakan untuk pemantauan kebakaran secara dini, analisis sebaran titik api, serta dukungan pengambilan keputusan dalam upaya mitigasi dan penanggulangan bencana kebakaran hutan dan lahan.",
      datasets: "MODIS, VIIRS",
      datasetTags: ["MODIS", "VIIRS"],
      category: "kebencanaan",
      requiresLogin: false,
      iconUrl: HOTSPOT_ICON,
    },
    {
      id: 3,
      title: "Deforestasi",
      url: "/info-deforestasi",
      description:
        "Informasi deforestasi di Sumatera, Kalimantan, Sulawesi, dan Papua pada periode tahun 2023-2024 serta tahun 2024-2025. Analisis dilakukan menggunakan data citra satelit untuk memantau perubahan tutupan hutan di wilayah-wilayah tersebut.",
      datasets: "Landsat",
      datasetTags: ["Landsat 8/9"],
      category: "kehutanan",
      requiresLogin: false,
      iconUrl: HOTSPOT_ICON,
    },
    {
      id: 4,
      title: "Zona Potensi Penangkapan Ikan",
      url: "/info-zppi",
      description:
        "Modul pemetaan geospasial yang digunakan untuk mengidentifikasi dan memetakan area laut yang berpotensi tinggi sebagai lokasi penangkapan ikan. Analisis dalam modul ini didasarkan pada data oseanografi seperti suhu permukaan laut, klorofil, dan arus laut yang diintegrasikan dengan data penginderaan jauh.",
      datasets: "MODIS, VIIRS",
      datasetTags: ["MODIS", "VIIRS"],
      category: "perikanan",
      requiresLogin: false,
      iconUrl: DATASET_ICON,
    },
    {
      id: 5,
      title: "Indeks Penanaman Padi (Akses Terbatas)",
      subtitle: user ? "" : "(Akses Memerlukan Login)",
      url: user ? "/map-pangan" : "/signin-app",
      description:
        "Indeks Penanaman Padi dari data satelit Sentinel-1 dengan mode interaktif untuk melakukan pemrosesan sesuai dengan area yang diinginkan.",
      datasets: "Sentinel-1",
      datasetTags: ["Sentinel-1"],
      category: "pertanian",
      requiresLogin: true,
      iconUrl: SATELLITE_ICON,
    },
    {
      id: 6,
      title: "Indeks Penanaman Padi",
      url: "/indeks-penanaman-padi",
      description:
        "Indeks Penanaman Padi dari data satelit Sentinel-1 tahun 2023 dan 2024.",
      datasets: "Sentinel-1",
      datasetTags: ["Sentinel-1"],
      category: "pertanian",
      requiresLogin: false,
      iconUrl: SATELLITE_ICON,
    },
    {
      id: 7,
      title: "Rawan Banjir dan Kering Lahan Sawah",
      url: "/info-rawan-sawah",
      description:
        "Informasi Rawan Banjir dan Kering Lahan Sawah merupakan informasi spasial yang diperoleh dari hasil ekstraksi citra Terra-MODIS.",
      datasets: "Terra-MODIS",
      datasetTags: ["MODIS"],
      category: "pertanian",
      requiresLogin: false,
      iconUrl: DATASET_ICON,
    },
    {
      id: 8,
      title: "Informasi Tanggap Darurat Bencana",
      url: "https://spectra.brin.go.id",
      description:
        "Informasi Tanggap Darurat Bencana merupakan informasi spasial yang diperoleh dari hasil ekstraksi citra resolusi tinggi.",
      datasets: "High Resolution Satellite",
      datasetTags: ["High Resolution Satellite"],
      category: "kebencanaan",
      requiresLogin: false,
      external: true,
      iconUrl: DATASET_ICON,
    },
    {
      id: 9,
      title: "Tumpahan Minyak",
      url: "/info-spill",
      description:
        "Modul pemetaan geospasial untuk memantau dan memvisualisasikan sebaran tumpahan minyak di wilayah perairan, khususnya Kepulauan Riau dan Kalimantan Timur. Informasi dihasilkan dari analisis citra satelit dan dapat digunakan untuk mendukung tanggap darurat, pemantauan pencemaran laut, serta pengambilan keputusan dalam penanggulangan tumpahan minyak.",
      datasets: "Sentinel-1, Sentinel-2, Landsat 8/9",
      datasetTags: ["Sentinel-1", "Sentinel-2", "Landsat 8/9"],
      category: "lingkungan",
      requiresLogin: false,
      iconUrl: DATASET_ICON,
    },
    // {
    //   id: 10,
    //   title: "Tuna Finder",
    //   url: "/info-tunafinder",
    //   description:
    //     "Modul pemetaan habitat dan potensi penangkapan tuna berdasarkan Habitat Suitability Index (HSI), area tangkap, dan titik tangkap. Pengguna dapat memfilter spesies, periode waktu, dan kategori potensi untuk mendukung operasi perikanan tuna yang lebih efisien.",
    //   datasets: "MODIS, VIIRS, Model HSI",
    //   datasetTags: ["MODIS", "VIIRS"],
    //   category: "perikanan",
    //   requiresLogin: false,
    //   iconUrl: DATASET_ICON,
    // },
    // {
    //   id: 11,
    //   title: "Devegetasi",
    //   url: "/info-devegetasi",
    //   description:
    //     "Dashboard pemantauan devegetasi untuk melihat perubahan tutupan vegetasi secara spasial sebagai dukungan analisis lingkungan dan kehutanan.",
    //   datasets: "Citra satelit optik",
    //   datasetTags: ["Landsat 8/9", "Sentinel-2"],
    //   category: "kehutanan",
    //   requiresLogin: false,
    //   iconUrl: HOTSPOT_ICON,
    // },
    {
      id: 10,
      title: "Emisi CO2 dan CH4",
      url: "/info-ch4",
      description:
        "Peta klasifikasi emisi karbon dioksida (ODIAC) untuk Indonesia dan emisi metana dari lahan sawah Jawa-Bali. Pengguna dapat memilih jenis informasi dan tahun pengamatan.",
      datasets: "ODIAC, Sentinel-2",
      datasetTags: ["Sentinel-2", "ODIAC"],
      category: "lingkungan",
      requiresLogin: false,
      iconUrl: DATASET_ICON,
    },
    {
      id: 11,
      title: "Alert Deforestasi Mangrove",
      url: "/info-mangrove",
      description:
        "Informasi alert deforestasi mangrove pada enam lokasi prioritas: Cilacap, Indramayu, Maros, Pekalongan, Semarang, dan Teluk Benoa, dengan pembaruan semesteran.",
      datasets: "Sentinel-2, Landsat 8/9",
      datasetTags: ["Sentinel-2", "Landsat 8/9"],
      category: "kehutanan",
      requiresLogin: false,
      iconUrl: HOTSPOT_ICON,
    },
    {
      id: 12,
      title: "Penurunan Muka Tanah",
      url: "/info-landsubsidence",
      description:
        "Pemantauan penurunan muka tanah (land subsidence) di Jawa dan Jakarta berdasarkan analisis interferometri InSAR, termasuk displacement vertikal, Line of Sight, serta komponen quasi UD dan EW.",
      datasets: "Sentinel-1, ALOS-2",
      datasetTags: ["Sentinel-1"],
      category: "kebencanaan",
      requiresLogin: false,
      iconUrl: DATASET_ICON,
    },
    {
      id: 13,
      title: "Fase Pertumbuhan Padi",
      url: "/info-fase-padi",
      description:
        "Informasi fase dan umur padi berdasarkan pengolahan data satelit Sentinel-1 per periode 12 harian untuk mendukung pemantauan musim tanam dan produktivitas lahan sawah.",
      datasets: "Sentinel-1",
      datasetTags: ["Sentinel-1"],
      category: "pertanian",
      requiresLogin: false,
      iconUrl: SATELLITE_ICON,
    },
  ];
}

export function getAllDatasetTags(modules) {
  const tags = new Set();
  modules.forEach((module) => {
    (module.datasetTags || []).forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort((a, b) => a.localeCompare(b, "id"));
}

export function filterAndSortModules({
  modules,
  searchQuery,
  selectedDatasets,
  selectedCategories,
  accessFilter,
  sortOrder,
}) {
  const query = (searchQuery || "").trim().toLowerCase();

  let result = modules.filter((module) => {
    const matchesSearch =
      !query ||
      module.title.toLowerCase().includes(query) ||
      (module.description || "").toLowerCase().includes(query) ||
      (module.datasets || "").toLowerCase().includes(query);

    const matchesDataset =
      selectedDatasets.length === 0 ||
      selectedDatasets.some((tag) => (module.datasetTags || []).includes(tag));

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(module.category);

    const matchesAccess =
      accessFilter === "all" ||
      (accessFilter === "login" && module.requiresLogin) ||
      (accessFilter === "public" && !module.requiresLogin);

    return matchesSearch && matchesDataset && matchesCategory && matchesAccess;
  });

  if (sortOrder === "az") {
    result = [...result].sort((a, b) => a.title.localeCompare(b.title, "id"));
  } else if (sortOrder === "za") {
    result = [...result].sort((a, b) => b.title.localeCompare(a.title, "id"));
  }

  return result;
}
