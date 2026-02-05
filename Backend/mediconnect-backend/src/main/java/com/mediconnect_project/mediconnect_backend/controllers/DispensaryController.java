package com.mediconnect_project.mediconnect_backend.controllers;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.mediconnect_project.mediconnect_backend.models.Dispensary;
import com.mediconnect_project.mediconnect_backend.services.DispensaryService;
import com.mediconnect_project.mediconnect_backend.services.dto.DispensaryWithWaitTime;

@RestController
@RequestMapping("/api/dispensaries")
@RequiredArgsConstructor
public class DispensaryController {
	private final DispensaryService dispensaryService;

	@GetMapping
	public List<Dispensary> getAllDispensaries() {
		return dispensaryService.getAllDispensaries();
	}

	@GetMapping("/with-wait")
	public List<DispensaryWithWaitTime> getAllDispensariesWithWait() {
		return dispensaryService.getAllDispensariesWithWaitTime();
	}

	@GetMapping("/search")
	public List<Dispensary> searchByName(@RequestParam("name") String name) {
		return dispensaryService.searchDispensariesByName(name);
	}

	@GetMapping("/nearby")
	public List<Dispensary> getNearby(@RequestParam("lat") double lat, @RequestParam("lon") double lon) {
		return dispensaryService.getNearbyDispensaries(lat, lon);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Dispensary> getDispensary(@PathVariable String id) {
		return dispensaryService.getDispensaryById(id)
				.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@GetMapping("/doctor/{doctorId}")
	public ResponseEntity<Dispensary> getByDoctor(@PathVariable String doctorId) {
		return dispensaryService.getDispensaryByDoctorId(doctorId)
				.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.notFound().build());
	}
}
