import axios from "axios";

/*
  This function sends the complaint to Spring Boot backend
*/

const API_URL = "http://localhost:8080/api/complaints";

export async function saveComplaint({
  title,
  details,
  lat,
  lon,
  userId,
  imageUrl,
}) {
  try {
    const payload = {
      citizenPhone: userId,
      title: title,
      description: details,
      location: lat && lon ? `${lat}, ${lon}` : null,
      imageUrl: imageUrl || null,
    };

    const response = await axios.post(API_URL, payload, {
      headers: {
        "Content-Type": "application/json"
      },
      withCredentials: false
    });

    return response.data;
  } catch (error) {
    console.error("❌ Backend save error:", error.response?.data || error.message);
    throw error;
  }
}
