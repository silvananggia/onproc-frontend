import {
  CREATE_JOB, 
  GET_JOB, 
  GET_ALL_JOB, 
  GET_RESULT ,
  SET_SELECTED_JOB,
  UPDATE_JOB_STATUS,
  UPDATE_JOB_PROGRESS,
} from "../actions/types";

const initialstate = {
  loading: true,
  joblist: [],
  jobobj: {},
  selectedJobId: null, // Add selectedJobId to the state
  errmessage: "",
};

function jobReducer(job = initialstate, action) {
  const { type, payload } = action;

  switch (type) {

    case SET_SELECTED_JOB:
      return {
          ...job,
          selectedJobId: action.payload, // Update selectedJobId
      };

    case CREATE_JOB:
      return{
        ...job,
        loading:false
    }

    case GET_ALL_JOB:
      return {
        loading: false,
        errmessage: "",
        joblist: action.payload,
        jobobj: {},
      };

    case GET_JOB:
      console.log("Updated jobobj:", action.payload); // Log the new jobobj
      return{
        ...job,
        loading:false,
        jobobj:action.payload
        
    }

    case UPDATE_JOB_STATUS:
      const { jobId, status, progress } = action.payload;
      console.log('🔄 Redux: UPDATE_JOB_STATUS action received');
      console.log('🔄 Redux: JobId:', jobId, 'Status:', status, 'Progress:', progress);
      console.log('🔄 Redux: Current jobobj.id:', job.jobobj.id);
      console.log('🔄 Redux: Match?', job.jobobj.id === jobId);
      
      // Update job in joblist if it exists
      const updatedJobList = job.joblist.map(jobItem => 
        jobItem.id === jobId 
          ? { ...jobItem, status, progress: progress !== undefined ? progress : jobItem.progress }
          : jobItem
      );
      
      // Update jobobj if it's the same job
      const updatedJobObj = job.jobobj.id === jobId 
        ? { ...job.jobobj, status, progress: progress !== undefined ? progress : job.jobobj.progress }
        : job.jobobj;
      
      console.log('🔄 Redux: Updated jobobj:', updatedJobObj);
      
      return {
        ...job,
        joblist: updatedJobList,
        jobobj: updatedJobObj
      };

    case UPDATE_JOB_PROGRESS:
      const { jobId: progressJobId, progress: newProgress } = action.payload;
      
      // Update progress in joblist if it exists
      const updatedProgressJobList = job.joblist.map(jobItem => 
        jobItem.id === progressJobId 
          ? { ...jobItem, progress: newProgress }
          : jobItem
      );
      
      // Update progress in jobobj if it's the same job
      const updatedProgressJobObj = job.jobobj.id === progressJobId 
        ? { ...job.jobobj, progress: newProgress }
        : job.jobobj;
      
      return {
        ...job,
        joblist: updatedProgressJobList,
        jobobj: updatedProgressJobObj
      };

    default:
      return job;
  }
}

export default jobReducer;
