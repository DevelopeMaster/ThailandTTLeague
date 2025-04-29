export function distributePlayersIntoGroups(allPlayers) {
    const numberOfGroups = window.groupFinalSettings.numberOfGroups;

    if (!numberOfGroups || allPlayers.length === 0) {
        console.error('Cannot distribute players: missing settings or players.');
        return [];
    }

    // Сортируем игроков по рейтингу по убыванию
    const sortedPlayers = [...allPlayers].sort((a, b) => b.rating - a.rating);

    // Инициализируем группы
    const groups = Array.from({ length: numberOfGroups }, () => []);

    let direction = 1; // 1 - вправо, -1 - влево
    let groupIndex = 0;

    // Распределяем змейкой
    for (const player of sortedPlayers) {
        groups[groupIndex].push(player);

        groupIndex += direction;

        if (groupIndex === numberOfGroups) {
            direction = -1;
            groupIndex = numberOfGroups - 1;
        } else if (groupIndex === -1) {
            direction = 1;
            groupIndex = 0;
        }
    }

    // Сохраняем группы в глобальное окно
    window.groups = groups;

    console.log('Groups distributed successfully:', groups);

    return groups;
}
