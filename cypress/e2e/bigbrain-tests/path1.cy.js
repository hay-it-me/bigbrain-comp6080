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
    const newGame = 'Test';
    
    cy.get('Button[name=new-game-button]')
      .click();

    cy.get('#new-game-name')
      .focus()
      .type(newGame);
    
    cy.contains('button', 'Submit')
      .click();
    
    cy.contains('.MuiCardHeader-root', newGame)
      .siblings()
      .contains('0 Questions');

  })

  it('Updates thumbnail and name of the game', () => {
    const oldGame = 'Test'
    const newName = 'Fun Quiz'

    cy.contains('.MuiCardHeader-root', oldGame)
      .children()
      .find(`[aria-label="${oldGame}-settings"]`)
      .click()
    
    cy.contains('p', 'Edit Game')
      .parent()
      .click();

    cy.url().should('include', 'editgame');

    // File input is redirected by a span that has a role of a button
    // Necessary to display to be able to upload files

    cy.get('input[type="file"]')
      .selectFile("cypress/test-assets/bird.jpeg", {force:true});
    
    // Clear or type({selectall}{backspace}) does not work
    cy.get('input[name="game-name"]')
      .as('quiz-name')
      .focus()
      .type('{backspace}{backspace}{backspace}{backspace}{backspace}', { delay: 100});
      
    cy.get('@quiz-name')
      .blur();

    cy.get('input[name="game-name"]')
      .focus()
      .type(newName);
      
    cy.get('input[name="game-name"]')
      .blur();

    cy.get('#back-button')
      .click({force:true});
    
    cy.url().should('include','dashboard');

    cy.contains('.MuiCardHeader-root', newName).should('be.visible');

  })

  it('Starts a game', () => {
    const newName = 'Fun Quiz'
    
    cy.contains('.MuiCardHeader-root', newName)
      .siblings()
      .contains('button', 'Start Game')
      .click()

  })

  it('Ends a game', () => {
    
    cy.contains('button', 'End Game')
      .click();

  })

  it('Loads results page', () => {
    const newName = 'Fun Quiz'
    
    cy.contains('.MuiDialog-paper', `Game ended for quiz: ${newName}`)
      .children()
      .contains('a', 'Yes')
      .click();

    cy.url().should('include', 'viewgame');
  })


})