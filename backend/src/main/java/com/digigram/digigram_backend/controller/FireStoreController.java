package com.digigram.digigram_backend.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.digigram.digigram_backend.services.FireStoreService;

import java.util.Map;

@RestController
@RequestMapping("/api/firestore")
public class FireStoreController {

    @Autowired
    private FireStoreService firestoreService;

    @PostMapping("/save/{collection}/{id}")
    public String save(@PathVariable String collection,
                       @PathVariable String id,
                       @RequestBody Map<String, Object> data) throws Exception {
        return firestoreService.save(collection, id, data);
    }

    @GetMapping("/read/{collection}/{id}")
    public Map<String, Object> read(@PathVariable String collection,
                                    @PathVariable String id) throws Exception {
        return firestoreService.read(collection, id);
    }
}
