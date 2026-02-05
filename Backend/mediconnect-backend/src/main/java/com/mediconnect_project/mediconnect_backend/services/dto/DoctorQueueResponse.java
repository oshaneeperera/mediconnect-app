package com.mediconnect_project.mediconnect_backend.services.dto;

import java.util.List;
import lombok.Data;

@Data
public class DoctorQueueResponse {
	private DoctorQueuePatient currentPatient;
	private List<DoctorQueuePatient> waitingPatients;

	public DoctorQueueResponse(DoctorQueuePatient currentPatient, List<DoctorQueuePatient> waitingPatients) {
		this.currentPatient = currentPatient;
		this.waitingPatients = waitingPatients;
	}
}
