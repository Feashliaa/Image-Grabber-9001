let imageURL;

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.image-container');

    container.addEventListener('click', async function () {
        console.log('Container was clicked');

        // get the url from local storage
        const url = localStorage.getItem('imageURL');

        console.log('Opening image URL:', url);

        // open the url in a new tab
        if (imageURL !== null && imageURL !== undefined) {
            window.open(imageURL, '_blank');
        } else {
            window.open(url, '_blank');
        }
    });

    document.querySelector('#generateImageButton').addEventListener('click', async function () {
        console.log('GenerateImageButton was clicked');

        try {
            console.log('Fetching random media...');
            const response = await fetch('/randomMeme', {
                method: 'GET', // Use GET method
            });
            const data = await response.json();
            if (data.success) {
                console.log('Random Media:', data.mediaUrl);

                // Check MIME type or file extension to determine if it's an image or video
                // webm, and mp4 are video types
                // jpg, jpeg, and png are image types
                const contentType = data.mediaUrl.includes('.mp4') || data.mediaUrl.includes('.webm') ? 'video' : 'image';

                console.log('Content Type:', contentType);

                console.log('Content URL:', data.currentURL);

                // save the URL to local storage
                localStorage.setItem('imageURL', data.currentURL);

                const randomImage = document.getElementById('randomImage');
                const randomVideo = document.getElementById('randomVideo');

                if (contentType === 'image') {
                    randomImage.src = data.mediaUrl;
                    randomImage.style.display = 'block';
                    randomVideo.style.display = 'none';
                } else if (contentType === 'video') {
                    randomVideo.src = data.mediaUrl;
                    randomVideo.style.display = 'block';
                    randomImage.style.display = 'none';
                }
            }
            else {
                console.error('Failed to fetch random media:', data.error);
                // try again
                document.querySelector('#generateImageButton').click();
            }
        } catch (error) {
            console.error('Error fetching random media:', error);
        }
    });
});

// once the dom is loaded, check if there is a cached image on the server
document.addEventListener('DOMContentLoaded', async () => {

    console.log('DOM is loaded');

    // wait like 1 second before checking for cached image
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // check if there is an image in the cache, send a request to set it to the .image-container
    try {
        const response = await fetch('/downloadImage', {
            method: 'GET', // Use GET method
        });

        if (!response.ok) {
            throw new Error('Failed to download image');
        }

        const blob = await response.blob();
        const type = blob.type;

        console.log('Blob Type:', type);
        console.log('Blob:', blob);

        // Check MIME type or file extension to determine if it's an image or video
        if (type.startsWith('image/')) {
            // It's an image
            const imageURL = URL.createObjectURL(blob);
            const randomImage = document.getElementById('randomImage');
            randomImage.src = imageURL;
            randomImage.style.display = 'block';
            randomVideo.style.display = 'none';
            console.log('Cached Image Set');
        } else if (type.startsWith('video/')) {
            // It's a video
            const videoURL = URL.createObjectURL(blob);
            const randomVideo = document.getElementById('randomVideo');
            randomVideo.src = videoURL;
            randomVideo.style.display = 'block';
            randomImage.style.display = 'none';
            console.log('Cached Video Set');
        } else {
            // Unknown type
            console.log('Unknown Blob Type:', type);
        }

        console.log('Cached Item Set');
    } catch (error) {
        console.error('Error downloading image:', error);
    }
});


document.querySelector('#downloadLink').addEventListener('mouseover', function (event) {
    event.stopPropagation();
});

document.querySelector('#downloadLink').addEventListener('click', async function (event) {
    event.preventDefault(); // Prevent default link behavior

    console.log('Download link was clicked');
    try {
        const response = await fetch('/downloadImage', {
            method: 'GET', // Use GET method
        });

        const confirmed = confirm('Are you sure you want to download this image?');
        if (!confirmed) {
            console.log('User cancelled download');
            return;
        }

        // check if the item is an image or video
        const blob = await response.blob();
        const type = blob.type;

        if (type.startsWith('image/')) {
            // response is an image, download it
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `image-${randomAppendNumber()}.jpg`;
            a.click();
        }
        else {
            // response is a video, download it
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `video-${randomAppendNumber()}.mp4`;
            a.click();
        }

    } catch (error) {
        console.error('Error downloading Image:', error);
        alert('Error downloading Image: ' + error.message);
    }
});

function randomAppendNumber() {
    return Math.floor(Math.random() * 1000);
}