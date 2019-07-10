const selectors = {
    fileUpload: 'input[type="file"]',
    randomMusic: 'button.random-music',
    play: 'button.play',
    pause: 'button.pause',
    visualizer: 'canvas',
};

describe('Music player', () => {
    const fileName = 'piano.mp3';

    beforeEach(() => {
        cy.visit('localhost:8080');
    });

    it('by default has disabled control buttons', () => {
        cy.get('button.play').should('be.disabled');
        cy.get('button.pause').should('be.disabled');
        cy.get('button.stop').should('be.disabled');
    });

    it('has file upload available', () => {
        cy.get(selectors.fileUpload).should('exist');
        cy.fixture(fileName).then(fileContent => {
            cy.get(selectors.fileUpload).upload(
                { fileContent, fileName, mimeType: 'application/json' },
                { subjectType: 'drag-n-drop' },
            );
        });
    });

    it('has empty visualizer', () => {
        cy.get(selectors.visualizer).should('not.have.class', 'animated');
    });

    it('has random music to play', () => {
        cy.get(selectors.randomMusic).click();
        cy.get(selectors.visualizer).should('have.class', 'animated');
    });

    it('can start playing', () => {
        cy.fixture(fileName).then(fileContent => {
            cy.get(selectors.fileUpload).upload(
                { fileContent, fileName, mimeType: 'application/json' },
                { subjectType: 'drag-n-drop' },
            );
            cy.click(selectors.play);
            cy.get(selectors.visualizer).should('have.class', 'animated');
        });
    });

    it('can pause while playing', () => {
        cy.fixture(fileName).then(fileContent => {
            cy.get(selectors.fileUpload).upload(
                { fileContent, fileName, mimeType: 'application/json' },
                { subjectType: 'drag-n-drop' },
            );
            cy.click(selectors.play);
            cy.click(selectors.pause);
            cy.get(selectors.visualizer).should('not.have.class', 'animated');
        });
    });
});
