before(function() {
  cy.server();
  // Before running all tests, make sure the following requests have completed:
  cy.route("GET", "https://api.mapbox.com/**").as("getMap");
  cy.route("GET", "https://api.sealevelsensors.org/v1.0/**").as("getData");

  cy.visit("/", {
    onBeforeLoad(win) {
      delete win.fetch;
    }
  });

  cy.get(".v-progress-circular").should("exist");

  cy.wait("@getMap", { timeout: 45000 });
  cy.wait("@getData", { timeout: 45000 });
  // Once the progress circle disappears, our app is in the default starting state and is ready to be tested:
  cy.get(".v-progress-circular").should("not.exist");
});
