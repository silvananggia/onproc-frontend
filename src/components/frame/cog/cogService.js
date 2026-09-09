const TILE_BASE =
  "https://geomimo-prototype.brin.go.id/tiles/cog/tiles/WebMercatorQuad/{z}/{x}/{y}.png";

const CLASS_COLORMAP = {
  0: [0, 0, 0, 0],
  1: [255, 255, 178, 255],
  2: [254, 204, 92, 255],
  3: [253, 141, 60, 255],
  4: [240, 59, 32, 255],
  5: [189, 0, 38, 255],
};

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
  11: [254, 178, 76, 255],
  12: [253, 141, 60, 255],
  13: [227, 26, 28, 255],
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
          colormap: CLASS_COLORMAP,
          nodata: 0,
          zoom: 7,
          centerLonLat: [110.7, -7.0],
          legendTitle: "Kelas emisi CH4",
          description:
            "Klasifikasi emisi metana dari lahan sawah Jawa-Bali berbasis EVI2.",
        };
      }
      return {
        s3Path: `s3://cog/ch4/co2/${year}/odiac2024_co2class_indonesia_${year}_cog.tif`,
        colormap: CLASS_COLORMAP,
        nodata: 0,
        zoom: 5,
        centerLonLat: [118, -2.5],
        legendTitle: "Kelas emisi CO2",
        description:
          "Klasifikasi emisi CO2 ODIAC 2024 untuk wilayah Indonesia.",
      };
    },
    legendItems: [
      { color: "rgb(255,255,178)", label: "Kelas 1 (rendah)" },
      { color: "rgb(254,204,92)", label: "Kelas 2" },
      { color: "rgb(253,141,60)", label: "Kelas 3" },
      { color: "rgb(240,59,32)", label: "Kelas 4" },
      { color: "rgb(189,0,38)", label: "Kelas 5 (tinggi)" },
    ],
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
      { color: "rgb(255,237,160)", label: "Alert baru" },
      { color: "rgb(254,178,76)", label: "Alert berulang" },
      { color: "rgb(227,26,28)", label: "Deforestasi terkonfirmasi" },
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
            colormapName: "rdylbu_r",
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
            colormapName: "rdylbu_r",
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
        key: "dekade",
        label: "Dekade",
        dependsOn: "year",
        optionsBy: {
          2025: Array.from({ length: 28 }, (_, i) => {
            const dekade = i + 3;
            return { value: String(dekade), label: `Dekade ${dekade}` };
          }),
          2026: [
            { value: "1", label: "Dekade 1" },
            { value: "2", label: "Dekade 2" },
          ],
        },
      },
    ],
    defaults: { year: "2026", dekade: "2" },
    getLayer: ({ year, dekade }) => {
      return {
        s3Path: `s3://cog/umur_padi/${year}/Fase_${year}_${dekade}_cog.tif`,
        colormap: UMUR_PADI_COLORMAP,
        nodata: 0,
        zoom: 5,
        centerLonLat: [118, -2.5],
        legendTitle: "Kelas umur/fase padi",
        description: `Informasi fase dan umur padi dekade ${dekade} tahun ${year}.`,
      };
    },
    legendItems: [
      { color: "rgb(237,248,233)", label: "1–10 HST" },
      { color: "rgb(199,233,192)", label: "11–20 HST" },
      { color: "rgb(161,217,155)", label: "21–30 HST" },
      { color: "rgb(116,196,118)", label: "31–40 HST" },
      { color: "rgb(65,171,93)", label: "41–50 HST" },
      { color: "rgb(35,139,69)", label: "51–60 HST" },
      { color: "rgb(0,109,44)", label: "61–70 HST" },
      { color: "rgb(0,68,27)", label: "71–80 HST" },
      { color: "rgb(255,237,160)", label: "81–90 HST" },
      { color: "rgb(254,178,76)", label: "91–100 HST" },
      { color: "rgb(253,141,60)", label: "101–110 HST" },
      { color: "rgb(227,26,28)", label: ">110 HST / panen" },
    ],
  },
};
