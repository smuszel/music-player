import { selectors } from './selectors';

describe('Empty Music Player', () => {

    beforeEach(() => {
        cy.visit('localhost:8080');
    });

    it('has disabled control buttons', () => {
        cy.get(selectors.play).should('be.disabled');
        cy.get(selectors.pause).should('be.disabled');
    });

    it('has empty visualizer', () => {
        cy.get(selectors.visualizer).should('not.have.class', 'loaded');
        cy.get(selectors.visualizer).should('not.have.class', 'playing');
    });

    it('has random music to play', () => {
        cy.get(selectors.randomMusic).click();
        cy.get(selectors.visualizer).should('not.have.class', 'playing');
        cy.get(selectors.visualizer).should('have.class', 'loaded');
    });
});
