// visually shows the current page on navigation menu
const currentPage = location.pathname
const menuItems = document.querySelectorAll('.nav-admin a')

for (let item of menuItems) {
    if (currentPage.includes(item.getAttribute('href'))) {
        item.classList.add('active')
    }
}

// adds extra fields on recipe Ingredients
function addIngredient() {
    const ingredients = document.querySelector('#ingredients')
    const fieldContainer = document.querySelectorAll('.ingredient')

    // clone from the last ingredient added
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)

    // prevents add new input field if last one were empty
    if (newField.children[0].value == "") return false

    // turns the input value empty
    newField.children[0].value = ""
    ingredients.appendChild(newField)
}

// listens the click on add new ingredient button IF it exists on the page
const addIngredientButton = document.querySelector('.add-ingredient')
if (addIngredientButton)
    addIngredientButton.addEventListener('click', addIngredient)

// adds extra fields on recipe Preparation Mode
function addStep() {
    const steps = document.querySelector('#steps')
    const fieldContainer = document.querySelectorAll('.step')

    // clone from the last ingredient added
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)

    // prevents add new input field if last one were empty
    if (newField.children[0].value == "") return false

    // turns the input value empty
    newField.children[0].value = ""
    steps.appendChild(newField)
}

// listens the click on add new step button IF it exists on the page
const addStepButton = document.querySelector('.add-step')
if (addStepButton)
    addStepButton.addEventListener('click', addStep)

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

        // the use of 'Array.from()' is to transform the list received in 'fileList' into a 'Array' and can use the 'forEach' on it
        Array.from(fileList).forEach(file => {
            
            PhotosUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)
                if (PhotosUpload.preview)
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

        if (preview) {
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
        }

        return false
    },
    getAllFiles() {
        // ClipboardEvent is for Firefox, DataTransfer is for Chrome
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

// FIELDS VALIDATION
const Validate = {
    apply(input, func) {
        Validate.clearErrors(input)
        
        let results = Validate[func](input.value)
        input.value = results.value

        if (results.error)
            Validate.displayError(input, results.error)
    },
    displayError(input, error) {
        const div = document.createElement('div')
        div.classList.add('error')
        div.innerHTML = error
        input.parentNode.appendChild(div)

        // prevents the user from leaving the field with an error
        input.focus()
    },
    clearErrors(input) {
        const errorDiv = input.parentNode.querySelector('.error')

        if (errorDiv)
            errorDiv.remove()
    },
    isEmail(value) {
        let error = null
        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (!value.match(mailFormat))
            error = "Email inválido"

        return {
            error,
            value
        }
    }
}