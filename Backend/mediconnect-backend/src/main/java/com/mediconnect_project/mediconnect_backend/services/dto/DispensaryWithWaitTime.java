package com.mediconnect_project.mediconnect_backend.services.dto;

import lombok.Data;
import com.mediconnect_project.mediconnect_backend.models.Dispensary;

@Data
public class DispensaryWithWaitTime {
	private Dispensary dispensary;
	private Integer averageWaitMinutes;

	public DispensaryWithWaitTime(Dispensary dispensary, Integer averageWaitMinutes) {
		this.dispensary = dispensary;
		this.averageWaitMinutes = averageWaitMinutes;
	}
}
