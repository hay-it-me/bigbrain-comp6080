/// <reference types="cypress" />

context('Happy Path - as described in spec', () => {
  it('Navigate to the home screen', () => {
    cy.clearAllLocalStorage();
    cy.visit('localhost:3000');
    cy.url().should('include','localhost:3000');
  });

  it('Navigate to register', () => {
    cy.get('#register-page').click();
    cy.url().should('include', 'register');
  });

  it('Fill out registration form', () => {
    const name = 'Jane Doe';
    const email = 'jane.doe@example.com';
    const password = 'password123';
    
    cy.get('Input[name=name]')
      .focus()
      .type(name);

    cy.get('Input[name=email]')
      .focus()
      .type(email);

    cy.get('Input[name=password]')
      .focus()
      .type(password);

    cy.get('Input[name=confirm-password]')
      .focus()
      .type(password);

    cy.get('#register-button')
      .click();
    
    cy.url().should('include', 'dashboard')
  });

  it('Create a new game from the dashboard', () => {
    const newGame = 'New Test Game'
    
    cy.get('Button[name=new-game-button]')
      .click();

    cy.get('#new-game-name')
      .focus()
      .type(newGame);
    
    cy.contains('button', 'Submit')
      .click();
    
  })


})