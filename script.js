let username = new URLSearchParams(window.location.search).get('username');
let current_year = 2024;

const headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
}

// Global user profile data 
const globals = {
    usname: '',
    longestCodingStreak: 0,
    profileImageSrc: '',
    activeHoursInterval: [0, 0],
    totalCommits: 0,
    totalStars: 0,
    totalRepos: 0,
    totalLanguages: 0,
    pullRequests: 0,
    mostActiveDate: '',
    mostActiveDay: 0,
    monthWiseContributions: {},
    mostStarredRepo: '',
    maxStars: 0,
    mostCommonCommitMessage: '',
    topLanguages: {},
    averageDailyLOC: 0,
    totalAdditions: 0,
    totalDeletions: 0,
    totalLOC: 0
};

// Make wrapped 
makeWrapped();

// Helper functions
function randomFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateRandomColor() {
    let textColor = 'white';
    const red = randomFromInterval(100, 255);
    const green = randomFromInterval(100, 255);
    const blue = randomFromInterval(100, 255);
    const randomColor = 'rgb(' + red + ',' + green + ',' + blue + ', 1)';
    // check if it is a light colour and if it is, then change the text color to black
    if (red + green + blue > 500) {
        textColor = 'black';
    }
    return [randomColor, textColor];
}

function setClassVariables(class_name, value) {
    const classes = document.getElementsByClassName(class_name);
    for (let i = 0; i < classes.length; i++) {
        classes[i].innerHTML = value;
    }
}

function checkIfNeedToShortenText(text, max_length) {
    if (text.length > max_length) {
        return text.slice(0, max_length) + '...';
    }
    return text;
}

function getRGBComplement(rgb) {
    const [r, g, b] = rgb.slice(4, -1).split(',').map(Number);
    return `rgb(${255 - r}, ${255 - g}, ${255 - b})`;
}

async function getAllPages(url) {
    let page = 1;
    let allData = [];
    let hasMore = true;

    while (hasMore) {
        const response = await fetch(`${url}?page=${page}&per_page=100`, headers);
        const data = await response.json();

        if (data.length === 0) {
            hasMore = false;
        } else {
            allData = allData.concat(data);
            page++;
        }
    }

    return allData;
}

// Decoration elements
function addCanvasElementToSlide(slide) {
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.borderRadius = '2em';
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.fillRect(0, 0, 100, 100);
    slide.appendChild(canvas);
}

