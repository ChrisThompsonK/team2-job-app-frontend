Feature: Job Application Workflow
  As a job seeker
  I want to apply for job positions
  So that I can submit my application

  Background:
    Given I am on the job roles listing page

  @critical @smoke
  Scenario: Can navigate to job application form
    When I click the first "Apply Now" button
    Then I should be navigated to an application form
    And I should be navigated to a job details page

  @critical @smoke
  Scenario: Application form is accessible
    When I click the first "Apply Now" button
    Then I should see an application form
    And the form should have input fields
    And the form should have submit button

  @interaction
  Scenario: Can navigate between different jobs
    When I click the first "View Details" button
    And I navigate back to job listings
    And I click on a different job's "View Details" button
    Then I should see a different job's details
    And I should be able to return to job listings

  @smoke
  Scenario: Application page has proper structure
    When I click the first "Apply Now" button
    Then I should see a header on the page
    And I should see job information displayed
    And I should see an application form

  @data
  Scenario: Job application flow shows correct job info
    When I click the first "Apply Now" button
    Then the page should display job details
    And the page should display application form for the job
    And I should be able to navigate to other jobs
