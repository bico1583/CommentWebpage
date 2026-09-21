function renderCommentForm() {
    const formSection = document.getElementById("comment-form-section");
    const currentUser = getCurrentUser();

    if (!currentUser) {
        formSection.innerHTML = "";
        return;
    }

    formSection.innerHTML = `
        <form id="comment-form">
            <textarea
                id="comment-input"
                placeholder="Write a comment..."
                required
            ></textarea>

            <p id="moderation-message" class="moderation-message"></p>

            <button
                type="submit"
                class="add-comment-button"
            >
                Add Comment
            </button>
        </form>
    `;

    const form = document.getElementById("comment-form");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        addComment(null);
    });
}


function addComment(parentId) {
    const input = parentId === null
        ? document.getElementById("comment-input")
        : document.getElementById(`reply-input-${parentId}`);

    const text = input.value.trim();

    if (!text) {
        return;
    }

    const currentUser = getCurrentUser();

    if (!currentUser) {
        return;
    }

    const worker = new Worker("workers/moderator.js");

    worker.postMessage({
        text: text
    });

    worker.onmessage = function (event) {
        const result = event.data;

        if (!result.allowed) {
            showModerationMessage(parentId, result.word);
            worker.terminate();
            return;
        }

        const comments = getComments();

        const comment = {
            id: generateId(),
            parentId: parentId,
            username: currentUser,
            text: text,
            timestamp: new Date().toISOString()
        };

        comments.push(comment);

        saveComments(comments);

        worker.terminate();

        renderComments();
    };
}


function showModerationMessage(parentId, word) {
    const message = parentId === null
        ? document.getElementById("moderation-message")
        : document.getElementById(
            `reply-moderation-message-${parentId}`
        );

    if (message) {
        message.textContent =
            `You cannot use the word "${word}" in your comment.`;
    }
}


function renderComments() {
    const commentsSection = document.getElementById("comments-section");
    const comments = getComments();

    commentsSection.innerHTML = `
        <h2>Comments</h2>
        <div id="comments-container"></div>
    `;

    const container = document.getElementById("comments-container");

    const rootComments = comments.filter(function (comment) {
        return comment.parentId === null;
    });

    rootComments.forEach(function (comment) {
        container.appendChild(
            createCommentElement(comment, comments)
        );
    });
}


function createCommentElement(comment, comments) {
    const commentElement = document.createElement("div");

    commentElement.className = "comment";

    const author = document.createElement("div");

    author.textContent = comment.username;

    const text = document.createElement("div");

    text.textContent = comment.text;

    const timestamp = document.createElement("div");

    timestamp.textContent = formatTimestamp(comment.timestamp);

    commentElement.appendChild(author);
    commentElement.appendChild(text);
    commentElement.appendChild(timestamp);

    const currentUser = getCurrentUser();

    if (currentUser) {
        const replyButton = document.createElement("button");

        replyButton.type = "button";
        replyButton.className = "reply-button";
        replyButton.textContent = "Reply";

        replyButton.addEventListener("click", function () {
            showReplyForm(comment.id);
        });

        commentElement.appendChild(replyButton);
    }

    const replyFormContainer = document.createElement("div");

    replyFormContainer.id = `reply-form-${comment.id}`;

    commentElement.appendChild(replyFormContainer);

    const replies = comments.filter(function (child) {
        return child.parentId === comment.id;
    });

    if (replies.length > 0) {
        const repliesContainer = document.createElement("div");

        repliesContainer.className = "comment-replies";

        replies.forEach(function (reply) {
            repliesContainer.appendChild(
                createCommentElement(reply, comments)
            );
        });

        commentElement.appendChild(repliesContainer);
    }

    return commentElement;
}


function showReplyForm(commentId) {
    const container = document.getElementById(
        `reply-form-${commentId}`
    );

    if (!container || container.innerHTML !== "") {
        return;
    }

    container.innerHTML = `
        <form class="reply-form">
            <textarea
                id="reply-input-${commentId}"
                placeholder="Write a reply..."
                required
            ></textarea>

            <p
                id="reply-moderation-message-${commentId}"
                class="moderation-message"
            ></p>

            <button
                type="submit"
                class="add-comment-button"
            >
                Add Comment
            </button>
        </form>
    `;

    const form = container.querySelector(".reply-form");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        addComment(commentId);
    });
}


function formatTimestamp(timestamp) {
    return new Date(timestamp).toLocaleString();
}


function generateId() {
    return Date.now().toString() +
        Math.random().toString(36).substring(2);
}