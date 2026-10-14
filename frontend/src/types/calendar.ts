export interface SeasonMonth {
    /** Индекс месяца внутри сезона (0-11) */
    index: number;

    /** Номер месяца для Date (0-11) */
    month: number;

    /** Год */
    year: number;

    /** Краткое название месяца */
    label: string;
}

export interface CalendarCell {
    /** День месяца, null - пустая ячейка */
    day: number | null;

    /** Принадлежит ли день текущему отображаемому месяцу */
    isCurrentMonth: boolean;
}