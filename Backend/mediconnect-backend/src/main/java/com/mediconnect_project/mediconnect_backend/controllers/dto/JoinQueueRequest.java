package com.mediconnect_project.mediconnect_backend.controllers.dto;

import lombok.Data;

@Data
public class JoinQueueRequest {
	private String patientId;
	private String dispensaryId;
}
