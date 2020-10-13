function checkAllFields(req) {
    // check if it has all fields
    const keys = Object.keys(req.body)

    for (let key of keys) {
        if (req.body[key] == "") {            
            return {
                userSession: req.user,
                error: "Por favor, preencha todos os campos.",
                chef: req.body
            }
        }
    }
}

function post(req, res, next) {    
        // check if it has all fields
    const fillAllFields = checkAllFields(req)

    if (fillAllFields)
        return res.render('admin/chefs/create', fillAllFields)

    if (req.files.length == 0)
        return res.render('admin/chefs/create', {
            error: "Por favor, envie uma imagem!",
            chef: req.body,
            userSession: req.user
        })

    next()
}

function update(req, res, next) {
    // check if it has all fields
    const fillAllFields = checkAllFields(req)

    if (fillAllFields) {
        return res.render('admin/chefs/edit', fillAllFields)
    }

    // console.log(req)

    // if (req.files.length == 0 || req.body.file_id == "")
    //     return res.render('admin/chefs/edit', {
    //         error: "Por favor envie uma imagem!",
    //         chef: req.body,
    //         userSession: req.user
    //     })

    next()
}

module.exports = {
    post,
    update
}