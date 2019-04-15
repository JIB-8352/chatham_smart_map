describe("When selecting a sensor via search", function() {
  beforeEach(function() {
    cy.server();
    cy.route("GET", "https://api.mapbox.com/geocoding/**").as(
      "getGeocoderResults"
    );

    cy.get('input[placeholder="Search"]')
      .clear()
      .type("sensor");
    cy.wait("@getGeocoderResults");
    cy.get("ul.suggestions li")
      .first()
      .click();
  });

  it("information card appears", function() {
    cy.get(".card.scroll");
    cy.get(".card.scroll").contains("Water Level");
    cy.get(".card.scroll").contains("Last Measured");

    cy.get('input[placeholder="Search"]')
      .invoke("val")
      .then(val => {
        const t = val.toUpperCase();
        cy.get(".card.scroll")
          .children("h2")
          .invoke("text")
          .then(text => {
            expect(t).to.include(text);
          });
      });
  });

  it("information card disappears when close icon is clicked", function() {
    cy.get(".geocoder-icon.geocoder-icon-close").click();
    cy.get(".card.scroll").should("not.exist");
  });

  it("information card disappears when another place is searched for", function() {
    cy.get('input[placeholder="Search"]')
      .clear()
      .type("Savannah, Georgia");
    cy.wait("@getGeocoderResults");
    cy.get("ul.suggestions li")
      .first()
      .click();

    cy.get(".mapboxgl-marker");
    cy.get(".card.scroll").should("not.exist");
  });
});
