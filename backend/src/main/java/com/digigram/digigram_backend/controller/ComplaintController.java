package com.digigram.digigram_backend.controller;

import com.digigram.digigram_backend.model.Complaint;
import com.digigram.digigram_backend.services.ComplaintService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "http://localhost:5173")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    // ================= CREATE =================
    @PostMapping
    public ResponseEntity<?> createComplaint(@RequestBody Complaint complaint) {
        try {
            Complaint saved = complaintService.createComplaint(complaint);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to save complaint");
        }
    }

    // ================= ADMIN (SMART DASHBOARD) =================
    // ✅ THIS IS THE ENDPOINT YOUR ADMIN UI SHOULD CALL
    @GetMapping("/admin")
    public ResponseEntity<List<Complaint>> getAllComplaintsForAdmin() {
        return ResponseEntity.ok(complaintService.getAllSortedByAi());
    }

    // ✅ Admin update complaint status
    @PatchMapping("/{id}/admin-status")
    public ResponseEntity<?> updateStatusAdmin(
            @PathVariable String id,
            @RequestParam String status
    ) {
        Complaint updated = complaintService.updateStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    // ================= CITIZEN =================
    @GetMapping("/user/{citizenId}")
    public ResponseEntity<?> getComplaintsByUser(@PathVariable String citizenId) {
        return ResponseEntity.ok(complaintService.getByUserId(citizenId));
    }
}
