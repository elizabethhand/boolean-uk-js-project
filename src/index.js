/*
1. ✔ Get the feed articles
2. ✔ Put feed articles into state
3. ✔ Create feed article
4. ✔ Create feed articles
5. ✔ Render feed articles to page
6. Move to filtering
*/
function createEl(tag) {
    return document.createElement(tag)
}
let filterFeedSection = document.querySelector(".filterFeed")
let mainContentSection = document.querySelector(".mainContent")


let state = {
    toBePushlished: [],
    published: []
}
function setState(keyToUpdate) {
    state = {...state, keyToUpdate}
}
function getFeedArticlesFromServer () {
    return fetch(`http://localhost:3000/published`)
            .then(function(response) {
            return response.json()
            })
            .then(function(data) {
            state.published = data
            return data
            })
}
getFeedArticlesFromServer()
    .then(function() {
        renderArticles()
    })

function renderFeedArticle(article) {
    const articleEl = createEl("article")
    articleEl.setAttribute("class", "article")

    const articleContentContainerEl = createEl("div")
    articleContentContainerEl.setAttribute("class", "articleContent")

    const articleTitleEl = createEl("h2")
    articleTitleEl.innerText = article.title

    const articleInfoEl = createEl("h3")
    articleInfoEl.innerText = `Author: ${article.author}, Date: ${article.date}, Time: ${article.time}` 

    let fullContent = ""
    for (paragraph of article.content) {
        fullContent = fullContent + paragraph + "\n\n"
    }
    
    const articleContentEl = createEl("p")
    articleContentEl.innerText = fullContent

    const articleURLContainerEl = createEl("div")
    articleURLContainerEl.setAttribute("class", "articleURL")

    const URLLinkEL = createEl("a")
    URLLinkEL.setAttribute("href", article["article_URL"])
    URLLinkEL.innerText = "Navigate To Article Page"
    const linebreakEl = createEl("hr")

    articleContentContainerEl.append(articleTitleEl, articleInfoEl, articleContentEl)
    articleURLContainerEl.append(URLLinkEL)
    articleEl.append(articleContentContainerEl, articleURLContainerEl, linebreakEl)
    return articleEl
    
}

function renderArticles() {
    const feedContainerEl = createEl("div")
    feedContainerEl.setAttribute("class", "feedContainer")
    
    for (article of state.published) {
        articleHTML = renderFeedArticle(article)
        feedContainerEl.append(articleHTML)
    }

    mainContentSection.append(feedContainerEl)
}
