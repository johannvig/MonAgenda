# MonAgenda — University Schedule Redesign & Data Pipeline

## Description

MonAgenda is a modern, responsive schedule application built to replace IMT Atlantique's legacy desktop-focused timetable. It features an automated data pipeline that extracts raw schedule exports from the university system, parses and cleans noisy text fields into structured JSON, and feeds a fast, mobile-first Ionic interface.

Designed for students checking their classes on the go, the app highlights the upcoming session immediately upon opening while offering day/week views, course filtering, custom color-coding, and a dedicated color-blind accessibility mode.

## Key Features

- **Automated Data Extraction & Parsing**: Fetches raw schedule data from the legacy portal and extracts structured fields (course title, room code, teacher name, and timestamps).
- **Mobile-First Schedule Views**: Clean Day and Week layouts with a real-time "now" indicator so students can find their next class in seconds.
- **Course Filtering & Customization**: Filter visible modules, customize course block colors, and add personal class notes.
- **Accessibility Focus**: High-contrast card typography (WCAG compliant) paired with a toggleable color-blind mode.

## Tech Stack

- **Front-End**: Ionic, TypeScript / JavaScript, HTML/CSS
- **Data Processing**: Automated extraction, string parsing, and JSON structuring
- **Deployment**: Vercel

## How It Works (ETL Pipeline)

1. **Extract**: Ingests raw calendar exports from the university's existing scheduling system.
2. **Transform**: Parses raw text blocks to separate subject names, room numbers, instructors, and start/end times into clean objects.
3. **Load**: Feeds the normalized dataset into the Ionic front-end for instant rendering and client-side filtering.
