import List from './pages/List.js';
import Leaderboard from './pages/Leaderboard.js';
import Roulette from './pages/Roulette.js';
import Submit from './pages/Submit.js';
import Legacy from './pages/Legacy.js'; // ✅ make sure this path and name are correct

export default [
    { path: '/', component: List },
    { path: '/legacy', component: Legacy }, // ✅ this defines your new tab
    { path: '/leaderboard', component: Leaderboard },
    { path: '/roulette', component: Roulette },
    { path: '/submit', component: Submit },
];
