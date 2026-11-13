import calculatoareCurriculum from './facultati/inginerie/cie/calculatoareCurriculum.json';
import tiCurriculum from './facultati/inginerie/cie/tiCurriculum.json';
import ismCurriculum from './facultati/inginerie/cie/ismCurriculum.json';
import managementCurriculum from './facultati/stiinteEconomice/mmaf/managementCurriculum.json';
import informaticaCurriculum from './facultati/stiinte/mi/informaticaCurriculum.json';
import matematicaInformaticaCurriculum from './facultati/stiinte/mi/matematicaInformaticaCurriculum.json';
import { Subject } from '../models/studyProfile';

export const CURRICULUM_DATA: Record<string, Subject[]> = {
  ...(calculatoareCurriculum as Record<string, Subject[]>),
  ...(tiCurriculum as Record<string, Subject[]>),
  ...(ismCurriculum as Record<string, Subject[]>),
  ...(managementCurriculum as Record<string, Subject[]>),
  ...(informaticaCurriculum as Record<string, Subject[]>),
  ...(matematicaInformaticaCurriculum as Record<string, Subject[]>),
};