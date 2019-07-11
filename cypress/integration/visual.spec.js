import { selectors } from './selectors';

describe('Music Player visual regression', () => {

    beforeEach(() => {
        cy.visit('localhost:8080');
    });

    it('matches empty view', () => {
        cy.matchImageSnapshot();
    });

    it('it matches loaded view', () => {
        cy.get(selectors.randomMusic).click();
        cy.matchImageSnapshot();
    });
});
