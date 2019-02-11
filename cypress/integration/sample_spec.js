// describe('My First Test', function() {
//   it('Visits the Kitchen Sink', function() {
//     cy.visit('https://example.cypress.io')
//     cy.contains('type').click()
//     cy.url().should('include', '/commands/actions')

//         cy.get('.action-email')
//       .type('fake@email.com')
//       .should('have.value', 'fake@email.com')
//   })
// })

describe('The Home Page', function() {
  it('successfully loads', function() {
    cy.visit('/')
  })
})