function drawRandomWavesOnTopCanvas(canvas, bgColor) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    const waves = [];
    const numWaves = 3;
    
    for (let i = 0; i < numWaves; i++) {
        waves.push({
            amplitude: height * (0.1 + Math.random() * 0.1),
            frequency: 0.01 + Math.random() * 0.02,
            speed: 0.02 + Math.random() * 0.03,
            offset: Math.random() * Math.PI * 2,
            y: height * (0.1 + i * 0.1),
            color: getRGBComplement(bgColor).replace('rgb', 'rgba').replace(')', ', 0.5)')
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        waves.forEach(wave => {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            for (let x = 0; x <= width; x++) {
                const y = wave.y + Math.sin(x * wave.frequency + wave.offset) * wave.amplitude;
                ctx.lineTo(x, y);
            }
            ctx.lineTo(width, 0);
            ctx.lineTo(0, 0);
            ctx.closePath();
            ctx.fillStyle = wave.color;
            ctx.fill();
            wave.offset += wave.speed;
        });

        requestAnimationFrame(animate);
    }
    
    animate();
}

function drawRandomWavesOnBottomCanvas(canvas, bgColor) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    const waves = [];
    const numWaves = 3;
    
    for (let i = 0; i < numWaves; i++) {
        waves.push({
            amplitude: height * (0.1 + Math.random() * 0.1),
            frequency: 0.01 + Math.random() * 0.02,
            speed: 0.02 + Math.random() * 0.03,
            offset: Math.random() * Math.PI * 2,
            y: height * (0.7 + i * 0.1),
            color: getRGBComplement(bgColor).replace('rgb', 'rgba').replace(')', ', 0.5)')
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        waves.forEach(wave => {
            ctx.beginPath();
            ctx.moveTo(0, height);
            for (let x = 0; x <= width; x++) {
                const y = wave.y + Math.sin(x * wave.frequency + wave.offset) * wave.amplitude;
                ctx.lineTo(x, y);
            }
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.closePath();
            ctx.fillStyle = wave.color;
            ctx.fill();
            wave.offset += wave.speed;
        });

        requestAnimationFrame(animate);
    }
    
    animate();
}

function addGradientEffectToText(text) {
    const [color1, _] = generateRandomColor();
    const [color2, __] = generateRandomColor();
    text.style.background = `linear-gradient(to right, ${color1}, ${color2})`;
    text.style.webkitBackgroundClip = 'text';
    text.style.backgroundClip = 'text';
    text.style.color = 'transparent';
    text.style.display = 'inline-block';
} 

function addPolkaDots(element, bgColor) {
    const col = getRGBComplement(bgColor);
    element.style.backgroundImage = `radial-gradient(${col} 5%, transparent 5%), radial-gradient(${col} 5%, transparent 5%)`;
    element.style.backgroundPosition = '0 0, 25px 25px';
    element.style.backgroundSize = '50px 50px';
}

function addStripeEffect(slide, bgColor) {
    const canvas = document.createElement('canvas');
    canvas.classList.add('stripe-border');
    canvas.width = 300; 
    canvas.height = 500; 
    
    const ctx = canvas.getContext('2d');
    const color = getRGBComplement(bgColor);
    
    // Top left stripes
    ctx.beginPath();
    ctx.lineWidth = 10;
    ctx.strokeStyle = color;
    ctx.moveTo(-50, 110);
    ctx.lineTo(130, -50);
    ctx.stroke();
    ctx.moveTo(-50, 150);
    ctx.lineTo(170, -50);
    ctx.stroke();
    
    // Bottom right stripes
    ctx.beginPath();
    ctx.moveTo(canvas.width + 50, canvas.height - 120);
    ctx.lineTo(canvas.width - 120, canvas.height + 50);
    ctx.stroke();
    ctx.moveTo(canvas.width + 50, canvas.height - 160);
    ctx.lineTo(canvas.width - 160, canvas.height + 50);
    ctx.stroke();
    
    slide.appendChild(canvas);
}

function addStripeEffect2(slide, bgColor) {
    const canvas = document.createElement('canvas');
    canvas.classList.add('stripe-border');
    canvas.width = 300; 
    canvas.height = 500; 
    
    const ctx = canvas.getContext('2d');
    const color = getRGBComplement(bgColor);
    
    // Top right stripes
    ctx.beginPath();
    ctx.lineWidth = 10;
    ctx.strokeStyle = color;
    ctx.moveTo(canvas.width + 50, 110);
    ctx.lineTo(canvas.width - 130, -50);
    ctx.stroke();
    ctx.moveTo(canvas.width + 50, 150);
    ctx.lineTo(canvas.width - 170, -50);
    ctx.stroke();
    
    // Bottom right stripes
    ctx.beginPath();
    ctx.lineWidth = 10;
    ctx.strokeStyle = color;
    ctx.moveTo(-50, canvas.height - 120);
    ctx.lineTo(120, canvas.height + 50);
    ctx.stroke();
    ctx.moveTo(-50, canvas.height - 160);
    ctx.lineTo(160, canvas.height + 50);
    ctx.stroke();
    
    slide.appendChild(canvas);
}

function addLineEffect(slide, bgColor) {
    const canvas = document.createElement('canvas');
    canvas.classList.add('line-border');
    canvas.width = 300;
    canvas.height = 500;

    const ctx = canvas.getContext('2d');
    const color = getRGBComplement(bgColor);

    // Top lines
    ctx.beginPath();
    ctx.lineWidth = 10;
    ctx.strokeStyle = color;
    ctx.moveTo(-50, 50);
    ctx.lineTo(canvas.width+50, 50);
    ctx.stroke();
    ctx.moveTo(-50, 80);
    ctx.lineTo(canvas.width+50, 80);
    ctx.stroke();

    // Bottom lines
    ctx.beginPath();
    ctx.lineWidth = 10;
    ctx.strokeStyle = color;
    ctx.moveTo(-50, canvas.height-80);
    ctx.lineTo(canvas.width+50, canvas.height-80);
    ctx.stroke();
    ctx.moveTo(-50, canvas.height-50);
    ctx.lineTo(canvas.width+50, canvas.height-50);
    ctx.stroke();

    slide.appendChild(canvas);
}

function addTopLineEffect(slide, bgColor) {
    const canvas = document.createElement('canvas');
    canvas.classList.add('line-border');
    canvas.width = 300;
    canvas.height = 500;

    const ctx = canvas.getContext('2d');
    const color = getRGBComplement(bgColor);

    // Top lines
    ctx.beginPath();
    ctx.lineWidth = 10;
    ctx.strokeStyle = color;
    ctx.moveTo(-50, 50);
    ctx.lineTo(canvas.width+50, 50);
    ctx.stroke();
    ctx.moveTo(-50, 80);
    ctx.lineTo(canvas.width+50, 80);
    ctx.stroke();

    slide.appendChild(canvas);
}

// Wrapped code
async function makeWrapped() { 
    try {
        await Promise.all([
            setContributionData(),
            setLOCData()
        ]);

        const apiData = await fetch(`https://api.github.com/users/${username}`, headers);
        const response = await apiData.json();
        
        globals.usname = response.name;
        globals.profileImageSrc = response.avatar_url;

        // Add initial slides 
        addFirstSlide();
        addSecondSlide();

        // Get the events data 
        const events = await getAllPages(`https://api.github.com/users/${username}/events`);
        const commits = events.filter(event => event.type === 'PushEvent');
        globals.totalCommits = getTotalCommits(commits);
        const pull_requests = events.filter(event => event.type === 'PullRequestEvent').length;
        globals.pullRequests = getTotalPulls(pull_requests);
        globals.mostCommonCommitMessage = getMostCommonCommitMessage(commits);

        // Get the repositories data
        const repos = await getAllPages(`https://api.github.com/users/${username}/repos`);
        globals.totalRepos = await getTotalRepos(repos);
        globals.totalStars = await getTotalStars(repos);
        globals.totalLanguages = await getTotalLanguages(repos);
        [globals.mostStarredRepo, globals.maxStars] = await getMostStarredRepo(repos);

        // Add the slides
        await addSlides();

        // Set the name in all the required places 
        setClassVariables('name', globals.usname);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function addSlides() {
    // Get the personalities of the user and add new slides for each personality
    const personalities = getPersonalitiesForUser(globals.longestCodingStreak, globals.activeHoursInterval, globals.totalCommits, globals.totalStars, globals.totalRepos, globals.totalLanguages);
    addPersonalitySlides(personalities);

    // Add the top languages slides
    addTopLanguageSlides();

    // Add the number of repositories slide
    addNoOfReposSlide();

    // Add the number of commits slide
    addNoOfCommitsSlide();

    // Add the number of pull requests slide
    addNoOfPullRequestsSlide(globals.pullRequests);

    addWaitThatWasTooManyNumbers();
    addHereIsSomeOtherData();

    // Add the most active date and day slide
    addMostActiveDateAndDay();

    // Add the month wise contribution slide
    addMonthWiseContributionSlide();

    // Add the contributions vs type of contribution slide
    addContributionsVsTypeSlide();

    // Add the longest streak and active hours slides
    addLongestStreakSlide();
    addActiveHoursSlide();

    // Add the most starred repo slide
    addMostStarredRepoSlide();

    // Add the most common commit message slide
    addMostCommonCommitMessageSlide();

    // Add Lines Of Code Data Slide 
    addLOCDataSlide();

    // Add the final slides
    addFinalSlides();
}

function getPersonalitiesForUser(longestStreak, activeHoursInterval, totalCommits, totalStars, totalRepos, totalLanguages) {
    let personalities = [
        "The Marathon Coder",  // Has a 15 day streak in coding 
        "The Night Owl",       // Codes between 12am and 6am
        "The Early Bird",      // Codes between 6am and 12pm
        "The Debugger",        // Has made more than 100 commits
        "The Star Gazer",      // Has starred more than 15 repositories 
        "The Trailblazer",     // Has made over 20 repositories
        "The Code Connoisseur", // Has coded in more than 5 languages
    ]

    let final_personalities = [];

    for (let i=0; i<7; i++) {
        let personality = personalities[i];  

        if (personality === "The Marathon Coder" && longestStreak >= 15) {
            final_personalities.push(personality);
        }

        if (personality === "The Night Owl" && activeHoursInterval[0] === 0 && activeHoursInterval[1] === 6) {
            final_personalities.push(personality);
        }

        if (personality === "The Early Bird" && activeHoursInterval[0] === 6 && activeHoursInterval[1] === 12) {
            final_personalities.push(personality);
        }

        if (personality === "The Debugger" && totalCommits >= 100) {
            final_personalities.push(personality);
        }

        if (personality === "The Star Gazer" && totalStars >= 15) {
            final_personalities.push(personality);
        }

        if (personality === "The Trailblazer" && totalRepos >= 20) {
            final_personalities.push(personality);
        }

        if (personality === "The Code Connoisseur" && totalLanguages >= 5) {
            final_personalities.push(personality);
        }
    }

    if (final_personalities.length === 0) {
        final_personalities.push("The Human");
    }

    return final_personalities;
}

function generatePersonalityImageName(personality) {
    let imageName = '';
    switch (personality) {
        case 'The Marathon Coder':
            imageName = 'assets/personalities/the_marathon_coder.jpeg';
            break;
        case 'The Night Owl':
            imageName = 'assets/personalities/the_night_owl.jpeg';
            break;
        case 'The Early Bird':
            imageName = 'assets/personalities/the_early_bird.jpeg';
            break;
        case 'The Debugger':
            imageName = 'assets/personalities/the_debugger.jpeg';
            break;
        case 'The Star Gazer':
            imageName = 'assets/personalities/the_stargazer.jpeg';
            break;
        case 'The Trailblazer':
            imageName = 'assets/personalities/the_trailblazer.jpeg';
            break;
        case 'The Code Connoisseur':
            imageName = 'assets/personalities/the_code_connoisseur.jpeg';
            break;
        default:
            imageName = globals.profileImageSrc;
            break;
    }
    return imageName;
}

function getPersonalityData(personality) {
    let personality_data = '';
    switch(personality) {
        case 'The Marathon Coder':
            personality_data = 'You coded for atleast 15 days straight. How cool is that!';
            break;
        case 'The Night Owl':
            personality_data = 'You are most active between 12am and 6am. Night owl!';
            break;
        case 'The Early Bird':
            personality_data = 'You are most active between 6am and 12pm. Early bird!';
            break;
        case 'The Debugger':
            personality_data = 'You made over 100 commits. You are a master of debugging!';
            break;
        case 'The Star Gazer':
            personality_data = 'Your repositories have been starred more than 15 times. Keep shining!';
            break;
        case 'The Trailblazer':
            personality_data = 'You have made 20+ repositories in one year! Wow!';
            break;
        case 'The Code Connoisseur':
            personality_data = 'You have coded in more than 5 languages. You are a polyglot!';
            break;
        default:
            personality_data = 'You didn\'t match any personality. You are unique in a way too!';
            break;
    }
    return personality_data;
}

function addPersonalitySlides(personalities) {
    // first slide
    const swiperWrapper = document.querySelector('swiper-container');
    const slide = document.createElement('swiper-slide');
    slide.classList.add('personality-slide');
    slide.innerHTML = `
        <h1>Your coding personalities this year were...</h1>
    `;
    slide.style.backgroundColor = 'black';
    slide.style.color = 'white';
    swiperWrapper.appendChild(slide);
    addPolkaDots(slide, 'rgb(0, 0, 0)');

    // personalities
    for (let i = 0; i < personalities.length; i++) {
        const slide = document.createElement('swiper-slide');
        slide.classList.add('personality-slide');
        slide.innerHTML = `
            <img src="${generatePersonalityImageName(personalities[i])}" alt="Personality Image">
            <div class='animate-text-slideup'>
                <h1>${personalities[i]}</h1>
                <h2>${getPersonalityData(personalities[i])}</h2>
            </div>
        `;
        let [color, textColor] = generateRandomColor();
        slide.style.backgroundColor = color;
        slide.style.color = textColor;
        addCanvasElementToSlide(slide);
        drawRandomWavesOnTopCanvas(slide.querySelector('canvas'), color);
        swiperWrapper.appendChild(slide);
    }
}

function getActiveHoursInterval(commits) {
    let commitTimes = commits.map(event => new Date(event.created_at).getHours());
    let activeHours = {};
    for (let i = 0; i < commits.length; i++) {
        if (new Date(commits[i]).getFullYear() !== current_year) {
            continue;
        }
        if (activeHours[commitTimes[i]]) {
            activeHours[commitTime[i]]++;
        } else {
            activeHours[commitTimes[i]] = 1;
        }
    }
    let maxActiveHour = 0;
    let maxActiveHourCount = 0;
    for (let hour in activeHours) {
        if (activeHours[hour] > maxActiveHourCount) {
            maxActiveHour = hour;
            maxActiveHourCount = activeHours[hour];
        }
    }
    return [maxActiveHour, (parseInt(maxActiveHour) + 6) % 24];
}

function getTotalLanguages(repos) {
    let languages = 0;
    let done = []
    for (let i = 0; i < repos.length; i++) {
        if (new Date(repos[i].created_at).getFullYear() !== current_year) {
            continue;
        }
        if (repos[i].language && !done.includes(repos[i].language)) {
            languages++;
            done.push(repos[i].language);
        }
    }
    return languages;
}

function getTotalStars(repos) {
    let stars = 0;
    for (let i = 0; i < repos.length; i++) {
        if (new Date(repos[i].created_at).getFullYear() !== current_year) {
            continue;
        }
        stars += repos[i].stargazers_count;
    }
    return stars;
}

function getTotalRepos(repos) {
    let totalRepos = 0;
    for (let i = 0; i < repos.length; i++) {
        if (new Date(repos[i].created_at).getFullYear() !== current_year) {
            continue;
        }
        totalRepos++;
    }
    return totalRepos;
}

function getTotalCommits(commits) {
    let totalCommits = 0;
    for (let i = 0; i < commits.length; i++) {
        if (new Date(commits[i].created_at).getFullYear() !== current_year) {
            continue;
        }
        totalCommits++;
    }
    return totalCommits;
}

function getTotalPulls(pulls) {
    let totalPulls = 0;
    for (let i = 0; i < pulls.length; i++) {
        if (new Date(pulls[i].created_at).getFullYear() !== current_year) {
            continue;
        }
        totalPulls++;
    }
    return totalPulls;
}

function getMostCommonCommitMessage(commits) {
    let commitMessages = {};
    for (let i = 0; i < commits.length; i++) {
        if (new Date(commits[i].created_at).getFullYear() !== current_year) {
            continue;
        }
        let message = commits[i].payload.commits[0].message;
        if (commitMessages[message]) {
            commitMessages[message]++;
        } else {
            commitMessages[message] = 1;
        }
    }
    let mostCommonMessage = '';
    let mostCommonMessageCount = 0;
    for (let message in commitMessages) {
        if (commitMessages[message] > mostCommonMessageCount) {
            mostCommonMessage = message;
            mostCommonMessageCount = commitMessages[message];
        }
    }
    return checkIfNeedToShortenText(mostCommonMessage, 40);
}

function addTopLanguageSlides() {
    // first slide
    const swiperWrapper = document.querySelector('swiper-container');
    const slide = document.createElement('swiper-slide');
    slide.classList.add('language-slide');
    slide.innerHTML = `
        <h1>But that's not it, is it <span class='name'></span>?</h1>
    `;
    let [color, textColor] = generateRandomColor();
    slide.style.backgroundColor = color;
    slide.style.color = textColor;
    swiperWrapper.appendChild(slide);
    addStripeEffect(slide, color);

    // Fallback for no languages 
    if (Object.keys(globals.topLanguages).length === 0) {
        // Add a fallback slide if no languages found
        const noLangSlide = document.createElement('swiper-slide');
        noLangSlide.classList.add('language-slide');
        noLangSlide.innerHTML = `
            <h1>Looks like we couldn't find any languages in your repositories for ${current_year}! Maybe next time?</h1>
        `;
        noLangSlide.style.backgroundColor = 'black';
        noLangSlide.style.color = 'white';
        swiperWrapper.appendChild(noLangSlide);
        return;
    }

    // get the top five languages (descending order)
    let sortable = [];
    for (let language in globals.topLanguages) {
        sortable.push([language, globals.topLanguages[language]]);
    }
    sortable.sort((a, b) => b[1] - a[1]);

    // get top language 
    let topLanguage = sortable[0][0];
    
    // add top language slide 
    const topLangSlide = document.createElement('swiper-slide');
    topLangSlide.classList.add('language-slide');
    topLangSlide.innerHTML = `
        <h1>Your top language this year was <span id='topLang'>${topLanguage}</span>. Incredible, isn't it?</h1>
    `;
    topLangSlide.style.backgroundColor = 'black';
    topLangSlide.style.color = 'white';
    swiperWrapper.appendChild(topLangSlide);
    addGradientEffectToText(topLangSlide.querySelector('#topLang'));
    addLineEffect(topLangSlide, 'rgb(0, 0, 0)');

    // add the top five languages slide 
    const topFiveLangSlide = document.createElement('swiper-slide');
    topFiveLangSlide.classList.add('language-slide');
    topFiveLangSlide.innerHTML = `
        <div>
            <h2>Here are your favourite languages of ${current_year} (by lines of code)!</h2>
        </div>
        <div style="width: 100%; height: 70%;">
            <canvas id='topLangChart'></canvas>
        </div>
    `;
    topFiveLangSlide.style.backgroundColor = 'white';
    topFiveLangSlide.style.color = 'black';
    swiperWrapper.appendChild(topFiveLangSlide);

    // add the top five languages chart using chartjs
    const topLangChart = topFiveLangSlide.querySelector('#topLangChart');
    let topLanguages = sortable;
    let labels = topLanguages.map(lang => lang[0]);
    let data = topLanguages.map(lang => lang[1]);
    let colors = [];
    for (let i = 0; i < 5; i++) {
        let color_chart = generateRandomColor();
        colors.push(color_chart[0]);
    }
    new Chart(topLangChart.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    border: {
                        display: false
                    }
                },
                y: {
                    display: false,
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function addFirstSlide() {
    const swiperWrapper = document.querySelector('swiper-container');
    const slide = document.createElement('swiper-slide');
    slide.id = 's1';
    slide.innerHTML = `
        <img src="" alt="profile-pic" id="profile-pic">
        <h1><span id="usname"></span>, Unwrap your GitHub Wrapped!</h1>
    `;
    slide.style.backgroundColor = 'black';
    slide.style.color = 'white';
    swiperWrapper.appendChild(slide);
    document.getElementById('usname').innerHTML = '@' + username;
    document.getElementById('profile-pic').src = globals.profileImageSrc;
}

function addSecondSlide() {
    const swiperWrapper = document.querySelector('swiper-container');
    const slide = document.createElement('swiper-slide');
    slide.id = 's2';
    slide.innerHTML = `
        <h1 class="name" id="n0"></h1>
        <h1 class="name" id="n1"></h1>
        <h1 class="name" id="n2"></h1>
        <h1 class="name" id="n3"></h1>
        <h1 class="name" id="n4"></h1>
        <h1 class="name" id="n5"></h1>
        <h1 class="name" id="n6"></h1>
        <h1 class="name" id="n7"></h1>
        <h1 class="name" id="n8"></h1>
    `;
    slide.style.backgroundColor = 'black';
    slide.style.color = 'white';
    swiperWrapper.appendChild(slide);
    for (let i=0; i<9; i++) {
        let [color, textColor] = generateRandomColor();
        document.getElementById('n'+i).style.backgroundColor = color;
        document.getElementById('n'+i).style.color = textColor;
    }
}

function addNoOfReposSlide() {
    const swiperWrapper = document.querySelector('swiper-container');
    const slide = document.createElement('swiper-slide');
    slide.classList.add('num-slide');
    slide.innerHTML = `
        <h1 id="repos">${globals.totalRepos}</h1>
        <h2>That is the number of repositories you made in ${current_year}!</h2>
    `;
    let [color, textColor] = generateRandomColor();
    slide.style.backgroundColor = color;
    slide.style.color = textColor;
    swiperWrapper.appendChild(slide);
    addGradientEffectToText(slide.querySelector('#repos'));
    addTopLineEffect(slide, color);
}

function addNoOfCommitsSlide() {
    const swiperWrapper = document.querySelector('swiper-container');
    const slide = document.createElement('swiper-slide');
    slide.classList.add('num-slide');
    slide.innerHTML = `
        <h1 id="commits">${globals.totalRepos}</h1>
        <h2>That is the number of commits you made in ${current_year}!</h2>
    `;
    let [color, textColor] = generateRandomColor();
    slide.style.backgroundColor = color;
    slide.style.color = textColor;
    swiperWrapper.appendChild(slide);
    addGradientEffectToText(slide.querySelector('#commits'));
    addTopLineEffect(slide, color);
}

function addNoOfPullRequestsSlide(pull_requests) {
    const swiperWrapper = document.querySelector('swiper-container');
    const slide = document.createElement('swiper-slide');
    slide.classList.add('num-slide');
    slide.innerHTML = `
        <h1 id="pull-requests">${pull_requests}</h1>
        <h2>That is the number of pull requests you made in ${current_year}!</h2>
    `;
    let [color, textColor] = generateRandomColor();
    slide.style.backgroundColor = color;
    slide.style.color = textColor;
    swiperWrapper.appendChild(slide);
    addGradientEffectToText(slide.querySelector('#pull-requests'));
    addTopLineEffect(slide, color);
}

function addWaitThatWasTooManyNumbers() {
    const swiperWrapper = document.querySelector('swiper-container');
    const slide = document.createElement('swiper-slide');
    slide.classList.add('too-many-nums-slide');
    slide.innerHTML = `
        <h1>Wait, that was too many numbers!</h1>
    `;
    slide.style.backgroundColor = 'black';
    slide.style.color = 'white';
    swiperWrapper.appendChild(slide);
}

function addHereIsSomeOtherData() {
    const swiperWrapper = document.querySelector('swiper-container');
    const slide = document.createElement('swiper-slide');
    slide.classList.add('too-many-nums-slide');
    slide.innerHTML = `
        <h1 id='text-for-graphs'>So, here is some other data for you!</h1>
    `;
    slide.style.backgroundColor = 'black';
    addGradientEffectToText(slide.querySelector('#text-for-graphs'));
    swiperWrapper.appendChild(slide);
}

function addMostActiveDateAndDay() {
    const swiperWrapper = document.querySelector('swiper-container');
    const slide = document.createElement('swiper-slide');
    slide.classList.add('most-active-date-slide');
    slide.innerHTML = `
        <h1>On <span id='date-most-active'>${globals.mostActiveDate}</span> you were the most active!</h1>
        <h2>Oh and ${globals.mostActiveDay}s are your most active days of the week</h2>
    `;
    addGradientEffectToText(slide.querySelector('#date-most-active'));
    let [color, textColor] = generateRandomColor();
    slide.style.backgroundColor = color;
    slide.style.color = textColor;
    swiperWrapper.appendChild(slide);
    addPolkaDots(slide, color);
}

async function setContributionData() {
    const query = `
    query($username: String!, $from: DateTime, $to: DateTime) {
        user(login: $username) {
            contributionsCollection(from: $from, to: $to) {
                contributionCalendar {
                    totalContributions
                    weeks {
                        contributionDays {
                            contributionCount
                            date
                            weekday
                        }
                    }
                }
                totalCommitContributions
                totalIssueContributions
                totalPullRequestContributions
                totalPullRequestReviewContributions
            }
        }
    }`;

    const variables = {
        username: username,
        from: new Date(current_year, 0, 1).toISOString(),
        to: new Date(current_year, 11, 31).toISOString()
    };

    const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ query, variables })
    });

    const data = await response.json();
    const contributions = data.data.user.contributionsCollection;

    // Calculate longest streak
    let currentStreak = 0;
    let longestStreak = 0;
    let prevDate = null;

    contributions.contributionCalendar.weeks.forEach(week => {
        week.contributionDays.forEach(day => {
            const date = new Date(day.date);
            
            // Only count days in current year
            if (date.getFullYear() === current_year) {
                if (day.contributionCount > 0) {
                    if (!prevDate || 
                        (prevDate.getTime() + 24 * 60 * 60 * 1000 === date.getTime())) {
                        currentStreak++;
                        longestStreak = Math.max(longestStreak, currentStreak);
                    } else {
                        currentStreak = 1;
                    }
                    prevDate = date;
                } else {
                    currentStreak = 0;
                    prevDate = null;
                }
            }
        });
    });

    // Calculate active hours
    let hourCounts = new Array(24).fill(0);
    contributions.contributionCalendar.weeks.forEach(week => {
        week.contributionDays.forEach(day => {
            const date = new Date(day.date);
            if (date.getFullYear() === current_year && day.contributionCount > 0) {
                const hour = date.getHours();
                hourCounts[hour] += day.contributionCount;
            }
        });
    });

    // Find active hours interval
    let maxSum = 0;
    let startHour = 0;
    for (let i = 0; i < 24; i++) {
        let sum = 0;
        for (let j = 0; j < 6; j++) {
            sum += hourCounts[(i + j) % 24];
        }
        if (sum > maxSum) {
            maxSum = sum;
            startHour = i;
        }
    }

    // Process daily contributions and active hours
    const dailyContributions = {};
    const activeHours = {};
    const dayContributions = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat

    contributions.contributionCalendar.weeks.forEach(week => {
        week.contributionDays.forEach(day => {
            const date = new Date(day.date);
            const dateKey = day.date;
            const hour = date.getHours();

            dailyContributions[dateKey] = day.contributionCount;
            activeHours[hour] = (activeHours[hour] || 0) + day.contributionCount;
            dayContributions[day.weekday] += day.contributionCount;
        });
    });

    // Process monthwise contributions from daily contributions
    let monthWiseContributions = {};
    for (let date in dailyContributions) {
        const month = new Date(date).toLocaleString('default', { month: 'short' });
        monthWiseContributions[month] = (monthWiseContributions[month] || 0) + dailyContributions[date];
    }

    let hours = {0: "12am", 1: "1am", 2: "2am", 3: "3am", 4: "4am", 5: "5am", 6: "6am", 7: "7am", 8: "8am", 9: "9am", 10: "10am", 11: "11am", 12: "12pm", 13: "1pm", 14: "2pm", 15: "3pm", 16: "4pm", 17: "5pm", 18: "6pm", 19: "7pm", 20: "8pm", 21: "9pm", 22: "10pm", 23: "11pm"};

    // Set global variables
    globals.mostActiveDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
        dayContributions.indexOf(Math.max(...dayContributions))
    ];
    globals.monthWiseContributions = monthWiseContributions;
    globals.mostActiveDate = Object.entries(dailyContributions)
        .sort((a, b) => b[1] - a[1])[0][0];
    globals.contributionTypes = {
        labels: ['Commits', 'Issues', 'Pull Requests', 'Pull Request Reviews'],
        data: [
            contributions.totalCommitContributions,
            contributions.totalIssueContributions, 
            contributions.totalPullRequestContributions,
            contributions.totalPullRequestReviewContributions
        ]
    };
    globals.longestCodingStreak = longestStreak;
    globals.activeHoursInterval = [hours[startHour], hours[(startHour + 6) % 24]];
}

async function setLOCData() {
    const query = `
    query($username: String!) {
        user(login: $username) {
            repositories(first: 100, orderBy: {field: CREATED_AT, direction: DESC}) {
                nodes {
                    name
                    createdAt
                    defaultBranchRef {
                        target {
                            ... on Commit {
                                history(first: 100, since: "${new Date(current_year, 0, 1).toISOString()}", until: "${new Date(current_year, 11, 31).toISOString()}") {
                                    totalCount
                                    nodes {
                                        additions
                                        deletions
                                    }
                                }
                            }
                        }
                    }
                    primaryLanguage {
                        name
                    }
                    languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                        edges {
                            size
                            node {
                                name
                            }
                        }
                    }
                }
            }
        }
    }`;

    const variables = {
        username: username
    };

    const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ query, variables })
    });

    const data = await response.json();
    const repos = data.data.user.repositories.nodes;

    // Process languages
    let languageStats = {};
    let totalAdditions = 0;
    let totalDeletions = 0;
    
    repos.forEach(repo => {
        if (new Date(repo.createdAt).getFullYear() === current_year) {
            // Process languages
            repo.languages.edges.forEach(lang => {
                languageStats[lang.node.name] = (languageStats[lang.node.name] || 0) + lang.size;
            });

            // Process LOC stats
            if (repo.defaultBranchRef?.target?.history?.nodes) {
                repo.defaultBranchRef.target.history.nodes.forEach(commit => {
                    totalAdditions += commit.additions || 0;
                    totalDeletions += commit.deletions || 0;
                });
            }
        }
    });

    // Calculate total LOC and average daily LOC
    const totalLOC = totalAdditions - totalDeletions;
    const daysInYear = (current_year === new Date().getFullYear()) ? 
        Math.floor((new Date() - new Date(current_year, 0, 1)) / (1000 * 60 * 60 * 24)) : 
        365;
    const averageDailyLOC = Math.round(totalLOC / daysInYear);

    // Set global variables
    globals.totalAdditions = totalAdditions;
    globals.totalDeletions = totalDeletions;
    globals.totalLOC = totalLOC;
    globals.averageDailyLOC = averageDailyLOC;

    // Sort languages by usage
    globals.topLanguages = Object.entries(languageStats)
        .sort(([,a], [,b]) => b - a)
        .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
}

