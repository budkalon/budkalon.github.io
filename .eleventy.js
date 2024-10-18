module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("./src/assets/");
    eleventyConfig.addWatchTarget("./src/assets/");

    eleventyConfig.addShortcode("tahunIni", () => `${new Date().getFullYear()}`);

    return {
        dir: {
            input: "src",
            output: "public",
        },
    };
};