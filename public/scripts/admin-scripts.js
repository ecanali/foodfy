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

// IMAGES MANAGER
const PhotosUpload = {
    input: "",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 5,
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target
        PhotosUpload.input = event.target

        if (PhotosUpload.hasLimit(event)) return

        // Uso de "Array.from()" é pra transformar a lista recebida em fileList em um Array e poder usar o forEach
        Array.from(fileList).forEach(file => {
            
            PhotosUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)
                PhotosUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)
        })

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    hasLimit(event) {
        const { uploadLimit, input, preview } = PhotosUpload
        const { files: fileList } = input

        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == "photo")
                photosDiv.push(item)
        })

        const totalPhotos = fileList.length + photosDiv.length
        if (totalPhotos > uploadLimit) {
            alert("Você atingiu o limite máximo de fotos")
            event.preventDefault()
            return true
        }

        return false
    },
    getAllFiles() {
        // ClipboardEvent é para o Firefix, DataTransfer é para o Chrome
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick = PhotosUpload.removePhoto

        div.appendChild(image)

        div.appendChild(PhotosUpload.getRemoveButton())

        return div
    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"
        return button
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode // <div class="photo">
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)


        PhotosUpload.files.splice(index, 1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoDiv.remove()
    },
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode

        if (photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]')
            if (removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove()
    }
}

// RECIPE GALLERY 
const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(e) {
        const { target } = e

        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
        target.classList.add('active')

        ImageGallery.highlight.src = target.src
    }
}