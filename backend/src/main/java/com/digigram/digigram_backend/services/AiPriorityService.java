//package com.digigram.digigram_backend.services;
//
//import com.digigram.digigram_backend.model.Complaint;
//import org.springframework.stereotype.Service;
//
//import java.util.Locale;
//
//@Service
//public class AiPriorityService {
//
//    public void enrichWithAiPriority(Complaint complaint) {
//
//        String text = ((complaint.getTitle() == null ? "" : complaint.getTitle()) + " " +
//                      (complaint.getDescription() == null ? "" : complaint.getDescription()))
//                      .toLowerCase(Locale.ROOT);
//
//        int score = 40; // base AI score
//        String priority = "Medium";
//        String department = "General";
//
//        // ================= CATEGORY-BASED INTELLIGENCE =================
//        if (complaint.getCategory() != null) {
//            String cat = complaint.getCategory().toLowerCase(Locale.ROOT);
//
//            if (cat.contains("health") || cat.contains("medical")) {
//                score += 35;
//                department = "Health Department";
//            }
//            else if (cat.contains("water") || cat.contains("drain") || cat.contains("sanitation")) {
//                score += 25;
//                department = "Water & Sanitation";
//            }
//            else if (cat.contains("road") || cat.contains("pothole")) {
//                score += 20;
//                department = "Road Maintenance";
//            }
//            else if (cat.contains("electricity") || cat.contains("power")) {
//                score += 20;
//                department = "Electricity Board";
//            }
//            else if (cat.contains("garbage") || cat.contains("waste")) {
//                score += 25;
//                department = "Waste Management";
//            }
//        }
//
//        // ================= KEYWORD-BASED INTELLIGENCE =================
//        if (text.contains("urgent") || text.contains("emergency") || text.contains("accident")) {
//            score += 30;
//        }
//
//        if (text.contains("pregnant") || text.contains("child") || text.contains("school")) {
//            score += 15;
//        }
//
//        if (text.contains("elderly") || text.contains("old age")) {
//            score += 10;
//        }
//
//        if (text.contains("danger") || text.contains("life risk") || text.contains("fire")) {
//            score += 35;
//        }
//
//        // ================= FINAL SCORE CLAMP =================
//        if (score > 100) score = 100;
//        if (score < 0) score = 0;
//
//        // ================= PRIORITY LOGIC =================
//        if (score >= 75) {
//            priority = "High";
//        } else if (score <= 45) {
//            priority = "Low";
//        } else {
//            priority = "Medium";
//        }
//
//        // ================= SLA DEADLINE ASSIGNMENT =================
//        long now = System.currentTimeMillis();
//        long sla;
//
//        switch (priority) {
//            case "High" -> sla = now + (12 * 60 * 60 * 1000);  // 12 hours
//            case "Medium" -> sla = now + (2 * 24 * 60 * 60 * 1000); // 2 days
//            default -> sla = now + (5 * 24 * 60 * 60 * 1000); // 5 days
//        }
//
//        // ================= APPLY TO COMPLAINT =================
//        complaint.setAiScore(score);
//        complaint.setPriority(priority);
//        complaint.setDepartment(department);
//        complaint.setSlaDueAt(sla);
//    }
//}
//
//////✅ What this AI now does
////Feature	Status
////Auto assigns priority	✅
////Detects critical emergencies	✅
////Routes to department	✅
////Creates SLA deadlines	✅
////Supports analytics dashboard	✅ 
///
package com.digigram.digigram_backend.services;

import com.digigram.digigram_backend.model.Complaint;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class AiPriorityService {

    private final RestTemplate restTemplate;

    // URL of the Python Flask service
    @Value("${ai.priority.url:http://localhost:5001/predict-priority}")
    private String aiUrl;

    public AiPriorityService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @SuppressWarnings("unchecked")
    public void enrichWithAiPriority(Complaint complaint) {

        try {
            // Prepare payload for ML
            Map<String, Object> payload = new HashMap<>();
            payload.put("title", complaint.getTitle());
            payload.put("description", complaint.getDescription());
            payload.put("category", complaint.getCategory());

            // Call Python API
            Map<String, Object> response =
                    restTemplate.postForObject(aiUrl, payload, Map.class);

            if (response != null) {
                String priority = (String) response.getOrDefault("priority", "Medium");
                Number score = (Number) response.getOrDefault("aiScore", 50);

                complaint.setPriority(priority);
                complaint.setAiScore(score.intValue());
            } else {
                // fallback
                complaint.setPriority("Medium");
                complaint.setAiScore(50);
            }

        } catch (Exception e) {
            // If AI service down → don't break app, use fallback
            e.printStackTrace();
            complaint.setPriority("Medium");
            complaint.setAiScore(50);
        }
    }
}

