import 'cypress-file-upload';
import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command';

addMatchImageSnapshotCommand({
    failureThreshold: 0.01,
    failureThresholdType: 'percent',
    customDiffConfig: { threshold: 0.01 },
    capture: 'viewport',
});

Cypress.Commands.add('setResolution', size => {
    if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1]);
    } else {
        cy.viewport(size);
    }
});
