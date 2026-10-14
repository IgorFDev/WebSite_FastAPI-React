import {
    addMonths,
    format,
    getDay,
    getDaysInMonth,
    startOfMonth,
} from "date-fns";
import { ru } from "date-fns/locale";

import type { CalendarCell, SeasonMonth } from "../types/calendar";

export function parseSeason(season: string) {
    const [startYear, endYear] = season.split("-").map(Number);

    return {
        startYear,
        endYear,
    };
}

export function getSeasonMonths(season: string): SeasonMonth[] {
    const { startYear } = parseSeason(season);

    const seasonStart = new Date(startYear, 8); // сентябрь

    return Array.from({ length: 12 }, (_, index) => {
        const date = addMonths(seasonStart, index);

        return {
            index,
            month: date.getMonth(),
            year: date.getFullYear(),
            label:
                format(date, "LLL", { locale: ru })
                    .replace(".", "")
                    .replace(/^./, (char) => char.toUpperCase()),
        };
    });
}

export function getCurrentSeasonMonth(season: string): number {
    const months = getSeasonMonths(season);

    const today = new Date();

    const index = months.findIndex(
        (month) =>
            month.month === today.getMonth() &&
            month.year === today.getFullYear()
    );

    if (index !== -1) {
        return index;
    }

    const firstMonth = months[0];
    const lastMonth = months[11];

    const current = today.getFullYear() * 12 + today.getMonth();

    const first =
        firstMonth.year * 12 + firstMonth.month;

    const last =
        lastMonth.year * 12 + lastMonth.month;

    if (current < first) {
        return 0;
    }

    if (current > last) {
        return 11;
    }

    return Math.floor((current - first) / 12);
}

export function getMonthGrid(
    month: number,
    year: number
): CalendarCell[] {

    const firstDay = startOfMonth(
        new Date(year, month)
    );

    const daysInMonth = getDaysInMonth(firstDay);

    const startWeekday =
        (getDay(firstDay) + 6) % 7;

    const cells: CalendarCell[] = [];

    for (let i = 0; i < startWeekday; i++) {
        cells.push({
            day: null,
            isCurrentMonth: false,
        });
    }

    for (let day = 1; day <= daysInMonth; day++) {
        cells.push({
            day,
            isCurrentMonth: true,
        });
    }

    while (cells.length < 42) {
        cells.push({
            day: null,
            isCurrentMonth: false,
        });
    }

    return cells;
}