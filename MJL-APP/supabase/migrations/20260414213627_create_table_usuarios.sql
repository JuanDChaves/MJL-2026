-- Crear tabla de usuarios
-- Vinculada con auth.users de Supabase

-- Enum para perfiles de usuario
CREATE TYPE perfil_rol AS ENUM (
    'duenio', 
    'supervisor', 
    'metre', 
    'mozo', 
    'cocinero', 
    'cantinero', 
    'cliente'
);

-- Tabla usuarios
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    apellidos TEXT NOT NULL,
    nombres TEXT NOT NULL,
    cuil BIGINT NOT NULL UNIQUE CHECK (cuil >= 10000000000 AND cuil <= 99999999999),
    correo_electronico TEXT NOT NULL UNIQUE CHECK (
        correo_electronico ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    ),
    perfil perfil_rol NOT NULL,
    activo BOOLEAN DEFAULT false,
    url_foto_perfil TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejorar performance
CREATE UNIQUE INDEX idx_usuarios_cuil ON usuarios(cuil);
CREATE UNIQUE INDEX idx_usuarios_correo ON usuarios(correo_electronico);
CREATE INDEX idx_usuarios_perfil_activo ON usuarios(perfil) WHERE activo = true;

-- Trigger para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER usuarios_updated_at
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Habilitar RLS (sin policies por ahora)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;