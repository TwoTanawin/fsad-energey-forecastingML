package com.example;

import okhttp3.*;
import org.json.JSONObject;
import java.io.IOException;

public class App {
    private static final String BASE_URL = "http://localhost:3000"; // Replace with your actual base URL
    private static final OkHttpClient client = new OkHttpClient();

    public static void main(String[] args) {
        // Login data
        JSONObject loginData = new JSONObject();
        loginData.put("email", "gogo@Gogo.com");
        loginData.put("password", "securepassword");

        // Perform login request
        RequestBody body = RequestBody.create(loginData.toString(), MediaType.get("application/json; charset=utf-8"));
        Request request = new Request.Builder()
                .url(BASE_URL + "/login")
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (response.isSuccessful() && response.body() != null) {
                String responseBody = response.body().string();
                System.out.println("Login Response: " + response.code() + " " + responseBody);

                JSONObject jsonResponse = new JSONObject(responseBody);
                String token = jsonResponse.optString("token");
                int userId = jsonResponse.getJSONObject("user").optInt("id", -1);

                if (token != null && !token.isEmpty() && userId != -1) {
                    System.out.println("JWT Token: " + token);
                    System.out.println("User ID: " + userId);
                    
                    // Test GET /posts
                    testGetPosts(token);

                    // Test POST /posts
                    testCreatePost(token, userId);

                    // Test PUT /posts/:id
                    testUpdatePost(token, 1); // Replace 1 with the actual post ID to update
                } else {
                    System.out.println("Login successful, but token or user ID not found.");
                }
            } else {
                System.out.println("Login failed. Unable to test protected endpoint.");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void testGetPosts(String token) throws IOException {
        Request request = new Request.Builder()
                .url(BASE_URL + "/posts")
                .header("Authorization", "Bearer " + token)
                .get()
                .build();

        try (Response response = client.newCall(request).execute()) {
            System.out.println("GET /posts Response: " + response.code() + " " + response.body().string());
        }
    }

    private static void testCreatePost(String token, int userId) throws IOException {
        JSONObject postData = new JSONObject();
        postData.put("postID", 123);
        postData.put("content", "This is a new post");
        postData.put("image", "Optional image data");
        postData.put("user_id", userId); // Use current user ID from login response

        RequestBody body = RequestBody.create(postData.toString(), MediaType.get("application/json; charset=utf-8"));
        Request request = new Request.Builder()
                .url(BASE_URL + "/posts")
                .header("Authorization", "Bearer " + token)
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            System.out.println("POST /posts Response: " + response.code() + " " + response.body().string());
        }
    }

    private static void testUpdatePost(String token, int postId) throws IOException {
        JSONObject updateData = new JSONObject();
        updateData.put("content", "Updated content");
        updateData.put("image", "Updated image data");

        RequestBody body = RequestBody.create(updateData.toString(), MediaType.get("application/json; charset=utf-8"));
        Request request = new Request.Builder()
                .url(BASE_URL + "/posts/" + postId)
                .header("Authorization", "Bearer " + token)
                .put(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            System.out.println("PUT /posts/" + postId + " Response: " + response.code() + " " + response.body().string());
        }
    }
}