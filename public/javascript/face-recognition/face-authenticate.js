document.addEventListener("DOMContentLoaded", async function () {

    let faceRecognitionSeviceDomain = ""
    let savedFaceFilename = ""
    try {

        const response = await fetch('/api/face-service-domain');
        const responseObject = await response.json();
        faceRecognitionSeviceDomain = responseObject.faceServiceDomain;

    } catch (error) {
        console.error(error);
    }

    try {

        const response = await fetch('/api/save-face-filename');
        const responseObject = await response.json();

        if (response.ok) {
            savedFaceFilename = responseObject.filename;
        }
    } catch (error) {
        console.error(error);
    }

    console.log(savedFaceFilename);
    console.log(faceRecognitionSeviceDomain);

    const video = document.getElementById('video');
    const messageDiv = document.getElementById('message'); // Get the message display area
    const connectionStatusDiv = document.getElementById('connection-status'); // Get the connection status display area

    navigator.mediaDevices.getUserMedia({
        video: true
    })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => {
            console.error("Error accessing camera: ", err);
            messageDiv.textContent = "Error accessing camera: " + err.message; // Display error message
        });

    const socket = new WebSocket(`ws://localhost:8000/ws/authenticate-face`);
    // const socket = new WebSocket(`wss://${faceRecognitionSeviceDomain}/ws/authenticate-face`);

    // Update connection status
    socket.onopen = function () {
        connectionStatusDiv.textContent = "WebSocket Status: Connected"; // Update status on successful connection
        connectionStatusDiv.style.backgroundColor = "#d4edda"; // Light green background for connected status
    };

    socket.onerror = function (error) {
        console.error("WebSocket error: ", error);
        connectionStatusDiv.textContent = "WebSocket Error: " + error.message; // Display error message
        connectionStatusDiv.style.backgroundColor = "#f8d7da"; // Light red background for error
    };

    video.addEventListener('play', function () {
        let frameCount = 0; // Counter for frames
        const sendFrame = () => {
            if (video.paused || video.ended) return;

            frameCount++; // Increment frame counter

            if (frameCount < 10) { // Only send every 10th frame
                requestAnimationFrame(sendFrame);
                return;
            }

            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const frameData = canvas.toDataURL('image/jpeg'); // Convert to base64

            // Check if the WebSocket is open before sending
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ image: frameData, filename: savedFaceFilename })); // Send as JSON
            } else {
                console.warn("WebSocket is not open. Current state: " + socket.readyState);
            }

            frameCount = 0; // Reset frame counter after sending
            requestAnimationFrame(sendFrame); // Continue sending frames
        };
        sendFrame();
    });

    socket.onmessage = async function (event) {
        try {

            const response = JSON.parse(event.data);
            if (response.success) {


                messageDiv.textContent = `Face saved successfully! ID: ${response.face_id}`; // Display success message with ID

                // if (response.message === "Face detected and saved") {
                socket.close();
                messageDiv.textContent += " WebSocket connection closed.";

                Swal.fire({
                    title: 'Success!',
                    text: response.message,
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {

                    window.location.href = '/election';
                });

            } else {
                console.warn(response.message);
                messageDiv.textContent = response.message;
            }

        } catch (error) {
            Swal.fire({
                title: 'Failed!',
                text: `Error on registration`,
                icon: 'error',
                confirmButtonText: 'OK'
            }).then(() => {

                window.location.href = '/election';
            });
        }
    };

    socket.onclose = async function (event) {
        console.log("WebSocket connection closed.");
        // Stop the video stream
        const stream = video.srcObject;
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            video.srcObject = null;
        }

        // Display the reason for closure
        let reasonMessage = "WebSocket connection closed.";
        if (event.code) {
            reasonMessage += ` Reason: ${event.code}`;
        }
        if (event.reason) {
            reasonMessage += ` Reason message: ${event.reason}`;
        }

        Swal.fire({
            title: 'Connection Closed',
            text: reasonMessage,
            icon: 'info',
            confirmButtonText: 'OK'
        }).then(() => {

            window.location.href = '/election';
        });

        // Update connection status
        connectionStatusDiv.textContent = "WebSocket Status: Disconnected"; // Update status on close
        connectionStatusDiv.style.backgroundColor = "#f8d7da"; // Light red background for disconnected status
    };
});
