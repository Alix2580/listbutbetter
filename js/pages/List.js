import { store } from '../main.js';
import { fetchList } from '../content.js';
import Spinner from '../components/Spinner.js';

export default {
    components: { Spinner },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list">
            <div class="list-container">
                <div class="level-box" v-for="([err, rank, level], i) in list" :key="level?.id">
                    <a :href="level?.youtube || '#'" target="_blank" class="thumbnail">
                        <img :src="getThumbnail(level?.youtube)" alt="Level Thumbnail"/>
                    </a>
                    <div class="level-info">
                        <p class="title">
                            <span class="rank">{{ rank === null ? '—' : '#' + rank }}</span> – 
                            <span class="name">{{ level?.name || 'Error' }}</span>
                        </p>
                        <p class="author">{{ level?.author || 'Unknown' }}</p>
                    </div>
                </div>
            </div>
        </main>
    `,
    data: () => ({
        list: [],
        loading: true,
        store,
    }),
    async mounted() {
        this.list = await fetchList();
        this.loading = false;
    },
    methods: {
        getThumbnail(youtube) {
            if (!youtube) return '/assets/default-thumbnail.png';
            const id = youtube.split('v=')[1]?.split('&')[0];
            return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
        }
    }
};
