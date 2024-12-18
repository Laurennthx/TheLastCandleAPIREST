$(document).ready(function () {
    const chatBox = $('#chat-box');
    const messageInput = $('#message-input');
    const sendBtn = $('#send-btn');
    let lastTimestamp = 0; // Track the last fetched timestamp

    // Base URL dynamically derived from the current browser location
    const baseUrl = `${window.location.origin}/api/chat`;

    // Fetch messages from the server
    function fetchMessages() {
        $.get(baseUrl, { since: lastTimestamp }, function (data) {
            if (data.messages && data.messages.length > 0) {
                data.messages.forEach(msg => {
                    chatBox.append(`<div>${msg}</div>`);
                });
                chatBox.scrollTop(chatBox.prop('scrollHeight')); // Scroll to the bottom
                lastTimestamp = data.timestamp; // Update last timestamp
            }
        });
    }

    // Send a new message to the server
    function sendMessage() {
        const message = messageInput.val().trim();
        if (!message) return;

        $.post(baseUrl, { message: message }, function () {
            messageInput.val(''); // Clear the input
            fetchMessages(); // Fetch new messages
        });
    }

    // Event listeners
    sendBtn.on('click', sendMessage);
    messageInput.on('keypress', function (e) {
        if (e.key === 'Enter') sendMessage();
    });

    // Fetch messages initially and poll every 2 seconds
    fetchMessages();
    setInterval(fetchMessages, 2000);
});
