import type { EventInput } from '@fullcalendar/core';
import type { ColorPaletteSet } from '../models/calendar.models';

export function buildCalendarEvents(colors: ColorPaletteSet): EventInput[] {
  return [
      // =========================
      // SEMAINE 1 — 05 → 09 JAN
      // =========================

      // LUNDI 05
      {
        title: 'APSA',
        start: '2026-01-05T08:00:00', end: '2026-01-05T10:00:00',
        extendedProps: { room: '-', teacher: null },
        backgroundColor: colors.cyan.bg, borderColor: colors.cyan.border, textColor: colors.cyan.text
      },
      {
        title: 'Mathématiques de base: méthodes et outil - Cours2',
        start: '2026-01-05T11:00:00', end: '2026-01-05T12:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'LEMOINE David' },
        backgroundColor: colors.blue.bg, borderColor: colors.blue.border, textColor: colors.blue.text
      },
      {
        title: 'Conception logicielle - Cours1',
        start: '2026-01-05T13:30:00', end: '2026-01-05T14:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'PALUD Sébastien' },
        backgroundColor: colors.blue.bg, borderColor: colors.blue.border, textColor: colors.blue.text
      },
      {
        title: 'Conception logicielle - Cours1',
        start: '2026-01-05T15:00:00', end: '2026-01-05T16:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'PALUD Sébastien' },
        backgroundColor: colors.blue.bg, borderColor: colors.blue.border, textColor: colors.blue.text
      },
      {
        title: 'Conception logicielle - Cours1',
        start: '2026-01-05T16:30:00', end: '2026-01-05T17:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'PALUD Sébastien' },
        backgroundColor: colors.blue.bg, borderColor: colors.blue.border, textColor: colors.blue.text
      },

      // MARDI 06
      {
        title: 'Mathématiques de base: méthodes et outil - TD2',
        start: '2026-01-06T08:00:00', end: '2026-01-06T09:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'LEMOINE David' },
        backgroundColor: colors.green.bg, borderColor: colors.green.border, textColor: colors.green.text
      },
      {
        title: 'Mathématiques de base: méthodes et outil - TD2',
        start: '2026-01-06T09:30:00', end: '2026-01-06T10:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'LEMOINE David' },
        backgroundColor: colors.green.bg, borderColor: colors.green.border, textColor: colors.green.text
      },
      {
        title: 'Anglais (S5)',
        start: '2026-01-06T11:00:00', end: '2026-01-06T12:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'LE BOTLAN-MARCATO Charlotte' },
        backgroundColor: colors.yellow.bg, borderColor: colors.yellow.border, textColor: colors.yellow.text
      },

      // MERCREDI 07
      {
        title: 'IHM - Cours1',
        start: '2026-01-07T08:00:00', end: '2026-01-07T09:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'DELFORGES ALEXIS' },
        backgroundColor: colors.blue.bg, borderColor: colors.blue.border, textColor: colors.blue.text
      },
      {
        title: 'IHM - Cours1',
        start: '2026-01-07T09:30:00', end: '2026-01-07T10:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'DELFORGES ALEXIS' },
        backgroundColor: colors.blue.bg, borderColor: colors.blue.border, textColor: colors.blue.text
      },
      {
        title: 'IHM - Cours1',
        start: '2026-01-07T11:00:00', end: '2026-01-07T12:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'DELFORGES ALEXIS' },
        backgroundColor: colors.blue.bg, borderColor: colors.blue.border, textColor: colors.blue.text
      },

      // JEUDI 08
      {
        title: 'Mathématiques discrètes - Cours1',
        start: '2026-01-08T08:00:00', end: '2026-01-08T09:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'NOYÉ Jacques' },
        backgroundColor: colors.blue.bg, borderColor: colors.blue.border, textColor: colors.blue.text
      },
      {
        title: 'Mathématiques discrètes - Cours1',
        start: '2026-01-08T09:30:00', end: '2026-01-08T10:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'NOYÉ Jacques' },
        backgroundColor: colors.blue.bg, borderColor: colors.blue.border, textColor: colors.blue.text
      },
      {
        title: 'Mathématiques discrètes - Cours1',
        start: '2026-01-08T11:00:00', end: '2026-01-08T12:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'NOYÉ Jacques' },
        backgroundColor: colors.blue.bg, borderColor: colors.blue.border, textColor: colors.blue.text
      },

      // VENDREDI 09
      {
        title: 'Anglais (S5)',
        start: '2026-01-09T08:00:00', end: '2026-01-09T09:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'LE BOTLAN-MARCATO Charlotte' },
        backgroundColor: colors.yellow.bg, borderColor: colors.yellow.border, textColor: colors.yellow.text
      },
      {
        title: 'Anglais (S5)',
        start: '2026-01-09T09:30:00', end: '2026-01-09T10:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'LE BOTLAN-MARCATO Charlotte' },
        backgroundColor: colors.yellow.bg, borderColor: colors.yellow.border, textColor: colors.yellow.text
      },
      {
        title: 'Architectures distribuées - Travail personnel (Libre service)',
        start: '2026-01-09T13:30:00', end: '2026-01-09T14:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: null },
        backgroundColor: colors.gray.bg, borderColor: colors.gray.border, textColor: colors.gray.text
      },
      {
        title: 'Architectures distribuées - Travail personnel (Libre service)',
        start: '2026-01-09T15:00:00', end: '2026-01-09T16:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: null },
        backgroundColor: colors.gray.bg, borderColor: colors.gray.border, textColor: colors.gray.text
      },
      {
        title: 'Architectures distribuées - Travail personnel (Libre service)',
        start: '2026-01-09T16:30:00', end: '2026-01-09T17:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: null },
        backgroundColor: colors.gray.bg, borderColor: colors.gray.border, textColor: colors.gray.text
      },

      // =========================
      // SEMAINE 2 — 12 → 16 JAN
      // =========================

      // LUNDI 12
      {
        title: 'APSA',
        start: '2026-01-12T08:00:00', end: '2026-01-12T10:00:00',
        extendedProps: { room: '-', teacher: null },
        backgroundColor: colors.cyan.bg, borderColor: colors.cyan.border, textColor: colors.cyan.text
      },
      {
        title: 'Mathématiques de base: méthodes et outil - Cours2',
        start: '2026-01-12T11:00:00', end: '2026-01-12T12:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'LEMOINE David' },
        backgroundColor: colors.blue.bg, borderColor: colors.blue.border, textColor: colors.blue.text
      },
      {
        title: 'Conception logicielle - Cours1',
        start: '2026-01-12T13:30:00', end: '2026-01-12T14:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'PALUD Sébastien' },
        backgroundColor: colors.blue.bg, borderColor: colors.blue.border, textColor: colors.blue.text
      },
      {
        title: 'Conception logicielle - Cours1',
        start: '2026-01-12T15:00:00', end: '2026-01-12T16:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'PALUD Sébastien' },
        backgroundColor: colors.blue.bg, borderColor: colors.blue.border, textColor: colors.blue.text
      },
      {
        title: 'Conception logicielle - Cours1',
        start: '2026-01-12T16:30:00', end: '2026-01-12T17:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'PALUD Sébastien' },
        backgroundColor: colors.blue.bg, borderColor: colors.blue.border, textColor: colors.blue.text
      },

      // MARDI 13
      {
        title: 'Mathématiques de base: méthodes et outil - TD2',
        start: '2026-01-13T08:00:00', end: '2026-01-13T09:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'LEMOINE David' },
        backgroundColor: colors.green.bg, borderColor: colors.green.border, textColor: colors.green.text
      },
      {
        title: 'Mathématiques de base: méthodes et outil - TD2',
        start: '2026-01-13T09:30:00', end: '2026-01-13T10:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'LEMOINE David' },
        backgroundColor: colors.green.bg, borderColor: colors.green.border, textColor: colors.green.text
      },
      {
        title: 'Anglais (S5)',
        start: '2026-01-13T11:00:00', end: '2026-01-13T12:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'LE BOTLAN-MARCATO Charlotte' },
        backgroundColor: colors.yellow.bg, borderColor: colors.yellow.border, textColor: colors.yellow.text
      },
      {
        title: 'Compréhension du travail et des entreprises - Cours1',
        start: '2026-01-13T13:30:00', end: '2026-01-13T14:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'KIRTCHIK Olessia' },
        backgroundColor: colors.blue.bg, borderColor: colors.blue.border, textColor: colors.blue.text
      },
      {
        title: 'Compréhension du travail et des entreprises - Cours1',
        start: '2026-01-13T15:00:00', end: '2026-01-13T16:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'KIRTCHIK Olessia' },
        backgroundColor: colors.blue.bg, borderColor: colors.blue.border, textColor: colors.blue.text
      },
      {
        title: 'Compréhension du travail et des entreprises - Cours1',
        start: '2026-01-13T16:30:00', end: '2026-01-13T17:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'KIRTCHIK Olessia' },
        backgroundColor: colors.blue.bg, borderColor: colors.blue.border, textColor: colors.blue.text
      },

      // MERCREDI 14
      {
        title: 'IHM - Cours1',
        start: '2026-01-14T08:00:00', end: '2026-01-14T09:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'DELFORGES ALEXIS' },
        backgroundColor: colors.blue.bg, borderColor: colors.blue.border, textColor: colors.blue.text
      },
      {
        title: 'IHM - Cours1',
        start: '2026-01-14T09:30:00', end: '2026-01-14T10:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'DELFORGES ALEXIS' },
        backgroundColor: colors.blue.bg, borderColor: colors.blue.border, textColor: colors.blue.text
      },
      {
        title: 'IHM - Cours1',
        start: '2026-01-14T11:00:00', end: '2026-01-14T12:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'DELFORGES ALEXIS' },
        backgroundColor: colors.blue.bg, borderColor: colors.blue.border, textColor: colors.blue.text
      },

      // JEUDI 15
      {
        title: 'Mathématiques discrètes - Cours1',
        start: '2026-01-15T08:00:00', end: '2026-01-15T09:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'NOYÉ Jacques' },
        backgroundColor: colors.blue.bg, borderColor: colors.blue.border, textColor: colors.blue.text
      },
      {
        title: 'Mathématiques discrètes - Cours1',
        start: '2026-01-15T09:30:00', end: '2026-01-15T10:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'NOYÉ Jacques' },
        backgroundColor: colors.blue.bg, borderColor: colors.blue.border, textColor: colors.blue.text
      },
      {
        title: 'Mathématiques discrètes - Cours1',
        start: '2026-01-15T11:00:00', end: '2026-01-15T12:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'NOYÉ Jacques' },
        backgroundColor: colors.blue.bg, borderColor: colors.blue.border, textColor: colors.blue.text
      },

      // VENDREDI 16
      {
        title: 'Anglais (S5)',
        start: '2026-01-16T08:00:00', end: '2026-01-16T09:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'LE BOTLAN-MARCATO Charlotte' },
        backgroundColor: colors.yellow.bg, borderColor: colors.yellow.border, textColor: colors.yellow.text
      },
      {
        title: 'Anglais (S5)',
        start: '2026-01-16T09:30:00', end: '2026-01-16T10:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'LE BOTLAN-MARCATO Charlotte' },
        backgroundColor: colors.yellow.bg, borderColor: colors.yellow.border, textColor: colors.yellow.text
      },
      {
        title: 'Débriefing - Cours1',
        start: '2026-01-16T11:00:00', end: '2026-01-16T12:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'ROSINOSKY Guillaume / TISI Massimo' },
        backgroundColor: colors.green.bg, borderColor: colors.green.border, textColor: colors.green.text
      },
      {
        title: 'Architectures distribuées - Travail personnel (Libre service)',
        start: '2026-01-16T13:30:00', end: '2026-01-16T14:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: null },
        backgroundColor: colors.gray.bg, borderColor: colors.gray.border, textColor: colors.gray.text
      },
      {
        title: 'Architectures distribuées - Travail personnel (Libre service)',
        start: '2026-01-16T15:00:00', end: '2026-01-16T16:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: null },
        backgroundColor: colors.gray.bg, borderColor: colors.gray.border, textColor: colors.gray.text
      },
      {
        title: 'Architectures distribuées - Travail personnel (Libre service)',
        start: '2026-01-16T16:30:00', end: '2026-01-16T17:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: null },
        backgroundColor: colors.gray.bg, borderColor: colors.gray.border, textColor: colors.gray.text
      },

      // =========================
      // SEMAINE 3 — 19 → 23 JAN
      // =========================

      // LUNDI 19
      {
        title: 'APSA',
        start: '2026-01-19T08:00:00', end: '2026-01-19T10:00:00',
        extendedProps: { room: '-', teacher: null },
        backgroundColor: colors.cyan.bg, borderColor: colors.cyan.border, textColor: colors.cyan.text
      },
      {
        title: 'Mathématiques de base: méthodes et outil - Cours2',
        start: '2026-01-19T11:00:00', end: '2026-01-19T12:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'LEMOINE David' },
        backgroundColor: colors.blue.bg, borderColor: colors.blue.border, textColor: colors.blue.text
      },
      {
        title: 'Conception logicielle - SOUTENANCES',
        start: '2026-01-19T13:30:00', end: '2026-01-19T14:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'LEDOUX Thomas / PALUD Sébastien' },
        backgroundColor: colors.green.bg, borderColor: colors.green.border, textColor: colors.green.text
      },
      {
        title: 'Conception logicielle - SOUTENANCES',
        start: '2026-01-19T15:00:00', end: '2026-01-19T16:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'LEDOUX Thomas / PALUD Sébastien' },
        backgroundColor: colors.green.bg, borderColor: colors.green.border, textColor: colors.green.text
      },
      {
        title: 'Conception logicielle - SOUTENANCES',
        start: '2026-01-19T16:30:00', end: '2026-01-19T17:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'LEDOUX Thomas / PALUD Sébastien' },
        backgroundColor: colors.green.bg, borderColor: colors.green.border, textColor: colors.green.text
      },

      // MARDI 20 (⚠️ salle Charpak sur ton screen)
      {
        title: 'Mathématiques de base: méthodes et outil - TD2',
        start: '2026-01-20T08:00:00', end: '2026-01-20T09:15:00',
        extendedProps: { room: 'NA-G. Charpak (A120) - (VC-200)', teacher: 'LEMOINE David' },
        backgroundColor: colors.green.bg, borderColor: colors.green.border, textColor: colors.green.text
      },
      {
        title: 'Mathématiques de base: méthodes et outil - TD2',
        start: '2026-01-20T09:30:00', end: '2026-01-20T10:45:00',
        extendedProps: { room: 'NA-G. Charpak (A120) - (VC-200)', teacher: 'LEMOINE David' },
        backgroundColor: colors.green.bg, borderColor: colors.green.border, textColor: colors.green.text
      },
      {
        title: 'Anglais (S5)',
        start: '2026-01-20T11:00:00', end: '2026-01-20T12:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'LE BOTLAN-MARCATO Charlotte' },
        backgroundColor: colors.yellow.bg, borderColor: colors.yellow.border, textColor: colors.yellow.text
      },
      {
        title: 'Compréhension du travail et des entreprises - Cours1',
        start: '2026-01-20T13:30:00', end: '2026-01-20T14:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'KIRTCHIK Olessia' },
        backgroundColor: colors.blue.bg, borderColor: colors.blue.border, textColor: colors.blue.text
      },
      {
        title: 'Compréhension du travail et des entreprises - Cours1',
        start: '2026-01-20T15:00:00', end: '2026-01-20T16:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'KIRTCHIK Olessia' },
        backgroundColor: colors.blue.bg, borderColor: colors.blue.border, textColor: colors.blue.text
      },
      {
        title: 'Compréhension du travail et des entreprises - Cours1',
        start: '2026-01-20T16:30:00', end: '2026-01-20T17:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'KIRTCHIK Olessia' },
        backgroundColor: colors.blue.bg, borderColor: colors.blue.border, textColor: colors.blue.text
      },

      // MERCREDI 21
      {
        title: 'IHM - Cours1',
        start: '2026-01-21T08:00:00', end: '2026-01-21T09:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'DELFORGES ALEXIS' },
        backgroundColor: colors.blue.bg, borderColor: colors.blue.border, textColor: colors.blue.text
      },
      {
        title: 'IHM - Cours1',
        start: '2026-01-21T09:30:00', end: '2026-01-21T10:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'DELFORGES ALEXIS' },
        backgroundColor: colors.blue.bg, borderColor: colors.blue.border, textColor: colors.blue.text
      },
      {
        title: 'IHM - Cours1',
        start: '2026-01-21T11:00:00', end: '2026-01-21T12:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'DELFORGES ALEXIS' },
        backgroundColor: colors.blue.bg, borderColor: colors.blue.border, textColor: colors.blue.text
      },

      // JEUDI 22 : rien sur ton screen

      // VENDREDI 23
      {
        title: 'Anglais (S5)',
        start: '2026-01-23T08:00:00', end: '2026-01-23T09:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'LE BOTLAN-MARCATO Charlotte' },
        backgroundColor: colors.yellow.bg, borderColor: colors.yellow.border, textColor: colors.yellow.text
      },
      {
        title: 'Anglais (S5)',
        start: '2026-01-23T09:30:00', end: '2026-01-23T10:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'LE BOTLAN-MARCATO Charlotte' },
        backgroundColor: colors.yellow.bg, borderColor: colors.yellow.border, textColor: colors.yellow.text
      },
      {
        title: 'Conseil de promotion - Cours1',
        start: '2026-01-23T11:00:00', end: '2026-01-23T12:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'ROSINOSKY Guillaume / SALAÜN Marine / TISI Massimo' },
        backgroundColor: colors.green.bg, borderColor: colors.green.border, textColor: colors.green.text
      },
      {
        title: 'Architectures distribuées - EVAL (ORAL PROJET)',
        start: '2026-01-23T13:30:00', end: '2026-01-23T14:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'COULLON Hélène' },
        backgroundColor: colors.green.bg, borderColor: colors.green.border, textColor: colors.green.text
      },
      {
        title: 'Architectures distribuées - EVAL (ORAL PROJET)',
        start: '2026-01-23T15:00:00', end: '2026-01-23T16:15:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'COULLON Hélène' },
        backgroundColor: colors.green.bg, borderColor: colors.green.border, textColor: colors.green.text
      },
      {
        title: 'Architectures distribuées - EVAL (ORAL PROJET)',
        start: '2026-01-23T16:30:00', end: '2026-01-23T17:45:00',
        extendedProps: { room: 'NA-J147 (V-40)', teacher: 'COULLON Hélène' },
        backgroundColor: colors.green.bg, borderColor: colors.green.border, textColor: colors.green.text
      }
    ];
}
