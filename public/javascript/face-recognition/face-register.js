document.addEventListener("DOMContentLoaded", async function () {

    let faceRecognitionSeviceDomain = ""
    try {

        const response = await fetch('/api/face-service-domain');
        const responseObject = await response.json();
        faceRecognitionSeviceDomain = responseObject.faceServiceDomain;

    } catch (error) {
        console.error(error);
    }

    console.log(faceRecognitionSeviceDomain);
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

    // const socket = new WebSocket(`ws://localhost:8000/ws/register-face`);
    const socket = new WebSocket(`wss://${faceRecognitionSeviceDomain}/ws/register-face`);

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
        const sendFrame = () => {
            if (video.paused || video.ended) return;

            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const frameData = canvas.toDataURL('image/jpeg'); // Convert to base64

            // Check if the WebSocket is open before sending
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ image: frameData })); // Send as JSON
            } else {
                console.warn("WebSocket is not open. Current state: " + socket.readyState);
            }

            requestAnimationFrame(sendFrame); // Continue sending frames
        };
        sendFrame();
    });

    socket.onmessage = function (event) {
        const response = JSON.parse(event.data);
        if (response.success) {
            console.log(response.message);
            // Display success message and the ID of the saved face
            messageDiv.textContent = `Face saved successfully! ID: ${response.face_id}`; // Display success message with ID

            // Close the WebSocket after saving the face
            if (response.message === "Face detected and saved") {
                socket.close(); // Close the WebSocket connection
                messageDiv.textContent += " WebSocket connection closed."; // Optional: Notify user

                // Alert the user after successfully saving the image
                alert(`Face saved successfully! ID: ${response.face_id}`);

            }
        } else {
            console.warn(response.message);
            messageDiv.textContent = response.message; // Display warning message
        }
    };

    socket.onclose = function (event) {
        console.log("WebSocket connection closed.");
        // Stop the video stream
        const stream = video.srcObject;
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop()); // Stop each track
            video.srcObject = null; // Clear the video source
        }

        // Display the reason for closure
        let reasonMessage = "WebSocket connection closed.";
        if (event.code) {
            reasonMessage += ` Reason: ${event.code}`; // Display the close code
        }
        if (event.reason) {
            reasonMessage += ` Reason message: ${event.reason}`; // Display the reason message if available
        }
        alert(reasonMessage); // Alert the user with the reason

        // Update connection status
        connectionStatusDiv.textContent = "WebSocket Status: Disconnected"; // Update status on close
        connectionStatusDiv.style.backgroundColor = "#f8d7da"; // Light red background for disconnected status
    };
});
