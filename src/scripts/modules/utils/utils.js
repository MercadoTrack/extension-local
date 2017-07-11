export default {

    /* e.g. $ 99.999,00 */
    formatMoney(value) {
        const options = { style: 'currency', currency: 'ARS' };
        const numberFormat = new Intl.NumberFormat('es-AR', options);
        return numberFormat.format(value);
    },

    /* DD/MM/YY */
    formatDate(date = new Date()) {
        const options = { year: '2-digit', month: '2-digit', day: '2-digit' }
        return date.toLocaleDateString('es-AR', options)
    },

    trimTitle(title) {
        return title.substring(0, 30) + '...'
    },

    isEmpty(obj) {
        return typeof obj === 'object' && Object.getOwnPropertyNames(obj).length === 0;
    },

    pipeBytesToSize(bytes) {
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    },

    getItemChartOptions(item) {
        return {
            type: 'line',
            data: {
                labels: item.history.map(hist => hist.date),
                datasets: [
                    getItemGraphDataset(item)
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: { callback: this.formatMoney }
                    }]
                },
                tooltips: {
                    displayColors: false,
                    callbacks: {
                        label: (tooltipItems) => this.formatMoney(tooltipItems.yLabel)
                    }
                }
            }
        }
    }

}

function getItemGraphDataset(item) {
    const yellowHalf = 'rgba(255, 219, 21, 0.5)';
    const border = 'rgba(244, 188, 66, 1)';
    const hoverBorder = 'rgba(0, 0, 0, 0.5)';
    const white = '#FFF';
    return {
        data: item.history.map(hist => hist.price),
        fill: true,
        lineTension: 0.1,
        backgroundColor: yellowHalf,
        borderColor: border,
        pointBorderColor: border,
        pointBackgroundColor: white,
        pointBorderWidth: 10,
        pointHoverRadius: 10,
        pointHoverBackgroundColor: border,
        pointHoverBorderColor: hoverBorder,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10
    }
}
