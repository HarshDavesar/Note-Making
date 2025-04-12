const btn = document.querySelector('#btn');
const notes = document.querySelector('#notes');

btn.addEventListener('click', (e) => {
    e.preventDefault();
    createNote("", getRandomHexColor());
});

function createNote(text, bgColor) {
    let newDiv = document.createElement("div");
    newDiv.classList.add("custom-class");
    notes.appendChild(newDiv);

    newDiv.innerHTML = `
        <div class="popupContainer">
            <textarea class="myTextarea" placeholder="Enter your text here...">${text}</textarea>
            <div class="button-container">
                <button class="save-btn"><i class="fa-regular fa-floppy-disk"></i></button>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `;

    const textarea = newDiv.querySelector('.myTextarea');
    const saveBtn = newDiv.querySelector('.save-btn');
    const deleteBtn = newDiv.querySelector('.delete-btn');

    newDiv.style.backgroundColor = bgColor;

    // Save button functionality
    saveBtn.addEventListener('click', () => {
        const noteData = {
            text: textarea.value,
            bgColor: bgColor
        };
    
        // Disable the save button to prevent multiple submissions
        saveBtn.disabled = true;
    
        fetch('/save-note', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteData)
        })
        .then(response => response.json())
        .then(data => {
            
             console.log('Note saved to server via save button:', data);
             saveBtn.innerHTML = '<i class="fa-solid fa-check"></i>';

        })
        .catch(error => {
            console.error('Error saving note:', error);
    
            saveBtn.disabled = false;
        });
    });

    // Delete button functionality
    deleteBtn.addEventListener('click', () => {
        const noteData = {
            text: textarea.value,
            bgColor: bgColor
        };

        fetch('/delete-note', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Note deleted from server:', data);
                notes.removeChild(newDiv);  // Remove the note from the UI
            } else {
                console.error('Error deleting note from server:', data);
            }
        })
        .catch(error => {
            console.error('Error deleting note:', error);
        });
    });
}

function getRandomHexColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}

// Load saved notes from the backend when page loads
window.addEventListener('DOMContentLoaded', () => {
    fetch('/notes')
        .then(res => res.json())
        .then(data => {
            data.forEach(note => {
                createNote(note.text, note.bgColor);
            });
        })
        .catch(error => {
            console.error('Error loading notes:', error);
        });
});
