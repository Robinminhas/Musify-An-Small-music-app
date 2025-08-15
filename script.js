import { allSongsData } from "./songsData.js";
const musicContainer = document.querySelector(".music-container");
const createPlaylistBtn = document.querySelector('.create-playlistBtn');
const searchBar = document.querySelector('#searchInput');
const menuBtn = document.querySelectorAll('#menu');
const menuCloseBtn = document.querySelector('#close-btn');
const menu = document.querySelector('.left');
let allPlayliststName = [];
let allPlaylists = [];

function createSongCard(allSongsData) {
  allSongsData.forEach((song) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "music-card ml m1 rounded";
    cardDiv.innerHTML = `<div class="image-container m1">
              <img class="rounded"
                src='${song.coverImage}'
                alt="Saiyaara Cover"
              />
              <div class="play-button" aria-label="Play" id='${song.songeName}' title="play song">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="play-svg"
                  id='${song.songeName}'
                >
                  <path
                    d="M16.3944 12.0001L10 7.7371V16.263L16.3944 12.0001ZM19.376 12.4161L8.77735 19.4818C8.54759 19.635 8.23715 19.5729 8.08397 19.3432C8.02922 19.261 8 19.1645 8 19.0658V4.93433C8 4.65818 8.22386 4.43433 8.5 4.43433C8.59871 4.43433 8.69522 4.46355 8.77735 4.5183L19.376 11.584C19.6057 11.7372 19.6678 12.0477 19.5146 12.2774C19.478 12.3323 19.4309 12.3795 19.376 12.4161Z"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="music-info">
              <div class="music-title">${song.songeName}</div>
              <div class="music-artists">
                ${song.artistName}
              </div>
            </div>`;

    musicContainer.appendChild(cardDiv);
  });
}

function displayPlayMusicSection(songToPlayInfo) {
  const playMusicSection = document.querySelector(".playMusic");
  playMusicSection.innerHTML = `
        <div class="nav flex items-center w-full gap ml">
          <img src="Svg/backIcon.svg" alt="back icon" class="invert back-icon-width" id="backToHome" title="Back to home">
          <h3>Playing ${songToPlayInfo.songeName}</h3>
        </div>
        <div class="songImg flex items-center justify-center w-full">
          <img src="${songToPlayInfo.coverImage}" alt="song cover image" class="rounded">
        </div>
        <div class="songInfo text-center m1">
          <h2>${songToPlayInfo.songeName}</h2>
          <p>${songToPlayInfo.artistName}</p>
        </div>

        <div class="playBar m2 flex items-center w-full">
          <h5>${songToPlayInfo.songeName}</h5>
          <div class="options">
            <img src="Svg/backSong.svg" alt="back song icon" class="invert music-options-width prevSong">
            <img src="Svg/pauseSong.svg" alt="play song icon" class="invert music-options-width pauseSong">
            <img src="Svg/forwardSong.svg" alt="forward song icon" class="invert music-options-width nextSong">
          </div>

          <div class="volume flex items-center">
            <img src="Svg/volumeIcon.svg" alt="Volume Icon" class="invert music-options-width">
            <input type="range" min="0" max="1" step="0.01" value="0.5" id="volumeBar">
          </div>
        </div>
        <div class="bar ml">
          <span id="current">0:00</span> / <span id="duration">0:00</span>
          <input type="range" id="progress" value="0" step="0.01"/>
          </div>
        </div> `;

  playMusicSection.style.display = "initial";
  document.querySelector('.search-container').style.display = 'none';
  document.querySelector(".showAllSongs").style.display = "none";
  playSong(songToPlayInfo);
}

function displayCreatePlaylist(allSongsData) {
  const createPlaylistSec = document.querySelector('.createPlaylist');
  const allSongs = document.querySelector('.allSongs');

  allSongsData.forEach((sng) => {
    const sngDiv = document.createElement('div');
    sngDiv.className = 'sng flex m1 rounded ml';
    sngDiv.innerHTML = `<div class="sngName flex items-center gap">
              <img src='${sng.coverImage}' alt="Song Cover Image" class="rounded ml">
              <h4><span id="sngName">${sng.songeName}</span> by ${sng.artistName}</h4>
            </div>
            <div class="addIcon flex items-center">
              <img src="Svg/addIcon.svg" alt="addIcon" class="invert music-options-width addToPlaylist" title="add song to playlist">
            </div>`

    allSongs.appendChild(sngDiv);
    createPlaylistSec.appendChild(allSongs);
  })

  createPlaylistSec.style.display = 'initial';
  document.querySelector(".showAllSongs").style.display = "none";
  document.querySelector(".playMusic").style.display = 'none';
  document.querySelector('#back-Home').addEventListener('click', function () { location.reload() })
}

