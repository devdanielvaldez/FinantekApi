const { 
    amortizacionCuotaSobreSaldoInsoluto, 
    amortizacionCapitalFijoInteresesVariables, 
    amortizacionCapitalInteresFijo, 
    amortizacionCapitalVencimiento 
  } = require('./prestamos');
  
  const frecuenciasDias = {
      DI: 1,
      SM: 7,
      CT: 14,
      QU: 15,
      ME: 30,
      BM: 60,
      TM: 90,
      SEM: 180,
      AN: 360
  };
  
  describe('Pruebas de amortización de préstamos', () => {
    test('Amortización Cuota Sobre Saldo Insoluto', () => {
      const resultado = amortizacionCuotaSobreSaldoInsoluto('2023-04-01T14:00:00', 10000, 5, 'ME', frecuenciasDias);
      expect(resultado).toBeInstanceOf(Array);
      expect(resultado.length).toBeGreaterThan(0);
      // Puedes añadir más expectativas según lo que necesites probar
    });
  
    test('Amortización Capital Fijo más Intereses Variables', () => {
      const resultado = amortizacionCapitalFijoInteresesVariables('2023-04-01T14:00:00', 10000, 5, 'ME', frecuenciasDias);
      expect(resultado).toBeInstanceOf(Array);
      expect(resultado.length).toBeGreaterThan(0);
      // Más expectativas
    });
  
    test('Amortización Capital e Interés Fijo sobre Saldo Insoluto', () => {
      const resultado = amortizacionCapitalInteresFijo('2023-04-01T14:00:00', 10000, 5, 'ME', frecuenciasDias);
      expect(resultado).toBeInstanceOf(Array);
      expect(resultado.length).toBeGreaterThan(0);
      // Más expectativas
    });
  
    test('Amortización Capital al Vencimiento del Préstamo', () => {
      const resultado = amortizacionCapitalVencimiento('2023-04-01T14:00:00', 10000, 5, 'ME', frecuenciasDias);
      expect(resultado).toBeInstanceOf(Array);
      expect(resultado.length).toBeGreaterThan(0);
      // Más expectativas
    });
  });
  