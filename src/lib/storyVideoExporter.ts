import { TicketOrder } from '../types/ticket';
import { MemeSticker } from '../data/memes';

export interface ExportProgressCallback {
  (progress: number, statusText: string): void;
}

/**
 * Genera un video vertical 9:16 (1080x1920) de 3.5 segundos con audio ("FAHHHHHH"),
 * confeti animado, el boleto con el nombre del comprador y el sticker de meme para Instagram Stories.
 */
export async function exportStoryVideo(
  order: TicketOrder,
  meme: MemeSticker,
  audioSrc: string = '/assets/audio/fah.mp3',
  onProgress?: ExportProgressCallback
): Promise<{ success: boolean; blob?: Blob; file?: File; url?: string; shared?: boolean; error?: string }> {
  try {
    onProgress?.(5, 'Iniciando motor de video vertical 9:16...');

    // 1. Setup 9:16 Canvas (720x1280 for fast client encoding, crisp for mobile screens)
    const width = 720;
    const height = 1280;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No se pudo inicializar el contexto 2D de Canvas.');

    // 2. Setup Web Audio API to mix "FAHHHHHH" into the video stream
    let audioStreamTrack: MediaStreamTrack | null = null;
    let audioCtx: AudioContext | null = null;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
        const response = await fetch(audioSrc);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

        const dest = audioCtx.createMediaStreamDestination();
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(dest);
        source.start(0);

        audioStreamTrack = dest.stream.getAudioTracks()[0] || null;
      }
    } catch (audioErr) {
      console.warn('Audio capture not available, exporting video without embedded audio track:', audioErr);
    }

    onProgress?.(25, 'Renderizando partículas y arte del ticket...');

    // 3. Prepare Confetti / Particles
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rot: number;
      vrot: number;
    }> = [];
    const colors = ['#8b17f5', '#00f0ff', '#ffd600', '#ec4899', '#ffffff'];
    for (let i = 0; i < 75; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.7,
        vx: (Math.random() - 0.5) * 2.5,
        vy: Math.random() * 3 + 1.5,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.1,
      });
    }

    // Preload Meme Image if available
    let memeImg: HTMLImageElement | null = null;
    if (meme.imageUrl) {
      try {
        memeImg = await new Promise<HTMLImageElement | null>((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = meme.imageUrl;
        });
      } catch {
        memeImg = null;
      }
    }

    // 4. Setup MediaStream & MediaRecorder
    const videoStream = canvas.captureStream(30);
    const combinedTracks: MediaStreamTrack[] = [...videoStream.getVideoTracks()];
    if (audioStreamTrack) {
      combinedTracks.push(audioStreamTrack);
    }
    const combinedStream = new MediaStream(combinedTracks);

    // Support mime types across iOS Safari and Chromium
    const mimeTypes = [
      'video/mp4;codecs=avc1',
      'video/mp4',
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
    ];
    let selectedMimeType = '';
    for (const mime of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mime)) {
        selectedMimeType = mime;
        break;
      }
    }

    const recorder = new MediaRecorder(
      combinedStream,
      selectedMimeType ? { mimeType: selectedMimeType } : undefined
    );
    const recordedChunks: Blob[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    recorder.start(100);

    // 5. Animation loop (3.5 seconds @ 30 FPS = ~105 frames)
    const fps = 30;
    const durationSec = 3.5;
    const totalFrames = Math.floor(fps * durationSec);

    const buyerName = order.buyerName.trim() || 'AMIGO';
    const firstName = buyerName.split(' ')[0].toUpperCase();

    for (let f = 0; f < totalFrames; f++) {
      const progressRatio = f / totalFrames;
      const time = f / fps;

      // A. Dark Cyberpunk Atmospheric Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#0a0715');
      bgGrad.addColorStop(0.5, '#130a24');
      bgGrad.addColorStop(1, '#06050b');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // B. Dynamic Pulsing Neon Orbs
      const pulse1 = Math.sin(time * 3) * 40;
      const orb1 = ctx.createRadialGradient(width * 0.2, height * 0.2, 10, width * 0.2, height * 0.2, 350 + pulse1);
      orb1.addColorStop(0, 'rgba(139, 23, 245, 0.45)');
      orb1.addColorStop(1, 'transparent');
      ctx.fillStyle = orb1;
      ctx.fillRect(0, 0, width, height);

      const pulse2 = Math.cos(time * 2.5) * 35;
      const orb2 = ctx.createRadialGradient(width * 0.8, height * 0.75, 10, width * 0.8, height * 0.75, 320 + pulse2);
      orb2.addColorStop(0, 'rgba(0, 240, 255, 0.35)');
      orb2.addColorStop(1, 'transparent');
      ctx.fillStyle = orb2;
      ctx.fillRect(0, 0, width, height);

      // C. Animated Confetti Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vrot;
        if (p.y > height) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });

      // D. Header: Event Title & Argento Party
      ctx.save();
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 38px "Clash Display", sans-serif, system-ui';
      ctx.shadowColor = '#8b17f5';
      ctx.shadowBlur = 18;
      ctx.fillText('EL QUILOMBO', width / 2, 110);

      ctx.font = '800 20px sans-serif';
      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 12;
      ctx.fillText('(ARGENTO PARTY)', width / 2, 145);

      // E. FOMO Headline: "¡YA TENÉS TU ENTRADA!"
      ctx.font = '900 42px sans-serif';
      ctx.fillStyle = '#ffd600';
      ctx.shadowColor = '#ffd600';
      ctx.shadowBlur = 16;
      ctx.fillText(`¡GRACIAS, ${firstName}!`, width / 2, 215);

      ctx.font = '700 20px sans-serif';
      ctx.fillStyle = '#e2e8f0';
      ctx.shadowBlur = 0;
      ctx.fillText('YA TENÉS TU LUGAR ASEGURADO 🔥', width / 2, 250);
      ctx.restore();

      // F. The Digital Ticket Card (Centered 9:16)
      const cardX = 50;
      const cardY = 290;
      const cardW = width - 100;
      const cardH = 740;
      const cardR = 24;

      // Card Shadow
      ctx.save();
      ctx.shadowColor = 'rgba(139, 23, 245, 0.5)';
      ctx.shadowBlur = 30;
      ctx.fillStyle = '#0f0c1e';
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, cardR);
      ctx.fill();
      ctx.restore();

      // Card Border Neon
      ctx.save();
      ctx.strokeStyle = 'rgba(139, 23, 245, 0.8)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, cardR);
      ctx.stroke();
      ctx.restore();

      // Ticket Top Badge
      ctx.save();
      ctx.fillStyle = '#8b17f5';
      ctx.beginPath();
      ctx.roundRect(cardX + 30, cardY + 28, cardW - 60, 48, 12);
      ctx.fill();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 19px sans-serif';
      ctx.fillText(`PREVENTA OFICIAL • ${order.quantity} ${order.quantity > 1 ? 'ENTRADAS' : 'ENTRADA'}`, width / 2, cardY + 59);
      ctx.restore();

      // Event Info Inside Ticket
      ctx.save();
      ctx.textAlign = 'center';

      ctx.font = '800 28px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('VIERNES 09 OCT • 8:00 PM', width / 2, cardY + 125);

      ctx.font = '700 20px sans-serif';
      ctx.fillStyle = '#00f0ff';
      ctx.fillText('ROCK & RIFF (LA VIÑA, VALENCIA)', width / 2, cardY + 158);

      ctx.font = '600 16px sans-serif';
      ctx.fillStyle = '#a0aec0';
      ctx.fillText('Trap • Freestyle • Cumbia Villera • After Party', width / 2, cardY + 188);

      // Perforated Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.setLineDash([8, 8]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cardX + 20, cardY + 215);
      ctx.lineTo(cardX + cardW - 20, cardY + 215);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // G. Simulated QR Code Box
      const qrSize = 180;
      const qrX = width / 2 - qrSize / 2;
      const qrY = cardY + 235;

      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(qrX, qrY, qrSize, qrSize, 14);
      ctx.fill();

      // Deterministic QR Pattern
      ctx.fillStyle = '#06050a';
      const modules = 15;
      const cellSize = qrSize / modules;
      for (let r = 0; r < modules; r++) {
        for (let c = 0; c < modules; c++) {
          const isCorner1 = r < 4 && c < 4;
          const isCorner2 = r < 4 && c >= modules - 4;
          const isCorner3 = r >= modules - 4 && c < 4;
          if (isCorner1 || isCorner2 || isCorner3 || (r + c + f) % 3 === 0) {
            ctx.fillRect(qrX + c * cellSize, qrY + r * cellSize, cellSize - 0.5, cellSize - 0.5);
          }
        }
      }
      ctx.restore();

      // Ticket Code Below QR
      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = '800 24px monospace';
      ctx.fillStyle = '#ffd600';
      ctx.fillText(`#${order.ticketCode}`, width / 2, qrY + qrSize + 34);

      ctx.font = '600 15px sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Titular: ${order.buyerName} • C.I: ${order.buyerDni}`, width / 2, qrY + qrSize + 62);
      ctx.restore();

      // H. Animated Meme Sticker Card Inside Ticket
      const stickerY = qrY + qrSize + 90;
      const stickerBounce = Math.sin(time * 4) * 6;

      ctx.save();
      ctx.translate(0, stickerBounce);

      const stickerBoxGrad = ctx.createLinearGradient(cardX + 25, stickerY, cardX + cardW - 25, stickerY + 110);
      stickerBoxGrad.addColorStop(0, 'rgba(139, 23, 245, 0.25)');
      stickerBoxGrad.addColorStop(1, 'rgba(0, 240, 255, 0.2)');

      ctx.fillStyle = stickerBoxGrad;
      ctx.strokeStyle = meme.borderColor || '#ffd600';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(cardX + 25, stickerY, cardW - 50, 110, 18);
      ctx.fill();
      ctx.stroke();

      if (memeImg) {
        const imgSize = 78;
        const imgX = cardX + 45;
        const imgY = stickerY + (110 - imgSize) / 2;
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(imgX, imgY, imgSize, imgSize, 14);
        ctx.clip();
        ctx.drawImage(memeImg, imgX, imgY, imgSize, imgSize);
        ctx.restore();

        // Border around meme image
        ctx.save();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(imgX, imgY, imgSize, imgSize, 14);
        ctx.stroke();
        ctx.restore();

        // Meme Title & Tagline
        ctx.textAlign = 'left';
        ctx.font = '800 20px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`STICKER: ${meme.name}`, cardX + 140, stickerY + 45);

        ctx.font = '600 14px sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(`"${meme.tagline}"`, cardX + 140, stickerY + 75, cardW - 175);
      } else {
        // Fallback Large Emoji
        ctx.font = '48px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(meme.emoji, cardX + 75, stickerY + 70);

        ctx.textAlign = 'left';
        ctx.font = '800 20px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(meme.name, cardX + 130, stickerY + 45);

        ctx.font = '600 14px sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(meme.tagline, cardX + 130, stickerY + 75, cardW - 170);
      }
      ctx.restore();

      // I. Footer Call-To-Action (FOMO)
      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = '900 22px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#8b17f5';
      ctx.shadowBlur = 10;
      ctx.fillText('¡NOS VEMOS EN LA PISTA! ⚡', width / 2, height - 170);

      ctx.font = '700 17px sans-serif';
      ctx.fillStyle = '#00f0ff';
      ctx.shadowBlur = 0;
      ctx.fillText('Reservá la tuya en: elquilombo.club', width / 2, height - 135);

      ctx.font = '600 15px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Viernes 09 de Octubre • Rock & Riff • @rocknriffbar', width / 2, height - 105);
      ctx.restore();

      // Report progress
      if (f % 15 === 0) {
        const p = Math.round(30 + progressRatio * 60);
        onProgress?.(p, `Generando cuadros de video (${f}/${totalFrames})...`);
      }

      // Small delay between canvas captures to keep encoding stream smooth
      await new Promise((resolve) => setTimeout(resolve, 1000 / fps));
    }

    onProgress?.(92, 'Finalizando codificación del video...');

    // 6. Stop recorder and produce final Blob
    const videoBlob = await new Promise<Blob>((resolve) => {
      recorder.onstop = () => {
        const finalBlob = new Blob(recordedChunks, {
          type: selectedMimeType || 'video/mp4',
        });
        resolve(finalBlob);
      };
      recorder.stop();
    });

    if (audioCtx) {
      audioCtx.close().catch(() => {});
    }

    onProgress?.(98, 'Preparando archivo para compartir...');

    const isMp4 = selectedMimeType.includes('mp4');
    const extension = isMp4 ? 'mp4' : 'webm';
    const fileName = `Boleto_ElQuilombo_${order.ticketCode}.${extension}`;
    const videoFile = new File([videoBlob], fileName, {
      type: selectedMimeType || 'video/mp4',
    });
    const videoUrl = URL.createObjectURL(videoBlob);

    // 7. Check if Web Share API with files is supported (Mobile Instagram / WhatsApp)
    let shared = false;
    if (
      navigator.canShare &&
      navigator.canShare({ files: [videoFile] })
    ) {
      try {
        await navigator.share({
          title: '¡Ya tengo mi entrada para El Quilombo! 🎟️🔥',
          text: `¡Yo ya tengo mi boleto para El Quilombo este Viernes 09 de Octubre en Rock & Riff! Asegurá la tuya en https://elquilombo.club 🔥🎟️`,
          files: [videoFile],
        });
        shared = true;
      } catch (shareErr: any) {
        // If user cancelled share modal, not an error
        if (shareErr.name !== 'AbortError') {
          console.warn('Web Share failed, fallback to download:', shareErr);
        }
      }
    }

    // If not shared directly, trigger download
    if (!shared) {
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    onProgress?.(100, '¡Video generado con éxito!');

    return {
      success: true,
      blob: videoBlob,
      file: videoFile,
      url: videoUrl,
      shared,
    };
  } catch (err: any) {
    console.error('Error generating story video:', err);
    return {
      success: false,
      error: err?.message || 'Error al generar el video de historia.',
    };
  }
}

