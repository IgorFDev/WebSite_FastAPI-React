export const fieldsClubTeam = [
    {
        name: "name",
        label: "Название",
        type: "text",
        required: true
    },
    {
        name: "league_name",
        label: "Лига",
        type: "select",
        options: [
            { value: "SuperLeague", label: "Суперлига" },
            { value: "Hard-A", label: "Хард-А" },
            { value: "Hard-B", label: "Хард-B" },
            { value: "Medium", label: "Медиум" },
            { value: "Light", label: "Лайт" }
        ],
        required: true
    },
    {
        name: "group_name",
        label: "Группа",
        type: "select",
        options: [
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
            { value: "5", label: "5" }
        ],
        required: true
    },
    {
        name: "results_url",
        label: "Ссылка на результаты",
        type: "select",
        options: [
            { value: "https://v-open.spb.ru/rezul-tsuper-liga.html", label: "Суперлига" },
            { value: "https://v-open.spb.ru/rezult-hard-liga.html", label: "Хард-А" },
            { value: "https://v-open.spb.ru/hard-liga-v.html", label: "Хард-B" },
            { value: "https://v-open.spb.ru/result-medium-liga-sever.html", label: "Медиум" },
            { value: "https://v-open.spb.ru/rezult-lajt-liga-sever.html", label: "Лайт" }
        ],
        required: true
    }
]


export const fieldsSeason = [
    {
        name: "name",
        label: "Название",
        type: "text",
        required: true
    },
    {
        name: "is_current",
        label: "Текущий сезон?",
        type: "checkbox",
        required: true
    }
]

export function getPlayerFields(
    clubTeamOptions: any[]
) {
    return [
    {
        name: "club_team_id",
        label: "Выберите команду",
        type: "select",
        options: clubTeamOptions,
        required: true
    },
    {
        name: "first_name",
        label: "Имя",
        type: "text",
        required: true
    },
    {
        name: "last_name",
        label: "Фамилия",
        type: "text",
        required: true
    },
    {
        name: "number",
        label: "Номер",
        type: "number",
        required: true
    },
    {
        name: "position",
        label: "Позиция",
        type: "select",
        options: [
            { value: "SETTER", label: "Связующий" },
            { value: "LIBERO", label: "Либеро" },
            { value: "MIDDLE_BLOCKER", label: "Центральный блокировщик" },
            { value: "OPPOSITE", label: "Диагональный" },
            { value: "OUTSIDE_HITTER", label: "Доигровщик" }
        ],
        required: true
    },
    {
        name: "birth_date",
        label: "Дата рождения",
        type: "date",
        required: true
    },
    {
        name: "height",
        label: "Рост",
        type: "number",
        required: true
    },
    {
        name: "weight",
        label: "Вес",
        type: "number",
        required: true
    },
    {
        name: "sport_rank",
        label: "Спортивный разряд",
        type: "text",
        required: true
    },
    {
        name: "avatar_media_id",
        label: "Аватар",
        type: "media",
        required: true
    },
    {
        name: "background_media_id",
        label: "Фоновое изображение",
        type: "media",
        required: true
    }
    ]
}

export const newsFields = [
    {
        name: "title",
        label: "Название",
        type: "text",
        required: true
    },
    {
        name: "content",
        label: "Содержание",
        type: "textarea",
        required: true
    },
    {
        name: "cover",
        label: "Фото",
        type: "media",
        required: true
    }
]


export function getMatchFields(
    clubTeamOptions: any[],
    seasonOptions: any[],
    tournamentTeamOptions: any[]
) {
    return [
        {
            name: "season_id",
            label: "Выберите сезон",
            type: "select",
            options: seasonOptions,
            required: true
        },
        {
            name: "club_team_id",
            label: "Выберите команду",
            type: "select",
            options: clubTeamOptions,
            required: true
        },
        {
            name: "opponent_team_id",
            label: "Соперник",
            type: "select",
            options: tournamentTeamOptions,
            required: true
        },
        {
            name: "match_datetime",
            label: "Дата и время матча",
            type: "datetime",
            required: true
        },
        {
            name: "our_score",
            label: "Выигранные партии",
            type: "text"
        },
        {
            name: "opponent_score",
            label: "Партии соперника",
            type: "text"
        },
        {
            name: "is_home",
            label: "Домашний матч",
            type: "checkbox",
            required: true
        },
        {
            name: "address",
            label: "Адрес",
            type: "text"
        },
        {
            name: "status",
            label: "Статус матча:",
            type: "select",
            options: [
                { value: "SCHEDULED", label: "Запланирован" },
                { value: "FINISHED", label: "Завершен" },
                { value: "POSTPONED", label: "Отложен" },
                { value: "CANCELLED", label: "Отменен" }
            ],
            required: true
        },
        {
            name: "parsed_from_url",
            label: "URL для парсинга",
            type: "text"
        }
    ]
}