function addMonthWiseContributionSlide() {
    const swiperWrapper = document.querySelector('swiper-container');
    const slide = document.createElement('swiper-slide');
    slide.classList.add('month-wise-slide');
    slide.innerHTML = `
        <h1>Here are your monthly contributions!</h1>
        <h2>Greener is more!</h2>
    `
    slide.style.backgroundColor = 'black';
    slide.style.color = 'white';
    swiperWrapper.appendChild(slide);

    // add canvas 
    const canvass = document.createElement('canvas');
    slide.appendChild(canvass);
    canvass.id = 'month-wise-contribution';

    const canvas = slide.querySelector('canvas');
    addMonthWiseContributionHeatmap(canvas, globals.monthWiseContributions);
}

function addMonthWiseContributionHeatmap(canvas, monthWiseContributions) {
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Set canvas size 
    canvas.width = 250;
    canvas.height = 250;
    const ctx = canvas.getContext('2d');

    // GitHub like colors
    function getColor(intensity) {
        const colors = [
            '#161b22',   
            '#0e4429',
            '#006d32',
            '#26a641',
            '#39d353' 
        ];
        const normalized = Math.min(4, Math.floor(intensity / 20));
        return colors[normalized];
    }

    const padding = 10;
    const cellSizeX = canvas.width / 4 - padding;
    const cellSizeY = canvas.height / 3 - padding;
    const gap = 8;

    // Draw cells 
    for (let row=0; row<3; row++) {
        for (let col=0; col<4; col++) {
            const index = row * 4 + col;
            if (index < months.length) {
                const month = months[index];
                const intensity = monthWiseContributions[month];

                const x = padding + col * (cellSizeX + gap);
                const y = padding + row * (cellSizeY + gap);

                // Cell 
                ctx.fillStyle = getColor(intensity);
                ctx.beginPath();
                ctx.roundRect(x, y, cellSizeX, cellSizeY, 5);
                ctx.fill();

                // Month label
                ctx.fillStyle = 'white';
                ctx.font = '1.5em ' + getComputedStyle(document.querySelector(':root')).getPropertyValue('--font-secondary');
                ctx.textAlign = 'center';
                ctx.fillText(month, x + cellSizeX / 2, y + cellSizeY / 2);
            }
        }
    }
}

