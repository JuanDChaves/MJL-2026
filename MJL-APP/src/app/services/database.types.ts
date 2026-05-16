
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]
export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      mesas: {
        Row: {
          cantidad_comensales: number
          created_at: string
          dni: string | null
          id: string
          numero_mesa: number
          ocupada: boolean
          tipo_mesa: string
          url_foto_mesa: string
          url_qr: string
        }
        Insert: {
          cantidad_comensales: number
          created_at?: string
          dni?: string | null
          id?: string
          numero_mesa: number
          ocupada?: boolean
          tipo_mesa: string
          url_foto_mesa: string
          url_qr: string
        }
        Update: {
          cantidad_comensales?: number
          created_at?: string
          dni?: string | null
          id?: string
          numero_mesa?: number
          ocupada?: boolean
          tipo_mesa?: string
          url_foto_mesa?: string
          url_qr?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          data: Json | null
          id: string
          title: string | null
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          data?: Json | null
          id?: string
          title?: string | null
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          data?: Json | null
          id?: string
          title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      pedidos: {
        Row: {
          created_at: string
          estado: Database["public"]["Enums"]["estado"] | null
          id: string
          id_cliente: string | null
          mesa: number | null
          nombre_cliente: string | null
        }
        Insert: {
          created_at?: string
          estado?: Database["public"]["Enums"]["estado"] | null
          id?: string
          id_cliente?: string | null
          mesa?: number | null
          nombre_cliente?: string | null
        }
        Update: {
          created_at?: string
          estado?: Database["public"]["Enums"]["estado"] | null
          id?: string
          id_cliente?: string | null
          mesa?: number | null
          nombre_cliente?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_id_cliente_fkey1"
            columns: ["id_cliente"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      productos: {
        Row: {
          creado_at: string | null
          creado_por: string | null
          descripcion: string
          fotos: string[]
          id: string
          nombre: string
          precio: number
          tiempo_elaboracion: number
          tipo: Database["public"]["Enums"]["tipo_producto"]
        }
        Insert: {
          creado_at?: string | null
          creado_por?: string | null
          descripcion: string
          fotos: string[]
          id?: string
          nombre: string
          precio: number
          tiempo_elaboracion: number
          tipo: Database["public"]["Enums"]["tipo_producto"]
        }
        Update: {
          creado_at?: string | null
          creado_por?: string | null
          descripcion?: string
          fotos?: string[]
          id?: string
          nombre?: string
          precio?: number
          tiempo_elaboracion?: number
          tipo?: Database["public"]["Enums"]["tipo_producto"]
        }
        Relationships: []
      }
      productos_pedido: {
        Row: {
          cantidad: number | null
          created_at: string
          id: string
          id_pedido: string | null
          id_producto: string | null
          precio: number | null
        }
        Insert: {
          cantidad?: number | null
          created_at?: string
          id?: string
          id_pedido?: string | null
          id_producto?: string | null
          precio?: number | null
        }
        Update: {
          cantidad?: number | null
          created_at?: string
          id?: string
          id_pedido?: string | null
          id_producto?: string | null
          precio?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "productos_pedido_id_pedido_fkey"
            columns: ["id_pedido"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "productos_pedido_id_producto_fkey"
            columns: ["id_producto"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitudes: {
        Row: {
          apellidos: string
          correo_electronico: string
          dni: string
          estado: boolean
          fecha_registro: string
          id: string
          nombres: string
          url_foto_perfil: string
        }
        Insert: {
          apellidos: string
          correo_electronico: string
          dni: string
          estado: boolean
          fecha_registro?: string
          id?: string
          nombres: string
          url_foto_perfil: string
        }
        Update: {
          apellidos?: string
          correo_electronico?: string
          dni?: string
          estado?: boolean
          fecha_registro?: string
          id?: string
          nombres?: string
          url_foto_perfil?: string
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          activo: boolean | null
          apellidos: string
          correo_electronico: string
          created_at: string | null
          cuil: string | null
          dni: string
          fcm_token: string | null
          id: string
          nombres: string
          perfil: Database["public"]["Enums"]["perfil_rol"]
          updated_at: string | null
          url_foto_perfil: string | null
          user_id: string
        }
        Insert: {
          activo?: boolean | null
          apellidos: string
          correo_electronico: string
          created_at?: string | null
          cuil?: string | null
          dni: string
          fcm_token?: string | null
          id?: string
          nombres: string
          perfil: Database["public"]["Enums"]["perfil_rol"]
          updated_at?: string | null
          url_foto_perfil?: string | null
          user_id: string
        }
        Update: {
          activo?: boolean | null
          apellidos?: string
          correo_electronico?: string
          created_at?: string | null
          cuil?: string | null
          dni?: string
          fcm_token?: string | null
          id?: string
          nombres?: string
          perfil?: Database["public"]["Enums"]["perfil_rol"]
          updated_at?: string | null
          url_foto_perfil?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      estado: "pendiente" | "preparando" | "hecho" | "entregado"
      perfil_rol:
        | "duenio"
        | "supervisor"
        | "metre"
        | "mozo"
        | "cocinero"
        | "cantinero"
        | "cliente"
      tipo_producto: "plato" | "bebida"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]
export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never
export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never
export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never
export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never
export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      estado: ["pendiente", "preparando", "hecho", "entregado"],
      perfil_rol: [
        "duenio",
        "supervisor",
        "metre",
        "mozo",
        "cocinero",
        "cantinero",
        "cliente",
      ],
      tipo_producto: ["plato", "bebida"],
    },
  },
} as const
