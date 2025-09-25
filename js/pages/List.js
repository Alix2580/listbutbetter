import { store } from '../main.js';
import { embed } from '../util.js';
import { score } from '../score.js';
import { fetchEditors, fetchList } from '../content.js';

export default {
    data: () => ({
        list: [],
        loading: true,
        selected: 0,
        store,
    }),
    computed: {
        level() {
            return this.list && this.list[this.selected] && this.list[this.selected][2];
        }
    },
    async mounted() {
        this.list = await fetchList();
        this.loading = false;
    },
    methods: {
        extractYouTubeID(url) {
            const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w-]{11})/);
            return match ? match[1] : '';
        }
    },
    template: `
        <main v-if="loading">
            <p style="text-align:center; margin-top: 2rem;">Loading...</p>
        </main>
        <main v-else class="page-list">
            <div class="list-container">
                <div
                    class="level-box"
                    v-for="([err, rank, level], i) in list"
                    :key="level.id"
                >
                    <div class="thumbnail">
                        <img
                            :src="level.song ? \`https://img.youtube.com/vi/\${extractYouTubeID(level.song)}/0.jpg\` : '/assets/default-thumbnail.png'"
                            alt="Thumbnail"
                        />
                    </div>
                    <div class="level-info">
                        <p class="title">
                            <span class="rank">#{{ rank }}</span> – 
                            <span class="name">{{ level.name }}</span>
                        </p>
                        <p class="author">{{ level.author }}</p>
                    </div>
                </div>
            </div>
        </main>
    `
};
