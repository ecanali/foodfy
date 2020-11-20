// listens 'click' event on a recipe and opens it
const recipes = document.querySelectorAll('.receita')

for (let recipe of recipes) {
    recipe.addEventListener('click', () => {
        window.location.href = `/recipes/${recipe.id}`
    })
}

// hides and shows recipe infos on preview
const hideShowButtons = document.querySelectorAll('.button')
const recipeInfos = document.querySelectorAll('.recipe-hide-show')

for (let i = 0; i < hideShowButtons.length; i++) {
    hideShowButtons[i].addEventListener('click', () => {
        if (recipeInfos[i].classList.contains('hidden')) {
            recipeInfos[i].classList.remove('hidden')
            hideShowButtons[i].textContent = "ESCONDER"
        } else {
            recipeInfos[i].classList.add('hidden')
            hideShowButtons[i].textContent = "MOSTRAR"
        }
    })
}

// visually shows the current page on navigation menu
const currentPage = location.pathname
const menuItems = document.querySelectorAll('nav a')

for (let item of menuItems) {
    if (currentPage.includes(item.getAttribute('href'))) {
        item.classList.add('active')
    }
}

// recipes list pagination strategy on frontend
function paginate(selectedPage, totalPages) {
    let pages = [],
    oldPage

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        
        const firstAndLastPage = currentPage == 1 || currentPage == totalPages
        const pagesAfterSelectedPage = currentPage <= selectedPage + 2
        const pagesBeforeSelectedPage = currentPage >= selectedPage -2
        
        if (firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage) {
            if (oldPage && currentPage - oldPage > 2) {
                pages.push("...")
            }
            if (oldPage && currentPage - oldPage == 2) {
                pages.push(oldPage + 1)
            }
            
            pages.push(currentPage)

            oldPage = currentPage
        }
    }

    return pages
}

function createPagination(pagination) {
    const filter = pagination.dataset.filter

    // info could come from HTML as 'string', the '+' turns it in 'number'
    // it's important to make sure it's a 'number' to avoid later calcule bugs
    const page = +pagination.dataset.page
    const total = +pagination.dataset.total

    const pages = paginate(page, total)

    let elements = ""

    for (let page of pages) {
        if(String(page).includes("...")) {
            elements += `<span>${page}</span>`
        } else {
            if (filter) {
                elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`

            } else {
                elements += `<a href="?page=${page}">${page}</a>`

            }
        }
    }

    pagination.innerHTML = elements
}

const pagination = document.querySelector('.pagination')

if (pagination)
    createPagination(pagination)

// visually shows the current page on recipes pagination
const currentPageSearch = location.search

if (currentPageSearch.includes("?page=")) {
    const aElements = document.getElementsByClassName('pagination')[0].childNodes

    for (let aElement of aElements) {
        if (currentPageSearch.includes(aElement.getAttribute('href'))) {
            aElement.classList.add('active')
        }
    }
}
