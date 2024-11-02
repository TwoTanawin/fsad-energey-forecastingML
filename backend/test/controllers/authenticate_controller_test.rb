require "test_helper"

class AuthenticateControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get authenticate_index_url
    assert_response :success
  end

  test "should get show" do
    get authenticate_show_url
    assert_response :success
  end

  test "should get register" do
    get authenticate_register_url
    assert_response :success
  end

  test "should get login" do
    get authenticate_login_url
    assert_response :success
  end

  test "should get update" do
    get authenticate_update_url
    assert_response :success
  end

  test "should get destroy" do
    get authenticate_destroy_url
    assert_response :success
  end
end
