package com.mediconnect_project.mediconnect_backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.mediconnect_project.mediconnect_backend.controllers.dto.AuthLoginRequest;
import com.mediconnect_project.mediconnect_backend.controllers.dto.AuthRegisterRequest;
import com.mediconnect_project.mediconnect_backend.models.User;
import com.mediconnect_project.mediconnect_backend.services.UserService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
	private final UserService userService;

	@PostMapping("/register")
	public ResponseEntity<User> register(@RequestBody AuthRegisterRequest request) {
		User user = userService.registerUser(request.getUser(), request.getDispensary());
		return ResponseEntity.ok(user);
	}

	@PostMapping("/login")
	public ResponseEntity<User> login(@RequestBody AuthLoginRequest request) {
		return userService.login(request.getEmail(), request.getPassword())
				.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.status(401).build());
	}
}
