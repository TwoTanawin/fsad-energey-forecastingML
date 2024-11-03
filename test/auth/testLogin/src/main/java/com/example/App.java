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

                if (token != null && !token.isEmpty()) {
                    System.out.println("JWT Token: " + token);
                } else {
                    System.out.println("Login successful, but token not found.");
                }
            } else {
                System.out.println("Login failed. Unable to test protected endpoint.");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
