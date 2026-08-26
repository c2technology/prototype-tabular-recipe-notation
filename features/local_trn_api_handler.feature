Feature: Local TRN PNG API handler

  Scenario: Return PNG for valid TRN matrix
    Given a valid TRN matrix JSON request
    When the local API handler processes the request
    Then the API response status is 200
    And the API response content type is image/png
    And the API response body contains a valid PNG

  Scenario: Reject invalid TRN matrix
    Given a TRN matrix request missing ingredient rows
    When the local API handler processes the request
    Then the API response status is 400
    And the API response explains the validation error