function addLongestStreakSlide() {
    const swiperWrapper = document.querySelector('swiper-container');
    const slide = document.createElement('swiper-slide');
    slide.classList.add('streak-hours-slide');
    slide.innerHTML = `
        <h1>Your longest coding streak was <mark><span id='longest-streak'>${globals.longestCodingStreak}</span></mark> days!</h1>
        <h2>Wow! That consistency!</h1>
    `;
    addGradientEffectToText(slide.querySelector('#longest-streak'));
    slide.querySelector('mark').style.backgroundColor = 'black';
    let [color, textColor] = generateRandomColor();
    slide.style.backgroundColor = color;
    slide.style.color = textColor;
    swiperWrapper.appendChild(slide);
    addStripeEffect(slide, color);
}

function addActiveHoursSlide() {
    const swiperWrapper = document.querySelector('swiper-container');
    const slide = document.createElement('swiper-slide');
    slide.classList.add('streak-hours-slide');
    slide.innerHTML = `
        <h1>You were most active between <mark id='mark1'><span id='active-hours1'>${globals.activeHoursInterval[0]}</span></mark> and <mark id='mark2'><span id='active-hours2'>${globals.activeHoursInterval[1]}</span></mark></h1>
    `;
    addGradientEffectToText(slide.querySelector('#active-hours1'));
    addGradientEffectToText(slide.querySelector('#active-hours2'));
    slide.querySelector('#mark1').style.backgroundColor = 'black';
    slide.querySelector('#mark2').style.backgroundColor = 'black';
    let [color, textColor] = generateRandomColor();
    slide.style.backgroundColor = color;
    slide.style.color = textColor;
    swiperWrapper.appendChild(slide);
    addPolkaDots(slide, color);
}

