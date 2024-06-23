import { Router } from 'express'
import SongsController from './songs-controller'
import SongsService from './songs-service'
import multer from 'multer'

const songRouter = Router()
const songsService = new SongsService()
const songsController = new SongsController(songsService)
const upload = multer({ storage: multer.memoryStorage() })

songRouter.get('/playlists', (req, res) =>
  songsController.getAllPlaylists(req, res)
)

songRouter.post(
  '/upload',
  upload.fields([
    { name: 'song', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  (req, res) => songsController.createSong(req, res)
)

songRouter.get('/songs', (req, res) => songsController.getAllSongs(req, res))
songRouter.get('/songs/:id', (req, res) =>
  songsController.getSongById(req, res)
)
songRouter.get('/songs/artist/:id', (req, res) =>
  songsController.getSongsById(req, res)
)

songRouter.delete('/songs/:id', (req, res) =>
  songsController.deleteSong(req, res)
)
songRouter.put(
  '/songs/:id',
  upload.fields([
    { name: 'song', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  (req, res) => songsController.updateSong(req, res)
)

songRouter.post('/playlist', upload.single('playlistCover'), (req, res) =>
  songsController.createPlaylist(req, res)
)

songRouter.put('/playlist/:playlistId/add-song', (req, res) =>
  songsController.updatePlaylist(req, res)
)
songRouter.get('/playlist/:id', (req, res) =>
  songsController.getAllPlaylists(req, res)
)

songRouter.put('/songs/:id/favorite', (req, res) =>
  songsController.addToFavorite(req, res)
)

export default songRouter
