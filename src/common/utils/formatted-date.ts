export const formattedDate = (date: Date): string => {
    return new Intl.DateTimeFormat('es-Mx', {
        dateStyle: 'full',
        timeStyle: 'short',
    }).format(date);
}