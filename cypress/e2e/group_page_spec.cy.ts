import { usePersistedStore } from '../../src/stores/usePersistedStore'

// Todo: Test um weitere Testfälle ergänzen. Hier sind lediglich die folgenden enthalten:
// - Gruppe hinzufügen
// - Gruppe öffnen
// - Mitglied hinzufügen
// - Einkauf hinzufügen (nur Name und Betrag)
// - Einkommen hinzufügen (nur Name und Betrag)
// - Zahlung hinzufügen (nur die ausgewählte speichern)
// - Zwischenstand prüfen (immer mal zwischendurch)
// - Gruppe verlassen

// Todo: Struktur und Lesbarkeit überarbeiten

const initialStoreState = usePersistedStore.getState()
const AddIcon =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Add</title><path stroke-linecap='square' stroke-linejoin='round' d='M256 112v288M400 256H112' class='ionicon-fill-none ionicon-stroke-width'/></svg>"
const MemberIcon =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Person</title><path d='M256 256a112 112 0 10-112-112 112 112 0 00112 112zm0 32c-69.42 0-208 42.88-208 128v64h416v-64c0-85.12-138.58-128-208-128z'/></svg>"
const PurchaseIcon =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Cart</title><circle cx='176' cy='416' r='32'/><circle cx='400' cy='416' r='32'/><path d='M167.78 304h261.34l38.4-192H133.89l-8.47-48H32v32h66.58l48 272H432v-32H173.42l-5.64-32z'/></svg>"
const IncomeIcon =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Server</title><path d='M409.43 389.87C362 410 305.4 421.05 256 421.05s-105.87-11.3-153.44-31.18S48 353.16 48 353.16v38.2c0 31.15 18 43.64 67.32 64.35C153.13 471.59 203.18 480 256 480s102.87-8.41 140.68-24.29C446 435 464 422.51 464 391.36v-38.2s-7.14 16.59-54.57 36.71zM63.69 173.22c11.23 9.84 27.82 19.49 48 27.92 42.48 17.76 96.45 28.37 144.36 28.37s101.88-10.61 144.36-28.37c20.13-8.43 36.72-18.08 47.95-27.92 6.06-5.31 10.85-10.12 13.47-12.85a8 8 0 002.22-5.54v-26.16c-.84-28.79-24.71-54.41-67.21-72.14C358.83 40.71 308.84 32 256 32s-102.83 8.71-140.74 24.53C72.85 74.22 49 99.78 48.05 128.5v26.33a8 8 0 002.21 5.54c2.58 2.73 7.36 7.54 13.43 12.85z'/><path d='M409.43 221.91C365 241 305.4 253.09 256 253.09s-108.87-12.27-153.43-31.18S48 185.2 48 185.2v47.36c.08 7.52 5.5 16.2 15.69 25.13 11.24 9.84 27.82 19.5 48 27.92C154.12 303.38 208.09 314 256 314s101.88-10.6 144.36-28.37c20.13-8.42 36.72-18.08 47.95-27.92 10.25-9 15.68-17.71 15.69-25.27V185.2s-10.13 17.62-54.57 36.71z'/><path d='M409.43 306.38C362 326 305.4 337.56 256 337.56s-109.87-12.8-153.43-31.18S48 269.67 48 269.67v46.25c0 7.55 5.44 16.28 15.69 25.26 11.23 9.84 27.81 19.5 48 27.92 42.48 17.77 96.44 28.37 144.36 28.37s101.88-10.6 144.36-28.37c20.13-8.43 36.72-18.08 47.95-27.92 10.19-8.93 15.61-17.61 15.69-25.13v-46.38s-7.18 17.09-54.62 36.71z'/></svg>"
const CompensationIcon =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Wallet</title><path d='M47.5 104H432V51.52a16 16 0 00-19.14-15.69l-368 60.48a16 16 0 00-12 10.47A39.69 39.69 0 0147.5 104zM463.5 128h-416a16 16 0 00-16 16v288a16 16 0 0016 16h416a16 16 0 0016-16V144a16 16 0 00-16-16zM368 320a32 32 0 1132-32 32 32 0 01-32 32z'/><path d='M31.33 259.5V116c0-12.33 5.72-18.48 15.42-20 35.2-5.53 108.58-8.5 108.58-8.5s-8.33 16-27.33 16V128c18.5 0 31.33 23.5 31.33 23.5L84.83 236z'/></svg>"

