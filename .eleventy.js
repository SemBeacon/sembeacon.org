const seo = require("eleventy-plugin-seo");
const sitemap = require("@quasibit/eleventy-plugin-sitemap");
const markdownIt = require("markdown-it");
const markdownItShiki = require("markdown-it-shiki").default;
const markdownItAnchor = require("markdown-it-anchor");
const markdownItAttrs = require("markdown-it-attrs");
const sass = require("eleventy-sass");
const favicon = require("eleventy-favicon");

const baseUrl = "https://sembeacon.github.io/sembeacon.org"; //"https://sembeacon.org";
module.exports = function(config) {
  config.addPassthroughCopy({
    "./src/site/example.ttl": "example.ttl",
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
    try {
      return new URL(url, baseUrl).href;
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
    theme: "nord"
  });

  config.addPlugin(sass, [
    {
      compileOptions: {
        permalink: function(permalinkString, inputPath) {
          return (data) => {
            return data.page.filePathStem.replace(/^\/_scss\//, "/css/") + ".css";
          };
        }
      },
      sass: {
        style: "expanded",
        sourceMap: true
      }
    }, {
      rev: true,
      when: { ELEVENTY_ENV: "stage" }
    }, {
      sass: {
        style: "compressed",
        sourceMap: false
      },
      rev: true,
      when: [ { ELEVENTY_ENV: "production" }, { ELEVENTY_ENV: false } ]
    }
  ]);

  // pass some assets right through
  config.addPassthroughCopy("./src/site/images");

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
    markdownTemplateEngine : "njk",
    passthroughFileCopy: true
  };

};
