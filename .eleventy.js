const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("./src/assets/");
    eleventyConfig.addWatchTarget("./src/assets/");

    eleventyConfig.addShortcode("tahunIni", () => `${new Date().getFullYear()}`);

    eleventyConfig.addFilter("postDate", (dateObj) => {
        return DateTime.fromJSDate(dateObj).
        toLocaleString(DateTime.DATE_MED);
    })

    eleventyConfig.addFilter("getByURL", function(url, posts) {
        return posts.reduce((prev, p) => {
            if(p.data.page.url === url) return p;
            else return prev;
        });
    });

    eleventyConfig.addFilter("getRelated", function(relatedPosts, posts) {
        return relatedPosts.map(p => eleventyConfig.getFilter('getByURL')(p, posts));
    });

    return {
        dir: {
            input: "src",
            output: "public",
        },
    };
};