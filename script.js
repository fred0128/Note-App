document.addEventListener('DOMContentLoaded', function () {
    const addNoteBtn = document.getElementById('add-note-btn');
    const noteModal = document.getElementById('note-modal');
    const userInfoModal = document.getElementById('user-info-modal');
    const closeNoteModalBtn = document.querySelector('#note-modal .close-btn');
    const closeUserInfoModalBtn = document.querySelector('#user-info-modal .close-btn');
    const saveNoteBtn = document.getElementById('save-note-btn');
    const saveUserInfoBtn = document.getElementById('save-user-info-btn');
    const notesContainer = document.getElementById('notes');
    const tagsContainer = document.querySelector('.tags');
    const usernameSpan = document.getElementById('username');

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
        userInfoModal.style.display = 'block';
    } else {
        usernameSpan.textContent = userInfo.name;
    }

    saveUserInfoBtn.addEventListener('click', function () {
        const name = document.getElementById('user-name').value;
        const email = document.getElementById('user-email').value;
        const age = document.getElementById('user-age').value;

        if (name && email && age) {
            const userInfo = { name, email, age };
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            userInfoModal.style.display = 'none';
            usernameSpan.textContent = name;
        }
    });

    addNoteBtn.addEventListener('click', function () {
        noteModal.style.display = 'block';
    });

    closeNoteModalBtn.addEventListener('click', function () {
        noteModal.style.display = 'none';
    });

    closeUserInfoModalBtn.addEventListener('click', function () {
        userInfoModal.style.display = 'none';
    });

    window.onclick = function (event) {
        if (event.target == noteModal) {
            noteModal.style.display = 'none';
        } else if (event.target == userInfoModal) {
            userInfoModal.style.display = 'none';
        }
    };

    saveNoteBtn.addEventListener('click', function () {
        const title = document.getElementById('note-title').value;
        const content = document.getElementById('note-content').value;
        let tags = document.getElementById('note-tags').value;

        if (title && content) {
            tags = tags.split(',').map(tag => tag.trim().replace(/^#/, ''));

            const note = {
                id: Date.now(),
                title,
                content,
                tags
            };

            saveNoteToLocalStorage(note);
            noteModal.style.display = 'none';
            clearModalFields();
            displayNotes();
            displayTags();
        }
    });

    function clearModalFields() {
        document.getElementById('note-title').value = '';
        document.getElementById('note-content').value = '';
        document.getElementById('note-tags').value = '';
    }

    function saveNoteToLocalStorage(note) {
        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes.push(note);
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    function getNotesFromLocalStorage() {
        return JSON.parse(localStorage.getItem('notes')) || [];
    }

    function displayNotes() {
        const notes = getNotesFromLocalStorage();
        notesContainer.innerHTML = '';
        const noteCountElement = document.getElementById('note-count');
        const pinnedNotesContainer = document.getElementById('pinned-notes');

        const noteCount = notes.length;
        noteCountElement.innerText = `/${noteCount}`;

        notes.forEach((note, index) => {
            const tags = Array.isArray(note.tags) ? note.tags.join(', ') : '';
            const noteElement = document.createElement('div');
            noteElement.classList.add('note');
            noteElement.innerHTML = `
            <div class="note-container">
                <div class="note-l">
                    <p class="note-number">0${index + 1}/</p>
                </div>

                <div class="note-main">
                    <div class="note-header">
                        <h2 class="note-title">${note.title}</h2>
                    </div>
                    <p class="note-content">${note.content}</p>
                </div>
                <div class="note-r">
                    <i class="fa-thin fa-arrow-up-right"></i>
                </div>
            </div>`;
            notesContainer.appendChild(noteElement);
        });
    }

    displayNotes();

    window.deleteNote = function (noteId) {
        let notes = getNotesFromLocalStorage();
        notes = notes.filter(note => note.id !== noteId);
        localStorage.setItem('notes', JSON.stringify(notes));
        displayNotes();
    };

    function displayTags() {
        const notes = getNotesFromLocalStorage();
        const tags = notes.flatMap(note => note.tags);
        const uniqueTags = Array.from(new Set(tags));

        tagsContainer.innerHTML = '';
        uniqueTags.forEach(tag => {
            const tagButton = document.createElement('button');
            tagButton.classList.add('tag');
            tagButton.innerText = `#${tag}`;
            tagButton.onclick = function () {
                filterNotes(tag);
            };
            tagsContainer.appendChild(tagButton);
        });
    }

    window.filterNotes = function (tag) {
        const notes = getNotesFromLocalStorage();
        const filteredNotes = notes.filter(note => note.tags.includes(tag));
        notesContainer.innerHTML = '';

        filteredNotes.forEach((note, index) => {
            const tags = Array.isArray(note.tags) ? note.tags.join(', ') : '';
            const noteElement = document.createElement('div');
            noteElement.classList.add('note');
            noteElement.innerHTML = `
            <div class="note-container">
                <div class="note-l">
                    <p class="note-number">0${index + 1}/</p>
                </div>

                <div class="note-main">
                    <div class="note-header">
                        <h2 class="note-title">${note.title}</h2>
                    </div>
                    <p class="note-content">${note.content}</p>
                </div>
                <div class="note-r">
                    <i class="fa-sharp fa-regular fa-star" id="star"></i>
                    <button class="delete-btn" onclick="deleteNote(${note.id})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
            <div class="note-tags">
                ${tags.split(',').map(tag => `<span class="note-tag">${tag}</span>`).join('')}
            </div>`;
            notesContainer.appendChild(noteElement);
        });
    };

    displayTags();
});