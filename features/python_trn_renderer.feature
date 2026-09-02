Feature: Python TRN PNG rendering

  Scenario Outline: Render a hand-authored TRN fixture with Python/Pillow
    Given the hand-authored TRN matrix fixture "<fixture>"
    When the Python renderer renders the fixture
    Then valid PNG bytes are produced
    And the PNG includes ingredient rows
    And the PNG includes action columns
    And the PNG includes participation marks
    And the PNG includes the finished dish
    And the PNG excludes superfluous prose

    Examples:
      | fixture                            |
      | hand-authored-trn-matrix.json      |
      | toll-house-cookie-trn-matrix.json  |
