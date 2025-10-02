import {
  GET_HOTSPOT_INFO,
  GET_LOCATION_LOOKUP,
  GET_HOTSPOT_DETAIL,
} from "../actions/types";

const initialstate = {
  loading: true,
  hotspotInfo: null,
  locationLookup: [],
  hotspotDetail: null,
  errmessage: "",
};

function informationReducer(information = initialstate, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_HOTSPOT_INFO:
      return {
        ...information,
        loading: false,
        errmessage: "",
        hotspotInfo: {
          ...payload,
          features: Array.isArray(payload.features) ? payload.features : [],
        },
      };

    case GET_LOCATION_LOOKUP:
      return {
        ...information,
        locationLookup: payload,
      };
      case GET_HOTSPOT_DETAIL:
        return {
          ...information,
          hotspotDetail: action.payload,
        };
    default:
      return information;
  }
}

export default informationReducer;
