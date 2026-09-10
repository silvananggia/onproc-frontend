const TILE_BASE =
  "https://geomimo-prototype.brin.go.id/tiles/cog/tiles/WebMercatorQuad/{z}/{x}/{y}.png";
const TILEJSON_BASE =
  "https://geomimo-prototype.brin.go.id/tiles/cog/WebMercatorQuad/tilejson.json";

const CO2_COLORMAP = {
  0: [0, 0, 0, 0],
  1: [43, 131, 186, 255],
  2: [171, 221, 164, 255],
  3: [255, 255, 191, 255],
  4: [253, 174, 97, 255],
  5: [215, 25, 28, 255],
};

const CO2_LEGEND_ITEMS = [
  { color: "rgb(43,131,186)", label: "≤ 2.500 ton CO₂/tahun" },
  { color: "rgb(171,221,164)", label: "2.500 – 7.500" },
  { color: "rgb(255,255,191)", label: "7.500 – 25.000" },
  { color: "rgb(253,174,97)", label: "25.000 – 75.000" },
  { color: "rgb(215,25,28)", label: "> 75.000 ton CO₂/tahun" },
];

const CH4_COLORMAP = {
  0: [0, 0, 0, 0],
  1: [50, 136, 189, 255],
  2: [102, 194, 165, 255],
  3: [171, 221, 164, 255],
  4: [230, 245, 152, 255],
  5: [254, 224, 139, 255],
  6: [253, 174, 97, 255],
  7: [244, 109, 67, 255],
  8: [213, 62, 79, 255],
};

const CH4_LEGEND_ITEMS = [
  { color: "rgb(50,136,189)", label: "≤ 50 mg/Ha/hari" },
  { color: "rgb(102,194,165)", label: "50 – 100" },
  { color: "rgb(171,221,164)", label: "100 – 150" },
  { color: "rgb(230,245,152)", label: "150 – 200" },
  { color: "rgb(254,224,139)", label: "200 – 250" },
  { color: "rgb(253,174,97)", label: "250 – 300" },
  { color: "rgb(244,109,67)", label: "300 – 350" },
  { color: "rgb(213,62,79)", label: "> 350 mg/Ha/hari" },
];

const MANGROVE_COLORMAP = {
  0: [0, 0, 0, 0],
  1: [255, 237, 160, 255],
  2: [254, 178, 76, 255],
  3: [227, 26, 28, 255],
};

const UMUR_PADI_COLORMAP = {
  0: [0, 0, 0, 0],
  1: [237, 248, 233, 255],
  2: [199, 233, 192, 255],
  3: [161, 217, 155, 255],
  4: [116, 196, 118, 255],
  5: [65, 171, 93, 255],
  6: [35, 139, 69, 255],
  7: [0, 109, 44, 255],
  8: [0, 68, 27, 255],
  9: [255, 237, 160, 255],
  10: [254, 178, 76, 255],
  11: [189, 189, 189, 255],
  12: [255, 196, 0, 255],
  13: [158, 202, 225, 255],
};

const MONTHS_ID = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const UMUR_PADI_FIXED_PERIODS = [
  [1, 1, 1, 12],
  [1, 13, 1, 24],
  [1, 25, 2, 5],
  [2, 6, 2, 12],
  [2, 13, 2, 24],
  [2, 25, 3, 8],
  [3, 9, 3, 20],
  [3, 21, 4, 1],
  [4, 2, 4, 12],
  [4, 13, 4, 24],
  [4, 25, 5, 6],
  [5, 7, 5, 18],
];

function formatDayMonth(date) {
  return `${date.getUTCDate()} ${MONTHS_ID[date.getUTCMonth()]}`;
}

function formatPeriodRange(start, end, year) {
  if (start.getUTCMonth() === end.getUTCMonth()) {
    return `${start.getUTCDate()}–${end.getUTCDate()} ${MONTHS_ID[start.getUTCMonth()]} ${year}`;
  }
  return `${formatDayMonth(start)}–${formatDayMonth(end)} ${year}`;
}

function makePeriod(index, start, end, year) {
  const rangeLabel = formatPeriodRange(start, end, year);
  return {
    value: String(index),
    label: `${index}. ${rangeLabel}`,
    rangeLabel,
  };
}

