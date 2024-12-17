const Article = require("../models/Article");

module.exports = {
  homePage: async (req, res) => {
    try {
      const featuredArticles = await Article.findAll({ limit: 4, order: [["views", "DESC"]] });
      res.render("guest/home", { featuredArticles });
    } catch (error) {
      console.error(error);
      res.send("Error loading homepage");
    }
  },

  articleDetail: async (req, res) => {
    const articleId = req.params.id;
    try {
      const article = await Article.findByPk(articleId);
      res.render("guest/article_detail", { article });
    } catch (error) {
      console.error(error);
      res.send("Error loading article");
    }
  },

  articlesByCategory: async (req, res) => {
    const categoryId = req.params.id;
    try {
      const articles = await Article.findAll({ where: { categoryId } });
      res.render("guest/category_list", { articles });
    } catch (error) {
      console.error(error);
      res.send("Error loading articles");
    }
  },

  searchArticles: async (req, res) => {
    const { keyword } = req.query;
    try {
      const articles = await Article.findAll({
        where: { title: { [Op.like]: `%${keyword}%` } },
      });
      res.render("guest/search_results", { articles });
    } catch (error) {
      console.error(error);
      res.send("Error performing search");
    }
  },
};
