package com.example;

import okhttp3.*;
import org.json.JSONObject;

import java.io.IOException;

public class App 
{
    private static final String BASE_URL = "http://localhost:3000"; // Replace with your actual base URL
    private static final OkHttpClient client = new OkHttpClient();
    public static void main( String[] args )
    {
                // Create JSON object for user data
                JSONObject userData = new JSONObject();
                JSONObject userDetails = new JSONObject();
                
                userDetails.put("firstName", "tester1");
                userDetails.put("lastName", "tester1");
                userDetails.put("email", "tester1@tester1.com");
                userDetails.put("password", "securepassword");
                userDetails.put("password_confirmation", "securepassword");
                userDetails.put("userImg", "base64_encoded_image_data"); // Replace with actual image data if needed
                
                userData.put("user", userDetails);
        
                // Create request body
                RequestBody body = RequestBody.create(userData.toString(), MediaType.get("application/json; charset=utf-8"));
        
                // Build request
                Request request = new Request.Builder()
                        .url(BASE_URL + "/register")
                        .post(body)
                        .build();
        
                // Execute request and handle response
                try (Response response = client.newCall(request).execute()) {
                    if (response.isSuccessful() && response.body() != null) {
                        String responseBody = response.body().string();
                        System.out.println("Register Response: " + response.code() + " " + responseBody);
                    } else {
                        System.out.println("Registration failed. Status Code: " + response.code());
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
    }
}
