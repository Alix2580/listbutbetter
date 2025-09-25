import { store } from '../main.js';
import { embed } from '../util.js';
import { score } from '../score.js';
import { fetchEditors, fetchList } from '../content.js';

import Spinner from '../components/Spinner.js';
import LevelAuthors from '../components/List/LevelAuthors.js';

const roleIconMap = {
    owner: 'crown',
    admin: 'user-gear',
    helper: 'user-shield',
    dev: 'code',
    trial: 'user-lock',
};

function getRankColor(rank) {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank === 3) return '#cd7f32'; // bronze
    if (rank > 100) return 'darkgrey';
    return undefined;
}

function getOpacity(rank) {
    if (rank === null) return 0.17; // Benchmark levels
    if (rank >= 101 && rank <= 151) {
        const opacity = 1 - (rank - 101) / 50;
        return opacity < 0 ? 0 : opacity;
    }
    return 1;
}

export default {
    components: { Spinner, LevelAuthors },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list">
            <div class="list-container">
                <table class="list" v-if="list">
                    <tr v-for="([err, rank, level], i) in list">
                        <td class="rank">
                            <p
                                class="type-label-lg"
                                :style="{ color: getRankColor(rank), opacity: getOpacity(rank) }"
                            >
                                {{ rank === null ? '—' : \`#\${rank}\` }}
                            </p>
                        </td>
                        <td class="level" :class="{ 'error': err !== null }">
                            <button>
                                <span
                                    class="type-label-lg"
                                    :style="{ color: getRankColor(rank), opacity: getOpacity(rank) }"
                                >
                                    {{ level?.name || \`Error (\${err}.json)\` }}
                                </span>
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
        </main>
    `,
    data: () => ({
        list: [],
        editors: [],
        loading: true,
        selected: 0,
        errors: [],
        listlevels: 0,
        roleIconMap,
        store,
        toggledShowcase: false,
    }),
    computed: {
        level() {
            return this.list && this.list[this.selected] && this.list[this.selected][2];
        },
        video() {
            if (!this.level.showcase) {
                return embed(this.level.verification);
            }
            return embed(
                this.toggledShowcase
                    ? this.level.showcase
                    : this.level.verification
            );
        },
    },
    async mounted() {
        this.list = await fetchList();
        this.editors = await fetchEditors();

        if (!this.list) {
            this.errors = [
                'Failed to load list. Retry in a few minutes or notify list staff.',
            ];
        } else {
            this.errors.push(
                ...this.list
                    .filter(([err]) => err)
                    .map(([err]) => `Failed to load level. (${err}.json)`),
            );
            if (!this.editors) {
                this.errors.push('Failed to load list editors.');
            }
        }

        this.loading = false;
    },
    methods: {
        embed,
        score,
        getRankColor,
        getOpacity,
    },
};
