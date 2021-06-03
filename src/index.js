let editArticleBtn = document.querySelector(".edit-tile-btn")
let mainContent = document.querySelector(".mainContent")
console.log(mainContent)

let state = {
    toBePushlished: [],
    published: [],
    selectedArticle: [],
    filters: {
        search: "",
        pillars: []
    }
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
