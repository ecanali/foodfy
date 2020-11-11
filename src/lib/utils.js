const Recipe = require('../app/models/Recipe')
const Chef = require('../app/models/Chef')

module.exports = {
    date(timestamp) {
        // gets the "local" format date
        const date = new Date(timestamp)

        // yyyy
        const year = date.getFullYear()

        // mm (month is from 0 to 11, +1 to have the 12)
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
        try {
            const results = await Recipe.files(recipeId)
            const files = results.map(recipe => ({
                ...recipe,
                src:`${req.protocol}://${req.headers.host}${recipe.path.replace("public", "")}`
                }))
                
            return files
            
        } catch (error) {
            console.error(error)
        }
    },
    async getChefImage(chefId, req) {
        try {
            const results = await Chef.filesByChefId(chefId)
            const files = results.map(chef => ({
                ...chef,
                src:`${req.protocol}://${req.headers.host}${chef.path.replace("public", "")}`
                }))
                
            return files[0]
            
        } catch (error) {
            console.error(error)
        }
    }
}