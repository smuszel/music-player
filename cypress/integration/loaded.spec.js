import { selectors } from './selectors';

describe('Music Player with loaded music file', () => {

    beforeEach(() => {
        cy.visit('localhost:8080');
        cy.get(selectors.randomMusic).click();
        cy.get(selectors.visualizer).should('have.class', 'loaded');
    });

    it('can start playing', () => {
        cy.get(selectors.play).click();
        cy.get(selectors.visualizer).should('have.class', 'animated');
    });

    it('can pause while playing', () => {
        cy.get(selectors.play).click();
        cy.get(selectors.pause).click();
        cy.get(selectors.visualizer).should('not.have.class', 'animated');
    });
})