import seo from "eleventy-plugin-seo";
import sitemap from "@quasibit/eleventy-plugin-sitemap";

import markdownIt from "markdown-it";
import markdownItShiki from "markdown-it-shiki";
import markdownItAnchor from "markdown-it-anchor";
import markdownItAttrs from "markdown-it-attrs";

import sass from "eleventy-sass";
import favicon from "eleventy-favicon";
import toc from "eleventy-plugin-toc";
import { decktape } from "./src/utils/decktape.js";
import { qr } from "./src/utils/qr.js";
import nunjucks from "nunjucks";
import markdown from 'nunjucks-markdown';
import { DateTime } from 'luxon';
import _ from "lodash";
import fs from 'fs';
import squash from "./src/utils/filters/squash.js";
import dateDisplay from "./src/utils/filters/date.js";

const baseUrl = new URL("https://sembeacon.org");

export default function(config) {
  config.addPassthroughCopy({
    "./src/site/example.ttl": "example.ttl",
    "./src/site/examples": "examples",
    "./src/site/assetlinks.json": "assetlinks.json",
  });
  config.addPassthroughCopy({
    "node_modules/reveal.js/dist/reveal.css": "vendor/reveal.js/reveal.css",
    "node_modules/reveal.js/dist/reset.css": "vendor/reveal.js/reset.css",
    "node_modules/reveal.js/dist/reveal.esm.js": "vendor/reveal.js/reveal.esm.js",
    "node_modules/reveal.js/plugin/notes/notes.esm.js": "vendor/reveal.js/plugin/notes/notes.esm.js",
    "node_modules/reveal.js-pointer/dist/pointer.esm.js": "vendor/reveal.js/plugin/pointer/pointer.esm.js",
    "node_modules/reveal.js-pointer/dist/pointer.css": "vendor/reveal.js/plugin/pointer/pointer.css",
  });
  config.addPassthroughCopy({ "./src/site/CNAME": "CNAME" });
  config.addPassthroughCopy("fonts");
  config.addPlugin(toc, {
    tags: ['h2'],
    ul: true
  });

  let env = process.env.ELEVENTY_ENV;

  config.addLayoutAlias('default', 'layouts/base.njk');

  config.addFilter("squash", squash);
  config.addFilter("dateDisplay", dateDisplay);

  const seoData = JSON.parse(fs.readFileSync("./src/site/_data/seo.json", "utf-8"));
  config.addPlugin(seo, seoData);
  config.addPlugin(sitemap, {
    sitemap: {
      hostname: baseUrl,
    },
  });
  config.addPlugin(favicon, {
    destination: "dist"
  });
  config.addFilter("absoluteUrl", function (url="") {
    if (env === "dev") {
      return url;
    }
    try {
      return new URL(String(baseUrl.pathname + url).replace("//", "/"), baseUrl).href;
    } catch (err) {
      console.error(err);
      return url;
    }
  });

  const md = markdownIt({ html: true });
  md.use(markdownItAnchor);
  md.use(markdownItAttrs, {
    leftDelimiter: '{',
    rightDelimiter: '}',
    allowedAttributes: []
  });
  md.use(markdownItShiki, { 
    theme: "dark-plus"
  });
  config.setLibrary("md", md);

  config.addPlugin(decktape);
  config.addPlugin(qr);

  config.addPlugin(sass, [
    {
      rev: false,
      compileOptions: {
        permalink: function(permalinkString, inputPath) {
          return (data) => {
            return data.page.filePathStem.replace(/^\/_scss\//, "/css/") + ".css";
          };
        },
      },
      sass: {
        style: "expanded",
        sourceMap: true
      }
    }, {
      sass: {
        style: "compressed",
        sourceMap: false
      },
      rev: false,
      when: [ { ELEVENTY_ENV: "production" }, { ELEVENTY_ENV: false } ]
    }
  ]);

  config.addCollection("sorted_docs", (collection) => {
    const items = collection.getFilteredByTag("docs");
    items.sort((a, b) => a.data.menuOrder - b.data.menuOrder);
    return items;
  });
  config.addCollection("posts_year", (collection) => {
    return _.chain(collection.getFilteredByTag("posts").sort((a, b) => a.date - b.date))
      .groupBy((post) => post.date.getFullYear())
      .toPairs()
      .reverse()
      .value();
  });

  config.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("cccc, dd LLL yyyy");
  });

  config.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  let njkEnv = new nunjucks.Environment(
    new nunjucks.FileSystemLoader("src/site/_includes")
  );
  markdown.register(njkEnv, (src, _) => {
    return md.render(src);
  });
  config.setLibrary("njk", njkEnv);

  config.addFilter("head", (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }
    return array.slice(0, n);
  });

  config.addFilter("min", (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  return {
    dir: {
      input: "src/site",
      output: "dist",
      data: `_data`
    },
    templateFormats : [
      "njk",
      "jpg",
      "md",
      "html",
      "svg",
      "png",
      "pdf",
      'gif',
      'js',
      'jsonld',
      'mp4'
    ],
    htmlTemplateEngine : "njk",
    markdownTemplateEngine : "liquid",
    passthroughFileCopy: true
  };
};
