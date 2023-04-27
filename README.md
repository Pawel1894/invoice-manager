# [Invoice Manager](https://invoices-manager-nine.vercel.app/)

App for managing invoices with PWA made using T3 stack [deigned by Frontend Mentor](https://www.frontendmentor.io/challenges/invoice-app-i7KaLTQjl) with some additions. I'm using free sendgrid license. If login via email or sending pdf is not working it is probably due to sendgrid limit exceed which resets every 24hrs, sorry for inconvenience.

## Table of contents

- [Overview](#overview)
  - [Website](#website)
  - [What it contains](#What-it-contains)
- [Built with](#built-with)
- [Install process](#install-process)
- [Build process](#build-process)

## Overview

### Website

[App live demo](https://invoices-manager-nine.vercel.app/)

### What it contains

- Auth with google and magick email link
- Dark mode
- CRUD for invoices
- PWA
- Generate invoice PDF
- Send invoice to email address
- e2e tests with cypress

## Built with

- [TailwindCSS](https://tailwindcss.com/)
- [tRPC](https://trpc.io/)
- [Prisma](https://www.prisma.io/)
- [Next-auth](https://next-auth.js.org/)
- [Next](https://nextjs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [Planetscale](https://planetscale.com/)
- [React-query](https://react-query-v3.tanstack.com/)
- [Send Grid](https://sendgrid.com/)
- [Formik](https://formik.org/)
- [Zod](https://zod.dev/)
- [Yup](https://www.npmjs.com/package/yup)
- [Headless UI](https://headlessui.com/)
- [Next PWA](https://www.npmjs.com/package/next-pwa)
- [PDF kit](https://pdfkit.org/)
- [Cypress](https://docs.cypress.io)

## Install process

1. Install [nodejs](https://nodejs.org/en/download/)
2. Navigate project folder in command line
3. Run `npm install`
4. Set all required env variables
5. Run `npm start`

## Build process

1. Open project folder in command line
2. Set all required env variables
3. Run `npm run build`
