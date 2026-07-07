package com.digigram.digigram_backend.util;

import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;

import java.util.Map;

public class FirestoreUtil {
    public static DocumentReference createDocument(String collection, Map<String, Object> data) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        data.put("createdAt", Timestamp.now());
        data.put("updatedAt", Timestamp.now());
        ApiFuture<DocumentReference> addedDocRef = db.collection(collection).add(data);
        // wait for doc creation
        DocumentReference ref = addedDocRef.get();
        return ref;
    }
}
