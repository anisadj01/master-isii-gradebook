export interface Module {
  id: string;
  name: string;
  coefficient: number;
  credits: number;
  tdWeight: number;
  tpWeight: number;
  examWeight: number;
}

export interface UnitEnseignement {
  id: string;
  name: string;
  code: string;
  type: 'fundamental' | 'methodology' | 'transversal' | 'discovery';
  modules: Module[];
}

const STD = { tdWeight: 0.2, tpWeight: 0.2, examWeight: 0.6 };

export const semester1Units: UnitEnseignement[] = [
  {
    id: 'uef1',
    name: 'Unité Fondamentale 1',
    code: 'UEF1',
    type: 'fundamental',
    modules: [
      { id: 'arch-log', name: 'Architecture Logicielle', coefficient: 3, credits: 6, ...STD },
      { id: 'reseaux', name: 'Réseaux Avancés', coefficient: 2, credits: 4, ...STD },
    ],
  },
  {
    id: 'uef2',
    name: 'Unité Fondamentale 2',
    code: 'UEF2',
    type: 'fundamental',
    modules: [
      { id: 'ia-ml', name: 'Intelligence Artificielle : Apprentissage Automatique', coefficient: 3, credits: 4, ...STD },
      { id: 'stats', name: 'Analyse Statistique des Données', coefficient: 2, credits: 4, ...STD },
    ],
  },
  {
    id: 'uem1',
    name: 'Méthodologie 1',
    code: 'UEM1',
    type: 'methodology',
    modules: [
      { id: 'multimedia', name: 'Multimédia', coefficient: 2, credits: 2, ...STD },
      { id: 'optim', name: 'Optimisation Combinatoire', coefficient: 2, credits: 3, ...STD },
    ],
  },
  {
    id: 'uem2',
    name: 'Méthodologie 2',
    code: 'UEM2',
    type: 'methodology',
    modules: [
      { id: 'securite', name: 'Méthodologies de Sécurité', coefficient: 2, credits: 2, ...STD },
    ],
  },
  {
    id: 'uet1',
    name: 'Transversale',
    code: 'UET1',
    type: 'transversal',
    modules: [
      { id: 'images', name: "Introduction au Traitement d'Images", coefficient: 2, credits: 3, ...STD },
    ],
  },
];

export const semester2Units: UnitEnseignement[] = [
  {
    id: 'uef3',
    name: 'Unité Fondamentale 3',
    code: 'UEF3',
    type: 'fundamental',
    modules: [
      { id: 'j2ee', name: 'Architecture Web J2EE', coefficient: 3, credits: 5, ...STD },
      { id: 'bdd-avancees', name: 'Bases de Données Avancées', coefficient: 3, credits: 4, ...STD },
    ],
  },
  {
    id: 'uef4',
    name: 'Unité Fondamentale 4',
    code: 'UEF4',
    type: 'fundamental',
    modules: [
      { id: 'data-mining', name: 'Data Mining', coefficient: 3, credits: 6, ...STD },
      { id: 'entrepot', name: 'Entrepôt de Données', coefficient: 2, credits: 3, ...STD },
    ],
  },
  {
    id: 'uem3',
    name: 'Méthodologie 3',
    code: 'UEM3',
    type: 'methodology',
    modules: [
      { id: 'crypto', name: 'Cryptographie', coefficient: 2, credits: 3, ...STD },
      { id: 'meps', name: "Méthodes d'Évaluation des Performances des Systèmes", coefficient: 2, credits: 3, ...STD },
      { id: 'vision', name: 'Introduction à la Vision par Ordinateur', coefficient: 2, credits: 3, ...STD },
      { id: 'sad', name: "Systèmes d'Aide à la Décision", coefficient: 1, credits: 2, ...STD },
    ],
  },
  {
    id: 'ued1',
    name: 'Découverte',
    code: 'UED1',
    type: 'discovery',
    modules: [
      { id: 'culture', name: "Culture d'entreprise / Déontologie du travail", coefficient: 1, credits: 2, ...STD },
    ],
  },
  {
    id: 'uet2',
    name: 'Transversale',
    code: 'UET2',
    type: 'transversal',
    modules: [
      { id: 'anglais', name: 'Anglais de base', coefficient: 1, credits: 1, tdWeight: 1, tpWeight: 0, examWeight: 0 },
    ],
  },
];

export interface GradeInput {
  td: number | null;
  tp: number | null;
  exam: number | null;
}

export interface Grades {
  [moduleId: string]: GradeInput;
}

export function calculateModuleAverage(
  grades: GradeInput,
  module: Module
): number | null {
  if (module.tdWeight > 0 && (grades.td === null || grades.td === undefined)) return null;
  if (module.tpWeight > 0 && (grades.tp === null || grades.tp === undefined)) return null;
  if (module.examWeight > 0 && (grades.exam === null || grades.exam === undefined)) return null;
  return (
    (grades.td ?? 0) * module.tdWeight +
    (grades.tp ?? 0) * module.tpWeight +
    (grades.exam ?? 0) * module.examWeight
  );
}

export function calculateSemesterAverage(
  units: UnitEnseignement[],
  allGrades: Grades
): number | null {
  let totalWeighted = 0;
  let totalCoeff = 0;

  for (const unit of units) {
    for (const module of unit.modules) {
      const grades = allGrades[module.id];
      if (!grades) return null;
      const moduleAvg = calculateModuleAverage(grades, module);
      if (moduleAvg === null) return null;
      totalWeighted += moduleAvg * module.coefficient;
      totalCoeff += module.coefficient;
    }
  }

  if (totalCoeff === 0) return null;
  return totalWeighted / totalCoeff;
}

export function getTotalCredits(units: UnitEnseignement[]): number {
  return units.reduce((total, unit) =>
    total + unit.modules.reduce((sum, mod) => sum + mod.credits, 0), 0
  );
}

export function getTotalCoefficients(units: UnitEnseignement[]): number {
  return units.reduce((total, unit) =>
    total + unit.modules.reduce((sum, mod) => sum + mod.coefficient, 0), 0
  );
}

export function getAllModules(units: UnitEnseignement[]): Array<Module & { unitCode: string }> {
  const modules: Array<Module & { unitCode: string }> = [];
  for (const unit of units) {
    for (const module of unit.modules) {
      modules.push({ ...module, unitCode: unit.code });
    }
  }
  return modules;
}

export function getAccumulatedCredits(
  units: UnitEnseignement[],
  allGrades: Grades
): number {
  let acc = 0;
  for (const unit of units) {
    for (const module of unit.modules) {
      const g = allGrades[module.id];
      if (!g) continue;
      const avg = calculateModuleAverage(g, module);
      if (avg !== null && avg >= 10) acc += module.credits;
    }
  }
  return acc;
}
