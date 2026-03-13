export default defineNuxtPlugin(() => {
    const appStore = useAppStore();
    if (typeof localStorage !== 'undefined' && localStorage.getItem('hideValues') === 'true') {
        appStore.hideValues = true;
    }
});
