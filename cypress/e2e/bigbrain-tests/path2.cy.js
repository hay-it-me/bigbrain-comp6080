/// <reference types="cypress" />

context('Happy Path - For Editing and Progressing Question/Answers', () => {
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
      const name = 'John Smith';
      const email = 'john.smith@example.com';
      const password = 'smith123';
      
      cy.get('input[name=name]')
        .focus()
        .type(name);
  
      cy.get('input[name=email]')
        .focus()
        .type(email);
  
      cy.get('input[name=password]')
        .focus()
        .type(password);
  
      cy.get('input[name=confirm-password]')
        .focus()
        .type(password);
  
      cy.get('#register-button')
        .click();
      
      cy.url().should('include', 'dashboard')
    });
  
    it('Create a new game from the dashboard', () => {
      const newGame = 'Programming';
      
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
  
    it('Adds new questions to the quiz', () => {
      const newGame = 'Programming';

      cy.contains('.MuiCardHeader-root', newGame)
        .children()
        .find(`[aria-label="${newGame}-settings"]`)
        .click()
      
      cy.contains('p', 'Edit Game')
        .parent()
        .click();
  
      cy.url().should('include', 'editgame');
  
      // File input is redirected by a span that has a role of a button
      // Necessary to display to be able to upload files
  
      cy.get('input[type="file"]')
        .selectFile("cypress/test-assets/sittingdog.png", {force:true});

      cy.get('#quiz-image').should('be.visible');
      
      // Create 3 games
      cy.get('#add-new-question')
        .click();

      cy.get('#add-new-question')
        .click();
      
      cy.get('#add-new-question')
        .click();

      // Delete 2 extra questions
      cy.get('.MuiList-root')
        .children()
        .get('#delete-button-question-2')
        .click();
      
      cy.get('.MuiList-root')
        .children()
        .get('#delete-button-question-1')
        .click();

      cy.get('.MuiList-root')
        .children()
        .get('#edit-button-question-0')
        .click();

      cy.url().should('include', 'editquestion');
  
    })

    it('Updates the details of the question', () => {
      const question = 'What is the most loved programming language?'

      cy.get('#question-question')
        .focus()
        .clear({force: true});

      cy.get('#question-question')
        .focus()
        .type(question);
      
      cy.get('#question-question')
        .blur();

      cy.get('#points-question')
        .focus()
        .type('{backspace}15');
      
      cy.get('#time-question')
        .focus()
        .type('{backspace}20');

      
    })

  })