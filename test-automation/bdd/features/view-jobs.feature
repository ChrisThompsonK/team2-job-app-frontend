Feature: Job Listings Browse
  As a job seeker
  I want to browse available job positions
  So that I can find positions to apply for

  Background:
    Given I am on the job roles listing page

  @smoke @critical
  Scenario: View all available job listings
    Then I should see "Career Opportunities" heading
    And I should see at least 1 job card
    And I should see job titles in the listings
    And the page should be responsive

  @smoke @critical
  Scenario: Job cards contain required information
    Then each job card should have a job title
    And each job card should have a location
    And each job card should have a band level
    And each job card should have a closing date
    And each job card should have a status badge

  @interaction @critical
  Scenario: Can view job details
    When I click the first "View Details" button
    Then I should be navigated to a job details page
    And the job details page should have job information

  @interaction @critical
  Scenario: Can see Apply buttons for open jobs
    Then I should see at least 1 "Apply Now" button
    And I should see at least 1 "View Details" button
    And action buttons should be clickable

  @ui @responsive
  Scenario: Job page structure is correct
    Then the page should have a header element
    And the page should have a footer element
    And the page should have a main content area
    And the page should have navigation

  @ui @responsive
  Scenario: Job listings are responsive
    Then the body width should not exceed window width
    And all content should be visible on current viewport
    And page layout should adapt to viewport size

  @navigation
  Scenario: Can navigate back to job listings
    When I click the first "View Details" button
    And I navigate back to previous page
    Then I should be on the job listings page
    And I should see the job cards again

  @data-validation
  Scenario: All jobs have required fields
    Then every job should have a roleName
    And every job should have a location
    And every job should have a status
    And every job should have closing date
