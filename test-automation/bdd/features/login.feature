@skip-saucedemo
Feature: User Authentication
  As a user of the SauceDemo application
  I want to be able to log in and log out
  So that I can access the application securely

  Background:
    Given I am on the SauceDemo login page

  @smoke @login
  Scenario: Successful login with valid credentials
    When I enter username "standard_user"
    And I enter password "secret_sauce"
    And I click the login button
    Then I should be redirected to the products page
    And I should see the products inventory

  @negative @login
  Scenario: Failed login with invalid credentials
    When I enter username "invalid_user"
    And I enter password "wrong_password"
    And I click the login button
    Then I should see an error message "Epic sadface: Username and password do not match any user in this service"

  @negative @login
  Scenario: Failed login with empty username
    When I enter password "secret_sauce"
    And I click the login button
    Then I should see an error message "Epic sadface: Username is required"

  @negative @login
  Scenario: Failed login with empty password
    When I enter username "standard_user"
    And I click the login button
    Then I should see an error message "Epic sadface: Password is required"

  @smoke @logout
  Scenario: Successful logout
    Given I am logged in as "standard_user" with password "secret_sauce"
    When I click the menu button
    And I click the logout link
    Then I should be redirected to the login page
    And I should see the login form

  @login @data-driven
  Scenario Outline: Login with different user types
    When I enter username "<username>"
    And I enter password "<password>"
    And I click the login button
    Then I should see "<expected_result>"

    Examples:
      | username                | password      | expected_result                          |
      | standard_user          | secret_sauce | products page                           |
      | locked_out_user        | secret_sauce | error message: Sorry, this user has been locked out |
      | problem_user           | secret_sauce | products page                           |
      | performance_glitch_user| secret_sauce | products page                           |