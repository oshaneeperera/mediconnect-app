package com.mediconnect_project.mediconnect_backend.controllers.dto;

import lombok.Data;

@Data
public class AuthLoginRequest {
	private String email;
	private String password;
}