describe('GroupPage', () => {
  beforeEach(() => {
    // Todo: Nicht einfach alreadyVisited auf true setzen, sondern den Test für die InfoSlides einfügen
    usePersistedStore.setState({ ...initialStoreState, alreadyVisited: true }, true)
  })
  afterEach(() => {
    usePersistedStore.setState({ ...initialStoreState, alreadyVisited: true }, true)
  })

  it('successfully loads', () => {
    cy.visit('/')

    // Gruppe hinzufügen
    cy.contains('Gruppe hinzufügen').click()
    cy.wait(1000)
    cy.get('[name="ion-input-0"]').type('Tennis', { delay: 100 }).should('have.value', 'Tennis')
    cy.get('[name="ion-input-1"]').type('Anni', { delay: 100 }).should('have.value', 'Anni')
    cy.get('[name="ion-input-2"]').type('Peter', { delay: 100 }).should('have.value', 'Peter')
    cy.get('[name="ion-input-3"]').type('Marko', { delay: 100 }).should('have.value', 'Marko')
    cy.get('[name="ion-input-4"]').type('Michel', { delay: 100 }).should('have.value', 'Michel')
    cy.contains('Gruppe speichern').click()

    // Gruppe öffnen
    cy.contains('Tennis').click()

    // Mitglied hinzufügen
    cy.get(`ion-fab-button > [icon="${AddIcon}"]`).click()
    cy.get(`ion-fab-button > [icon="${MemberIcon}"]`).click()
    cy.get('#alert-input-2-0').type('Falk', { delay: 100 }).should('have.value', 'Falk')
    cy.contains('Speichern').click()
    cy.get('ion-text > div').each(item => {
      expect(item).to.have.text('0,00 €')
    })

    // Einkauf hinzufügen
    cy.get(`ion-fab-button > [icon="${AddIcon}"]`).click()
    cy.get(`ion-fab-button > [icon="${PurchaseIcon}"]`).click()
    cy.get('[name="ion-input-6"]').type('Bälle', { delay: 100 }).should('have.value', 'Bälle')
    cy.get('[name="ion-input-7"]').type('1000', { delay: 100 }).should('have.value', '10,00 €')
    cy.contains('Einkauf speichern').click()
    cy.get('ion-text > div').each((item, index) => {
      if (index === 0) return expect(item).to.have.text('8,00 €')
      expect(item).to.have.text('-2,00 €')
    })

    // Einkommen hinzufügen
    cy.get(`ion-fab-button > [icon="${AddIcon}"]`).click()
    cy.get(`ion-fab-button > [icon="${IncomeIcon}"]`).click()
    cy.get('[name="ion-input-8"]').type('Schlüsselpfand', { delay: 100 }).should('have.value', 'Schlüsselpfand')
    cy.get('[name="ion-input-9"]').type('500', { delay: 100 }).should('have.value', '5,00 €')
    cy.contains('Einkommen speichern').click()
    cy.get('ion-text > div').each((item, index) => {
      if (index === 0) return expect(item).to.have.text('4,00 €')
      expect(item).to.have.text('-1,00 €')
    })

    // Zahlungen hinzufügen
    cy.get(`ion-fab-button > [icon="${AddIcon}"]`).click()
    cy.get(`ion-fab-button > [icon="${CompensationIcon}"]`).click()
    cy.contains('Zahlung speichern').click()
    cy.get('ion-text > div').each((item, index) => {
      if (index === 0) return expect(item).to.have.text('3,00 €')
      if (index === 1) return expect(item).to.have.text('0,00 €')
      expect(item).to.have.text('-1,00 €')
    })
    cy.get(`ion-fab-button > [icon="${AddIcon}"]`).click()
    cy.get(`ion-fab-button > [icon="${CompensationIcon}"]`).click()
    cy.contains('Zahlung speichern').click()
    cy.get('ion-text > div').each((item, index) => {
      if (index === 0) return expect(item).to.have.text('2,00 €')
      if (index === 1 || index === 2) return expect(item).to.have.text('0,00 €')
      expect(item).to.have.text('-1,00 €')
    })
    cy.get(`ion-fab-button > [icon="${AddIcon}"]`).click()
    cy.get(`ion-fab-button > [icon="${CompensationIcon}"]`).click()
    cy.contains('Zahlung speichern').click()
    cy.get('ion-text > div').each((item, index) => {
      if (index === 0) return expect(item).to.have.text('1,00 €')
      if (index === 4) return expect(item).to.have.text('-1,00 €')
      expect(item).to.have.text('0,00 €')
    })
    cy.get(`ion-fab-button > [icon="${AddIcon}"]`).click()
    cy.get(`ion-fab-button > [icon="${CompensationIcon}"]`).click()
    cy.contains('Zahlung speichern').click()
    cy.get('ion-text > div').each(item => {
      expect(item).to.have.text('0,00 €')
    })

    // Gruppe verlassen
    cy.get('ion-back-button').click()
  })
})
