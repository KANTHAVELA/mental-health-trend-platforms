# Wireframes And Theme

## User Journey

1. User lands on login or signup
2. Patient enters dashboard and records mood activity
3. Psychologist enters dashboard and reviews patient trends
4. User opens reports, personal vault, emergency tools, and settings

## Low-Fidelity Wireframes

### Login

```text
+------------------------------------------------------+
|                    MindFlow Login                    |
|------------------------------------------------------|
|  [ Patient ] [ Doctor ]                              |
|                                                      |
|  Email Address                                       |
|  [_______________________________]                   |
|                                                      |
|  Password                                            |
|  [_______________________________]                   |
|                                                      |
|  [           Sign In Button          ]               |
|                                                      |
|  Demo account note / signup link                     |
+------------------------------------------------------+
```

### Patient Dashboard

```text
+---------Sidebar---------+----------------------------+
| Dashboard               | Welcome / Quick Actions    |
| Reports                 | [Stress Games] [Vault]     |
| Patients                |----------------------------|
| Personal Vault          | Insight Cards              |
| Emergency               | [Mood] [Variance] [Trend]  |
| Games                   |----------------------------|
| Settings                | Charts / Recent Insights   |
+-------------------------+----------------------------+
```

### Psychologist Dashboard

```text
+---------Sidebar---------+----------------------------+
| Dashboard               | Doctor summary             |
| Reports                 | Insight cards              |
| Patients                |----------------------------|
| Emergency               | Trend chart                |
| Settings                | Mood pie / keyword cloud   |
+-------------------------+----------------------------+
```

### Personal Vault

```text
+------------------------------------------------------+
| Personal Space                    [New Private Note] |
|------------------------------------------------------|
| + Add Note Form                                      |
|   Title / Content / Category / Save                  |
|------------------------------------------------------|
| Note Card 1    | Note Card 2    | Note Card 3        |
| Category/date  | Category/date  | Category/date      |
| Preview text   | Preview text   | Preview text       |
+------------------------------------------------------+
```

## Theme Direction

- Primary palette: `#4F46E5`, `#10B981`, `#0F172A`, `#F8FAFC`
- Accent palette: `#A855F7`, `#F59E0B`, `#EF4444`
- Visual style: calm clinical gradients, rounded cards, soft shadows, high contrast action buttons
- Typography approach: bold dashboard headings with clean sans-serif body text
- Motion: subtle fades, slide-ins, loading skeletons, and toast feedback

## Responsive Notes

- Sidebar-based desktop layout
- Card stacking for tablet and mobile widths
- Large touch targets on actions like login, SOS, and note creation
