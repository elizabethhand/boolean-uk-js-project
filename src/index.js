let editArticleBtn = document.querySelector(".edit-tile-btn")
let mainContent = document.querySelector(".mainContent")
console.log(mainContent)

function listenToEditBtn() {
    editArticleBtn.addEventListener("click", function () {
        mainContent.innerText = ""
        let container = document.createElement('div')
        container.setAttribute("class", "editContainer")

        let title = document.createElement('h2')
        title.innerText = "EDIT"

        let titleLabel = document.createElement('label')
        titleLabel.innerText = "Title"
        titleLabel.setAttribute("for", "titleInput")

        let titleInput = document.createElement('input')
        titleInput.setAttribute("class", "titleInput")

        let articleLabel = document.createElement('label')
        articleLabel.innerText = "Article"
        articleLabel.setAttribute("for", "articleInput")

        let articleInput = document.createElement('input')
        articleInput.setAttribute("class", "articleInput")

        let deleteBtn = document.createElement('button')
        deleteBtn.setAttribute("class", "deleteArticleBtn")
        deleteBtn.innerText = "Delete"

        let publishBtn = document.createElement('button')
        publishBtn.setAttribute("class", "publishArticleBtn")
        publishBtn.innerText = "Publish"

        mainContent.append(container)
        container.append(title, titleLabel, titleInput, articleLabel, articleInput, deleteBtn, publishBtn)
    })
}

listenToEditBtn()
