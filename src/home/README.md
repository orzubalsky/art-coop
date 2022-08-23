[![Netlify Status](https://api.netlify.com/api/v1/badges/2fccd816-a7e2-44b1-a3fb-5e0eda9c8498/deploy-status)](https://app.netlify.com/sites/art-coop/deploys)

# art.coop

This is the code for art.coop.

## Architecture and tools

art.coop is a static site built with [Eleventy](https://11ty.dev/), a JavaScript-based static site generator. Eleventy compiles template code written in [EJS](https://ejs.co/), content written in [Markdown](https://spec.commonmark.org/current/), and styles written in [LESS](https://lesscss.org/), into pure HTML and CSS. Being a static site, there is no backend, database, or (much) frontend rendering. At art.coop/admin, [Netlify CMS](https://www.netlifycms.org/) provides a GUI to edit content. This is really just a fancy interface that commits changes to Markdown files to Git, as there is no database like in popular CMSes such as WordPress.
The site is deployed to Netlify, a static site host, and served via their CDNs.

## Development environment

### Prerequisites

This site was built with npm 6 and node 14.

### Installing dependencies

```
npm install
```

### Running locally

```
npm run serve
```

And open the URL shown. For historical reasons (different pages were used as the landing page at different times), there is no page at `/` so expect a 404.
The two main pages are at `/report` and `/study`.
In production there is a redirect from `/` to `/report`, which is configured in the file `_redirects`.

### Deployment

Netlify manages automatic deployment of changes to `master`, and creates preview branch deploys automatically.

### Code Style

Git hooks will be automatically installed by `husky` to lint files upon saving. Unfortunately it's not great at `.ejs` files, so try to keep those tidy yourself.

## Overview

### Sectional layout

The two pages `/report` and `/study` use a sectional layout. That is, they are rendered by concatenating together items in Eleventy collections in one page (implemented in `/_includes/sectionalLayout.ejs`). The collections items are the `/home` directory for the page at `/report` and the `/study` directory for the page at `/study`. They are rendered in the order of the `position` attribute of each item. The navigation is generated from these items, exempting those with `hideInNavigation: true`.

Markdown files are editable in the CMS, ejs files are not but allow writing custom HTML for when a custom layout is needed. Alternating sections is one way to intersperse editable and non-editable content.

### Styles

LESS files are in `/styles`. `/styles/styles.less` is the entrypoint and must import all other files.

`/styles/variables` contains declarations of reusable colors, fonts, etc. Please try to always reuse a varible rather than using literal colors anywhere else.

`/styles/partials` has larger blocks of reusable styles.

Most other files map 1:1 with an item of content. They should be wrapped in a scoping block that ensures they only affect the element they intend to style, and shouldn't be reused.

### Assets

`/assets/downloads` has PDFs for download.

`/assets/uploads` is has files uploaded into the CMS's media manager.

`/assets/images` - static images not managable by the CMS

`/assets/scripts` - a small amount of JavaScript
There are a few small interactive elements, for which we need client-side JS.
There is no transpiler or polyfills, so party like it's 2012 🕺🏻 ! Check [CanIUse](https://caniuse.com/) for what JS features have cross-browser support and please be careful! We do not have a browser matrix but try to write compatible code. We are not supporting Internet Explorer, so ES6 should be okay.

### Admin

Netlify CMS is loaded from a CDN in `/admin/index.html`.
The configuration in in `/admin/config.yml`. This file specifies what files are editable in the UI.
For sections, we use "folder collections", meaning each item is a file in a folder.
For other data that doesn't have a clear "content body", we use "file collections" which mean all the collection items are in a JSON file in `/_data`.
See the Netlify CMS documentation for details.

### `/_data`

The data folder is a convenience way to store arbitrary data for use in templates.
There are a couple things in here: actual data and utility functions.
Data files like `interventions.json` are editable in the CMS and used in templates.

The second, hacky use of `_data` is to make JavaScript functions available to templates.
This includes `_.js` which exports lodash, and `markdown.js` which provides a function to render markdown (Eleventy automatically renders Markdown when it's the body of a Markdown file, but not if it's just a string in a JSON blob in \_data).

### Misc.

### Markdown containers

If we need some custom layout but also need a section to be editable, it's possible to define custom markdown blocks that turn into CSS classes. These are defined in the markdown-it configuration in `.eleventy.js` and the styles are in `markdown-containers.less`.

### PDF download interstitial popup

A client-side js script implements our interstitials that pop up when clicking a PDF download link. It registers itself on all links with the attribute `data-use-interstitial`.

### Forms

We use [Netlify Forms](https://www.netlify.com/products/forms/) to collect data. Netlify reads html attributes and wires up the form automatically. Data goes to Netlify and is then processed by Zapier to insert a row in a Google Sheet.
