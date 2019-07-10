describe('Music player', () => {
    const fileName = 'piano.mp3';

    beforeEach(() => {
        cy.visit('localhost:8080');
    });

    it('has default view', () => {
        cy.matchImageSnapshot();
    });

    it('has playing view', () => {
        cy.fixture(fileName).then(fileContent => {
            cy.get('input[type="file"]').upload(
                { fileContent, fileName, mimeType: 'application/json' },
                { subjectType: 'drag-n-drop' },
            );
            cy.matchImageSnapshot();
        });
    });
});
