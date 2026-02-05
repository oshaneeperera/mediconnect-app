package com.mediconnect_project.mediconnect_backend.controllers.dto;

import lombok.Data;
import com.mediconnect_project.mediconnect_backend.models.Dispensary;
import com.mediconnect_project.mediconnect_backend.models.User;

@Data
public class AuthRegisterRequest {
	private User user;
	private Dispensary dispensary;
}
