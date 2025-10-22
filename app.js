import express from 'express'
import { engine } from 'express-handlebars'
import path from 'path';
import { getDocs, editDocs, insertDocs, removeDocs } from './business.js'


const app = express();
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', engine({
    defaultLayout: false
}));
app.set('view engine', 'handlebars');
app.set('views', path.resolve('views'));
app.use(express.static('static'))


app.get('/', async (req, res) => {
    const albums = await getDocs({ collection: 'albums' })
    res.render('home_page', { albums })
})


app.get('/album/:id', async (req, res) => {
    const albumID = Number(req.params.id)
    const photos = await getDocs({ collection: 'photos', filter: { albums: albumID } })
    const album = await getDocs({ collection: 'albums', filter: { id: albumID }, single: true })

    res.render('photos_list', { photos, album })
})


app.get('/photo-details/:id', async (req, res) => {
    const photoId = Number(req.params.id)
    const photo = await getDocs({ collection: 'photos', filter: { id: photoId }, single: true })

    res.render('get_photo', photo)
})


app.get('/edit-photo', (req, res) => {
    const pid = req.query.pid
    res.render('edit_photo', { pid })
})


app.post('/edit-photo', async (req, res) => {
    const pid = Number(req.body.pid)
    const title = req.body.title
    const description = req.body.description

    const updated = await editDocs({
        collection: 'photos',
        doc: {
            id: pid,
            $set: { title: title, description: description }
        },
        single: true
})

    if(!updated.matchedCount) {
        res.render('edit_photo', {pid, updated: false, showMessage: true})
        return
    }

    res.render('edit_photo', {pid, updated: true, showMessage: true})
    
})






app.listen(8000, () => console.log("Server Running on Port 8000"))