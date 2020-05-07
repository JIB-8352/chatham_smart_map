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

  it("enables the timelapse feature", function() {
    cy.clock();
    // Start the timelapse
    cy.get("button")
      .contains("play_arrow")
      .click();
    cy.get("button").contains("pause");

    cy.get(".v-slider__thumb-label__container").should(
      "not.have.css",
      "display",
      "none"
    );

    cy.tick(1000);
    cy.get('input[role="slider"]').should($el => {
      expect($el.attr("value")).to.equal("0"); // slider is at '0' after 1 second
    });
    // move slider once more so that it is at '1'
    cy.tick(1000);
    // Timelapse should pause when dates widget is opened
    cy.get("#datepicker-trigger").click();
    cy.get("[id^=airbnb-style-datepicker-wrapper]").should(
      "not.have.css",
      "display",
      "none"
    );
    cy.get("button").contains("play_arrow");
    cy.get("button")
      .contains("Cancel")
      .click(); // slider value shouldn't reset when 'Cancel' is clicked
    cy.get('input[role="slider"]').should($el => {
      // slider should stay at '1'
      expect($el.attr("value")).to.equal("1");
    });
    // Timelapse should reset when 'Apply' is clicked
    cy.get("#datepicker-trigger").click({ force: true });
    cy.get("button")
      .contains("Apply")
      .click();
    cy.get("button").contains("play_arrow");
    cy.get('input[role="slider"]').should($el => {
      // slider should stay at '1'
      expect($el.attr("value")).to.equal("0");
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
