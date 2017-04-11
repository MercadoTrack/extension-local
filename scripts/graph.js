const yellowHalf = 'rgba(255, 219, 21, 0.5)';
const border = 'rgba(244, 188, 66, 1)';
const hoverBorder = 'rgba(0, 0, 0, 0.5)';
const white = '#FFF';

class Graph {

    static show(item, $elem) {
        let canvas = DomUtils.createCanvas();
        let container = DomUtils.createContainer(canvas, item.history.length);
        $elem.parentNode.insertBefore(container, $elem);
        return new Chart(canvas, {
            type: 'line',
            data: {
                labels: item.history.map(hist => hist.date),
                datasets: [getDataset(item)]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: { callback: formatMoney }
                    }]
                },
                tooltips: {
                    callbacks: {
                        label: (tooltipItems) => formatMoney(tooltipItems.yLabel)
                    }
                }
            }
        });
    }

}

function getDataset(item) {
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

function formatMoney(value) {
    const options = { style: 'currency', currency: 'ARS' };
    const numberFormat = new Intl.NumberFormat('es-AR', options);
    return numberFormat.format(value);
}

(function setChartDefaults() {
    const defaults = {
        defaultFontSize: 15,
        legend: { display: false }
    };
    Chart.defaults.global.tooltips.displayColors = false;
    Object.assign(Chart.defaults.global, defaults);
})();
