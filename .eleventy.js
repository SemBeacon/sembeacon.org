const seo = require("eleventy-plugin-seo");
const sitemap = require("@quasibit/eleventy-plugin-sitemap");
const markdownIt = require("markdown-it");
const markdownItShiki = require("markdown-it-shiki").default;
const markdownItAnchor = require("markdown-it-anchor");
const markdownItAttrs = require("markdown-it-attrs");
const sass = require("eleventy-sass");
const favicon = require("eleventy-favicon");
const toc = require("eleventy-plugin-toc");
const { decktape } = require("./src/utils/decktape");
const nunjucks = require("nunjucks");
const markdown = require('nunjucks-markdown');

const baseUrl = new URL("https://sembeacon.org");

module.exports = function(config) {
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
  config.addPlugin(toc, {
    tags: ['h2'],
    ul: true
  });


  // A useful way to reference the context we are runing eleventy in
  let env = process.env.ELEVENTY_ENV;

  // Layout aliases can make templates more portable
  config.addLayoutAlias('default', 'layouts/base.njk');

  // Add some utility filters
  config.addFilter("squash", require("./src/utils/filters/squash.js") );
  config.addFilter("dateDisplay", require("./src/utils/filters/date.js") );

  // SEO
  config.addPlugin(seo, require("./src/site/_data/seo.json"));
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

  // minify the html output
  config.addTransform("htmlmin", require("./src/utils/minify-html.js"));

  // compress and combine js files
  config.addFilter("jsmin", function(code) {
    const UglifyJS = require("uglify-js");
    let minified = UglifyJS.minify(code);
      if( minified.error ) {
          console.log("UglifyJS error: ", minified.error);
          return code;
      }
      return minified.code;
  });

  // Markdown
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

  config.on('eleventy.before', async () => {
    const scssExtension = Array.from(config.extensionMap.values())[1];
    config.extensionMap.delete(scssExtension);
    config.addExtension("scss", {
      ...scssExtension,
      compile: async function(inputContent, inputPath) {
        inputContent = inputContent.replace(/{{ baseUrl }}/g, baseUrl.href.substring(0, baseUrl.href.length - 1));
        return await scssExtension.compile.bind(this)(inputContent, inputPath);
      },
    });
  });

  // pass some assets right through
  config.addPassthroughCopy("./src/site/images");

  // Collections
  config.addCollection("sorted_docs", (collection) => {
    const items = collection.getFilteredByTag("docs");
    items.sort((a, b) => a.data.menuOrder - b.data.menuOrder);
    return items;
  });

  /* Nunjucks */
  let njkEnv = new nunjucks.Environment(
    new nunjucks.FileSystemLoader("src/site/_includes")
  );
  markdown.register(njkEnv, (src, _) => {
    return md.render(src);
  });
  config.setLibrary("njk", njkEnv);

    
  // make the seed target act like prod
  env = (env=="seed") ? "prod" : env;
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
      'js'
    ],
    htmlTemplateEngine : "njk",
    markdownTemplateEngine : "liquid",
    passthroughFileCopy: true
  };

};
