export function debounce (duration) {
    let timer = null;
    return {
        run: cb => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                timer = null;
                cb();
            }, duration);
        },
        clear: () => timer?clearTimeout(timer):null,
    }
}
