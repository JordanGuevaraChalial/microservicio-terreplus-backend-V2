from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from enum import Enum
import joblib
import pandas as pd
import os
import warnings
warnings.filterwarnings("ignore")

app = FastAPI(title="TerrePlus Valuation Service", version="1.0.0")

# ============================================
# 🔥 CONFIGURACIÓN CORS
# ============================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8081",
        "http://127.0.0.1:8081",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:19006",
        "exp://localhost:19000",
        "*"  # Permitir todos en desarrollo
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "x-access-token", "Authorization", "Accept"],
)

class TipoSuelo(str, Enum):
    fertil = "fertil"
    medio = "medio"
    pobre = "pobre"

class TerrenoInput(BaseModel):
    area_hectareas: float
    tipo_suelo: TipoSuelo
    acceso_riego: int
    proximidad_vias_km: float

class EstimateRequest(BaseModel):
    terreno_id: int
    modelo_id: int = 1

model_path = os.path.join(os.path.dirname(__file__), 'modelo_valoracion.pkl')
model = joblib.load(model_path)

@app.get("/health")
async def health():
    return {"status": "ok", "service": "ms-valuation"}

@app.post("/api/v1/valuate")
async def valuate(terreno: TerrenoInput):
    try:
        prepared_data = {
            'area_hectareas': terreno.area_hectareas,
            'acceso_riego': terreno.acceso_riego,
            'proximidad_vias_km': terreno.proximidad_vias_km,
            'tipo_suelo_fertil': 1 if terreno.tipo_suelo == "fertil" else 0,
            'tipo_suelo_medio': 1 if terreno.tipo_suelo == "medio" else 0,
            'tipo_suelo_pobre': 1 if terreno.tipo_suelo == "pobre" else 0
        }
        
        df = pd.DataFrame([prepared_data])
        prediccion = model.predict(df)[0]
        valor = round(float(prediccion), 2)
        
        if valor > 8000:
            recomendacion = "Alta rentabilidad - Cultivo intensivo recomendado"
        elif valor > 5000:
            recomendacion = "Rentabilidad media - Cultivo de ciclo corto o ganadería"
        else:
            recomendacion = "Baja rentabilidad - Revisar accesibilidad o conservación"
        
        return {
            "status": "success",
            "data": {
                "valor_por_hectarea": valor,
                "valor_total": round(valor * terreno.area_hectareas, 2),
                "recomendacion": recomendacion,
                "precision": 0.94
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/estimate")
async def estimate_from_terrain(request: EstimateRequest):
    """
    Endpoint para estimar valor desde un terreno existente
    """
    try:
        # Aquí deberías obtener el terreno de la base de datos
        # Por ahora, devolvemos un valor de prueba
        return {
            "valor_estimado_hectarea": 8500.50,
            "uso_recomendado": "Cultivo intensivo",
            "precision_modelo": 0.94,
            "terreno_id": request.terreno_id,
            "modelo_id": request.modelo_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))