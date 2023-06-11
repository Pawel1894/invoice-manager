# [Invoice Manager](https://invoices-manager-nine.vercel.app/)

App for managing invoices that has a PWA and was made with the use of T3 stack. I used the Frontend Mentor design and enriched it with additional features.

I'm using a free SendGrid license, so if logging via email or sending a pdf isn’t working, it’s probably due to the SendGrid’s limit which resets every 24 hrs. Sorry for the inconvenience.

## Table of contents

- [Overview](#overview)
  - [Website](#website)
  - [What it contains](#what-it-contains)
- [Built with](#built-with)
- [Install process](#install-process)
- [Build process](#build-process)

## Overview

### Website

[App live demo](https://invoices-manager-nine.vercel.app/)

### What it contains

- Auth with Google and Magick email link
- Dark mode
- CRUD for invoices
- PWA
- Invoice PDF generation
- Invoices sending via email
- E2E tests with Cypress

## Built with

- [TailwindCSS](https://tailwindcss.com/)
- [tRPC](https://trpc.io/)
- [Prisma](https://www.prisma.io/)
- [Next Auth](https://next-auth.js.org/)
- [Next](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [PlanetScale](https://planetscale.com/)
- [TanStack Query](https://react-query-v3.tanstack.com/)
- [Send Grid](https://sendgrid.com/)
- [Formik](https://formik.org/)
- [Zod](https://zod.dev/)
- [Yup](https://www.npmjs.com/package/yup)
- [Headless UI](https://headlessui.com/)
- [Next PWA](https://www.npmjs.com/package/next-pwa)
- [PDFKit](https://pdfkit.org/)
- [Cypress](https://docs.cypress.io)

## Install process

1. Install [Node.js](https://nodejs.org/en/download/)
2. Navigate to project folder in command line
3. Run `npm install`
4. Set all required env variables
5. Run `npm start`

## Build process

1. Open project folder in command line
2. Set all required env variables
3. Run `npm run build`
