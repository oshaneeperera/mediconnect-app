package com.mediconnect_project.mediconnect_backend.services.dto;

import java.util.List;
import lombok.Data;

@Data
public class QueueStatusResponse {
	private Integer currentServingToken;
	private long totalWaiting;
	private List<String> anonymousPatients;

	public QueueStatusResponse(Integer currentServingToken, long totalWaiting, List<String> anonymousPatients) {
		this.currentServingToken = currentServingToken;
		this.totalWaiting = totalWaiting;
		this.anonymousPatients = anonymousPatients;
	}
}
