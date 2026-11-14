export interface Subject {
  name: string;
  credits: number;
  type: string;
  isOptional?: boolean;
  options?: string[];
}

export function isOptionalSubject(subject: Subject): boolean {
  return !!(
    subject.isOptional ||
    (subject.options && subject.options.length > 0) ||
    /^op[tț]ional/i.test(subject.name.trim())
  );
}

export function getSubjectOptions(subject: Subject): string[] {
  if (subject.options && subject.options.length > 0) {
    return subject.options;
  }
  const match = subject.name.match(/\(([^)]+)\)/);
  if (match && match[1]) {
    return match[1]
      .split('/')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }
  return [];
}

export type StudyDegree = 'Licență' | 'Master';

export const STUDY_DEGREES: StudyDegree[] = ['Licență', 'Master'];

export type StudyMajor =
  | 'Calculatoare'
  | 'Tehnologia Informației'
  | 'Ingineria Sistemelor Multimedia'
  | 'Electronică Aplicată'
  | 'Electronică Aplicată (Dual)'
  | 'Electromecanică'
  | 'Ingineria Transporturilor și a Traficului'
  | 'Transportul, Depozitarea și Distribuția Hidrocarburilor'
  | 'Transportul, Depozitarea și Distribuția Hidrocarburilor (FR)'
  | 'Tehnologia Construcțiilor de Mașini'
  | 'Inginerie Economică în Domeniul Mecanic'
  | 'Inginerie Economică în Domeniul Mecanic (ID)'
  | 'Inginerie Economică Industrială'
  | 'Mecatronică'
  | 'Mecatronică (în limba engleză)'
  | 'Mecatronică (Dual)'
  | 'Robotică'
  | 'Robotică (Dual)'
  | 'Sisteme de Producție Digitale'
  | 'Management'
  | 'Informatică'
  | 'Matematică Informatică'
  | 'Matematică informatică'
  | 'Applied Artificial Intelligence'
  | 'Aplicații Avansate în Ingineria Electrică'
  | 'Advanced Computing Systems'
  | 'Embedded Systems'
  | 'Ingineria Calculatoarelor în Aplicații Industriale'
  | 'Ingineria și Managementul Gazelor Naturale'
  | 'Logistică Industrială'
  | 'Managementul Afacerilor Industriale'
  | 'Managementul Calității'
  | 'Managementul Proiectelor'
  | 'Sisteme și Tehnologii Inteligente de Fabricație'
  | 'Sisteme CAD-CAE-CAM în Deformarea Plastică'
  | 'Sisteme Mecatronice Avansate'
  | 'Sisteme Mecatronice Avansate (Dual)';

export const STUDY_MAJORS: StudyMajor[] = [
  'Calculatoare',
  'Tehnologia Informației',
  'Ingineria Sistemelor Multimedia',
  'Electronică Aplicată',
  'Electronică Aplicată (Dual)',
  'Electromecanică',
  'Ingineria Transporturilor și a Traficului',
  'Transportul, Depozitarea și Distribuția Hidrocarburilor',
  'Transportul, Depozitarea și Distribuția Hidrocarburilor (FR)',
  'Tehnologia Construcțiilor de Mașini',
  'Inginerie Economică în Domeniul Mecanic',
  'Inginerie Economică în Domeniul Mecanic (ID)',
  'Inginerie Economică Industrială',
  'Mecatronică',
  'Mecatronică (în limba engleză)',
  'Mecatronică (Dual)',
  'Robotică',
  'Robotică (Dual)',
  'Sisteme de Producție Digitale',
  'Management',
  'Informatică',
  'Matematică Informatică',
  'Applied Artificial Intelligence',
  'Aplicații Avansate în Ingineria Electrică',
  'Advanced Computing Systems',
  'Embedded Systems',
  'Ingineria Calculatoarelor în Aplicații Industriale',
  'Ingineria și Managementul Gazelor Naturale',
  'Logistică Industrială',
  'Managementul Afacerilor Industriale',
  'Managementul Calității',
  'Managementul Proiectelor',
  'Sisteme și Tehnologii Inteligente de Fabricație',
  'Sisteme CAD-CAE-CAM în Deformarea Plastică',
  'Sisteme Mecatronice Avansate',
  'Sisteme Mecatronice Avansate (Dual)',
];

