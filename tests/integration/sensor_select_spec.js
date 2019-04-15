describe("When selecting a sensor via click", function() {
  before(function() {
    cy.wait(2000); // wait for sensors to show up on the map
    cy.window().should("have.property", "map");
    cy.window().then(win => {
      try {
        win.map.fire(
          "click",
          win.map.queryRenderedFeatures({ layers: ["outer_point"] })[0].geometry
            .coordinates
        );
      } catch (error) {
        // empty
      }
    });
    cy.wait(2000); // wait for the above promise to resolve before proceeding
  });

  it("information card appears and the search bar is populated with the sensor's name", function() {
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

  it("sensor is unselected when clicked again", function() {
    cy.window().then(win => {
      try {
        win.map.fire(
          "click",
          win.map.queryRenderedFeatures({ layers: ["outer_point"] })[0].geometry
            .coordinates
        );
      } catch (error) {
        // empty
      } finally {
        cy.get('input[placeholder="Search"]')
          .invoke("val")
          .then(val => {
            expect(val).to.be.empty; /* jshint expr: true */
          });
        cy.get(".card.scroll").should("not.exist");
      }
    });
  });
});