function handleVolumeUpdate(songAudio) {
  document.querySelector('#volumeBar').addEventListener('input', (e) => {
    songAudio.volume = e.target.value;
  })
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

function playSong(song) {
  let isPlaying = false;
  const duration = document.getElementById('duration');
  const progress = document.getElementById('progress');
  const current = document.getElementById('current');
  const songAudio = new Audio();
  if (!isPlaying) {
    songAudio.src = song.songLocation;

    songAudio.addEventListener('loadedmetadata', () => {
      duration.textContent = formatTime(songAudio.duration);
      progress.max = songAudio.duration;
    })

    songAudio.addEventListener('timeupdate', () => {
      progress.value = songAudio.currentTime;
      current.textContent = formatTime(songAudio.currentTime);
    })

    progress.addEventListener('input', () => {
      songAudio.currentTime = progress.value;
    })

    songAudio.play();
    isPlaying = true;
    handleVolumeUpdate(songAudio);
  }

  const pauseBtn = document.querySelector('.pauseSong');

  pauseBtn.addEventListener('click', () => {
    if (isPlaying) {
      songAudio.pause();
      isPlaying = false;

      pauseBtn.setAttribute('src', "Svg/playSong.svg")
    } else if (!isPlaying) {
      songAudio.play();
      isPlaying = true;

      pauseBtn.setAttribute('src', "Svg/pauseSong.svg");
    }
  })

  let songIndex = allSongsData.indexOf(song);
  handlePrevNextSong(songIndex, songAudio);

  document.querySelector('#backToHome').addEventListener('click', function () {
    songAudio.pause();
    this.parentElement.parentElement.style.display = 'none';
    document.querySelector('.right').style.display = 'initial';
    document.querySelector('.search-container').style.display = 'initial';
    document.querySelector('footer').style.display = 'initial';
  })
}

function handlePrevNextSong(currSong, audio) {
  document.querySelector('.prevSong').addEventListener('click', () => {
    audio.pause();
    currSong = (currSong === 0) ? allSongsData.length - 1 : currSong - 1;
    displayPlayMusicSection(allSongsData[currSong]);
  })

  document.querySelector('.nextSong').addEventListener('click', () => {
    audio.pause();
    currSong = (currSong === allSongsData.length - 1) ? 0 : currSong + 1;
    displayPlayMusicSection(allSongsData[currSong]);
  })
}

function createPalylistCard(playlistName) {
  const playListContainer = document.createElement('div');
  playListContainer.setAttribute('title', 'click to open playlist')
  playListContainer.className = 'play-list flex items-center';
  playListContainer.innerHTML = `<div class="info flex items-center gap-2">
              <img src="cover images/Playlist_Img.jpg" alt="playlist cover image" class="rounded"/>
              <h4 id="play-List-Name">${playlistName}</h4>
            </div>
            <div class="arrowBtn">
              <img src="Svg/rightArrow.svg" alt="arrowBtn" class="invert playlist-btn-width" id="open-playList">
            </div>`

  document.querySelector('.playlists').appendChild(playListContainer);
}

function handleCreatePlaylist() {
  let query = '';
  searchBar.addEventListener('input', function () {
    document.querySelectorAll('.sng').forEach((SC) => {
      SC.style.display = 'none';
    })
    query = this.value.toLowerCase();
    const displaySongs = allSongsData.filter((sng) => {
      return sng.songeName.toLowerCase().includes(query);
    })
    displayCreatePlaylist(displaySongs);
  })

  displayCreatePlaylist(allSongsData);
  const popup = document.getElementById("popup");
  popup.classList.add('open');

  document.querySelector('.playlistName').addEventListener('submit', function (e) { playListNameSubmit(this, e, popup); })
  if (document.querySelector('.create-playlist')) {
    document.querySelector('.create-playlist').remove();
    document.querySelector('#mainLeft').style.gap = '20px'
  }
  document.querySelector('#savePlaylistBtn').style.display = 'block';
  handleNewPlaylist();
}

function playListNameSubmit(from, event, popup) {
  event.preventDefault();
  const playListNameData = new FormData(from);
  const playlistName = playListNameData.get('playlist-Name');
  
  if (playlistName) {
    createPalylistCard(playlistName);
    popup.classList.remove('open');
  } else {
    alert('Please Enter a playlist name to create a new playlist!');
  }

  if (localStorage.getItem('playlistsName')) {
    allPlayliststName = JSON.parse(localStorage.getItem('playlistsName'));
    allPlayliststName.push(playlistName);
  } else {
    allPlayliststName.push(playlistName);
  }
}

function handleNewPlaylist() {
  let currPlayList = []
  document.querySelectorAll('.addToPlaylist').forEach((btn) => {
    btn.addEventListener('click', function () {
      btn.setAttribute('src', 'Svg/check.svg')
      const song = this.parentElement.parentElement.querySelector('#sngName').textContent;
      allSongsData.forEach((sng) => {
        if (song === sng.songeName) currPlayList.push(sng);
      })
    })
  })

  document.querySelector('#savePlaylistBtn').addEventListener('click', () => {
    if (localStorage.getItem('allPlaylists')) {
      allPlaylists = JSON.parse(localStorage.getItem('allPlaylists'));
      allPlaylists.push(currPlayList);
    } else {
      allPlaylists.push(currPlayList);
    }
    localStorage.setItem('playlistsName', JSON.stringify(allPlayliststName));
    localStorage.setItem('allPlaylists', JSON.stringify(allPlaylists));
    currPlayList = [];
    alert('Playlist Saved Successfully');
    location.reload();
  })

  document.querySelectorAll('.play-list').forEach((playlistOpen) => {
    playlistOpen.addEventListener('click', function () {
      handleOpenPlaylist(this);
    })
  })
}

function removeCrads(cards) {
  cards.forEach((crd) => {
    crd.remove();
  })
}

function handleOpenPlaylist(ele) {
  removeCrads(document.querySelectorAll('.music-card'));
  let closePlaylistBtn = document.querySelector('#closePlaylist');
  let heading = document.querySelector('.right-heading');
  const playlistToOpen = ele.querySelector('#play-List-Name').textContent;
  const playListIndex = allPlayliststName.indexOf(playlistToOpen);
  closePlaylistBtn.style.display = 'initial'
  createSongCard(allPlaylists[playListIndex]);
  heading.textContent = `${playlistToOpen} songs:`
  document.querySelector('.createPlaylist').style.display = 'none';
  document.querySelector(".showAllSongs").style.display = "initial";

  closePlaylistBtn.addEventListener('click', () => { 
    removeCrads(document.querySelectorAll('.music-card'));
    createSongCard(allSongsData) 
    heading.textContent = 'All Songs'
    closePlaylistBtn.style.display = 'none';
  });
}

musicContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("play-button") || e.target.classList.contains("play-svg")) {
    const songToPlay = e.target.id;
    const song = allSongsData.filter((sng) => sng.songeName === songToPlay)[0];
    displayPlayMusicSection(song);
  }
});


