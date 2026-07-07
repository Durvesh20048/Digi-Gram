package com.digigram.digigram_backend.services;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class FireStoreService {

    // Save data
    public String save(String collection, String documentId, Map<String, Object> data) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> writeResult = db.collection(collection).document(documentId).set(data);
        return writeResult.get().getUpdateTime().toString();
    }

    // Read data
    public Map<String, Object> read(String collection, String documentId) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        DocumentSnapshot snapshot = db.collection(collection).document(documentId).get().get();
        if (snapshot.exists()) {
            return snapshot.getData();
        }
        return null;
    }
}
