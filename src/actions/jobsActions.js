import { 
  CREATE_JOB, 
  GET_JOB, 
  GET_ALL_JOB, 
  GET_RESULT ,
  SET_SELECTED_JOB,
  UPDATE_JOB_STATUS,
  UPDATE_JOB_PROGRESS,
} from "./types";

import JobService from "../services/jobService";

export const setSelectedJob = (jobId) => ({
  type: SET_SELECTED_JOB,
  payload: jobId,
});
// Action to get a job by ID
export const getJobById = (id) => async (dispatch) => {
  try {
    const res = await JobService.getJobById(id);
    dispatch({
      type: GET_JOB,
      payload: res.data,
    });
    console.log(res.data);
  } catch (error) {
    dispatch({
      type: GET_JOB,
      payload: error.response.data.error,
    });
  }
};

// Action to get all jobs by user
export const getAllJobsByUser = (username) => async (dispatch) => {
  try {
    const res = await JobService.getAllJobsByUser(username);
    dispatch({
      type: GET_ALL_JOB,
      payload: res.data,
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    // Set empty array instead of error message to prevent .map() errors
    dispatch({
      type: GET_ALL_JOB,
      payload: [],
    });
  }
};

export const createJob = (jobId, username, jobname, command, cpurequired, priority, timeStart = null, timeFinish = null) => async (dispatch) => {
  try {
    const res = await JobService.createJob(jobId, username, jobname, command, cpurequired, priority, timeStart, timeFinish);
    dispatch({
      type: CREATE_JOB,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: CREATE_JOB,
      payload: error.response.data.error,
    });
  }
};

// Action to update job status (for real-time updates)
export const updateJobStatus = (jobId, status, progress) => ({
  type: UPDATE_JOB_STATUS,
  payload: { jobId, status, progress },
});

// Action to update job progress (for real-time updates)
export const updateJobProgress = (jobId, progress) => ({
  type: UPDATE_JOB_PROGRESS,
  payload: { jobId, progress },
});


