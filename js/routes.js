import List from './pages/List.js';
import Leaderboard from './pages/Leaderboard.js';
import Roulette from './pages/Roulette.js';
import Submit from './pages/Submit.js';
import Legacy from './pages/Legacy.js'; // ✅ Correct path and capitalization

export default [
    { path: '/', component: List },
    { path: '/legacy', component: Legacy }, // ✅ Add legacy route
    { path: '/leaderboard', component: Leaderboard },
    { path: '/roulette', component: Roulette },
    { path: '/submit', component: Submit },
];