export interface DepartmentOption {
  id: string;
  name: string;
  shortName: string;
  majors: StudyMajor[];
}

export interface FacultyOption {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  departments: DepartmentOption[];
}

export const FACULTIES: FacultyOption[] = [
  {
    id: 'inginerie',
    name: 'Facultatea de Inginerie',
    shortName: 'Inginerie',
    icon: 'assets/facultati/inginerie.png',
    departments: [
      {
        id: 'cie',
        name: 'Calculatoare și Inginerie Electrică (CIE)',
        shortName: 'CIE',
        majors: [
          'Calculatoare',
          'Tehnologia Informației',
          'Ingineria Sistemelor Multimedia',
          'Electronică Aplicată',
          'Electronică Aplicată (Dual)',
          'Electromecanică',
          'Applied Artificial Intelligence',
          'Aplicații Avansate în Ingineria Electrică',
          'Advanced Computing Systems',
          'Embedded Systems',
          'Ingineria Calculatoarelor în Aplicații Industriale',
        ],
      },
      {
        id: 'iim',
        name: 'Inginerie Industrială și Management (IIM)',
        shortName: 'IIM',
        majors: [
          'Ingineria Transporturilor și a Traficului',
          'Transportul, Depozitarea și Distribuția Hidrocarburilor',
          'Transportul, Depozitarea și Distribuția Hidrocarburilor (FR)',
          'Tehnologia Construcțiilor de Mașini',
          'Inginerie Economică în Domeniul Mecanic',
          'Inginerie Economică în Domeniul Mecanic (ID)',
          'Ingineria și Managementul Gazelor Naturale',
          'Logistică Industrială',
          'Managementul Afacerilor Industriale',
          'Managementul Calității',
          'Managementul Proiectelor',
          'Sisteme și Tehnologii Inteligente de Fabricație',
        ],
      },
      {
        id: 'mei',
        name: 'Mașini și Echipamente Industriale (MEI)',
        shortName: 'MEI',
        majors: [
          'Inginerie Economică Industrială',
          'Mecatronică',
          'Mecatronică (în limba engleză)',
          'Mecatronică (Dual)',
          'Robotică',
          'Robotică (Dual)',
          'Sisteme de Producție Digitale',
          'Sisteme CAD-CAE-CAM în Deformarea Plastică',
          'Sisteme Mecatronice Avansate',
          'Sisteme Mecatronice Avansate (Dual)',
        ],
      },
    ],
  },
  {
    id: 'drept',
    name: 'Facultatea de Drept',
    shortName: 'Drept',
    icon: 'assets/facultati/drept.png',
    departments: [
      {
        id: 'drept-dept',
        name: 'Departamentul de Drept (DD)',
        shortName: 'DD',
        majors: [],
      },
    ],
  },
  {
    id: 'litere',
    name: 'Facultatea de Litere și Arte',
    shortName: 'Litere și Arte',
    icon: 'assets/facultati/litere.png',
    departments: [
      {
        id: 'litere-dept',
        name: 'Studii Romanice și Francofone (DSRF)',
        shortName: 'DSRF',
        majors: [],
      },
    ],
  },
  {
    id: 'medicina',
    name: 'Facultatea de Medicină',
    shortName: 'Medicină',
    icon: 'assets/facultati/medicina.png',
    departments: [
      {
        id: 'medicina-dept',
        name: 'Departamentul Clinic și Preclinic (DCP)',
        shortName: 'DCP',
        majors: [],
      },
    ],
  },
  {
    id: 'stiinte',
    name: 'Facultatea de Științe',
    shortName: 'Științe',
    icon: 'assets/facultati/stiinte.png',
    departments: [
      {
        id: 'stiinte-dept',
        name: 'Matematică și Informatică (DMI)',
        shortName: 'DMI',
        majors: ['Informatică', 'Matematică Informatică'],
      },
    ],
  },
  {
    id: 'saiapm',
    name: 'Facultatea de ȘAIAPM',
    shortName: 'ȘAIAPM',
    icon: 'assets/facultati/saiapm.png',
    departments: [
      {
        id: 'saiapm-dept',
        name: 'Științe Agricole și Industrie Alimentară (DSAIA)',
        shortName: 'DSAIA',
        majors: [],
      },
    ],
  },
  {
    id: 'stiinte-economice',
    name: 'Facultatea de Științe Economice',
    shortName: 'Științe Economice',
    icon: 'assets/facultati/stiinte-economice.png',
    departments: [
      {
        id: 'economice-dept',
        name: 'Management, Marketing și Administrarea Afacerilor (DMMA)',
        shortName: 'DMMA',
        majors: ['Management'],
      },
    ],
  },
  {
    id: 'socio-umane',
    name: 'Facultatea de Științe Socio-Umane',
    shortName: 'Științe Socio-Umane',
    icon: 'assets/facultati/socio-umane.png',
    departments: [
      {
        id: 'socio-dept',
        name: 'Psihologie și Științe ale Educației (DPSE)',
        shortName: 'DPSE',
        majors: [],
      },
    ],
  },
  {
    id: 'teologie',
    name: 'Facultatea de Teologie',
    shortName: 'Teologie',
    icon: 'assets/facultati/teologie.png',
    departments: [
      {
        id: 'teologie-dept',
        name: 'Teologie Ortodoxă (DTO)',
        shortName: 'DTO',
        majors: [],
      },
    ],
  },
];