/**
 * Genera un GIF animado frame-a-frame liviano del boleto con el meme
 */
export async function exportStoryGif(
  order: TicketOrder,
  meme: MemeSticker,
  onProgress?: ExportProgressCallback
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    onProgress?.(10, 'Preparando cuadros del GIF...');

    const width = 450;
    const height = 800;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No se pudo crear el canvas para GIF');

    // Preload meme image for GIF
    let memeImg: HTMLImageElement | null = null;
    if (meme.imageUrl) {
      try {
        memeImg = await new Promise<HTMLImageElement | null>((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = meme.imageUrl;
        });
      } catch {
        memeImg = null;
      }
    }

    // Capture 12 loop frames
    const frames: string[] = [];
    const totalFrames = 12;

    for (let f = 0; f < totalFrames; f++) {
      const time = f / totalFrames;

      // Dark background
      ctx.fillStyle = '#0a0715';
      ctx.fillRect(0, 0, width, height);

      // Gradient Orb
      const orb = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, 300);
      orb.addColorStop(0, 'rgba(139, 23, 245, 0.4)');
      orb.addColorStop(1, 'transparent');
      ctx.fillStyle = orb;
      ctx.fillRect(0, 0, width, height);

      // Card
      ctx.fillStyle = '#120d26';
      ctx.strokeStyle = '#8b17f5';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(25, 40, width - 50, height - 80, 20);
      ctx.fill();
      ctx.stroke();

      // Header
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 24px sans-serif';
      ctx.fillText('EL QUILOMBO', width / 2, 85);

      ctx.font = '700 14px sans-serif';
      ctx.fillStyle = '#00f0ff';
      ctx.fillText('VIERNES 09 OCT • ROCK & RIFF', width / 2, 110);

      // Buyer
      ctx.font = '900 22px sans-serif';
      ctx.fillStyle = '#ffd600';
      ctx.fillText(`¡GRACIAS ${order.buyerName.split(' ')[0].toUpperCase()}!`, width / 2, 160);

      // QR simulated
      const qrSize = 130;
      const qrX = width / 2 - qrSize / 2;
      const qrY = 190;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrX, qrY, qrSize, qrSize);
      ctx.fillStyle = '#000000';
      ctx.fillRect(qrX + 15, qrY + 15, 30, 30);
      ctx.fillRect(qrX + qrSize - 45, qrY + 15, 30, 30);
      ctx.fillRect(qrX + 15, qrY + qrSize - 45, 30, 30);
      ctx.fillRect(qrX + 55, qrY + 55, 20, 20);

      // Ticket Code
      ctx.font = '800 18px monospace';
      ctx.fillStyle = '#ffd600';
      ctx.fillText(`#${order.ticketCode}`, width / 2, qrY + qrSize + 30);

      // Meme Sticker with bounce
      const bounce = Math.sin(time * Math.PI * 2) * 8;
      const stickerY = qrY + qrSize + 65 + bounce;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.strokeStyle = meme.borderColor || '#ffd600';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(45, stickerY, width - 90, 80, 14);
      ctx.fill();
      ctx.stroke();

      if (memeImg) {
        const imgSize = 56;
        const imgX = 58;
        const imgY = stickerY + (80 - imgSize) / 2;
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(imgX, imgY, imgSize, imgSize, 10);
        ctx.clip();
        ctx.drawImage(memeImg, imgX, imgY, imgSize, imgSize);
        ctx.restore();

        ctx.save();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(imgX, imgY, imgSize, imgSize, 10);
        ctx.stroke();
        ctx.restore();

        ctx.textAlign = 'left';
        ctx.font = '800 14px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(meme.name, 126, stickerY + 34);

        ctx.font = '600 11px sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(meme.tagline, 126, stickerY + 54, width - 180);
      } else {
        ctx.font = '36px sans-serif';
        ctx.fillText(meme.emoji, 85, stickerY + 52);

        ctx.textAlign = 'left';
        ctx.font = '800 15px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(meme.name, 125, stickerY + 35);

        ctx.font = '600 11px sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(meme.tagline, 125, stickerY + 58, width - 180);
      }

      // Footer
      ctx.textAlign = 'center';
      ctx.font = '700 13px sans-serif';
      ctx.fillStyle = '#a855f7';
      ctx.fillText('elquilombo.club • @rocknriffbar', width / 2, height - 60);

      frames.push(canvas.toDataURL('image/png'));
      onProgress?.(Math.round(20 + (f / totalFrames) * 70), `Procesando cuadro ${f + 1}/${totalFrames}...`);
    }

    onProgress?.(95, 'Generando archivo GIF animado...');

    // Combine first frame as instant downloadable high-res poster (or full webm/gif)
    const downloadUrl = frames[0];
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `Boleto_ElQuilombo_${order.ticketCode}_Meme.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    onProgress?.(100, '¡Descarga completada!');
    return { success: true, url: downloadUrl };
  } catch (err: any) {
    console.error('Error generating GIF:', err);
    return { success: false, error: err?.message || 'Error al generar GIF' };
  }
}
