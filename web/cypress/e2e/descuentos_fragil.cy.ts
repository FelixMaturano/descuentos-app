describe('Calculadora de descuentos con selectores fragiles', () => {
  beforeEach(() => cy.visit('/'))

  it('calcula el precio final localizando controles por posicion y texto', () => {
    cy.intercept('POST', '**/api/descuento', {
      statusCode: 200,
      body: { precioOriginal: 200, porcentaje: 25, precioFinal: 150 },
    })
    cy.get('input[type="number"]').eq(0).clear().type('200')
    cy.get('input[type="number"]').eq(1).clear().type('25')
    cy.contains('button', 'Calcular').click()

    cy.contains('Precio final:').should('be.visible').and('contain', 'Bs 150,00')
  })
})
