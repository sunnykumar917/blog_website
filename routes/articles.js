const express = require('express');
const Article = require('./../models/article');
const router = express.Router();

// Display form to create a new article
router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() });
});

// Display form to edit an existing article
router.get('/edit/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.redirect('/');
        }
        res.render('articles/edit', { article: article });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

// Display a specific article
router.get('/:slug', async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug });
        if (!article) {
            return res.redirect('/');
        }
        res.render('articles/show', { article: article });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

// Delete an article
router.delete('/:id', async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

// Middleware to handle saving articles (common logic for both creating and editing)
function saveArticle(path) {
    return async (req, res) => {
        let article = req.article;
        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;

        try {
            article = await article.save();
            res.redirect(`/articles/${article.slug}`);
        } catch (e) {
            res.render(`articles/${path}`, { article: article });
        }
    };
}

// Update an existing article
router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
}, saveArticle('edit'));

// Create a new article
router.post('/', async (req, res, next) => {
    req.article = new Article();
    next();
}, saveArticle('new'));

// Export the router to be used in other files
module.exports = router;
