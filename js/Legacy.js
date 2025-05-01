import { createListView } from './SharedListView.js';
import { fetchList } from './content.js';

export default createListView({
    fetchList,
    hidePoints: true,
    filter: ([, rank]) => rank === null || rank > 100,
});
