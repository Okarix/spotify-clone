import { Song } from './models/Song'
import { Playlist } from './models/Playlist'
import User from '../auth/models/User'
import {
  uploadFileToFirebase,
  deleteFileFromFirebase
} from '../../utils/firebaseHelpers'

interface CreateSongParams {
  songFile: Express.MulterFile
  coverImageFile: Express.MulterFile
  folder?: string
}

interface UpdateSongParams {
  title: string
  songFile?: Express.MulterFile
  coverImageFile?: Express.MulterFile
  folder?: string
}

class SongsService {
  async createSong(
    { songFile, coverImageFile, folder = 'songs' }: CreateSongParams,
    req
  ) {
    const songUrl = await uploadFileToFirebase(songFile, folder)
    const coverUrl = await uploadFileToFirebase(coverImageFile, folder)

    const song = new Song({
      title: req.body.title,
      artist: req.body.artist,
      artistId: req.body.artistId,
      url: songUrl,
      coverUrl: coverUrl,
      favorite: false
    })

    await song.save()
    return song
  }

  async getAllSongs() {
    try {
      const songs = await Song.find()
      return songs
    } catch (error) {
      throw new Error('Failed to fetch songs')
    }
  }

  async getSongsById(id: string) {
    try {
      const songs = await Song.find({ artistId: id })
      return songs
    } catch (error) {
      throw new Error('Failed to fetch songs')
    }
  }

  async deleteSong(songId: string, folder = 'songs'): Promise<void> {
    try {
      const song = await Song.findById(songId)

      if (!song) {
        throw new Error('Song not found')
      }

      await deleteFileFromFirebase(song.url)
      await deleteFileFromFirebase(song.coverUrl)

      await Song.findByIdAndDelete(songId)
    } catch (error) {
      throw new Error('Failed to delete song')
    }
  }

  async updateSong(
    id: string,
    { title, songFile, coverImageFile, folder = 'songs' }: UpdateSongParams
  ): Promise<any> {
    const song = await Song.findById(id)
    if (!song) {
      throw new Error('Song not found')
    }

    if (songFile) {
      const songUrl = await uploadFileToFirebase(songFile, folder)
      song.url = songUrl
    }

    if (coverImageFile) {
      const coverUrl = await uploadFileToFirebase(coverImageFile, folder)
      song.coverUrl = coverUrl
    }

    song.title = title

    await song.save()
    return song
  }

  async createPlaylist(
    {
      playlistName,
      playlistDescr,
      playlistCover,
      userId,
      folder = 'playlists'
    },
    req
  ) {
    const coverUrl = await uploadFileToFirebase(playlistCover, folder)

    const playlist = new Playlist({
      title: playlistName,
      description: playlistDescr,
      coverUrl: coverUrl,
      userId: userId,
      playlistType: '',
      songs: []
    })

    await playlist.save()
    return playlist
  }

  async getAllPlaylists() {
    const playlists = await Playlist.find()
    return playlists
  }

  async updatePlaylist(playlistId, songId) {
    const playlist = await Playlist.findById(playlistId)
    if (playlist) {
      if (!playlist.songs.includes(songId)) {
        playlist.songs.push(songId)
        await playlist.save()
      }
    } else {
      throw new Error('Playlist not found')
    }
  }

  async getSongById(id: string) {
    try {
      const song = await Song.findById(id)
      return song
    } catch (error) {
      throw new Error('Failed to fetch song')
    }
  }

  async addToFavorite(userId: string, songId: string): Promise<any> {
    const user = await User.findById(userId)

    if (user) {
      const index = user.favorites.indexOf(songId)
      if (index === -1) {
        user.favorites.push(songId)
      } else {
        user.favorites.splice(index, 1)
      }
      await user.save()
    }
    return user
  }
}

export default SongsService
