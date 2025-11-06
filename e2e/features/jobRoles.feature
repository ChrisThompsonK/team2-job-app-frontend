Feature: Browse Job Roles
  As a job seeker
  I want to view and search for job roles
  So that I can find opportunities that match my skills

  Background:
    Given the user is on the job roles listing page

  Scenario: Display all available job roles
    Then the user should see a list of job roles
    And each job role should have an apply button

  Scenario: Search for job roles by keyword
    When the user searches for "Software Engineer"
    Then the user should see job roles matching "Software Engineer"
    And the number of results should be greater than or equal to 0

  Scenario: Filter job roles by capability
    When the user filters by capability "Engineering"
    Then the user should see only Engineering job roles
    And the results should be updated

  Scenario: Navigate through pagination
    When the user views the first page of results
    And the user clicks the next page button
    Then the user should see the next page of results
    And the URL should contain page parameter

  Scenario: Apply for a job role
    When the user clicks apply for the first job role
    Then the user should be prompted to login if not authenticated
    Or the user should be navigated to the application form

  Scenario: Handle empty search results
    When the user searches for "NonexistentJobRole12345"
    Then the user should see an empty state message
    And no results should be displayed