export const DEFAULT_FACULTY = 'Facultatea de Inginerie';
export const DEFAULT_DEPARTMENT = 'CIE';

export function getFacultyIcon(facultyName: string): string {
  const f = FACULTIES.find(
    (item) => item.name === facultyName || item.id === facultyName || item.shortName === facultyName
  );
  return f?.icon ?? 'assets/facultati/inginerie.png';
}

export function getDepartmentsForFaculty(facultyName: string): DepartmentOption[] {
  const f = FACULTIES.find(
    (item) => item.name === facultyName || item.id === facultyName || item.shortName === facultyName
  );
  return f ? f.departments : (FACULTIES[0]?.departments ?? []);
}

export function getMajorDegree(major: StudyMajor | string): StudyDegree {
  const years = MAJOR_TOTAL_YEARS[major];
  if (years && years <= 2) {
    return 'Master';
  }
  return 'Licență';
}

export function getMajorsForDepartment(
  facultyName: string,
  departmentNameOrShort: string,
  degree?: StudyDegree
): StudyMajor[] {
  const depts = getDepartmentsForFaculty(facultyName);
  const norm = (departmentNameOrShort ?? '').toLowerCase().trim();
  const d = depts.find(
    (item) =>
      item.name.toLowerCase() === norm ||
      item.shortName.toLowerCase() === norm ||
      item.id.toLowerCase() === norm ||
      (norm === 'mi' && item.shortName === 'DMI') ||
      (norm === 'mmaf' && item.shortName === 'DMMA')
  );
  const majors = d ? d.majors : STUDY_MAJORS;
  if (!degree) {
    return majors;
  }
  return majors.filter((m) => getMajorDegree(m) === degree);
}

export type YearRoman = 'I' | 'II' | 'III' | 'IV';

export interface YearOption {
  roman: YearRoman;
  key: string; // e.g. 'Anul 1'
  label: string; // e.g. 'Anul I'
}

export const STUDY_YEARS: YearOption[] = [
  { roman: 'I', key: 'Anul 1', label: 'Anul I' },
  { roman: 'II', key: 'Anul 2', label: 'Anul II' },
  { roman: 'III', key: 'Anul 3', label: 'Anul III' },
  { roman: 'IV', key: 'Anul 4', label: 'Anul IV' },
];

