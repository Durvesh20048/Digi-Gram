package com.digigram.digigram_backend.services;

import com.digigram.digigram_backend.dto.AdminAnalyticsResponse;
import com.digigram.digigram_backend.model.Complaint;
import com.digigram.digigram_backend.repository.ComplaintRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ComplaintAnalyticsService {

    private final ComplaintRepository repo;

    public ComplaintAnalyticsService(ComplaintRepository repo) {
        this.repo = repo;
    }

    public AdminAnalyticsResponse getAnalytics() {

        List<Complaint> list = repo.findAll();

        long pending = list.stream()
                .filter(c -> "Pending".equalsIgnoreCase(c.getStatus()))
                .count();

        long inProgress = list.stream()
                .filter(c -> "In-Progress".equalsIgnoreCase(c.getStatus()))
                .count();

        long resolved = list.stream()
                .filter(c -> "Resolved".equalsIgnoreCase(c.getStatus()))
                .count();

        Map<String, Long> byPriority = list.stream()
                .collect(Collectors.groupingBy(
                        c -> c.getPriority() == null ? "Unknown" : c.getPriority(),
                        Collectors.counting()
                ));

        return new AdminAnalyticsResponse(
                list.size(),
                pending,
                inProgress,
                resolved,
                byPriority
        );
    }
}
