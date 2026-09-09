// src/components/frame/tunafinder/tunafinderService.js

/**
 * Normalize species parameter for API
 * Accepts a string or array of strings and returns a comma-joined string.
 * @param {string|string[]} spesies
 * @param {string} defaultValue
 * @returns {string}
 */
const normalizeSpesiesParam = (spesies, defaultValue = 'ALB') => {
  if (!spesies) return defaultValue;
  if (Array.isArray(spesies)) {
    return spesies.length ? spesies.join(',') : defaultValue;
  }
  return spesies;
};

/**
 * Build HSI tile URL
 * @param {Object} params - HSI parameters
 * @param {string} params.date - Date string (YYYYMMDD format)
 * @param {string|string[]} params.spesies - Species code(s) (ALB, BET, SKJ, YFT)
 * @returns {string} Tile URL template
 */
export const getHSITileUrl = ({ date = '20251119', spesies = 'ALB' }) => {
  // Map species to band index based on band_descriptions:
  // b1: ALB, b2: BET, b3: SKJ, b4: YFT
  const bandMap = {
    ALB: '1',
    BET: '2',
    SKJ: '3',
    YFT: '4',
  };

  // For HSI we use the first species only when multiple are selected
  let primarySpesies = spesies;
  if (Array.isArray(spesies)) {
    primarySpesies = spesies[0] || 'ALB';
  }

  const baseUrl = 'https://geomimo-prototype.brin.go.id/tiles/cog/tiles/WebMercatorQuad/{z}/{x}/{y}.png';

  // Extract year and month from date (YYYYMMDD format)
  // Example: date = '20251119' -> year = '2025', month = '11'
  const year = date.substring(0, 4);
  const month = date.substring(4, 6);

  // S3 path format: s3://cog/hsi/{year}/{month}/hsi_{date}_cog.tif
  // Example: s3://cog/hsi/2025/11/hsi_20251119_cog.tif
  const s3Path = `s3://cog/hsi/${year}/${month}/hsi_${date}_cog.tif`;

  const params = new URLSearchParams({
    url: s3Path,
    bidx: bandMap[primarySpesies] || '1',
    rescale: '0,1',
    colormap_name: 'turbo',
  });

  const fullUrl = `${baseUrl}?${params.toString()}`;

  // Debug logging - remove in production if needed
  console.log('HSI Tile URL:', fullUrl);
  console.log('HSI Parameters:', { date, spesies: primarySpesies, band: bandMap[primarySpesies] || '1', s3Path });

  return fullUrl;
};

/**
 * Build Area Tangkap tile URL
 * @param {Object} params - Filter parameters
 * @param {string} params.tanggal_start - Start date (YYYY-MM-DD)
 * @param {string} params.tanggal_end - End date (YYYY-MM-DD)
 * @param {string} params.kategori - Category (e.g., 'Berpotensi')
 * @param {string|string[]} params.spesies - Species (e.g., 'ALB' or ['ALB', 'BET'])
 * @returns {string} Tile URL template
 */
export const getAreaTangkapTileUrl = ({ tanggal_start, tanggal_end, kategori, spesies }) => {
  const baseUrl = 'https://geomimo-prototype.brin.go.id/tiling/function_zxy_area_tangkap/{z}/{x}/{y}';
  const params = new URLSearchParams({
    tanggal_start: tanggal_start || '2025-09-01',
    tanggal_end: tanggal_end || '2025-09-01',
    kategori: kategori || 'Berpotensi',
    // Backend is expected to support comma-separated species list, e.g. ALB,BET,SKJ
    spesies: normalizeSpesiesParam(spesies, 'ALB'),
  });
  return `${baseUrl}?${params.toString()}`;
};

/**
 * Build Titik Tangkap tile URL
 * @param {Object} params - Filter parameters
 * @param {string} params.tanggal_start - Start date (YYYY-MM-DD)
 * @param {string} params.tanggal_end - End date (YYYY-MM-DD)
 * @param {string} params.kategori - Category (e.g., 'Berpotensi')
 * @param {string|string[]} params.spesies - Species (e.g., 'ALB' or ['ALB', 'BET'])
 * @returns {string} Tile URL template
 */
export const getTitikTangkapTileUrl = ({ tanggal_start, tanggal_end, kategori, spesies }) => {
  const baseUrl = 'https://geomimo-prototype.brin.go.id/tiling/function_zxy_titik_tangkap/{z}/{x}/{y}';
  const params = new URLSearchParams({
    tanggal_start: tanggal_start || '2025-09-01',
    tanggal_end: tanggal_end || '2025-09-30',
    kategori: kategori || 'Berpotensi',
    // Backend is expected to support comma-separated species list, e.g. ALB,BET,SKJ
    spesies: normalizeSpesiesParam(spesies, 'ALB'),
  });
  return `${baseUrl}?${params.toString()}`;
};
