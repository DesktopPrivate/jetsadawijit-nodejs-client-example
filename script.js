document.addEventListener('DOMContentLoaded', () => {
    const folderForm = document.getElementById('folderForm');
    const messageElement = document.getElementById('message');

    folderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const folderName = document.getElementById('folderName').value.trim();

        try {
            const response = await fetch('/createFolder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ folderName })
            });

            const result = await response.text();
            messageElement.textContent = result;
        } catch (error) {
            console.error('Error:', error);
            messageElement.textContent = 'An error occurred.';
        }
    });
});
