import moment from 'moment';

export const dateFormat = (date) => {
    return moment(date).format('DD/MM/YYYY [lúc] h:mm A');
}