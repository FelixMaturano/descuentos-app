describe('Calculadora de descuentos con selectores estables', () => {
  beforeEach(() => cy.visit('/'))

  it('calcula correctamente el descuento con valores validos', () => {
    cy.intercept('POST', '**/api/descuento', {
      statusCode: 200,
      body: { precioOriginal: 200, porcentaje: 25, precioFinal: 150 },
    })
    cy.get('[data-cy=precio]').clear().type('200')
    cy.get('[data-cy=porcentaje]').clear().type('25')
    cy.get('[data-cy=calcular]').click()

    cy.get('[data-cy=resultado]').should('be.visible').and('contain', 'Bs 150,00')
  })

  it('muestra un mensaje claro para un precio negativo', () => {
    cy.get('[data-cy=precio]').clear().type('-10')
    cy.get('[data-cy=calcular]').click()

    cy.get('[data-cy=error]').should('be.visible').and('contain', 'mayor que cero')
  })

  it('rechaza un porcentaje superior a 100', () => {
    cy.get('[data-cy=porcentaje]').clear().type('101')
    cy.get('[data-cy=calcular]').click()

    cy.get('[data-cy=error]').should('be.visible').and('contain', 'entre 0 y 100')
  })
})
