window.onload = function () {
  const bodyElement = document.querySelector('body');
  const mainAvatar = document.querySelector('#userAvatar');
  const navAvatar = document.querySelector('#navAvatar');
  const name = document.querySelector('#name');
  const username = document.querySelector('#username');
  const bio = document.querySelector('#bio');
  const repoList = document.querySelector('#repoList');

  const baseUrl = 'https://gracious-kalam-f4b8cf.netlify.app/.netlify/functions/github';

  // show timestamp in readable format
  // Epochs
  const epochs = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1],
  ];

  // Get duration
  const getDuration = (timeAgoInSeconds) => {
    for (let [name, seconds] of epochs) {
      const interval = Math.floor(timeAgoInSeconds / seconds);

      if (interval >= 1) {
        return {
          interval: interval,
          epoch: name,
        };
      }
    }
  };

  // Calculate
  const timeAgo = (date) => {
    const timeAgoInSeconds = Math.floor((new Date() - new Date(date)) / 1000);
    const { interval, epoch } = getDuration(timeAgoInSeconds);
    const suffix = interval === 1 ? '' : 's';

    return `${interval} ${epoch}${suffix} ago`;
  };

  fetch(baseUrl)
    .then((response) => response.json())
    .then((data) => {
      navAvatar.setAttribute('src', data.viewer.avatarUrl);
      mainAvatar.setAttribute('src', data.viewer.avatarUrl);
      name.textContent = data.viewer.name;
      username.textContent = data.viewer.login;
      bio.textContent = data.viewer.bio;
      data.viewer.repositories.nodes.forEach((repository) => {
        repoList.innerHTML += `
              <div class="repo">
                <div class="repo-main-data">
                  <div class="repo-data">
                    <a href="${repository.url}" class="repo-name">${repository.name}</a>
                    <p class="repo-description">${repository.description || ''}</p>
                  </div>
                  <button class="star-button">
                    <img src="./assets/icons/star.svg" alt="star icon" />
                    <span>Star</span>
                  </button>
                </div>
                <div class="repo-meta">
                  <div class="${repository.primaryLanguage ? 'repo-language' : 'hide'}">
                    <span style="background: ${repository.primaryLanguage?.color || ''};" class="repo-language-color"></span>
                    <span class="repo-language-text">${repository.primaryLanguage?.name || ''}</span>
                  </div>
                  <div class="repo-stars">
                    <img src="./assets/icons/star.svg" alt="star icon" />
                    <span>${repository.stargazerCount}</span>
                  </div>
                  <div class="updated">
                    <span>Updated ${timeAgo(repository.updatedAt)}</span>
                  </div>
                </div>
              </div>
          `;
      });
      bodyElement.style.opacity = 1; // remove jitters
    })
    .catch((error) => console.log(error));
};
