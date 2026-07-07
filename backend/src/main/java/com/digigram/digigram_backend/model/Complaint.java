package com.digigram.digigram_backend.model;

import java.util.List;

public class Complaint {

    // ================= BASIC =================
    private String id;

    // Citizen details
    private String citizenId;         // Firebase UID
    private String citizenPhone;
    private String citizenName;

    // Complaint details
    private String title;
    private String category;
    private String description;
    private String incidentDate;
    private String address;

    // Media
    private List<String> imageUrl;
    private String documentUrl;

    // ================= WORKFLOW =================
    private String status;            // Pending, In Progress, Resolved, Rejected
    private long timestamp;           // Creation time (System.currentTimeMillis)

    // ================= AI DATA =================
    private String priority;          // High, Medium, Low
    private int aiScore;              // 0 - 100 score
    private String department;        // Auto assigned dept
    private Long slaDueAt;            // SLA deadline timestamp

    private double latitude;
    private double longitude;
   
    // ================= GETTERS & SETTERS =================

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCitizenId() { return citizenId; }
    public void setCitizenId(String citizenId) { this.citizenId = citizenId; }

    public String getCitizenPhone() { return citizenPhone; }
    public void setCitizenPhone(String citizenPhone) { this.citizenPhone = citizenPhone; }

    public String getCitizenName() { return citizenName; }
    public void setCitizenName(String citizenName) { this.citizenName = citizenName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIncidentDate() { return incidentDate; }
    public void setIncidentDate(String incidentDate) { this.incidentDate = incidentDate; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public List<String> getImageUrl() { return imageUrl; }
    public void setImageUrl(List<String> imageUrl) { this.imageUrl = imageUrl; }

    public String getDocumentUrl() { return documentUrl; }
    public void setDocumentUrl(String documentUrl) { this.documentUrl = documentUrl; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public int getAiScore() { return aiScore; }
    public void setAiScore(int aiScore) { this.aiScore = aiScore; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Long getSlaDueAt() { return slaDueAt; }
    public void setSlaDueAt(Long slaDueAt) { this.slaDueAt = slaDueAt; }
    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }
}
