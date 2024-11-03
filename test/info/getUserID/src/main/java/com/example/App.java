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
                    System.out.println("Current User ID (PK): " + userId);
                    System.out.println("JWT Token: " + token);

                    // Test GET all users and their IDs
                    getAllUsers(token);
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

    private static void getAllUsers(String token) throws IOException {
        Request request = new Request.Builder()
                .url(BASE_URL + "/users") // Ensure this endpoint returns a list of users
                .header("Authorization", "Bearer " + token)
                .get()
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (response.isSuccessful() && response.body() != null) {
                String responseBody = response.body().string();
                JSONArray usersArray = new JSONArray(responseBody);

                System.out.println("List of users and their IDs:");
                for (int i = 0; i < usersArray.length(); i++) {
                    JSONObject user = usersArray.getJSONObject(i);
                    int userId = user.optInt("id", -1);
                    String userName = user.optString("firstName", "Unknown") + " " + user.optString("lastName", "");
                    System.out.println("User ID: " + userId + ", Name: " + userName);
                }
            } else {
                System.out.println("Failed to fetch users. Response: " + response.code());
            }
        }
    }
}