export const MAJOR_TOTAL_YEARS: Record<string, number> = {
  Calculatoare: 4,
  'Tehnologia Informației': 4,
  'Ingineria Sistemelor Multimedia': 4,
  'Electronică Aplicată': 4,
  'Electronică Aplicată (Dual)': 4,
  Electromecanică: 4,
  'Ingineria Transporturilor și a Traficului': 4,
  'Transportul, Depozitarea și Distribuția Hidrocarburilor': 4,
  'Transportul, Depozitarea și Distribuția Hidrocarburilor (FR)': 4,
  'Tehnologia Construcțiilor de Mașini': 4,
  'Inginerie Economică în Domeniul Mecanic': 4,
  'Inginerie Economică în Domeniul Mecanic (ID)': 4,
  'Inginerie Economică Industrială': 4,
  Mecatronică: 4,
  'Mecatronică (în limba engleză)': 4,
  'Mecatronică (Dual)': 4,
  Robotică: 4,
  'Robotică (Dual)': 4,
  'Sisteme de Producție Digitale': 4,
  Management: 3,
  Informatică: 3,
  'Matematică Informatică': 3,
  'Matematică informatică': 3,
  'Applied Artificial Intelligence': 2,
  'Aplicații Avansate în Ingineria Electrică': 2,
  'Advanced Computing Systems': 2,
  'Embedded Systems': 2,
  'Ingineria Calculatoarelor în Aplicații Industriale': 2,
  'Ingineria și Managementul Gazelor Naturale': 2,
  'Logistică Industrială': 2,
  'Managementul Afacerilor Industriale': 2,
  'Managementul Calității': 2,
  'Managementul Proiectelor': 2,
  'Sisteme și Tehnologii Inteligente de Fabricație': 2,
  'Sisteme CAD-CAE-CAM în Deformarea Plastică': 2,
  'Sisteme Mecatronice Avansate': 2,
  'Sisteme Mecatronice Avansate (Dual)': 2,
};

export const FACULTY_DEFAULT_YEARS: Record<string, number> = {
  inginerie: 4,
  'Facultatea de Inginerie': 4,
  stiinte: 3,
  'Facultatea de Științe': 3,
  'stiinte-economice': 3,
  'Facultatea de Științe Economice': 3,
  litere: 3,
  'Facultatea de Litere și Arte': 3,
  'socio-umane': 3,
  'Facultatea de Științe Socio-Umane': 3,
  drept: 4,
  'Facultatea de Drept': 4,
  teologie: 4,
  'Facultatea de Teologie': 4,
  saiapm: 4,
  'Facultatea de ȘAIAPM': 4,
  medicina: 6,
  'Facultatea de Medicină': 6,
};

export function getYearsForMajor(major: string, facultyName?: string): YearOption[] {
  if (major && MAJOR_TOTAL_YEARS[major]) {
    return STUDY_YEARS.slice(0, MAJOR_TOTAL_YEARS[major]);
  }
  if (facultyName && FACULTY_DEFAULT_YEARS[facultyName]) {
    return STUDY_YEARS.slice(0, FACULTY_DEFAULT_YEARS[facultyName]);
  }
  return STUDY_YEARS;
}

export type SemesterRoman = 'Semestrul I' | 'Semestrul II';

export interface SemesterOption {
  roman: SemesterRoman;
  key: string; // e.g. 'Semestrul 1'
  shortLabel: string; // e.g. 'Sem. I'
  num: 1 | 2;
}

export const STUDY_SEMESTERS: SemesterOption[] = [
  { roman: 'Semestrul I', key: 'Semestrul 1', shortLabel: 'Sem. I', num: 1 },
  { roman: 'Semestrul II', key: 'Semestrul 2', shortLabel: 'Sem. II', num: 2 },
];

export function buildCurriculumKey(
  major: StudyMajor,
  yearRoman: YearRoman,
  semesterRoman: SemesterRoman
): string {
  const y = STUDY_YEARS.find((item) => item.roman === yearRoman)?.key ?? 'Anul 1';
  const s = STUDY_SEMESTERS.find((item) => item.roman === semesterRoman)?.key ?? 'Semestrul 1';
  return `${major} - ${y}, ${s}`;
}