function getMostStarredRepo(repos) {
    let mostStarredRepo = '';
    let maxStars = 0;
    for (let i = 0; i < repos.length; i++) {
        if (new Date(repos[i].created_at).getFullYear() !== current_year) {
            continue;
        }
        if (repos[i].stargazers_count > maxStars) {
            mostStarredRepo = repos[i].full_name;
            maxStars = repos[i].stargazers_count;
        }
    }
    mostStarredRepo = mostStarredRepo.split('/')[1];
    return [mostStarredRepo, maxStars];
} 

function addMostStarredRepoSlide() {
    if ((globals.mostStarredRepo === '' || globals.mostStarredRepo === 'undefined') && globals.maxStars === 0) {
        return;
    }
    const swiperWrapper = document.querySelector('swiper-container');
    const slide = document.createElement('swiper-slide');
    slide.classList.add('most-starred-slide');
    slide.innerHTML = `
        <h1>Your most starred repository was</h1>
        <h1 id='most-starred-repo'>${globals.mostStarredRepo}</h1>
        <h1>with <mark><span id='most-stars'>${globals.maxStars}</span></mark> stars!</h1>
    `;
    addGradientEffectToText(slide.querySelector('#most-starred-repo'));
    slide.style.backgroundColor = 'black';
    slide.style.color = 'white';
    addGradientEffectToText(slide.querySelector('#most-stars'));
    slide.querySelector('mark').style.backgroundColor = 'white';
    swiperWrapper.appendChild(slide);
}

