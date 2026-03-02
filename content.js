// ==========================
// Pagination Detection
// ==========================

function getPageNumber() {
    let url = window.location.href;

    // Pattern: /page/10/
    let match1 = url.match(/\/page\/(\d+)\//);
    if (match1) return parseInt(match1[1]);

    // Pattern: ?page=10 or &page=10
    let match2 = url.match(/[?&]page=(\d+)/);
    if (match2) return parseInt(match2[1]);

    return null;
}

// ==========================
// Navigation Logic
// ==========================

function changePage(step) {
    let current = getPageNumber();
    if (!current) return;

    let newPage = current + step;
    if (newPage < 1) return;

    jumpToPage(newPage);
}

function jumpToPage(pageNumber) {
    let url = window.location.href;

    if (/\/page\/\d+\//.test(url)) {
        window.location.href =
            url.replace(/\/page\/\d+\//, `/page/${pageNumber}/`);
        return;
    }

    if (/[?&]page=\d+/.test(url)) {
        window.location.href =
            url.replace(/([?&]page=)\d+/, `$1${pageNumber}`);
        return;
    }
}

// ==========================
// Badge Update
// ==========================

function updateBadge() {
    let page = getPageNumber();

    chrome.runtime.sendMessage({
        pageNumber: page ? page.toString() : ""
    });
}

updateBadge();

// ==========================
// Jump Overlay
// ==========================
function toggleJumpOverlay() {

    let existing = document.getElementById("page-jumper-overlay");

    if (existing) {
        existing.remove();
        return;
    }

    let overlay = document.createElement("div");
    overlay.id = "page-jumper-overlay";

    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.5)";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "999999";

    let input = document.createElement("input");
    input.type = "number";
    input.placeholder = "Enter page number";
    input.style.padding = "10px 15px";
    input.style.fontSize = "18px";
    input.style.borderRadius = "8px";
    input.style.border = "none";
    input.style.outline = "none";
    input.style.width = "200px";
    input.style.textAlign = "center";

    overlay.appendChild(input);
    document.body.appendChild(overlay);

    input.focus();

    input.addEventListener("keydown", function (e) {

        if (e.key === "Enter") {
            let value = parseInt(input.value);
            if (value && value > 0) {
                jumpToPage(value);
            }
        }

        if (e.key === "Escape") {
            overlay.remove();
        }
    });
}


// document.addEventListener("keydown", function (e) {

//     // Prevent triggering inside inputs
//     if (
//         e.target.tagName === "INPUT" ||
//         e.target.tagName === "TEXTAREA" ||
//         e.target.isContentEditable
//     ) return;

//     if (e.code === "Period") changePage(1);
//     if (e.code === "Comma") changePage(-1);
//     if (e.key === "?")  e.preventDefault();toggleJumpOverlay();
// });
document.addEventListener("keydown", function (e) {

    // Always allow ? to toggle
    if (e.key === "?") {
        e.preventDefault();
        toggleJumpOverlay();
        return;
    }

    // Block other keys inside inputs
    if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.isContentEditable
    ) return;

    if (e.code === "Period") changePage(1);
    if (e.code === "Comma") changePage(-1);

});