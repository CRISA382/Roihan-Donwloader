async function downloadVideo() {
    const url = document.getElementById('videoUrl').value.trim();
    const resultDiv = document.getElementById('result');
    const btn = document.getElementById('downloadBtn');

    if (!url) {
        resultDiv.innerHTML = '<div class="error-box">⚠️ Masukkan URL terlebih dahulu!</div>';
        return;
    }

    // Deteksi platform
    let endpoint = '';
    if (url.includes('tiktok.com')) endpoint = 'tiktok.php';
    else if (url.includes('instagram.com')) endpoint = 'instagram.php';
    else {
        resultDiv.innerHTML = '<div class="error-box">❌ Platform tidak didukung. Gunakan link TikTok atau Instagram.</div>';
        return;
    }

    // Loading state
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
    resultDiv.innerHTML = '<p class="loading">⏳ Sedang mengambil video...</p>';

    try {
        const response = await fetch(`${endpoint}?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (data.success) {
            resultDiv.innerHTML = `
                <div class="success-box">
                    <h3 style="color: #28a745; margin-bottom: 10px;">
                        <i class="fas fa-check-circle"></i> Berhasil!
                    </h3>
                    ${data.cover ? `<img class="thumb" src="${data.cover}" alt="Thumbnail">` : ''}
                    ${data.title ? `<p style="margin: 8px 0; font-size: 13px; color: #666;">${data.title.substring(0, 80)}...</p>` : ''}
                    <a href="${data.video_url}" target="_blank" download class="download-link">
                        <i class="fas fa-download"></i> Unduh Video
                    </a>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `<div class="error-box">❌ ${data.message || 'Gagal mengambil video.'}</div>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<div class="error-box">❌ Terjadi kesalahan: ${error.message}</div>`;
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-download"></i> Unduh Sekarang';
    }
}

// Enter key untuk submit
document.getElementById('videoUrl').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') downloadVideo();
});
