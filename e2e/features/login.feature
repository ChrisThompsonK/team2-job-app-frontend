Feature: User Login
  As a job seeker
  I want to login to the application
  So that I can access job opportunities and submit applications

  Background:
    Given the user is on the login page

  Scenario: Successfully login with valid credentials
    When the user enters email "test.user@example.com"
    And the user enters password "Test123!"
    And the user clicks the login button
    Then the user should be logged in
    And the user should not see the login page

  Scenario: Reject login with invalid email format
    When the user enters email "invalid-email"
    And the user enters password "Test123!"
    And the user clicks the login button
    Then the user should see an error message

  Scenario: Reject login with empty email field
    When the user enters email ""
    And the user enters password "Test123!"
    And the user clicks the login button
    Then the user should remain on the login page

  Scenario: Reject login with empty password field
    When the user enters email "test.user@example.com"
    And the user enters password ""
    And the user clicks the login button
    Then the user should remain on the login page

  Scenario: Reject login with non-existent user
    When the user enters email "nonexistent@example.com"
    And the user enters password "WrongPassword123!"
    And the user clicks the login button
    Then the user should see an error message
    And the user should remain on the login page

  Scenario: Navigate to registration page
    When the user clicks the register link
    Then the user should be navigated to the register page
