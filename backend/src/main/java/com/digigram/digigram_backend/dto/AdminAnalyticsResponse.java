package com.digigram.digigram_backend.dto;

import java.util.Map;

public class AdminAnalyticsResponse {

    private long totalComplaints;
    private long pending;
    private long inProgress;
    private long resolved;
    private Map<String, Long> byPriority;

    public AdminAnalyticsResponse(long totalComplaints, long pending, long inProgress, long resolved, Map<String, Long> byPriority) {
        this.totalComplaints = totalComplaints;
        this.pending = pending;
        this.inProgress = inProgress;
        this.resolved = resolved;
        this.byPriority = byPriority;
    }

    public long getTotalComplaints() {
        return totalComplaints;
    }

    public long getPending() {
        return pending;
    }

    public long getInProgress() {
        return inProgress;
    }

    public long getResolved() {
        return resolved;
    }

    public Map<String, Long> getByPriority() {
        return byPriority;
    }
}