function addMostCommonCommitMessageSlide() {
    if ((globals.mostCommonCommitMessage === '' || globals.mostCommonCommitMessage === 'undefined') && globals.maxStars === 0) {
        return;
    }
    const swiperWrapper = document.querySelector('swiper-container');
    const slide = document.createElement('swiper-slide');
    slide.classList.add('most-common-commit-slide');
    slide.innerHTML = `
        <h1>Your most common commit message was</h1>
        <div>
            <h1 id='most-common-commit'>"${globals.mostCommonCommitMessage}"</h1>
        </div>
    `;
    addGradientEffectToText(slide.querySelector('#most-common-commit'));
    let [color, textColor] = generateRandomColor();
    slide.style.backgroundColor = color;
    slide.style.color = textColor;
    swiperWrapper.appendChild(slide);
    addPolkaDots(slide, color);
}

function addLOCDataSlide() {
    const swiperWrapper = document.querySelector('swiper-container');
    const slide = document.createElement('swiper-slide');
    slide.classList.add('loc-slide');
    slide.innerHTML = `
        <h1>Here is some more data related to lines of code!</h1>
    `;
    slide.style.backgroundColor = 'black';
    slide.style.color = 'white';
    swiperWrapper.appendChild(slide);

    // Add total LOC slide
    const totalLOC = document.createElement('swiper-slide');
    totalLOC.classList.add('loc-slide');
    totalLOC.innerHTML = `
        <h1>You wrote <mark><span id='total-loc'>${globals.totalLOC}</span></mark> lines of code this year...</h1>
    `;
    addGradientEffectToText(totalLOC.querySelector('#total-loc'));
    let [color, textColor] = generateRandomColor();
    totalLOC.style.backgroundColor = color;
    totalLOC.style.color = textColor;
    totalLOC.querySelector('mark').style.backgroundColor = 'black';
    swiperWrapper.appendChild(totalLOC);
    addStripeEffect2(totalLOC, color);

    // Add total additions and deletions slide
    const totalAdditions = document.createElement('swiper-slide');
    totalAdditions.classList.add('loc-slide');
    totalAdditions.innerHTML = `
        <h1>...which includes <mark><span id='total-additions'>${globals.totalAdditions}</span></mark> lines added, and <mark><span id='total-deletions'>${globals.totalDeletions}</span></mark> lines deleted!</h1>
    `;
    addGradientEffectToText(totalAdditions.querySelector('#total-additions'));
    addGradientEffectToText(totalAdditions.querySelector('#total-deletions'));
    let [color2, textColor2] = generateRandomColor();
    totalAdditions.style.backgroundColor = color2;
    totalAdditions.style.color = textColor2;
    totalAdditions.querySelector('mark').style.backgroundColor = 'black';
    swiperWrapper.appendChild(totalAdditions);

    // Add average daily LOC slide
    const averageDailyLOC = document.createElement('swiper-slide');
    averageDailyLOC.classList.add('loc-slide');
    averageDailyLOC.innerHTML = `
        <h1>That's an average of <mark><span id='average-daily-loc'>${globals.averageDailyLOC}</span></mark> lines of code per day!</h1>
    `;
    addGradientEffectToText(averageDailyLOC.querySelector('#average-daily-loc'));
    let [color3, textColor3] = generateRandomColor();
    averageDailyLOC.style.backgroundColor = color3;
    averageDailyLOC.style.color = textColor3;
    averageDailyLOC.querySelector('mark').style.backgroundColor = 'black';
    swiperWrapper.appendChild(averageDailyLOC);
    addPolkaDots(averageDailyLOC, color3);
}

