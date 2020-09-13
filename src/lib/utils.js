module.exports = {

    date(timestamp) {
        // pega a data mas em formato 'local'
        const date = new Date(timestamp)

        // yyyy (com UTC transformo para data em formato 'universal' = // IMPORTANTE fazer isso pra manipular depois)
        const year = date.getUTCFullYear()

        // mm (mês é de 0 a 11, +1 pra fechar os 12)
        const month = `0${date.getUTCMonth() + 1}`.slice(-2)

        // dd
        const day = `0${date.getUTCDate()}`.slice(-2)

        return `${year}-${month}-${day}`
    }
}