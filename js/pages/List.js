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

export default {
    components: { Spinner, LevelAuthors },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list">
            <div class="search-bar-container">
                <input
                    v-model="searchQuery"
                    placeholder="Search levels..."
                    class="search-bar"
                />
            </div>
            <div class="list-container">
                <table class="list" v-if="filteredList.length">
                    <tr v-for="([err, rank, level], i) in filteredList" :key="level.id">
                        <td class="rank">
                            <p v-if="rank === null" class="type-label-lg">&mdash;</p>
                            <p
                                v-else
                                class="type-label-lg"
                                :style="{ color: getRankColor(rank) }"
                            >
                                #{{ rank }}
                            </p>
                        </td>
                        <td class="level" :class="{ 'active': selected == i, 'error': err !== null }">
                            <button @click="selectLevel(level)">
                                <span
                                    class="type-label-lg"
                                    :style="{ color: getRankColor(rank) }"
                                >
                                    {{ level?.name || \`Error (\${err}.json)\` }}
                                </span>
                            </button>
                        </td>
                    </tr>
                </table>
                <p v-else class="type-label-lg">No levels found.</p>
            </div>
            <div class="level-container">
                <div class="level" v-if="level">
                    <h1>{{ level.name }}</h1>
                    <LevelAuthors :author="level.author" :creators="level.creators" :verifier="level.verifier"></LevelAuthors>
                    <div style="display:flex">
                        <div v-for="tag in level.tags" class="tag">{{tag}}</div>
                    </div>
                    <div v-if="level.showcase" class="tabs">
                        <button class="tab type-label-lg" :class="{selected: !toggledShowcase}" @click="toggledShowcase = false">
                            <span class="type-label-lg">Verification</span>
                        </button>
                        <button class="tab" :class="{selected: toggledShowcase}" @click="toggledShowcase = true">
                            <span class="type-label-lg">Showcase</span>
                        </button>
                    </div>
                    <iframe class="video" id="videoframe" :src="video" frameborder="0"></iframe>
                    <ul class="stats">
                        <li>
                            <div class="type-title-sm">Points when completed</div>
                            <p>{{ score(level.rank, 100, level.percentToQualify, list.filter((x)=>x[2]["rank"]!==null).length) }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">ID</div>
                            <p>{{ level.id }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">Password</div>
                            <p>{{ level.password || 'Free to copy' }}</p>
                        </li>
                    </ul>
                    <ul stats="stats" v-if="level.song">
                        <li>
                            <div class="type-title-sm">Song</div><br>
                            <p><a :href="(level.song===undefined)?'#':level.song" :style="{'text-decoration':(level.song===undefined)?'none':'underline'}">Link to song</a></p>
                        </li>
                    </ul>
                    <h2>Records</h2>
                    <p v-if="level.rank === null">This level does not accept records.</p>
                    <p v-else-if="level.rank <= 75"><strong>{{ level.percentToQualify }}%</strong> or better to qualify</p>
                    <p v-else-if="level.rank <= 150"><strong>100%</strong> or better to qualify</p>
                    <p v-else>This level has fallen to legacy, but still accepts completion records.</p>
                    <table class="records">
                        <tr v-for="record in level.records" class="record">
                            <td class="percent">
                                <p>{{ record.percent }}%</p>
                            </td>
                            <td class="user">
                                <a :href="record.link" target="_blank" class="type-label-lg">{{ record.user }}</a>
                            </td>
                            <td class="mobile">
                                <img v-if="record.mobile" :src="\`/assets/phone-landscape\${store.dark ? '-dark' : ''}.svg\`" alt="Mobile">
                            </td>
                        </tr>
                    </table>
                </div>
                <div v-else class="level" style="height: 100%; justify-content: center; align-items: center;">
                    <p>(ノಠ益ಠ)ノ彡┻━┻</p>
                </div>
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
        searchQuery: '',
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
        filteredList() {
            const query = this.searchQuery.toLowerCase();
            return this.list.filter(([err, rank, level]) => {
                return level?.name?.toLowerCase().includes(query);
            });
        }
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
        selectLevel(level) {
            this.selected = this.list.findIndex(x => x[2].name === level.name);
        }
    },
};
