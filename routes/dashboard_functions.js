
export function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
            
}

export function updateLivePreview(value, profileCircle, profileUsername, accountHeader) {
    if (value === undefined) return;
    let selectedColor = hslToHex(value, 100, 50);

    profileCircle.style.backgroundColor = selectedColor;

    const r = parseInt(selectedColor.substr(1, 2), 16);
    const g = parseInt(selectedColor.substr(3, 2), 16);
    const b = parseInt(selectedColor.substr(5, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    if (brightness > 200) {
        profileUsername.style.color = '#000000';
    } else {
        profileUsername.style.color = '#ffffff';
    }

    if (accountHeader) {
        accountHeader.style.backgroundColor = selectedColor;
    }
}

export function updateChoices(choicesInstances, allOptions, selects) {
    const selectedValues = new Set();
    choicesInstances.forEach(instance => {
        instance.getValue().forEach(val => {
            selectedValues.add(val);
        });
    });

    choicesInstances.forEach((instance, idx) => {
        const select = selects[idx];
        const currentSelections = instance.getValue();

        instance.removeActiveItems();
        instance.clearChoices();

        const newChoices = allOptions[select.id].map(opt => ({
            value: opt.value,
            label: opt.label,
            selected: currentSelections.includes(opt.value),
            disabled: selectedValues.has(opt.value) && !currentSelections.includes(opt.value)
        }));

        instance.setChoices(newChoices);
    });
}
