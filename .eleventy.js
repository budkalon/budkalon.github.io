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

    eleventyConfig.addCollection("categories", function(collectionApi) {
		let categories = new Set();
		let posts = collectionApi.getFilteredByTag('post');
		posts.forEach(p => {
			let cats = p.data.categories;
			cats.forEach(c => categories.add(c));
		});
		return Array.from(categories);
	});

	eleventyConfig.addFilter("filterByCategory", function(posts, cat) {
		cat = cat.toLowerCase();
		let result = posts.filter(p => {
			let cats = p.data.categories.map(s => s.toLowerCase());
			return cats.includes(cat);
		});

		return result;
	});

    return {
        dir: {
            input: "src",
            output: "docs",
        },
    };
};