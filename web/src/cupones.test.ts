import { describe, expect, it } from 'vitest'
import { aplicarCupon, codigoValido, normalizarCodigo, redondear2, type Cupon } from './cupones'

const HOY = new Date('2026-10-16T12:00:00.000Z')

function crearCupon(overrides: Partial<Cupon> = {}): Cupon {
  return {
    codigo: 'USFX10',
    porcentaje: 10,
    topeBs: 50,
    vence: '2026-10-16',
    ...overrides,
  }
}

describe('normalizarCodigo', () => {
  it('elimina espacios externos y convierte a mayusculas', () => {
    expect(normalizarCodigo('  usfx10  ')).toBe('USFX10')
  })
})

describe('codigoValido', () => {
  it.each(['USFX10', '  usfx10  ', 'ABCD00'])('acepta el codigo %s', (codigo) => {
    expect(codigoValido(codigo)).toBe(true)
  })

  it.each(['USF10', 'USFX100', 'USF110', 'USFX1A', 'USFX-1', 'XUSFX10', ''])(
    'rechaza el codigo %s',
    (codigo) => {
      expect(codigoValido(codigo)).toBe(false)
    },
  )
})

describe('redondear2', () => {
  it.each([
    [1.234, 1.23],
    [1.235, 1.24],
    [1.005, 1.01],
  ])('redondea %s a %s', (valor, esperado) => {
    expect(redondear2(valor)).toBe(esperado)
  })
})

describe('aplicarCupon', () => {
  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])('rechaza el precio %s', (precio) => {
    expect(aplicarCupon(precio, crearCupon(), HOY)).toEqual({
      ok: false,
      motivo: 'El precio original debe ser mayor que cero',
    })
  })

  it('rechaza que no se proporcione un cupon', () => {
    expect(aplicarCupon(100, null, HOY)).toEqual({
      ok: false,
      motivo: 'No hay cupón',
    })
  })

  it('rechaza un codigo de cupon invalido', () => {
    expect(aplicarCupon(100, crearCupon({ codigo: 'MALO' }), HOY)).toEqual({
      ok: false,
      motivo: 'El código del cupón no es válido',
    })
  })

  it('rechaza el cupon despues de su fecha de vencimiento', () => {
    expect(aplicarCupon(100, crearCupon({ vence: '2026-10-15' }), HOY)).toEqual({
      ok: false,
      motivo: 'El cupón venció',
    })
  })

  it('acepta el cupon durante todo el dia de vencimiento', () => {
    expect(aplicarCupon(100, crearCupon(), HOY)).toEqual({
      ok: true,
      descuentoBs: 10,
      precioFinal: 90,
    })
  })

  it('calcula el descuento redondeado a dos decimales', () => {
    expect(aplicarCupon(10.05, crearCupon({ porcentaje: 10 }), HOY)).toEqual({
      ok: true,
      descuentoBs: 1.01,
      precioFinal: 9.04,
    })
  })

  it('limita el descuento al tope del cupon', () => {
    expect(aplicarCupon(1000, crearCupon({ porcentaje: 20, topeBs: 75 }), HOY)).toEqual({
      ok: true,
      descuentoBs: 75,
      precioFinal: 925,
    })
  })

  it('nunca devuelve un precio final negativo', () => {
    expect(aplicarCupon(10, crearCupon({ porcentaje: 200, topeBs: 50 }), HOY)).toEqual({
      ok: true,
      descuentoBs: 20,
      precioFinal: 0,
    })
  })
})
