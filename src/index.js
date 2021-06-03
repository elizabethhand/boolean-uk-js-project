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
1. Have an event listener on the submit of the search input
2. Filter the publishesd articles with the search string and add to state 
3. Render the filtered articles to the page
*/
function createEl(tag) {
    return document.createElement(tag)
}
let filterFeedSection = document.querySelector(".filterFeed")
let mainContent = document.querySelector(".mainContent")
let searchFormEl = document.querySelector(".searchbarForm")
let editArticleBtn = document.querySelector(".edit-tile-btn")

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

        let form = e.target 
        state.filters.search = form.search.value
        renderFeedArticles()

    })
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
        listenForSearchBar()
        addPillarsToState()
        renderPillarCheckboxes()
        renderFeedArticles()
    })
function addPillarsToState() {
    let pillarsArray = state.published.map(function(article) {
        return article.pillars
    })
    pillarsArray = [...new Set(pillarsArray)].sort()
    state.filters.pillars = pillarsArray //TODO: CHANGE TO IMMUTABLE
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
            }
            if(!inputEl.checked) {
                state.filters.checkedPillars = state.filters.checkedPillars.filter(pillar =>  pillar !== inputEl.value)
            }
            renderFeedArticles()
            
        })
        labelEl.append(inputEl)
        formEl.append(labelEl)
    }
}
function renderFeedArticles() {
    mainContent.innerHTML = ""

    const feedContainerEl = createEl("div")
    feedContainerEl.setAttribute("class", "feedContainer")

    let articlesToBeFiltered = state.published
    let filteredArticles = []

    let checkboxes = document.querySelectorAll("input[type=checkbox]")
    let checkboxValues = []

    for (checkbox of checkboxes) {
        if(checkbox.checked) {
            checkboxValues.push(checkbox.value)
        } 
    }// HERE
    

    if(state.filters.search === "") filteredArticles = articlesToBeFiltered
    if(state.filters.search !==  "") {
        filteredArticles = articlesToBeFiltered.filter(function(article) {
            return article.title.includes(state.filters.search) || article.content.includes(state.filters.search)
        })
    }
    if(state.filters.checkedPillars.length !== 0) {
        filteredArticles = filteredArticles.filter(function(article) {
            return article.pillars.toLowerCase().includes(state.filters.checkedPillars)
        }) //HERE
    }
    for (article of filteredArticles) {
        articleHTML = renderFeedArticle(article)
        feedContainerEl.append(articleHTML)
    }
    
        

    mainContent.append(feedContainerEl)
}
function renderFeedArticle(article) {
    const articleEl = createEl("article")
    articleEl.setAttribute("class", "article")

    const articleContentContainerEl = createEl("div")
    articleContentContainerEl.setAttribute("class", "articleContent")

    const articleTitleEl = createEl("h2")
    articleTitleEl.innerText = article.title

    const articleInfoEl = createEl("h3")
    articleInfoEl.innerText = `Author: ${article.author}, ${article.date}, ${article.time}` 

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


function renderEditorialBoard() {
    let tileContainer = document.querySelector('.edit-tiles')

    for (const article of state.toBePublished) {
        let tile = renderTiles(article)
        tileContainer.append(tile)
    }

}

function renderTiles(article) {
    let container = document.createElement('div')
    container.setAttribute("class", "edit-tile")

    let title = document.createElement('h3')
    title.innerText = article.title

    let editBtn = document.createElement('button')
    editBtn.setAttribute("class", "edit-tile-btn")
    editBtn.innerText = "EDIT"

    editBtn.addEventListener("click", function () {
        state.selectedArticle = article
        listenToEditBtn()
        console.log(state.selectedArticle)
    })

    let deleteBtn = document.createElement('button')
    deleteBtn.setAttribute("class", "delete-tile-btn")
    deleteBtn.innerText = "DELETE"

    deleteBtn.addEventListener("click", function () {
        state.selectedArticle = article
        deleteproposedArticle()
    })

    container.append(title, editBtn, deleteBtn)

    return container
}

function deleteproposedArticle() {
    fetch(`http://localhost:3000/toBePushlished/${state.selectedArticle.id}`, {
        method: 'DELETE',
    })
        .then(res => res.text()) // or res.json()
        .then(res => console.log(res))
}



function listenToEditBtn() {
    mainContent.innerText = ""
    let container = document.createElement('form')
    container.setAttribute("class", "editContainer")

    let title = document.createElement('h2')
    title.innerText = "EDIT"

    let titleLabel = document.createElement('label')
    titleLabel.innerText = "Title"
    titleLabel.setAttribute("for", "titleInput")

    let titleInput = document.createElement('input')
    titleInput.setAttribute("class", "titleInput")
    titleInput.setAttribute("value", state.selectedArticle.title)

    let articleLabel = document.createElement('label')
    articleLabel.innerText = "Article"

    // let articleInput = document.createElement('input')
    // articleInput.setAttribute("class", "articleInput")




    // 



    let deleteBtn = document.createElement('button')
    deleteBtn.setAttribute("class", "deleteArticleBtn")
    deleteBtn.innerText = "Delete"

    deleteBtn.addEventListener("click", function () {
        deleteproposedArticle()
    })

    let publishBtn = document.createElement('button')
    publishBtn.setAttribute("class", "publishArticleBtn")
    publishBtn.innerText = "Publish"

    publishBtn.addEventListener("click", function () {
        addtoPublishedArticles()
    })

    mainContent.append(container)
    container.append(title, titleLabel, titleInput, articleLabel, deleteBtn, publishBtn)

    let textArea = document.createElement('textarea')
    textArea.setAttribute("rows", "25")

    // for (const article of state.selectedArticle.content) {
    // console.log(article)

    // textArea.innerText = article
    console.log(state.selectedArticle.content)
    let newArray = state.selectedArticle.content.join("\n\n")
    console.log(newArray)
    textArea.value = newArray
    container.append(textArea)

}

function addtoPublishedArticles() {
    fetch('http://localhost:3000/published', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: state.selectedArticle.title,
            content: state.selectedArticle.content,
            author: state.selectedArticle.author,
            date: state.selectedArticle.date,
            time: state.selectedArticle.time,
            pillars: state.selectedArticle.pillars,
            article_URL: state.selectedArticle.article_URL,
            picture_URL: state.selectedArticle.picture_URL
        })
    })
}



function getArticleTitles() {
    return fetch(`http://localhost:3000/toBePushlished`)
        .then(function (response) {
            return response.json()
        }).then(function (titles) {
            state.toBePublished = titles
            console.log(state.toBePublished)
            renderEditorialBoard()
        })
}

getArticleTitles()
