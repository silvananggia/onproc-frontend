import { 
  GET_HOTSPOT_INFO,
  GET_LOCATION_LOOKUP,
  GET_HOTSPOT_DETAIL,
} from "./types";

import InformationService from "../services/informationService";

// Action to get hotspot information with filters
export const getHSInfo = (filterParams) => async (dispatch) => {
  try {
    const res = await InformationService.getHSInfo(filterParams);
    dispatch({
      type: GET_HOTSPOT_INFO,
      payload: res.data,
    });
    console.log('Hotspot data received:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error fetching hotspot data:', error);
    dispatch({
      type: GET_HOTSPOT_INFO,
      payload: error.response?.data?.error || 'Error fetching hotspot data',
    });
    throw error;
  }
};

export const getLocationLookup = (query) => async (dispatch) => {
  try {
    console.log('Fetching locations for query:', query);
    const res = await InformationService.getLocationLookup(query);
    console.log('Location lookup API response:', res.data);
    dispatch({
      type: GET_LOCATION_LOOKUP,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching location lookup data:', error);
    dispatch({
      type: GET_LOCATION_LOOKUP,
      payload: [],
    });
    return [];
  }
};

// Action to get detailed hotspot information
export const getHotspotDetail = (hotspotId, mode = 'cluster') => async (dispatch) => {
  try {
    console.log('Fetching hotspot detail for ID:', hotspotId);
    const res = await InformationService.getHotspotDetail(hotspotId, mode);
    console.log('Hotspot detail received:', res.data);
    dispatch({
      type: GET_HOTSPOT_DETAIL,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching hotspot detail:', error);
    dispatch({
      type: GET_HOTSPOT_DETAIL,
      payload: null,
    });
    throw error;
  }
};


