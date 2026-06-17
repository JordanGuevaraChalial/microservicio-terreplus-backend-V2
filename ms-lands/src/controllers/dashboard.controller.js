const { Consulta, Terrain, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.obtenerDashboard = async (req, res) => {
  try {
    const hoy = new Date();
    const haceUnMes = new Date();
    haceUnMes.setMonth(hoy.getMonth() - 1);

    // 1. Terrenos Registrados
    const totalTerrenos = await Terrain.count();
    
    // 2. Usuarios Activos - Como User está en ms-auth, contamos usuarios únicos de consultas
    const usuariosNuevos = await Consulta.count({
      distinct: true,
      col: 'usuario_id'
    });

    // 3. Zonas Cubiertas
    const zonasCubiertas = await Terrain.count({
      distinct: true,
      col: 'ubicacion_nombre'
    });

    // 4. Precisión IA
    const precisionIA = await Consulta.findOne({
      attributes: [[sequelize.fn('AVG', sequelize.col('precision_modelo')), 'promedio']],
      raw: true
    });
    const precisionPromedio = precisionIA?.promedio 
      ? (parseFloat(precisionIA.promedio) * 100).toFixed(1) + '%' 
      : '0%';

    // 5. Precisión mensual
    const precisionMensual = await Consulta.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('fecha')), 'mes'],
        [sequelize.fn('AVG', sequelize.col('precision_modelo')), 'promedio_precision']
      ],
      group: ['mes'],
      order: [[sequelize.literal('mes'), 'ASC']],
      raw: true
    });

    // 6. Zonas con más actividad
    const zonasConMasRegistros = await Consulta.findAll({
      attributes: [
        [sequelize.col('Terreno.ubicacion_nombre'), 'zona'],
        [sequelize.fn('COUNT', sequelize.col('Consulta.id')), 'cantidad']
      ],
      include: [{
        model: Terrain,
        attributes: []
      }],
      group: [sequelize.col('Terreno.ubicacion_nombre')],
      order: [[sequelize.fn('COUNT', sequelize.col('Consulta.id')), 'DESC']],
      limit: 6,
      raw: true
    });

    // 7. Últimos 5 terrenos
    const terrenosRecientes = await Terrain.findAll({
      limit: 5,
      order: [['id', 'DESC']],
      attributes: ['ubicacion_nombre', 'area_hectareas', 'tipo_suelo'],
      raw: true
    });

    // 8. Distribución de tipos de suelo
    const tiposSuelo = await Terrain.findAll({
      attributes: [
        'tipo_suelo',
        [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad']
      ],
      group: ['tipo_suelo'],
      raw: true
    });

    res.status(200).json({
      kpis: {
        terrenosRegistrados: totalTerrenos || 0,
        usuariosNuevos: usuariosNuevos || 0,
        zonasCubiertas: zonasCubiertas || 0,
        precisionIA: precisionPromedio || '0%'
      },
      precisionMensual: precisionMensual.map(row => ({
        mes: row.mes ? new Date(row.mes).toLocaleString('es-ES', { month: 'short' }) : 'S/N',
        promedio: (parseFloat(row.promedio_precision || 0) * 100).toFixed(2)
      })),
      zonasMasActivas: zonasConMasRegistros.map(row => ({
        zona: row.zona || 'Desconocida',
        cantidad: parseInt(row.cantidad) || 0
      })),
      terrenosRecientes: terrenosRecientes.map(t => ({
        zona: t.ubicacion_nombre || 'Sin nombre',
        area: t.area_hectareas || 0,
        suelo: t.tipo_suelo || 'No especificado'
      })),
      distribucionSuelo: tiposSuelo.map(row => ({
        tipo: row.tipo_suelo || 'Otros',
        cantidad: parseInt(row.cantidad) || 0
      }))
    });

  } catch (error) {
    console.error('Error detallado en dashboard:', error);
    res.status(500).json({ 
      message: "Error al generar estadísticas", 
      error: error.message 
    });
  }
};