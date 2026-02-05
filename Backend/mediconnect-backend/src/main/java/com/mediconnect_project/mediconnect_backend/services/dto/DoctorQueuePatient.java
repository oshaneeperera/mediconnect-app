package com.mediconnect_project.mediconnect_backend.services.dto;

import lombok.Data;

@Data
public class DoctorQueuePatient {
	private String patientId;
	private String name;
	private Integer age;
	private Integer tokenNumber;

	public DoctorQueuePatient(String patientId, String name, Integer age, Integer tokenNumber) {
		this.patientId = patientId;
		this.name = name;
		this.age = age;
		this.tokenNumber = tokenNumber;
	}
}
