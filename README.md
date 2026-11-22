# MonAgenda — University Schedule Redesign & Data Pipeline

## Description

MonAgenda is a modern, responsive schedule application built to replace IMT Atlantique's legacy desktop-focused timetable[cite: 4, 5]. It features an automated data pipeline that extracts raw schedule exports from the university system, parses and cleans noisy text fields into structured JSON, and feeds a fast, mobile-first Ionic interface[cite: 4, 9, 28].

Designed for students checking their classes on the go, the app highlights the upcoming session immediately upon opening while offering day/week views, course filtering, custom color-coding, and a dedicated color-blind accessibility mode[cite: 4, 9, 10].

## Key Features

- **Automated Data Extraction & Parsing**: Fetches raw schedule data from the legacy portal and extracts structured fields (course title, room code, teacher name, and timestamps)[cite: 4, 28].
- **Mobile-First Schedule Views**: Clean Day and Week layouts with a real-time "now" indicator so students can find their next class in seconds[cite: 4, 9, 13].
- **Course Filtering & Customization**: Filter visible modules, customize course block colors, and add personal class notes[cite: 10, 11, 13].
- **Accessibility Focus**: High-contrast card typography (WCAG compliant) paired with a toggleable color-blind mode[cite: 10, 12].

## Tech Stack

- **Front-End**: Ionic, TypeScript / JavaScript, HTML/CSS[cite: 4, 9]
- **Data Processing**: Automated extraction, string parsing, and JSON structuring[cite: 28]
- **Deployment**: Vercel[cite: 4]

## How It Works (ETL Pipeline)

1. **Extract**: Ingests raw calendar exports from the university's existing scheduling system[cite: 4, 28].
2. **Transform**: Parses raw text blocks to separate subject names, room numbers, instructors, and start/end times into clean objects[cite: 4, 28].
3. **Load**: Feeds the normalized dataset into the Ionic front-end for instant rendering and client-side filtering[cite: 4, 9, 28].
