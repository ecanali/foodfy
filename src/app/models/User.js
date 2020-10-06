const Base = require('./Base')

// const db = require('../../config/db')
// const { hash } = require('bcryptjs')
// const fs = require('fs') // FileSystem = files/images in public file

Base.init({ table: 'users' })

module.exports = {
    ...Base
}

//     async delete(id) {
//         // // gets all products from user
//         // let results = await db.query('SELECT * FROM products WHERE user_id = $1', [id])
//         // const products = results.rows

//         // // from products, gets all imagens
//         // const allFilesPromise = products.map(product =>
//         //     Product.files(product.id))
        
//         // let promiseResults = await Promise.all(allFilesPromise)

//         // runs user deletion
//         await db.query('DELETE FROM users WHERE id = $1', [id])

//         // // removes images from public
//         // promiseResults.map(results => {
//         //     results.rows.map(file => {
//         //         try {
//         //             fs.unlinkSync(file.path)
//         //         } catch (error) {
//         //             console.error(error)
//         //         }
//         //     }) 
//         // })
//     }
// }