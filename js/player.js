/**
 * EL QUILOMBO - OFFICIAL MUSIC PLAYER CONTROLLER
 * Background Trap & Urban Player: Milo J, Duki & Trueno
 */

(function() {
  'use strict';

  const PLAYLIST = [
    {
      id: 'gil',
      title: 'Gil',
      artist: 'Milo J & Trueno',
      badge: '🇦🇷 Milo J & Trueno',
      src: 'assets/audio/gil.m4a',
      cover: 'assets/img/tracks/gil.jpg',
      category: 'milo trueno'
    },
    {
      id: 'goteo',
      title: 'Goteo',
      artist: 'Duki',
      badge: '⚡ Duki',
      src: 'assets/audio/goteo.m4a',
      cover: 'assets/img/tracks/goteo.jpg',
      category: 'duki'
    },
    {
      id: 'mamichula',
      title: 'Mamichula',
      artist: 'Trueno, Nicki Nicole & Bizarrap',
      badge: '🎤 Trueno',
      src: 'assets/audio/mamichula.m4a',
      cover: 'assets/img/tracks/mamichula.jpg',
      category: 'trueno'
    },
    {
      id: 'mai',
      title: 'M.A.I',
      artist: 'Milo J',
      badge: '🇦🇷 Milo J',
      src: 'assets/audio/mai.m4a',
      cover: 'assets/img/tracks/mai.jpg',
      category: 'milo'
    },
    {
      id: 'she-dont-give-a-fo',
      title: "She Don't Give a Fo",
      artist: 'Duki & KHEA',
      badge: '⚡ Duki',
      src: 'assets/audio/she-dont-give-a-fo.m4a',
      cover: 'assets/img/tracks/she-dont-give-a-fo.jpg',
      category: 'duki'
    },
    {
      id: 'nino',
      title: 'Niño',
      artist: 'Milo J',
      badge: '🇦🇷 Milo J',
      src: 'assets/audio/nino.m4a',
      cover: 'assets/img/tracks/nino.jpg',
      category: 'milo'
    }
  ];

  let currentIndex = 0;
  let isPlaying = false;
  let isMuted = false;
  let isShuffle = false;
  let currentFilter = 'all';

  const audio = new Audio();
  audio.preload = 'auto';

  // DOM Elements
  let playerContainer;
  let playerMiniLauncher;
  let trackCover;
  let trackTitle;
  let trackArtist;
  let trackBadge;
  let btnPlayPause;
  let playIcon;
  let btnPrev;
  let btnNext;
  let btnShuffle;
  let btnMinimize;
  let btnTogglePlaylist;
  let playlistDrawer;
  let playlistItemsContainer;
  let progressSlider;
  let currentTimeEl;
  let durationTimeEl;
  let volumeSlider;
  let btnMute;
  let autoplayNotice;
  let heroSoundWidget;
  let heroSoundSub;
  let heroEqBars;

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function loadTrack(index, autoPlay = true) {
    if (index < 0) index = PLAYLIST.length - 1;
    if (index >= PLAYLIST.length) index = 0;
    currentIndex = index;

    const track = PLAYLIST[currentIndex];
    audio.src = track.src;

    if (trackTitle) trackTitle.textContent = track.title;
    if (trackArtist) trackArtist.textContent = track.artist;
    if (trackBadge) trackBadge.textContent = track.badge;
    if (trackCover) {
      trackCover.src = track.cover;
      trackCover.alt = `${track.title} - ${track.artist}`;
    }

    if (playerContainer) {
      playerContainer.style.setProperty('--player-progress', '0%');
    }

    // Sync hero sound widget
    if (heroSoundSub) {
      heroSoundSub.textContent = `Sonando: ${track.artist} - ${track.title}`;
    }

    // Update active state in playlist items
    updatePlaylistActiveItem();

    // Mobile Media Session API Integration (mobile-player-controller)
    updateMediaSession(track);

    if (autoPlay) {
      playAudio();
    } else {
      updatePlayButtonUI(false);
    }
  }

  function updateMediaSession(track) {
    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: track.title,
          artist: track.artist,
          album: 'El Quilombo - Fiesta Temática Valencia',
          artwork: [
            { src: track.cover, sizes: '300x300', type: 'image/jpeg' },
            { src: track.cover, sizes: '512x512', type: 'image/jpeg' }
          ]
        });

        navigator.mediaSession.setActionHandler('play', () => playAudio());
        navigator.mediaSession.setActionHandler('pause', () => pauseAudio());
        navigator.mediaSession.setActionHandler('previoustrack', () => prevTrack());
        navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
        navigator.mediaSession.setActionHandler('seekto', (details) => {
          if (details.seekTime !== undefined && audio.duration) {
            audio.currentTime = details.seekTime;
          }
        });
      } catch (err) {
        // Media session fallback
      }
    }
  }

  function playAudio() {
    const promise = audio.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          isPlaying = true;
          updatePlayButtonUI(true);
          hideAutoplayNotice();
        })
        .catch(() => {
          isPlaying = false;
          updatePlayButtonUI(false);
          showAutoplayNotice();
        });
    }
  }

  function pauseAudio() {
    audio.pause();
    isPlaying = false;
    updatePlayButtonUI(false);
  }

  function togglePlayPause() {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }

  function nextTrack() {
    if (isShuffle) {
      let nextIdx;
      do {
        nextIdx = Math.floor(Math.random() * PLAYLIST.length);
      } while (nextIdx === currentIndex && PLAYLIST.length > 1);
      loadTrack(nextIdx, true);
    } else {
      loadTrack(currentIndex + 1, true);
    }
  }

  function prevTrack() {
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
    } else {
      loadTrack(currentIndex - 1, true);
    }
  }

  function updatePlayButtonUI(playing) {
    if (btnPlayPause) {
      btnPlayPause.setAttribute('aria-label', playing ? 'Pausar música' : 'Reproducir música');
      btnPlayPause.classList.toggle('is-playing', playing);
    }
    if (playIcon) {
      playIcon.textContent = playing ? '⏸' : '▶';
    }
    if (trackCover) {
      trackCover.classList.toggle('spinning', playing);
    }
    if (playerContainer) {
      playerContainer.classList.toggle('music-active', playing);
    }

    // Sync hero card equalizer
    if (heroEqBars) {
      heroEqBars.forEach(bar => {
        bar.style.animationPlayState = playing ? 'running' : 'paused';
      });
    }

    // Sync Media Session Playback State (mobile-player-controller)
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
    }
  }

  function showAutoplayNotice() {
    if (autoplayNotice) {
      autoplayNotice.classList.add('visible');
    }
  }

  function hideAutoplayNotice() {
    if (autoplayNotice) {
      autoplayNotice.classList.remove('visible');
    }
  }

  function renderPlaylist() {
    if (!playlistItemsContainer) return;

    playlistItemsContainer.innerHTML = '';
    const filteredTracks = PLAYLIST.filter(track => {
      if (currentFilter === 'all') return true;
      return track.category.includes(currentFilter);
    });

    filteredTracks.forEach(track => {
      const globalIndex = PLAYLIST.findIndex(t => t.id === track.id);
      const isCurrent = globalIndex === currentIndex;

      const item = document.createElement('div');
      item.className = `player-playlist-item ${isCurrent ? 'active' : ''}`;
      item.dataset.index = globalIndex;

      item.innerHTML = `
        <div class="playlist-item-art">
          <img src="${track.cover}" alt="${track.title}">
          <div class="playlist-item-play-icon">${isCurrent && isPlaying ? '⏸' : '▶'}</div>
        </div>
        <div class="playlist-item-info">
          <div class="playlist-item-title">${track.title}</div>
          <div class="playlist-item-artist">${track.artist}</div>
        </div>
        <div class="playlist-item-tag">${track.badge.split(' ')[0]}</div>
      `;

      item.addEventListener('click', () => {
        loadTrack(globalIndex, true);
      });

      playlistItemsContainer.appendChild(item);
    });
  }

  function updatePlaylistActiveItem() {
    if (!playlistItemsContainer) return;
    const items = playlistItemsContainer.querySelectorAll('.player-playlist-item');
    items.forEach(item => {
      const idx = parseInt(item.dataset.index, 10);
      const isCurrent = idx === currentIndex;
      item.classList.toggle('active', isCurrent);
      const icon = item.querySelector('.playlist-item-play-icon');
      if (icon) {
        icon.textContent = isCurrent && isPlaying ? '⏸' : '▶';
      }
    });
  }

  function setupEventListeners() {
    // Play/Pause button
    if (btnPlayPause) {
      btnPlayPause.addEventListener('click', togglePlayPause);
    }

    // Prev / Next
    if (btnPrev) btnPrev.addEventListener('click', prevTrack);
    if (btnNext) btnNext.addEventListener('click', nextTrack);

    // Shuffle
    if (btnShuffle) {
      btnShuffle.addEventListener('click', () => {
        isShuffle = !isShuffle;
        btnShuffle.classList.toggle('active', isShuffle);
      });
    }

    // Audio timeupdate
    audio.addEventListener('timeupdate', () => {
      if (!audio.duration) return;
      const progress = (audio.currentTime / audio.duration) * 100;
      if (progressSlider) progressSlider.value = progress;
      if (playerContainer) {
        playerContainer.style.setProperty('--player-progress', `${progress}%`);
      }
      if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
      if (durationTimeEl) durationTimeEl.textContent = formatTime(audio.duration);
    });

    // Audio loadedmetadata
    audio.addEventListener('loadedmetadata', () => {
      if (durationTimeEl) durationTimeEl.textContent = formatTime(audio.duration);
    });

    // Audio track ended -> auto next
    audio.addEventListener('ended', () => {
      nextTrack();
    });

    // Progress bar seeking
    if (progressSlider) {
      progressSlider.addEventListener('input', () => {
        if (!audio.duration) return;
        const seekTime = (progressSlider.value / 100) * audio.duration;
        audio.currentTime = seekTime;
      });
    }

    // Volume control
    if (volumeSlider) {
      volumeSlider.addEventListener('input', () => {
        audio.volume = parseFloat(volumeSlider.value);
        audio.muted = false;
        isMuted = false;
        updateVolumeIcon();
      });
    }

    if (btnMute) {
      btnMute.addEventListener('click', () => {
        isMuted = !isMuted;
        audio.muted = isMuted;
        updateVolumeIcon();
      });
    }

    function updateVolumeIcon() {
      if (!btnMute) return;
      if (isMuted || audio.volume === 0) {
        btnMute.textContent = '🔇';
      } else if (audio.volume < 0.5) {
        btnMute.textContent = '🔉';
      } else {
        btnMute.textContent = '🔊';
      }
    }

    // Minimize / Maximize Player
    if (btnMinimize && playerContainer && playerMiniLauncher) {
      btnMinimize.addEventListener('click', () => {
        playerContainer.classList.add('minimized');
        playerMiniLauncher.classList.add('visible');
      });

      playerMiniLauncher.addEventListener('click', () => {
        playerContainer.classList.remove('minimized');
        playerMiniLauncher.classList.remove('visible');
      });
    }

    // Toggle Playlist Drawer
    if (btnTogglePlaylist && playlistDrawer) {
      btnTogglePlaylist.addEventListener('click', () => {
        playlistDrawer.classList.toggle('open');
        btnTogglePlaylist.classList.toggle('active', playlistDrawer.classList.contains('open'));
      });
    }

    // Filter pills in playlist
    const filterPills = document.querySelectorAll('.player-filter-pill');
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentFilter = pill.dataset.filter || 'all';
        renderPlaylist();
      });
    });

    // Autoplay banner click
    if (autoplayNotice) {
      autoplayNotice.addEventListener('click', () => {
        playAudio();
      });
    }

    // Listen for any first user interaction on the whole page to trigger audio if autoplay was blocked
    const startAudioOnFirstGesture = () => {
      if (!isPlaying) {
        playAudio();
      }
      window.removeEventListener('click', startAudioOnFirstGesture);
      window.removeEventListener('touchstart', startAudioOnFirstGesture);
      window.removeEventListener('keydown', startAudioOnFirstGesture);
    };

    window.addEventListener('click', startAudioOnFirstGesture, { once: true });
    window.addEventListener('touchstart', startAudioOnFirstGesture, { once: true });

    // Link hero sound widget
    heroSoundWidget = document.getElementById('sound-widget');
    heroSoundSub = document.getElementById('sound-sub');
    heroEqBars = document.querySelectorAll('.sound-widget .eq-bar');

    if (heroSoundWidget) {
      heroSoundWidget.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlayPause();
      });
    }

    // Auto-minimize player when focusing on reservation form on mobile (mobile-player-controller)
    setupCheckoutErgonomics();
  }

  function setupCheckoutErgonomics() {
    const resForm = document.getElementById('reservation-form');
    if (!resForm) return;

    const inputs = resForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        if (window.innerWidth <= 768 && playerContainer && playerMiniLauncher) {
          if (!playerContainer.classList.contains('minimized')) {
            playerContainer.classList.add('minimized');
            playerMiniLauncher.classList.add('visible');
          }
        }
      });
    });
  }

  function init() {
    playerContainer = document.getElementById('quilombo-music-player');
    playerMiniLauncher = document.getElementById('player-mini-launcher');
    trackCover = document.getElementById('player-track-cover');
    trackTitle = document.getElementById('player-track-title');
    trackArtist = document.getElementById('player-track-artist');
    trackBadge = document.getElementById('player-track-badge');
    btnPlayPause = document.getElementById('player-btn-play');
    playIcon = document.getElementById('player-play-icon');
    btnPrev = document.getElementById('player-btn-prev');
    btnNext = document.getElementById('player-btn-next');
    btnShuffle = document.getElementById('player-btn-shuffle');
    btnMinimize = document.getElementById('player-btn-minimize');
    btnTogglePlaylist = document.getElementById('player-btn-playlist');
    playlistDrawer = document.getElementById('player-playlist-drawer');
    playlistItemsContainer = document.getElementById('player-playlist-items');
    progressSlider = document.getElementById('player-progress-bar');
    currentTimeEl = document.getElementById('player-current-time');
    durationTimeEl = document.getElementById('player-duration-time');
    volumeSlider = document.getElementById('player-volume-slider');
    btnMute = document.getElementById('player-btn-mute');
    autoplayNotice = document.getElementById('player-autoplay-prompt');

    setupEventListeners();
    renderPlaylist();

    // Load initial track (Milo J & Trueno - Gil) and attempt to autoplay right when page opens!
    loadTrack(0, true);
  }

  // Public API to pause when Instagram Reel or Video modal opens
  window.QuilomboPlayer = {
    pause: pauseAudio,
    play: playAudio,
    toggle: togglePlayPause,
    next: nextTrack,
    prev: prevTrack,
    loadTrack: loadTrack
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
