package com.digigram.digigram_backend.repository;

import com.digigram.digigram_backend.model.Complaint;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class ComplaintRepository {

    private static final String COLLECTION = "complaints";

    private Firestore getDb() {
        return FirestoreClient.getFirestore();
    }

    public Complaint save(Complaint complaint) {
        try {
            Firestore db = getDb();
            DocumentReference ref;

            if (complaint.getId() == null || complaint.getId().isEmpty()) {
                ref = db.collection(COLLECTION).document();
                complaint.setId(ref.getId());
            } else {
                ref = db.collection(COLLECTION).document(complaint.getId());
            }

            ref.set(complaint).get();
            return complaint;

        } catch (Exception e) {
            throw new RuntimeException("Failed to save complaint", e);
        }
    }

    public List<Complaint> findAll() {
        try {
            Firestore db = getDb();
            ApiFuture<QuerySnapshot> future = db.collection(COLLECTION).get();
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();

            List<Complaint> list = new ArrayList<>();
            for (QueryDocumentSnapshot doc : documents) {
                list.add(doc.toObject(Complaint.class));
            }
            return list;

        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch complaints", e);
        }
    }

    // ✅ FIXED: Get complaints by citizenId
    public List<Complaint> findByUserId(String citizenId) {
        try {
            Firestore db = getDb();

            Query query = db.collection(COLLECTION)
                    .whereEqualTo("citizenId", citizenId);

            ApiFuture<QuerySnapshot> future = query.get();
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();

            List<Complaint> list = new ArrayList<>();
            for (QueryDocumentSnapshot doc : documents) {
                list.add(doc.toObject(Complaint.class));
            }
            return list;

        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch complaints by userId", e);
        }
    }

    public Complaint updateStatus(String id, String status) {
        try {
            Firestore db = getDb();
            DocumentReference ref = db.collection(COLLECTION).document(id);
            DocumentSnapshot snap = ref.get().get();

            if (!snap.exists()) return null;

            Complaint c = snap.toObject(Complaint.class);
            c.setStatus(status);
            return save(c);

        } catch (Exception e) {
            throw new RuntimeException("Status update failed", e);
        }
    }
}
