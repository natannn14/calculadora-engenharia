// ===========================================================
// REPOSITORY — Abstrai a origem dos dados.
// Na v0.1: lê de JSON/Markdown locais.
// Futuramente: pode trocar para PostgreSQL via API REST,
// sem reescrever NADA no Engine ou na UI.
// ===========================================================
import type { KnowledgeFormula, KnowledgeConstant, KnowledgeMaterial } from '../core/types/knowledge';

export interface KnowledgeRepository {
  getFormula(id: string): Promise<KnowledgeFormula | null>;
  searchFormulas(query: string): Promise<KnowledgeFormula[]>;
  getFormulasByDiscipline(disciplineId: string): Promise<KnowledgeFormula[]>;

  getConstant(id: string): Promise<KnowledgeConstant | null>;
  getAllConstants(): Promise<KnowledgeConstant[]>;

  getMaterial(id: string): Promise<KnowledgeMaterial | null>;
  getAllMaterials(): Promise<KnowledgeMaterial[]>;
}

// Default JSON repository implementation (v0.1)
class JsonKnowledgeRepository implements KnowledgeRepository {
  private formulasCache: KnowledgeFormula[] | null = null;
  private constantsCache: KnowledgeConstant[] | null = null;

  async getFormula(id: string) {
    const all = await this.getAllFormulas();
    return all.find(f => f.id === id) ?? null;
  }

  async searchFormulas(query: string) {
    const all = await this.getAllFormulas();
    const q = query.toLowerCase();
    return all.filter(f => f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q));
  }

  async getFormulasByDiscipline(disciplineId: string) {
    const all = await this.getAllFormulas();
    return all.filter(f => f.discipline === disciplineId);
  }

  async getConstant(id: string) {
    const all = await this.getAllConstants();
    return all.find(c => c.id === id) ?? null;
  }

  async getAllConstants() {
    if (this.constantsCache) return this.constantsCache;
    try {
      const mod = await import('../knowledge/constants/index.json');
      this.constantsCache = mod.default as KnowledgeConstant[];
    } catch { this.constantsCache = []; }
    return this.constantsCache!;
  }

  async getMaterial(id: string) {
    const all = await this.getAllMaterials();
    return all.find(m => m.id === id) ?? null;
  }

  async getAllMaterials() {
    try {
      const mod = await import('../knowledge/materials/index.json');
      return mod.default as unknown as KnowledgeMaterial[];
    } catch { return []; }
  }

  private async getAllFormulas() {
    if (this.formulasCache) return this.formulasCache;
    try {
      const mod = await import('../knowledge/formulas/index.json');
      this.formulasCache = mod.default as KnowledgeFormula[];
    } catch { this.formulasCache = []; }
    return this.formulasCache!;
  }
}

// Singleton — troque aqui quando migrar para PostgreSQL
export const knowledgeRepo: KnowledgeRepository = new JsonKnowledgeRepository();
