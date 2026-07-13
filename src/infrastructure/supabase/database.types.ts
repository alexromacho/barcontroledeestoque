export type Database = {
  public: {
    Tables: {
      fornecedores: {
        Row: {
          id: string;
          nome: string;
          telefone: string;
          categoria: string;
          frequencia_compra: string;
          ativo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          nome: string;
          telefone: string;
          categoria: string;
          frequencia_compra: string;
          ativo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["fornecedores"]["Insert"]>;
        Relationships: [];
      };
      produtos: {
        Row: {
          id: string;
          fornecedor_id: string;
          nome: string;
          categoria: string;
          unidade: string;
          estoque_atual: number;
          estoque_minimo: number;
          valor_unitario: number;
          ativo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          fornecedor_id: string;
          nome: string;
          categoria: string;
          unidade: string;
          estoque_atual?: number;
          estoque_minimo?: number;
          valor_unitario?: number;
          ativo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["produtos"]["Insert"]>;
        Relationships: [{
          foreignKeyName: "produtos_fornecedor_id_fkey";
          columns: ["fornecedor_id"];
          isOneToOne: false;
          referencedRelation: "fornecedores";
          referencedColumns: ["id"];
        }];
      };
      movimentacoes_estoque: {
        Row: {
          id: string;
          produto_id: string;
          fornecedor_id: string;
          tipo: "entrada" | "saida";
          quantidade: number;
          unidade: string;
          estoque_anterior: number;
          estoque_atual: number;
          data_movimentacao: string;
          horario_movimentacao: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["movimentacoes_estoque"]["Row"], "created_at"> & {
          created_at?: string;
        };
        Update: never;
        Relationships: [
          {
            foreignKeyName: "movimentacoes_estoque_produto_id_fkey";
            columns: ["produto_id"];
            isOneToOne: false;
            referencedRelation: "produtos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "movimentacoes_estoque_fornecedor_id_fkey";
            columns: ["fornecedor_id"];
            isOneToOne: false;
            referencedRelation: "fornecedores";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type FornecedorRow = Database["public"]["Tables"]["fornecedores"]["Row"];
export type ProdutoRow = Database["public"]["Tables"]["produtos"]["Row"];
export type ProdutoUpdate = Database["public"]["Tables"]["produtos"]["Update"];
export type MovimentacaoRow = Database["public"]["Tables"]["movimentacoes_estoque"]["Row"];
export type MovimentacaoInsert = Database["public"]["Tables"]["movimentacoes_estoque"]["Insert"];

export type ProdutoComFornecedorRow = ProdutoRow & {
  fornecedores: Pick<FornecedorRow, "nome"> | null;
};

export type MovimentacaoComRelacoesRow = MovimentacaoRow & {
  produtos: Pick<ProdutoRow, "nome" | "categoria"> | null;
  fornecedores: Pick<FornecedorRow, "nome"> | null;
};
