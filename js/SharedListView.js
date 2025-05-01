import Spinner from '../components/Spinner.js';
import LevelAuthors from '../components/List/LevelAuthors.js';
import { score } from '../score.js';
import { embed } from '../util.js';
import { store } from './main.js';

function getRankColor(rank) {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank === 3) return '#cd7f32';
    if (rank > 100) return 'darkgrey';
    return undefined;
}

function getOpacity(rank) {
    if (rank >= 101 && rank <= 151) {
        const opacity = 1 - (rank - 101) / 50;
        return opacity < 0 ? 0 : opacity;
    }
    return 1;
}

export function createListView({ fetchList, hidePoints = false, filter = () => true }) {
    return {
        components: { Spinner, LevelAuthors },
        template: /* same as List.js, you can reuse your template with small edits if needed */,
        data: () => ({
            list: [],
            editors: [],
            loading: true,
            selected: 0,
            errors: [],
            roleIconMap: {
                owner: 'crown',
                admin: 'user-gear',
                helper: 'user-shield',
                dev: 'code',
                trial: 'user-lock',
            },
            store,
            toggledShowcase: false,
        }),
        computed: {
            level() {
                return this.list?.[this.selected]?.[2];
            },
            video() {
                if (!this.level.showcase) return embed(this.level.verification);
                return embed(this.toggledShowcase ? this.level.showcase : this.level.verification);
            },
        },
        async mounted() {
            this.list = (await fetchList()).filter(filter);
            this.loading = false;
        },
        methods: {
            embed,
            score,
            getRankColor,
            getOpacity,
        },
    };
}
