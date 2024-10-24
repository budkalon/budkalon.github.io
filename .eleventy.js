const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("./src/assets/");
    eleventyConfig.addWatchTarget("./src/assets/");

    eleventyConfig.addShortcode("tahunIni", () => `${new Date().getFullYear()}`);

    eleventyConfig.addFilter("postDate", dateObj => {
        return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED)
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

    // KATEGORI BLOG
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

    // GENRE KOMIK
    eleventyConfig.addCollection("comgenre", function(collectionApi) {
        let genres = new Set();  // Use a Set to store unique genres
        let comics = collectionApi.getFilteredByTag('comic');  // Get all items tagged with 'comic'
        
        comics.forEach(comic => {
            let genresList = comic.data.genre;  // Assume 'genre' is an array in front matter of 'comic'
            
            if (Array.isArray(genresList)) {
                genresList.forEach(genre => genres.add(genre));  // Add each genre to the Set
            }
        });
        
        return Array.from(genres);  // Convert the Set to an Array and return it
    });

	eleventyConfig.addFilter("filterByGenre", function(comics, genre) {
        genre = genre.toLowerCase();  // Ensure case-insensitive matching
        let result = comics.filter(comic => {
            let comicGenres = comic.data.genre.map(g => g.toLowerCase());  // Make all genres lowercase
            return comicGenres.includes(genre);  // Check if the comic has the specified genre
        });
    
        return result;  // Return the filtered comics list
    });

    return {
        dir: {
            input: "_src",
            output: "docs",
            data: "_data",
            include: "_includes"
        },
    };
};