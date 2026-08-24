Feature: Render hand-authored TRN matrix fixture as PNG

  Scenario Outline: Render a TRN matrix as PNG
    Given the hand-authored TRN matrix fixture "<fixture>"
    When the PNG generator renders the fixture
    Then a PNG file is created
    And the PNG contains ingredient rows
    And the PNG contains action columns
    And the PNG contains participation marks
    And the PNG contains the finished dish
    And the PNG contains only TRN marks and labels, not recipe prose

    Examples:
      | fixture                         |
      | hand-authored-trn-matrix.json   |
      | toll-house-cookie-trn-matrix.json |
