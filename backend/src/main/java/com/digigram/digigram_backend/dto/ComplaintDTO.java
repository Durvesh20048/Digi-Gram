package com.digigram.digigram_backend.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.Map;

public class ComplaintDTO {
    @NotBlank
    public String title;

    @NotBlank
    public String category;

    @NotBlank
    public String description;

    public String incidentDate; // optional

    public Map<String, Object> address; // arbitrary JSON

    public Double lat;
    public Double lng;

    public List<String> images; // cloudinary URLs (strings)
    public String documentUrl; // supabase URL

    // getters/setters omitted for brevity (Jackson will populate public fields)
}