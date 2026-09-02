Feature: Schema.org Recipe JSON-LD parsing

  Scenario: Normalize a Recipe JSON-LD document
    Given a Schema.org Recipe JSON-LD fixture
    When the Python recipe parser normalizes the recipe
    Then the normalized recipe contains the source ingredient list
    And the normalized recipe contains ordered instruction steps
    And the normalized recipe preserves instruction section names
    And superfluous non-TRN metadata is removed

  Scenario: Reject a document without Recipe JSON-LD
    Given an HTML document without Schema.org Recipe JSON-LD
    When the Python recipe parser tries to normalize the recipe
    Then no normalized recipe is returned
