import axios from "axios";
export const getAllSpecializations = () => {
  return axios.get("http://localhost:8002/api/doctors/specializations");
};

export const createNewSpecializations = (specializationsData) => {
  return axios.post(
    "http://localhost:8002/api/doctors/specializations",
    specializationsData,
    {
      withCredentials: true,
    }
  );
};

export const updateSpecializations = (specializationId,specializationsData) => {
  return axios.put(
    `http://localhost:8002/api/doctors/specializations/${specializationId}`,
    specializationsData,
    {
      withCredentials: true,
    }
  );
};
export const getSpecializationsById = (specializationId) => {
  return axios.get(
    `http://localhost:8002/api/doctors/specializations/${specializationId}`,
  
  );
};

export const deleteSpecializations = (specializationId) => {
  return axios.delete(
    `http://localhost:8002/api/doctors/specializations/${specializationId}`,
     {
      withCredentials: true,
    }
  );
};

export const getAllDoctors = () => {
  return axios.get(
    "http://localhost:8002/api/doctors",
   
  );
};

export const getDoctorsById = (doctorId) => {
  return axios.get(`http://localhost:8002/api/doctors/${doctorId}`);
};

export const updateDoctorInfoByAdmin = (doctorId , doctorData) => {
  return axios.put(`http://localhost:8002/api/doctors/${doctorId}`, doctorData ,
      {
      withCredentials: true,
    }
  );
};

export const getAllSchedule = () => {
  return axios.get('http://localhost:8002/api/doctors/all/schedules');
};

export const getDetailsShedule = (doctorId , scheduleId) => {
  return axios.get(`http://localhost:8002/api/doctors/${doctorId}/schedules/${scheduleId}`);
};