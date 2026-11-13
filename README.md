# MND CODE — Interview & Soft Skills Coaching website

A lightweight, dependency-free website built with HTML5, CSS3, vanilla JavaScript and inline SVG.

```
mnd-code-coaching/
├── index.html          All page sections + SVG icon sprite + hero illustration
├── css/styles.css      Design tokens, layout, components, animations
├── js/main.js          Mobile nav, scroll reveal, subject filter, FAQ, enquiry form
├── assets/logo/favicon.svg
├── assets/icons/       (empty – icons live in the inline sprite in index.html)
└── assets/images/      (add social-preview.png here, 1200×630)
```

To preview: open `index.html` in a browser. To publish: upload the whole folder to any static host
(Netlify, Vercel, GitHub Pages, cPanel hosting, etc.).

## Before launch — things you must do

1. **Connect the enquiry form.** Open `js/main.js` and set `CONFIG.FORM_ENDPOINT` to a real form
   service URL (for example a Formspree or Getform endpoint). Until this is set, the form checks
   the fields but tells the visitor honestly that the enquiry was **not** sent. After connecting,
   send a test enquiry and confirm it arrives.
2. **Set the domain.** In `index.html`, uncomment the `canonical`, `og:url` and `og:image` lines and
   replace `your-domain.com`. Add `assets/images/social-preview.png`.
3. **Confirm the free intro call.** The header button says "Book a Free Intro Call" (as in the brief).
   It only scrolls to the enquiry form. If a free call is not actually offered, change the text
   (e.g. "Enquire Now").
4. **Check the privacy note** under the form matches how enquiries are really stored and used.
5. **Confirm coach details:** the "MBA in Human Resources" wording and the "Global Interview & Soft
   Skills Coach" title.

## Deliberately left out (add only once verified)

Coach name and photo, years of experience, student counts, success rates, testimonials, ratings,
client logos, certificates, prices, schedules, email, phone/WhatsApp and office address.
When a verified phone number is available, a click-to-call / WhatsApp button can be added
to the contact section.

The physiognomy topic from the original guide is omitted on purpose, as recommended in the brief.

## Editing tips

- **Colours / fonts:** change the variables at the top of `css/styles.css`.
- **Subjects:** each subject is one `<li class="subject" data-category="...">` in `index.html`.
  The category must be one of: Career, Personal Growth, Workplace Skills, Special Topics.
- **FAQs:** copy an existing `.faq-item` block and give it new `faq-N` ids.
- **Program "Enquire" links** pre-select the form's "Interested in" field via `data-interest`.

## Accessibility & performance notes

- Semantic landmarks, skip link, visible focus ring, keyboard-friendly menu (Esc closes it).
- FAQ uses buttons with `aria-expanded`; learning modules use native `<details>`.
- Form errors are announced and linked to their fields with `aria-describedby`.
- Animations use only `transform` / `opacity` and switch off with `prefers-reduced-motion`.
- Only external request: Google Fonts (Sora + Inter). Remove the font `<link>` to go fully offline;
  system fonts are used as fallback.
