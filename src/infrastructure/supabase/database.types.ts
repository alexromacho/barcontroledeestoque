export type Database = {
  public: {
    Tables: {
      suppliers: {
        Row: {
          id: string;
          name: string;
          phone: string;
          category: string;
          purchase_frequency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone?: string;
          category?: string;
          purchase_frequency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["suppliers"]["Insert"]>;
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          supplier_id: string;
          name: string;
          category: string;
          unit: string;
          current_stock: number;
          minimum_stock: number;
          unit_price: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          supplier_id: string;
          name: string;
          category?: string;
          unit?: string;
          current_stock?: number;
          minimum_stock?: number;
          unit_price?: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [{
          foreignKeyName: "products_supplier_id_fkey";
          columns: ["supplier_id"];
          isOneToOne: false;
          referencedRelation: "suppliers";
          referencedColumns: ["id"];
        }];
      };
      stock_movements: {
        Row: {
          id: string;
          product_id: string;
          movement_type: "entrada" | "saida" | "ajuste";
          quantity: number;
          previous_stock: number;
          current_stock: number;
          note: string;
          invoice_image_path: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["stock_movements"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: never;
        Relationships: [{
          foreignKeyName: "stock_movements_product_id_fkey";
          columns: ["product_id"];
          isOneToOne: false;
          referencedRelation: "products";
          referencedColumns: ["id"];
        }];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type SupplierRow = Database["public"]["Tables"]["suppliers"]["Row"];
export type SupplierInsert = Database["public"]["Tables"]["suppliers"]["Insert"];
export type SupplierUpdate = Database["public"]["Tables"]["suppliers"]["Update"];
export type ProdutoRow = Database["public"]["Tables"]["products"]["Row"];
export type ProdutoInsert = Database["public"]["Tables"]["products"]["Insert"];
export type ProdutoUpdate = Database["public"]["Tables"]["products"]["Update"];
export type MovimentacaoRow = Database["public"]["Tables"]["stock_movements"]["Row"];
export type MovimentacaoInsert = Database["public"]["Tables"]["stock_movements"]["Insert"];

export type ProdutoComFornecedorRow = ProdutoRow & {
  suppliers: Pick<SupplierRow, "name"> | null;
};

export type MovimentacaoComRelacoesRow = MovimentacaoRow & {
  products: (Pick<ProdutoRow, "name" | "category" | "unit"> & {
    suppliers: Pick<SupplierRow, "name"> | null;
  }) | null;
};
