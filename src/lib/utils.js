const Recipe = require('../app/models/Recipe')

module.exports = {

    date(timestamp) {
        // pega a data mas em formato 'local'
        const date = new Date(timestamp)

        // yyyy (com UTC transformo para data em formato 'universal' = // IMPORTANTE fazer isso pra manipular depois)
        const year = date.getFullYear()

        // mm (mês é de 0 a 11, +1 pra fechar os 12)
        const month = `0${date.getMonth() + 1}`.slice(-2)

        // dd
        const day = `0${date.getDate()}`.slice(-2)

        const hour = date.getHours()
        const minutes = date.getMinutes()

        return {
            day,
            month,
            year,
            hour,
            minutes,
            iso: `${year}-${month}-${day}`,
            birthDay: `${day}/${month}`,
            format: `${day}/${month}/${year}`
        }
    },

    async getRecipeImages(recipeId, req) {
        const results = await Recipe.files(recipeId)
        const files = results.map(recipe => ({
            ...recipe,
            src:`${req.protocol}://${req.headers.host}${recipe.path.replace("public", "")}`
            }))
            
        return files
    }
}