Feature: Render hand-authored TRN matrix fixture as PNG

  Scenario: Render a TRN matrix as PNG
    Given a hand-authored TRN matrix fixture
    When the PNG generator renders the fixture
    Then a PNG file is created
    And the PNG contains ingredient rows
    And the PNG contains action columns
    And the PNG contains participation marks
    And the PNG contains the finished dish
    And the PNG contains only TRN marks and labels, not recipe prose
