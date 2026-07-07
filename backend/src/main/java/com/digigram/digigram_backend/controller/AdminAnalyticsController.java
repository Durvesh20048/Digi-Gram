package com.digigram.digigram_backend.controller;

import com.digigram.digigram_backend.dto.AdminAnalyticsResponse;
import com.digigram.digigram_backend.services.ComplaintAnalyticsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminAnalyticsController {

    private final ComplaintAnalyticsService analyticsService;

    public AdminAnalyticsController(ComplaintAnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/analytics")
    public AdminAnalyticsResponse getAnalytics() {
        return analyticsService.getAnalytics();
    }
}