function addContributionsVsTypeSlide() {
    // Text 
    const swiperWrapper = document.querySelector('swiper-container');
    const slide = document.createElement('swiper-slide');
    slide.classList.add('contributions-vs-type-slide');
    slide.innerHTML = `
        <h2>And this is yet another analysis of your contributions!</h2>
    `; 
    slide.style.backgroundColor = 'white';
    slide.style.color = 'black';
    swiperWrapper.appendChild(slide);

    // Chart
    const chart = document.createElement('canvas');
    chart.id = 'contributions-vs-type-chart';
    slide.appendChild(chart);
    const data = globals.contributionTypes.data;
    const labels = globals.contributionTypes.labels;
    const colors = data.map(() => generateRandomColor()[0]);
    const ctx = chart.getContext('2d');
    new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    ticks: {
                        display: true
                    },
                    grid: {
                        display: true
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: 'black',
                        font: {
                            family: 'var(--font-secondary)',
                            size: 14
                        },
                        padding: 20
                    }
                }
            }
        }
    });
}

function addFinalSlides() {
    const swiperWrapper = document.querySelector('swiper-container');
    const slide = document.createElement('swiper-slide');
    slide.innerHTML = `
        <h1>And that @${globals.usname} was your GitHub Wrapped for 2024!</h1>
    `;
    addGradientEffectToText(slide.querySelector('h1'));
    slide.style.backgroundColor = 'black';
    slide.style.color = 'white';
    swiperWrapper.appendChild(slide);
    addStripeEffect(slide, 'rgb(0, 0, 0)');

    const slide2 = document.createElement('swiper-slide');
    slide2.innerHTML = `
        <h1>Hope you loved it! Never stop coding!</h1>
        <h2>Hack away to glory!</h2>
    `;
    addGradientEffectToText(slide2.querySelector('h2'));
    slide2.style.backgroundColor = 'black';
    slide2.style.color = 'white';
    swiperWrapper.appendChild(slide2);
    addStripeEffect2(slide2, 'rgb(0, 0, 0)');
}