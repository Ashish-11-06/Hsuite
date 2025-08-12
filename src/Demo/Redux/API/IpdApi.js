import React from "react";
import demoaxiosInstance from "./demoaxiosInstance";

const IpdApi = {
    PostWard: (wardData) => {
        return demoaxiosInstance.post("hospital/wards/", wardData);
    },

    PostBed: (bedData) => {
        return demoaxiosInstance.post("hospital/bed/", bedData);
    },
    GetAllWards: () => {
        return demoaxiosInstance.get("hospital/wards_all/");
    },

    GetBedByWardId: (wardId) => {
        return demoaxiosInstance.get(`hospital/beds/ward/${wardId}/`);
    },

    GetWardsWithBeds: () => {
        return demoaxiosInstance.get("hospital/wards-beds/");
    },

    EditBedStatus: (bedId, data) => {
        return demoaxiosInstance.patch(`hospital/beds/${bedId}/update-status/`, data);
    },

    PostIPD: (ipdData) => {
        return demoaxiosInstance.post("hospital/ipd/", ipdData);
    },

    GetAllIPD: () => {
        return demoaxiosInstance.get("hospital/ipd-list/");
    },

    GetIpdbyDoctorId: (doctorId) => {
        return demoaxiosInstance.get(`hospital/ipd/by-doctor/${doctorId}/`);
    },

    TransferDoctor: (ipdId, data) => {
        return demoaxiosInstance.patch(`hospital/ipd/${ipdId}/transfer-doctor/`, data);
    },
}

export default IpdApi;