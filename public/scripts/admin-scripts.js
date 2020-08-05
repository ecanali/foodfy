// Marcar Menu da Página Atual
const currentPage = location.pathname
const menuItems = document.querySelectorAll('.nav-admin a')

for (let item of menuItems) {
    if (currentPage.includes(item.getAttribute('href'))) {
        item.classList.add('active')
    }
}

// Adiciona campos extras em Ingredientes
function addIngredient() {
    const ingredients = document.querySelector('#ingredients')
    const fieldCointainer = document.querySelectorAll('.ingredient')

    // Clone do último ingrediente adicionado
    const newField = fieldCointainer[fieldCointainer.length - 1].cloneNode(true)

    // Não add novo input se último estiver vazio
    if (newField.children[0].value == "") return false

    // Deixa o valor do input vazio
    newField.children[0].value = ""
    ingredients.appendChild(newField)
}

// Escuta clique no botão de add campo SE o campo existir na página
// (Isso só aconteceu pq to usando o mesmo arquivo de scripts pra tudo)
const addIngredientButton = document.querySelector('.add-ingredient')
    if (addIngredientButton) {
        addIngredientButton.addEventListener('click', addIngredient)
    }

// Adiciona campos extras em Modo de Preparo
function addStep() {
    const steps = document.querySelector('#steps')
    const fieldCointainer = document.querySelectorAll('.step')

    // Clone do último ingrediente adicionado
    const newField = fieldCointainer[fieldCointainer.length - 1].cloneNode(true)

    // Não add novo input se último estiver vazio
    if (newField.children[0].value == "") return false

    // Deixa o valor do input vazio
    newField.children[0].value = ""
    steps.appendChild(newField)
}

// Escuta clique no botão de add campo SE o campo existir na página
// (Isso só aconteceu pq to usando o mesmo arquivo de scripts pra tudo)
const addStepButton = document.querySelector('.add-step')
    if (addStepButton) {
        addStepButton.addEventListener('click', addStep)
    }