function getTwelveDayPeriods(year, fromPeriod = 1) {
  const endOfYear = new Date(Date.UTC(year, 11, 31));
  const periods = [];

  UMUR_PADI_FIXED_PERIODS.forEach(([sm, sd, em, ed], i) => {
    const index = i + 1;
    if (index < fromPeriod) return;
    periods.push(
      makePeriod(
        index,
        new Date(Date.UTC(year, sm - 1, sd)),
        new Date(Date.UTC(year, em - 1, ed)),
        year
      )
    );
  });

  let index = UMUR_PADI_FIXED_PERIODS.length + 1;
  let cursor = new Date(Date.UTC(year, 4, 19));
  while (cursor <= endOfYear) {
    const periodEnd = new Date(cursor);
    periodEnd.setUTCDate(periodEnd.getUTCDate() + 11);
    if (periodEnd > endOfYear) {
      periodEnd.setTime(endOfYear.getTime());
    }
    if (index >= fromPeriod) {
      periods.push(makePeriod(index, cursor, periodEnd, year));
    }
    cursor = new Date(periodEnd);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    index += 1;
  }

  return periods;
}

const UMUR_PADI_PERIODS = {
  2025: getTwelveDayPeriods(2025, 3),
  2026: getTwelveDayPeriods(2026),
};

export function getCogTileUrl({
  s3Path,
  colormap,
  colormapName,
  rescale,
  nodata,
}) {
  const params = new URLSearchParams({ url: s3Path });
  if (colormap) {
    params.set("colormap", JSON.stringify(colormap));
  }
  if (colormapName) {
    params.set("colormap_name", colormapName);
  }
  if (rescale) {
    params.set("rescale", rescale);
  }
  if (nodata !== undefined && nodata !== null && nodata !== "") {
    params.set("nodata", String(nodata));
  }
  return `${TILE_BASE}?${params.toString()}`;
}

export function getCogTileJsonUrl(s3Path) {
  const params = new URLSearchParams({ url: s3Path });
  return `${TILEJSON_BASE}?${params.toString()}`;
}

const POINT_BASE = "https://geomimo-prototype.brin.go.id/tiles/cog/point";

export function getCogPointUrl(lon, lat, s3Path) {
  const params = new URLSearchParams({ url: s3Path });
  return `${POINT_BASE}/${lon},${lat}?${params.toString()}`;
}

export function describeCogValue(raw, layerConfig, config) {
  const num = Number(raw);
  if (raw === null || raw === undefined || !Number.isFinite(num) || Math.abs(num) > 1e30) {
    return { valueLabel: "Tidak ada data", classLabel: null, color: null };
  }

  if (layerConfig?.legendGradient) {
    const digits = Math.abs(num) >= 1 ? 2 : 4;
    return {
      valueLabel: `${num.toFixed(digits)}`,
      classLabel: layerConfig.legendTitle || "Nilai raster",
      color: null,
    };
  }

  const klass = Math.round(num);
  if (klass === 0) {
    return { valueLabel: "Tidak ada data", classLabel: null, color: null };
  }

  const items = layerConfig?.legendItems || config?.legendItems || [];
  const byIndex = items[klass - 1];
  const byPrefix = items.find((item) => item.label.trim().startsWith(String(klass)));
  const item = byPrefix || byIndex;

  return {
    valueLabel: String(klass),
    classLabel: item?.label || `Kelas ${klass}`,
    color: item?.color || null,
  };
}

