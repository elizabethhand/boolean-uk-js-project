/*
RENDERING FEED
1. ✔ Get the feed articles
2. ✔ Put feed articles into state
3. ✔ Create feed article
4. ✔ Create feed articles
5. ✔ Render feed articles to page
*/
/*
FILTERING
Search:
1. Have an event listener on theb submit of the search input
2. Filter the publishesd articles with the search string and add to state 
3. Render the filtered articles to the page
*/
function createEl(tag) {
    return document.createElement(tag)
}
let filterFeedSection = document.querySelector(".filterFeed")
let mainContentSection = document.querySelector(".mainContent")
let searchInputEl = document.querySelector(".searchbar")

function listenForSearchBar() {
    searchInputEl.addEventListener("submit",function(e) {
        e.preventDefault()

        state.filters.search = searchInputEl.value
        renderArticles()
    })
}
listenForSearchBar()


let state = {
    toBePushlished: [],
    published: [],
    filters: {
        search: "",
        pillars: []
    }
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

    let articlesToBeFiltered = state.published
    
    if(state.filters.search === "") {
        for (article of articlesToBeFiltered) {
            articleHTML = renderFeedArticle(article)
            feedContainerEl.append(articleHTML)
        }
    }
    if(state.filters.search !==  "") {
        let filteredArticles = articlesToBeFiltered.filter(function(article) {
            return article.title.includes(state.filters.search) || article.content.includes(state.filters.search)
        })
    }
        

    mainContentSection.append(feedContainerEl)
}
