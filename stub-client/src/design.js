/* 
  stubFor(
    request(
      GET OR POST OR ANY_METHOD ETC,
      urlMatcher('/url/{id}' OR '/url/*'),
      url('/url/exact'),
      bodyMatcher( {EXACT_EQUAL} OR {PARTIAL_EQUAL} OR XPATH?),
      json OR xml
    ),
    aRequest()
      .withMethod()
      .withUrl()
      .withUrlMatcher()
      .withBodyMatching()
      .withType()

    // STUB
    responds()
      .withStatusCode()
      .withContentType()
      .withBody()
    respondsWith(
      200,
      json,
      {}
    )
    OR

    // SCENARIOS
    responds(withScenarios)
      .defaultScenario({})
      .outcomes([])
    respondsWithScenarios(
      {default},
      [{
        other
      }]
    )
    OR
    
    // PROXY
    proxiesTo(
      /url/somewhere
      // any other options?
    )
    OR

    // CRUD
    crud(
      withIdAlias(),
      [INITIAL_DATA]
    )
  )
*/
