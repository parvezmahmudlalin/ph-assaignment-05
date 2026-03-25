const allBtn = document.getElementById("all-button");
const openBtn = document.getElementById("open-button");
const closedBtn = document.getElementById("closed-button");

let issueArr = []; 
let searchedIssue = []; 

// 1. Fetch initial data
const loadIssueCard = () => {
    loadingSpinner(true);
    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
        .then((res) => res.json())
        .then((object) => {
            issueArr = object.data;
            renderCards(issueArr); 
            issuesCount("all");
        })
        .catch(err => console.error("Error loading issues:", err));
};

// 2. Loading Spinner Control
const loadingSpinner = (status) => {
    const spinner = document.getElementById("loading-spinner");
    const container = document.getElementById("issues-main-container");
    if (status) {
        spinner.classList.remove("hidden");
        container.classList.add("hidden");
    } else {
        spinner.classList.add("hidden");
        container.classList.remove("hidden");
    }
};

// 3. Main Render Function (Fixes the green line issue)
const renderCards = (issues) => {
    const cardsContainer = document.getElementById("issues-cards-container");
    cardsContainer.innerHTML = ""; 

    if (issues.length === 0) {
        cardsContainer.innerHTML = `<p class="text-center col-span-full py-10 text-gray-500 font-medium">No issues found!</p>`;
        loadingSpinner(false);
        return;
    }

    issues.forEach((issue) => {
        const card = document.createElement("div");
        card.className = "cursor-pointer h-full flex"; // flex added for height matching
        
        card.innerHTML = `
            <div class="bg-base-100 flex flex-col justify-between w-full rounded-lg shadow-md border-t-4 ${
                issue.status === "open" ? "border-green-600" : "border-purple-600"
            } hover:shadow-xl transition-all">
                <div class="p-4 space-y-3">
                    <div class="flex justify-between items-center">
                        <div class="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
                            <i class="fa-solid ${issue.status === 'open' ? 'fa-circle-dot text-green-600' : 'fa-circle-check text-purple-600'}"></i>
                        </div>
                        <span class="${
                            issue.priority === "high" ? "bg-red-100 text-red-600" : 
                            issue.priority === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-purple-100 text-purple-600"
                        } py-1 px-3 rounded-full text-[10px] font-bold uppercase">${issue.priority}</span>
                    </div>
                    
                    <h2 class="font-bold text-md leading-tight h-12 overflow-hidden text-ellipsis" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                        ${issue.title}
                    </h2>
                    
                    <p class="text-gray-500 text-xs h-8 overflow-hidden" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                        ${issue.description}
                    </p>

                    <div class="flex flex-wrap gap-1">
                        ${issue.labels.map(label => `
                            <span class="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-500 border border-blue-100">${label}</span>
                        `).join('')}
                    </div>
                </div>

                <div>
                    <hr class="border-gray-50" />
                    <div class="p-3 bg-gray-50/50 rounded-b-lg flex justify-between items-center">
                        <div class="text-[10px] text-gray-400">
                            <p>#${issue.id} by <span class="font-semibold text-gray-600">${issue.author}</span></p>
                        </div>
                        <div class="text-[9px] text-right text-gray-400">
                            <p>${issue.createdAt.split('T')[0]}</p> 
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        card.addEventListener("click", () => loadIssueDetails(issue.id));
        cardsContainer.appendChild(card);
    });
    loadingSpinner(false);
};

// 4. Load Issue Details for Modal
const loadIssueDetails = (id) => {
    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
        .then((res) => res.json())
        .then((object) => {
            const issue = object.data;
            const detailsBox = document.getElementById("issue-details-container");
            detailsBox.innerHTML = `
                <h3 class="text-xl font-bold">${issue.title}</h3>
                <div class="flex gap-3 items-center">
                    <span class="badge ${issue.status === 'open' ? 'badge-success' : 'badge-secondary'} text-white">
                        ${issue.status.toUpperCase()}
                    </span>
                    <p class="text-sm text-gray-400 italic">by ${issue.author} on ${issue.createdAt}</p>
                </div>
                <div class="divider m-0"></div>
                <p class="text-gray-600 leading-relaxed">${issue.description}</p>
                <div class="bg-base-200 p-4 rounded-lg flex justify-between text-sm">
                    <p><strong>Assignee:</strong> ${issue.assignee}</p>
                    <p><strong>Priority:</strong> <span class="uppercase font-bold">${issue.priority}</span></p>
                </div>
            `;
            document.getElementById("issue-details-modal").showModal();
        });
};

// 5. Active Button and Filtering Logic
const btnActive = (id) => {
    loadingSpinner(true);
    
    // UI Update: Button styles
    [allBtn, openBtn, closedBtn].forEach(btn => btn.classList.remove("btn-primary"));
    document.getElementById(id).classList.add("btn-primary");

    // Filtering logic
    setTimeout(() => {
        if (id === "open-button") {
            const data = filterIssues("open");
            renderCards(data);
            issuesCount("open");
        } else if (id === "closed-button") {
            const data = filterIssues("closed");
            renderCards(data);
            issuesCount("closed");
        } else {
            renderCards(searchedIssue.length ? searchedIssue : issueArr);
            issuesCount("all");
        }
    }, 300);
};

// 6. Helper: Filter Logic
const filterIssues = (status) => {
    const source = searchedIssue.length ? searchedIssue : issueArr;
    return source.filter((issue) => issue.status === status);
};

// 7. Update Issue Count Header
const issuesCount = (type) => {
    const countText = document.getElementById("issue-count-text");
    if (type === "open") countText.innerText = filterIssues("open").length;
    else if (type === "closed") countText.innerText = filterIssues("closed").length;
    else countText.innerText = searchedIssue.length ? searchedIssue.length : issueArr.length;
};

// 8. Search Functionality
const searchFunc = () => {
    document.getElementById("search-button").addEventListener("click", () => {
        const inputVal = document.getElementById("search-input-field").value.trim().toLowerCase();
        if (!inputVal) return;

        loadingSpinner(true);
        fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${inputVal}`)
            .then((res) => res.json())
            .then((matchIssue) => {
                searchedIssue = matchIssue.data;
                renderCards(searchedIssue);
                issuesCount("searched");
                
                // Reset active button to 'All' after search
                [allBtn, openBtn, closedBtn].forEach(btn => btn.classList.remove("btn-primary"));
                allBtn.classList.add("btn-primary");
            });
    });
};

// Initialize
loadIssueCard();
searchFunc();