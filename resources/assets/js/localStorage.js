export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('saelosState');

        if (serializedState === null) {
            return undefined;
        }

        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

export const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);

        localStorage.setItem('saelosState', serializedState);
    } catch (err) {
        // ignore
    }
};