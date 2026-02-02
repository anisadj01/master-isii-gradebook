export interface Module {
  id: string;
  name: string;
  coefficient: number;
  credits: number;
  ccWeight: number;
  examWeight: number;
}

export interface UnitEnseignement {
  id: string;
  name: string;
  code: string;
  type: 'fundamental' | 'methodology' | 'transversal';
  modules: Module[];
}

export const semester1Units: UnitEnseignement[] = [
  {
    id: 'uef1',
    name: 'Unité Fondamentale 1',
    code: 'UEF1',
    type: 'fundamental',
    modules: [
      {
        id: 'arch-log',
        name: 'Architecture Logicielle',
        coefficient: 3,
        credits: 6,
        ccWeight: 0.4,
        examWeight: 0.6,
      },
      {
        id: 'reseaux',
        name: 'Réseaux Avancés',
        coefficient: 2,
        credits: 4,
        ccWeight: 0.4,
        examWeight: 0.6,
      },
    ],
  },
  {
    id: 'uef2',
    name: 'Unité Fondamentale 2',
    code: 'UEF2',
    type: 'fundamental',
    modules: [
      {
        id: 'ia-ml',
        name: 'Intelligence Artificielle : Apprentissage Automatique',
        coefficient: 3,
        credits: 4,
        ccWeight: 0.4,
        examWeight: 0.6,
      },
      {
        id: 'stats',
        name: 'Analyse Statistique des Données',
        coefficient: 2,
        credits: 4,
        ccWeight: 0.4,
        examWeight: 0.6,
      },
    ],
  },
  {
    id: 'uem1',
    name: 'Méthodologie 1',
    code: 'UEM1',
    type: 'methodology',
    modules: [
      {
        id: 'multimedia',
        name: 'Multimédia',
        coefficient: 2,
        credits: 2,
        ccWeight: 0.4,
        examWeight: 0.6,
      },
      {
        id: 'optim',
        name: 'Optimisation Combinatoire',
        coefficient: 2,
        credits: 3,
        ccWeight: 0.4,
        examWeight: 0.6,
      },
    ],
  },
  {
    id: 'uem2',
    name: 'Méthodologie 2',
    code: 'UEM2',
    type: 'methodology',
    modules: [
      {
        id: 'sad',
        name: "Systèmes d'Aide à la Décision",
        coefficient: 1,
        credits: 2,
        ccWeight: 0.4,
        examWeight: 0.6,
      },
      {
        id: 'securite',
        name: 'Méthodologies de Sécurité',
        coefficient: 2,
        credits: 2,
        ccWeight: 0.4,
        examWeight: 0.6,
      },
    ],
  },
  {
    id: 'uet1',
    name: 'Transversale',
    code: 'UET1',
    type: 'transversal',
    modules: [
      {
        id: 'images',
        name: "Introduction au Traitement d'Images",
        coefficient: 2,
        credits: 3,
        ccWeight: 0.4,
        examWeight: 0.6,
      },
    ],
  },
];

export interface GradeInput {
  cc: number | null;
  exam: number | null;
}

export interface Grades {
  [moduleId: string]: GradeInput;
}

export function calculateModuleAverage(
  grades: GradeInput,
  module: Module
): number | null {
  if (grades.cc === null || grades.exam === null) return null;
  return grades.cc * module.ccWeight + grades.exam * module.examWeight;
}

export function calculateUnitAverage(
  unit: UnitEnseignement,
  allGrades: Grades
): number | null {
  let totalWeighted = 0;
  let totalCoeff = 0;

  for (const module of unit.modules) {
    const grades = allGrades[module.id];
    if (!grades) return null;
    
    const moduleAvg = calculateModuleAverage(grades, module);
    if (moduleAvg === null) return null;

    totalWeighted += moduleAvg * module.coefficient;
    totalCoeff += module.coefficient;
  }

  if (totalCoeff === 0) return null;
  return totalWeighted / totalCoeff;
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