createPlaylistBtn.addEventListener('click', handleCreatePlaylist);
document.querySelector('.newPlaylist').addEventListener('click', handleCreatePlaylist);

searchBar.addEventListener('input', function () {
  document.querySelectorAll('.music-card').forEach((sng) => {
    sng.style.display = 'none';
  })
  let query = this.value.toLowerCase();
  let searchSong = allSongsData.filter((sng) => {
    return sng.songeName.toLowerCase().includes(query)
  })

  createSongCard(searchSong);
})

menuBtn.forEach((menubtn) => {
  menubtn.addEventListener('click', () => {
    menu.style.display = 'flex';
    menu.style.position = 'absolute';
    menu.style.backGroundColor = 'black'
    menu.style.width = '60%'
    menuCloseBtn.style.transform = 'scale(1)';
  })
})

menuCloseBtn.addEventListener('click', () => {
  menu.style.display = 'none';
})


createSongCard(allSongsData);

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('allPlaylists') && localStorage.getItem('playlistsName')) {
    allPlayliststName = JSON.parse(localStorage.getItem('playlistsName'));
    allPlayliststName.forEach((playlistName) => {
      createPalylistCard(playlistName);
    })

    allPlaylists = JSON.parse(localStorage.getItem('allPlaylists'));
    document.querySelector('.create-playlist').remove();

    document.querySelectorAll('.play-list').forEach((playlistOpen) => {
      playlistOpen.addEventListener('click', function () {
        handleOpenPlaylist(this);
      })
    })
  }
})
