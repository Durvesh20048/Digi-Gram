package com.digigram.digigram_backend.services;

import com.digigram.digigram_backend.model.Complaint;
import com.digigram.digigram_backend.repository.ComplaintRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final AiPriorityService aiPriorityService;

    public ComplaintService(ComplaintRepository complaintRepository,
                            AiPriorityService aiPriorityService) {
        this.complaintRepository = complaintRepository;
        this.aiPriorityService = aiPriorityService;
    }

    // CREATE COMPLAINT
    public Complaint createComplaint(Complaint complaint) {

        // Basic defaults
        complaint.setStatus("Pending");
        complaint.setTimestamp(System.currentTimeMillis());

        // 🔥 Call ML Service to set priority + aiScore
        aiPriorityService.enrichWithAiPriority(complaint);

        // Save to Firestore
        return complaintRepository.save(complaint);
    }

    // ADMIN – all complaints
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    // CITIZEN – their complaints
    public List<Complaint> getByUserId(String citizenId) {
        return complaintRepository.findByUserId(citizenId);
    }

    // ADMIN – sorted by AI (already used for smart table)
    public List<Complaint> getAllSortedByAi() {
        return complaintRepository.findAll()
                .stream()
                .sorted((a, b) -> Integer.compare(b.getAiScore(), a.getAiScore()))
                .toList();
    }

    public Complaint updateStatus(String id, String status) {
        return complaintRepository.updateStatus(id, status);
    }
}
