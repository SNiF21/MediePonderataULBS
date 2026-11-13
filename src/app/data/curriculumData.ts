import calculatoareCurriculum from './facultati/inginerie/cie/calculatoareCurriculum.json';
import tiCurriculum from './facultati/inginerie/cie/tiCurriculum.json';
import ismCurriculum from './facultati/inginerie/cie/ismCurriculum.json';
import eaCurriculum from './facultati/inginerie/cie/eaCurriculum.json';
import eaDualCurriculum from './facultati/inginerie/cie/eaDualCurriculum.json';
import emCurriculum from './facultati/inginerie/cie/emCurriculum.json';
import ittCurriculum from './facultati/inginerie/iim/ittCurriculum.json';
import tddhCurriculum from './facultati/inginerie/iim/tddhCurriculum.json';
import tddhFrCurriculum from './facultati/inginerie/iim/tddhFrCurriculum.json';
import iedmCurriculum from './facultati/inginerie/iim/iedmCurriculum.json';
import iedmIdCurriculum from './facultati/inginerie/iim/iedmIdCurriculum.json';
import tcmCurriculum from './facultati/inginerie/iim/tcmCurriculum.json';
import ieiCurriculum from './facultati/inginerie/mei/ieiCurriculum.json';
import mecatronicaCurriculum from './facultati/inginerie/mei/mecatronicaCurriculum.json';
import mecatronicaEnCurriculum from './facultati/inginerie/mei/mecatronicaEnCurriculum.json';
import mecatronicaDualCurriculum from './facultati/inginerie/mei/mecatronicaDualCurriculum.json';
import roboticaCurriculum from './facultati/inginerie/mei/roboticaCurriculum.json';
import roboticaDualCurriculum from './facultati/inginerie/mei/roboticaDualCurriculum.json';
import spdCurriculum from './facultati/inginerie/mei/spdCurriculum.json';
import managementCurriculum from './facultati/stiinteEconomice/mmaf/managementCurriculum.json';
import informaticaCurriculum from './facultati/stiinte/mi/informaticaCurriculum.json';
import matematicaInformaticaCurriculum from './facultati/stiinte/mi/matematicaInformaticaCurriculum.json';
import { Subject } from '../models/studyProfile';

export const CURRICULUM_DATA: Record<string, Subject[]> = {
  ...(calculatoareCurriculum as Record<string, Subject[]>),
  ...(tiCurriculum as Record<string, Subject[]>),
  ...(ismCurriculum as Record<string, Subject[]>),
  ...(eaCurriculum as Record<string, Subject[]>),
  ...(eaDualCurriculum as Record<string, Subject[]>),
  ...(emCurriculum as Record<string, Subject[]>),
  ...(ittCurriculum as Record<string, Subject[]>),
  ...(tddhCurriculum as Record<string, Subject[]>),
  ...(tddhFrCurriculum as Record<string, Subject[]>),
  ...(iedmCurriculum as Record<string, Subject[]>),
  ...(iedmIdCurriculum as Record<string, Subject[]>),
  ...(tcmCurriculum as Record<string, Subject[]>),
  ...(ieiCurriculum as Record<string, Subject[]>),
  ...(mecatronicaCurriculum as Record<string, Subject[]>),
  ...(mecatronicaEnCurriculum as Record<string, Subject[]>),
  ...(mecatronicaDualCurriculum as Record<string, Subject[]>),
  ...(roboticaCurriculum as Record<string, Subject[]>),
  ...(roboticaDualCurriculum as Record<string, Subject[]>),
  ...(spdCurriculum as Record<string, Subject[]>),
  ...(managementCurriculum as Record<string, Subject[]>),
  ...(informaticaCurriculum as Record<string, Subject[]>),
  ...(matematicaInformaticaCurriculum as Record<string, Subject[]>),
};
