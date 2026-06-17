const fetch = require('node-fetch');

class ValuationClient {
  constructor() {
    this.baseUrl = process.env.VALUATION_URL || 'http://ms-valuation:8000';
  }

  async valuate(terrenoData) {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/valuate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          area_hectareas: terrenoData.area,
          tipo_suelo: terrenoData.suelo,
          acceso_riego: terrenoData.riego,
          proximidad_vias_km: terrenoData.vias
        })
      });

      if (!response.ok) throw new Error(`Valuation error: ${response.status}`);
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Valuation service error:', error);
      // Fallback: fórmula simple
      return {
        valor_por_hectarea: terrenoData.area * 5000 / terrenoData.area,
        valor_total: terrenoData.area * 5000,
        recomendacion: "Valor estimado (modo contingencia)",
        precision: 0.5
      };
    }
  }
}

module.exports = new ValuationClient();