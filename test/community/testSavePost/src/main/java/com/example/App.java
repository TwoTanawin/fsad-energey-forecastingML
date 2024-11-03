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

                    // Test GET /save_posts
                    testGetSavePosts(token);

                    // Test POST /save_posts
                    testCreateSavePost(token, userId);

                    // Test PUT /save_posts/:id
                    testUpdateSavePost(token, 1); // Replace 1 with the actual save post ID to update
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

    private static void testGetSavePosts(String token) throws IOException {
        Request request = new Request.Builder()
                .url(BASE_URL + "/save_posts")
                .header("Authorization", "Bearer " + token)
                .get()
                .build();

        try (Response response = client.newCall(request).execute()) {
            System.out.println("GET /save_posts Response: " + response.code() + " " + response.body().string());
        }
    }

    private static void testCreateSavePost(String token, int userId) throws IOException {
        JSONObject postData = new JSONObject();
        postData.put("savePostID", 456);
        postData.put("post_id", getLatestPostId(token)); // Use current post ID
        postData.put("user_id", userId); // Use current user ID from login response

        RequestBody body = RequestBody.create(postData.toString(), MediaType.get("application/json; charset=utf-8"));
        Request request = new Request.Builder()
                .url(BASE_URL + "/save_posts")
                .header("Authorization", "Bearer " + token)
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            System.out.println("POST /save_posts Response: " + response.code() + " " + response.body().string());
        }
    }

    private static int getLatestPostId(String token) throws IOException {
        Request request = new Request.Builder()
                .url(BASE_URL + "/posts")
                .header("Authorization", "Bearer " + token)
                .get()
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (response.isSuccessful() && response.body() != null) {
                String responseBody = response.body().string();
                if (responseBody.startsWith("[")) {
                    org.json.JSONArray jsonArray = new org.json.JSONArray(responseBody);
                    if (jsonArray.length() > 0) {
                        return jsonArray.getJSONObject(0).getInt("id"); // Adjust if necessary
                    }
                }
            }
        }
        return -1; // Return -1 if no valid post ID is found
    }

    private static void testUpdateSavePost(String token, int savePostId) throws IOException {
        JSONObject updateData = new JSONObject();
        updateData.put("post_id", getLatestPostId(token)); // Use PK of post to reference that post

        RequestBody body = RequestBody.create(updateData.toString(), MediaType.get("application/json; charset=utf-8"));
        Request request = new Request.Builder()
                .url(BASE_URL + "/save_posts/" + savePostId)
                .header("Authorization", "Bearer " + token)
                .put(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            System.out.println("PUT /save_posts/" + savePostId + " Response: " + response.code() + " " + response.body().string());
        }
    }
}
