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
let searchFormEl = document.querySelector(".searchbarForm")

let state = {
    toBePushlished: [],
    published: [],
    filters: {
        search: "",
        pillars: [],
        checkedPillars: []
    }
}
function setState(keyToUpdate) {
    state = {...state, keyToUpdate}
}
function listenForSearchBar() {
    searchFormEl.addEventListener("submit", function(e) {
        e.preventDefault()

        console.log(e)

        let form = e.target 
        state.filters.search = form.search.value
        renderArticles()

        console.log(state.filters.search)
    })
}
listenForSearchBar()

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
        
        addPillarsToState()
        renderPillarCheckboxes()
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
    for (const paragraph of article.content) {
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
function addPillarsToState() {
    let pillarsArray = state.published.map(function(article) {
        return article.pillars
    })
    pillarsArray = [...new Set(pillarsArray)].sort()
    state.filters.pillars = pillarsArray
}
function renderPillarCheckboxes() {
    let formEl = document.querySelector(".pillarsForm")
    for (const pillar of state.filters.pillars) {
        const labelEl = createEl("label")
        labelEl.setAttribute("for", pillar.toLowerCase())
        labelEl.innerText = pillar

        const inputEl = createEl("input")
        inputEl.setAttribute("type", "checkbox")
        inputEl.setAttribute("id", pillar.toLowerCase())
        inputEl.setAttribute("value", pillar.toLowerCase())

        //Adding checked filter boxes to state
        inputEl.addEventListener("change", function() {
            if(inputEl.checked) {
                state.filters.checkedPillars.push(inputEl.value)
                console.log(state.filters.checkedPillars)
            }
            if(!inputEl.checked) {
                state.filters.checkedPillars = state.filters.checkedPillars.filter(function(pillar) {
                    return pillar !== inputEl.value
                })
                console.log(state.filters.checkedPillars)
            }
            renderArticles()
            
        })
        labelEl.append(inputEl)
        formEl.append(labelEl)
    }
}

function renderArticles() {
    mainContentSection.innerHTML = ""

    const feedContainerEl = createEl("div")
    feedContainerEl.setAttribute("class", "feedContainer")

    let articlesToBeFiltered = state.published
    let filteredArticles = []

    let checkboxes = document.querySelectorAll("input[type=checkbox]")
    console.log(checkboxes)
    let checkboxValues = []

    for (checkbox of checkboxes) {
        if(checkbox.checked) {
            console.log(checkbox.value)
            checkboxValues.push(checkbox.value)
        } 
    }// HERE
    

    if(state.filters.search === "") filteredArticles = articlesToBeFiltered
    if(state.filters.search !==  "") {
        filteredArticles = articlesToBeFiltered.filter(function(article) {
            return article.title.includes(state.filters.search) || article.content.includes(state.filters.search)
        })
        console.log(filteredArticles)
    }
    if(state.filters.checkedPillars.length !== 0) {
        filteredArticles = filteredArticles.filter(function(article) {
            return article.pillars.toLowerCase().includes(state.filters.checkedPillars)
        }) //HERE
        console.log(filteredArticles)
    }
    for (article of filteredArticles) {
        articleHTML = renderFeedArticle(article)
        feedContainerEl.append(articleHTML)
    }
    
        

    mainContentSection.append(feedContainerEl)
}