export const PRODUCT_CONFIGS = {
  ch4: {
    id: "ch4",
    title: "Emisi CO2 dan CH4",
    defaultZoom: 5,
    defaultCenterLonLat: [118, -2.5],
    filters: [
      {
        key: "layerType",
        label: "Jenis Informasi",
        options: [
          { value: "co2", label: "Emisi CO2 (ODIAC, Indonesia)" },
          { value: "paddy", label: "Emisi CH4 Lahan Sawah (Jawa-Bali)" },
        ],
      },
      {
        key: "year",
        label: "Tahun",
        dependsOn: "layerType",
        optionsBy: {
          co2: [
            { value: "2019", label: "2019" },
            { value: "2020", label: "2020" },
            { value: "2021", label: "2021" },
            { value: "2022", label: "2022" },
            { value: "2023", label: "2023" },
          ],
          paddy: [
            { value: "2021", label: "2021" },
            { value: "2022", label: "2022" },
            { value: "2023", label: "2023" },
            { value: "2024", label: "2024" },
            { value: "2025", label: "2025" },
          ],
        },
      },
    ],
    defaults: { layerType: "co2", year: "2023" },
    getLayer: ({ layerType, year }) => {
      if (layerType === "paddy") {
        return {
          s3Path: `s3://cog/ch4/paddy/${year}/ch4class_evi2_jawabali_${year}_cog.tif`,
          colormap: CH4_COLORMAP,
          nodata: 0,
          zoom: 7,
          centerLonLat: [110.7, -7.0],
          legendTitle: "Emisi CH₄ rata-rata harian (mg/Ha/hari)",
          legendItems: CH4_LEGEND_ITEMS,
          description:
            "Klasifikasi emisi metana lahan sawah Jawa-Bali berbasis EVI2. Ambang: 50, 100, 150, 200, 250, 300, dan 350 mg/Ha/hari.",
        };
      }
      return {
        s3Path: `s3://cog/ch4/co2/${year}/odiac2024_co2class_indonesia_${year}_cog.tif`,
        colormap: CO2_COLORMAP,
        nodata: 0,
        zoom: 6,
        centerLonLat: [118, -2.5],
        legendTitle: "Emisi CO₂ tahunan (ton)",
        legendItems: CO2_LEGEND_ITEMS,
        description:
          "Klasifikasi emisi CO₂ tahunan ODIAC 2024 (tonne CO₂) untuk wilayah Indonesia. Ambang nasional: 2.500, 7.500, 25.000, dan 75.000 ton.",
      };
    },
    legendItems: CO2_LEGEND_ITEMS,
  },

  mangrove: {
    id: "mangrove",
    title: "Alert Deforestasi Mangrove",
    defaultZoom: 11,
    defaultCenterLonLat: [110.51, -6.83],
    filters: [
      {
        key: "location",
        label: "Lokasi",
        options: [
          { value: "cilacap", label: "Cilacap", centerLonLat: [108.92, -7.69] },
          { value: "indramayu", label: "Indramayu", centerLonLat: [108.24, -6.29] },
          { value: "maros", label: "Maros", centerLonLat: [119.52, -4.88] },
          { value: "pekalongan", label: "Pekalongan", centerLonLat: [110.23, -6.91] },
          { value: "semarang", label: "Semarang", centerLonLat: [110.51, -6.83] },
          { value: "teluk_benoa", label: "Teluk Benoa", centerLonLat: [115.22, -8.76] },
        ],
      },
      {
        key: "date",
        label: "Periode",
        options: [
          { value: "2023-06-30", label: "Juni 2023" },
          { value: "2023-12-31", label: "Desember 2023" },
          { value: "2024-06-30", label: "Juni 2024" },
          { value: "2024-12-31", label: "Desember 2024" },
          { value: "2025-06-30", label: "Juni 2025" },
          { value: "2025-12-31", label: "Desember 2025" },
        ],
      },
    ],
    defaults: { location: "semarang", date: "2025-12-31" },
    getLayer: ({ location, date }) => {
      const loc = PRODUCT_CONFIGS.mangrove.filters[0].options.find((o) => o.value === location);
      const year = date.slice(0, 4);
      return {
        s3Path: `s3://cog/mangrove_alert/${location}/${year}/alerts_in_${date}_cog.tif`,
        colormap: MANGROVE_COLORMAP,
        nodata: 0,
        zoom: 11,
        centerLonLat: loc?.centerLonLat || [110.51, -6.83],
        legendTitle: "Kelas alert mangrove",
        description: `Alert deforestasi mangrove ${loc?.label || location} periode ${date}.`,
      };
    },
    legendItems: [
      { color: "rgb(255,237,160)", label: "1 Warning" },
      { color: "rgb(254,178,76)", label: "2 Alert" },
      { color: "rgb(227,26,28)", label: "3 High alert" },
    ],
  },

  landsubsidence: {
    id: "landsubsidence",
    title: "Penurunan Muka Tanah",
    defaultZoom: 7,
    defaultCenterLonLat: [110.3, -7.2],
    filters: [
      {
        key: "layerType",
        label: "Layer",
        options: [
          {
            value: "vertical",
            label: "Displacement vertikal (Jawa)",
            s3Path: "s3://cog/landsubsidence/displacement_vertical_cog.tif",
            rescale: "-50,0",
            nodata: "-3.4028235e+38",
            colormapName: "rdylbu",
            zoom: 7,
            centerLonLat: [110.3, -7.2],
            legendTitle: "Displacement vertikal (m)",
            description: "Akumulasi pergeseran vertikal. Nilai negatif menandakan penurunan muka tanah.",
            legendGradient: true,
            legendMin: "-50 m",
            legendMax: "0 m",
          },
          {
            value: "los",
            label: "Displacement Line of Sight (Jawa)",
            s3Path: "s3://cog/landsubsidence/displacement_los_cog.tif",
            rescale: "-40,15",
            nodata: "-3.4028235e+38",
            colormapName: "rdylbu",
            zoom: 7,
            centerLonLat: [110.3, -7.2],
            legendTitle: "Displacement LoS (m)",
            description: "Pergeseran sepanjang garis pandang satelit (Line of Sight).",
            legendGradient: true,
            legendMin: "-40 m",
            legendMax: "+15 m",
          },
          {
            value: "jkt_ud",
            label: "Jakarta quasi vertikal (UD)",
            s3Path: "s3://cog/landsubsidence/jkt_quasi_ud_cog.tif",
            rescale: "-0.15,0.04",
            nodata: "nan",
            colormapName: "rdylbu",
            zoom: 10,
            centerLonLat: [106.85, -6.2],
            legendTitle: "Kecepatan vertikal (m)",
            description: "Komponen quasi vertikal (up-down) penurunan muka tanah wilayah Jakarta.",
            legendGradient: true,
            legendMin: "-0.15 m",
            legendMax: "+0.04 m",
          },
          {
            value: "jkt_ew",
            label: "Jakarta quasi timur-barat (EW)",
            s3Path: "s3://cog/landsubsidence/jkt_quasi_ew_cog.tif",
            rescale: "-0.05,0.05",
            nodata: "nan",
            colormapName: "rdylbu",
            zoom: 10,
            centerLonLat: [106.85, -6.2],
            legendTitle: "Kecepatan timur-barat (m)",
            description: "Komponen quasi timur-barat pergerakan tanah wilayah Jakarta.",
            legendGradient: true,
            legendMin: "-0.05 m",
            legendMax: "+0.05 m",
          },
        ],
      },
    ],
    defaults: { layerType: "vertical" },
    getLayer: ({ layerType }) => {
      const option = PRODUCT_CONFIGS.landsubsidence.filters[0].options.find(
        (o) => o.value === layerType
      );
      return option;
    },
    legendItems: [],
  },

  fasepadi: {
    id: "fasepadi",
    title: "Fase Pertumbuhan Padi",
    defaultZoom: 5,
    defaultCenterLonLat: [118, -2.5],
    filters: [
      {
        key: "year",
        label: "Tahun",
        options: [
          { value: "2025", label: "2025" },
          { value: "2026", label: "2026" },
        ],
      },
      {
        key: "periode",
        label: "Periode 12 harian",
        dependsOn: "year",
        optionsBy: UMUR_PADI_PERIODS,
      },
    ],
    defaults: { year: "2026", periode: "2" },
    getLayer: ({ year, periode }) => {
      const period = (UMUR_PADI_PERIODS[year] || []).find(
        (item) => item.value === String(periode)
      );
      const rangeLabel = period?.rangeLabel || `periode ${periode}`;
      return {
        s3Path: `s3://cog/umur_padi/${year}/Fase_${year}_${periode}_cog.tif`,
        colormap: UMUR_PADI_COLORMAP,
        nodata: 0,
        zoom: 5,
        centerLonLat: [118, -2.5],
        legendTitle: "Kelas pertumbuhan padi",
        description: `Umur padi pada tahun ${year} periode 12 harian ke ${periode}: (${rangeLabel}).`,
      };
    },
    legendItems: [
      { color: "rgb(237,248,233)", label: "1 Umur 1–12 hari" },
      { color: "rgb(199,233,192)", label: "2 Umur 13–24 hari" },
      { color: "rgb(161,217,155)", label: "3 Umur 25–36 hari" },
      { color: "rgb(116,196,118)", label: "4 Umur 37–48 hari" },
      { color: "rgb(65,171,93)", label: "5 Umur 49–60 hari" },
      { color: "rgb(35,139,69)", label: "6 Umur 61–72 hari" },
      { color: "rgb(0,109,44)", label: "7 Umur 73–84 hari" },
      { color: "rgb(0,68,27)", label: "8 Umur 85–96 hari" },
      { color: "rgb(255,237,160)", label: "9 Umur 97–108 hari" },
      { color: "rgb(254,178,76)", label: "10 Umur 109–120 hari" },
      { color: "rgb(189,189,189)", label: "11 Bukan padi" },
      { color: "rgb(255,196,0)", label: "12 Panen" },
      { color: "rgb(158,202,225)", label: "13 Persiapan tanam" },
    ],
  },
};
