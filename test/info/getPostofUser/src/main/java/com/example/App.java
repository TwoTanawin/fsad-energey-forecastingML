package com.example;

import okhttp3.*;
import org.json.JSONObject;
import org.json.JSONArray;
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

                    // Test GET all post IDs from user
                    getAllPostIdsByUser(token, userId);
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

    private static void getAllPostIdsByUser(String token, int userId) throws IOException {
        Request request = new Request.Builder()
                .url(BASE_URL + "/posts?user_id=" + userId) // Ensure your API supports this query parameter
                .header("Authorization", "Bearer " + token)
                .get()
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (response.isSuccessful() && response.body() != null) {
                String responseBody = response.body().string();
                JSONArray postsArray = new JSONArray(responseBody);

                System.out.println("All post IDs by user:");
                for (int i = 0; i < postsArray.length(); i++) {
                    int postId = postsArray.getJSONObject(i).getInt("id");
                    System.out.println("Post ID: " + postId);
                }
            } else {
                System.out.println("Failed to fetch posts. Response: " + response.code());
            }
        }
    }
}
