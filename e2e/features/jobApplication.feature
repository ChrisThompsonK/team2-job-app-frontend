Feature: Submit Job Application
  As a logged-in user
  I want to submit job applications
  So that I can apply for positions

  Background:
    Given the user is logged in
    And the user is on a job application form

  Scenario: Successfully submit application with valid data
    When the user fills in the application form with valid data
    And the user uploads a valid CV
    And the user clicks the submit button
    Then the user should see a success message
    And the application should be saved

  Scenario: Submit application with minimal required fields
    When the user fills in only the required fields
    And the user uploads a valid CV
    And the user clicks the submit button
    Then the user should see a success message

  Scenario: Show error when required fields are empty
    When the user leaves the name field empty
    And the user clicks the submit button
    Then the user should see an error message
    And the form should not be submitted

  Scenario: Show error with invalid email format
    When the user enters an invalid email format
    And the user clicks the submit button
    Then the user should see an email validation error

  Scenario: Show error when CV is not uploaded
    When the user fills in the application form
    And the user does not upload a CV
    And the user clicks the submit button
    Then the user should see a CV upload required error

  Scenario: Application form shows all required fields
    Then the user should see the name field
    And the user should see the email field
    And the user should see the phone field
    And the user should see the CV upload field
    And the user should see the submit button
