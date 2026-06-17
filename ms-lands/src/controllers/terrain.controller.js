const { Terrain, Consulta } = require('../models');
const { Op, literal } = require('sequelize');

exports.crearTerreno = async (req, res) => {
  try {
    const terreno = await Terrain.create({
      poligono: req.body.poligono,
      area_hectareas: req.body.area_hectareas,
      tipo_suelo: req.body.tipo_suelo,
      acceso_riego: req.body.acceso_riego,
      proximidad_vias_km: req.body.proximidad_vias_km,
      ubicacion_nombre: req.body.ubicacion_nombre,
      coordenadas: { type: 'Point', coordinates: [req.body.lng, req.body.lat] }
    });
    res.status(201).json(terreno);
  } catch (error) {
    console.error('Error al crear terreno:', error);
    res.status(500).json({ message: "Error al registrar el terreno.", error: error.message });
  }
};

exports.obtenerMisTerrenos = async (req, res) => {
  try {
    // Verificar que el usuario está autenticado
    if (!req.userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    // Obtener terrenos que el usuario ha consultado
    const terrenos = await Terrain.findAll({
      include: [{
        model: Consulta,
        attributes: ['valor_estimado_hectarea', 'fecha'],
        limit: 1,
        order: [['fecha', 'DESC']],
        where: { usuario_id: req.userId },
        required: false
      }],
      order: [['id', 'DESC']]
    });

    if (terrenos.length === 0) {
      return res.status(200).json({ 
        message: "No tienes terrenos registrados o consultados.", 
        data: [] 
      });
    }

    res.status(200).json(terrenos);
  } catch (error) {
    console.error('Error al obtener mis terrenos:', error);
    res.status(500).json({ message: "Error al obtener la lista de terrenos: " + error.message });
  }
};

exports.obtenerTodosTerrenos = async (req, res) => {
  try {
    const { sequelize } = require('../models');
    
    const terrenos = await Terrain.findAll({
      attributes: [
        'id', 
        'ubicacion_nombre',
        'tipo_suelo', 
        'area_hectareas',
        [sequelize.fn('ST_AsGeoJSON', sequelize.col('coordenadas')), 'ubicacion']
      ]
    });

    if (!terrenos || terrenos.length === 0) {
      return res.status(404).json({ message: "No se encontraron terrenos." });
    }

    res.status(200).json(terrenos);
  } catch (error) {
    console.error('Error al obtener todos los terrenos:', error);
    res.status(500).json({ message: "Error al obtener terrenos: " + error.message });
  }
};