
function getYouTubeEmbedUrl(url) {
    try {
        // Handle already embed format
        if (url.includes('/embed/')) {
            return url;
        }

        const urlObj = new URL(url);
        let videoId = '';

        // Handle youtu.be
        if (urlObj.hostname === 'youtu.be') {
            videoId = urlObj.pathname.slice(1);
        }
        // Handle youtube.com
        else if (urlObj.hostname.includes('youtube.com')) {
            if (urlObj.pathname === '/watch') {
                videoId = urlObj.searchParams.get('v');
            } else if (urlObj.pathname.startsWith('/embed/')) {
                videoId = urlObj.pathname.split('/')[2];
            }
        }

        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }

        // Fallback for playlist or other formats if needed
        if (url.includes('playlist?list=')) {
            const playlistId = url.split('playlist?list=')[1].split('&')[0];
            return `https://www.youtube.com/embed/videoseries?list=${playlistId}`;
        }

        return url;
    } catch (error) {
        console.error('Error parsing YouTube URL:', error);
        return url;
    }
}

const testCases = [
    'https://www.youtube.com/watch?v=pQN-pnXPaVg',
    'https://www.youtube.com/playlist?list=PLlasXeu85E9cQ32gLCvAvr9vNaUccPVNP',
    'https://www.youtube.com/playlist?list=PL4cUxeGkcC9gTg2g8e1n9E0ROlmGAc3n6',
    'https://www.youtube.com/watch?feature=shared&v=dQw4w9WgXcQ'
];

testCases.forEach(url => {
    console.log(`Input: ${url}`);
    console.log(`Output: ${getYouTubeEmbedUrl(url)}`);
    console.log('---');
});
