const { Consulta, Terrain, ModeloML, ConsultaFactor } = require('../models');
const valuationClient = require('./valuation.client');

exports.estimarValor = async (terrenoId, modeloId, usuarioId) => {
  const terreno = await Terrain.findByPk(terrenoId);
  if (!terreno) throw new Error("Terreno no encontrado");

  const resultadoIA = await valuationClient.valuate({
    area: parseFloat(terreno.area_hectareas),
    suelo: terreno.tipo_suelo,
    riego: terreno.acceso_riego ? 1 : 0,
    vias: parseFloat(terreno.proximidad_vias_km)
  });

  const nuevaConsulta = await Consulta.create({
    usuario_id: usuarioId,
    terreno_id: terrenoId,
    modelo_ml_id: modeloId,
    fecha: new Date(),
    valor_estimado_hectarea: resultadoIA.valor_por_hectarea,
    uso_recomendado: resultadoIA.recomendacion,
    precision_modelo: resultadoIA.precision || 0.94
  });

  return nuevaConsulta;
};