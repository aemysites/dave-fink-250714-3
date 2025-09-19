# Multi-Option Selector - Editor Guide

This guide shows content editors how to add option selectors to download buttons in Cards (cards17) blocks using Word documents.

## How It Works

The selector **automatically appears** when you add multiple download links to a card. If there's only one download link, you get a regular download button.

**Use cases:** Languages, file formats, versions, regions, or any other options you need.

## Quick Start

### Single Option (No Selector)

For one option, use a regular download link:

```
Cards (cards17)

| [Image] | Patient Brochure
|         | Download our comprehensive guide.
|         | [DOWNLOAD](/documents/guide.pdf)
```

**Result:** Regular download button (no selector)

### Multiple Options (Shows Selector)

For multiple options, add multiple download links:

```
Cards (cards17)

| [Image] | Considering IBRANCE?
|         | Print out this guide to start a conversation with your doctor.
|         | [English](/documents/considering-en.pdf)
|         | [Te Reo Maori](/documents/considering-mi.pdf)
|         | [Mandarin](/documents/considering-zh.pdf)
|         | [Samoan](/documents/considering-sm.pdf)
```

**Result:** Option selector dropdown + download button

## Word Document Example

```
Cards (cards17)

| [Image: /icons/brochure1.png] | Patient Brochure
|                               | Want a comprehensive overview? Download this brochure.
|                               | [DOWNLOAD](/documents/patient-brochure.pdf)

| [Image: /icons/guide1.png]    | Doctor Discussion Guide
|                               | Print out this guide to start a conversation with your doctor.
|                               | [English](/documents/guide-en.pdf)
|                               | [Te Reo Maori](/documents/guide-mi.pdf)
|                               | [Mandarin](/documents/guide-zh.pdf)
|                               | [Samoan](/documents/guide-sm.pdf)
```

## Link Text Examples

The selector uses whatever text you put in the links. Here are some examples:

### Languages

```
[English](/documents/guide-en.pdf)
[Te Reo Maori](/documents/guide-mi.pdf)
[Mandarin](/documents/guide-zh.pdf)
```

### File Formats

```
[PDF Version](/documents/guide.pdf)
[Word Document](/documents/guide.docx)
[PowerPoint](/documents/guide.pptx)
```

### Versions

```
[Version 1.0](/documents/guide-v1.pdf)
[Version 2.0](/documents/guide-v2.pdf)
[Latest Version](/documents/guide-latest.pdf)
```

## What Happens Automatically

When you add multiple download links, the system:

1. **Detects** multiple download links in a card
2. **Creates** an option selector dropdown
3. **Converts** first link to "DOWNLOAD" button
4. **Removes** other links from display
5. **Updates** download URL when selection changes

The selector appears **only** when 2 or more links are detected.

## File Organization

Organize your files with clear naming:

```
/documents/
├── patient-brochure.pdf        (single language)
├── guide-en.pdf               (English)
├── guide-mi.pdf               (Te Reo Maori)
├── guide-zh.pdf               (Mandarin)
└── guide-sm.pdf               (Samoan)
```

## Best Practices

### ✅ Do This

- Use clear option names: "English", "PDF Version", "Version 1.0"
- Use consistent file naming: `guide-en.pdf`, `guide-v1.pdf`
- Use absolute paths: `/documents/guide.pdf`
- Keep same structure across all cards

### ❌ Avoid This

- Unclear abbreviations: "en", "v1", "fmt1"
- Inconsistent naming: `guide_english.pdf`, `guide-v2.docx`
- Relative paths: `../files/guide.pdf`

## Troubleshooting

### Selector not appearing?

- Check you have multiple download links (not just one)
- Ensure your block starts with `Cards (cards17)`
- Verify all download URLs are working

### Wrong option selected?

- Use clear option names in link text
- Check all file paths are correct
- Test download URLs work

## Requirements

- Use **Word documents** (.docx files)
- Block must be named `Cards (cards17)`
- Multiple download links must be in the same card content cell

---

**That's it!** The selector will automatically appear when you have multiple download links in a card.
