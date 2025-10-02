import axios from "../api/axios";
import authHeader from "./auth-header";

const getHSInfo = (params) => {
    return axios.get(`/information/hotspot`, { 
        headers: authHeader(),
        params: params // Add filter parameters to the request
    });
};

const getLocationLookup = (query) => {
    return axios.get(`/information/location-lookup`, {
        headers: authHeader(),
        params: { query }
    });
};

const getHotspotDetail = (hotspotId, mode = 'cluster') => {
    return axios.get(`/information/hotspot-detail/${hotspotId}`, {
        headers: authHeader(),
        params: { mode }
    });
};

const informationService = {
    getHSInfo,
    getLocationLookup,
    getHotspotDetail,
};

export default informationService;